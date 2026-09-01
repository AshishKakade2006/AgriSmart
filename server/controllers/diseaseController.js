const { GoogleGenAI } = require("@google/genai");
const DiseaseScan = require("../models/DiseaseScan");

console.log(
  "Gemini Key exists:",
  !!process.env.GEMINI_API_KEY
);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ======================================================
// HELPER: WAIT
// ======================================================

const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ======================================================
// HELPER: CALL GEMINI WITH RETRY
// ======================================================

const generateGeminiResponse = async (contents) => {
  const model = "gemini-flash-latest";

  let lastError = null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(
        `Calling Gemini - attempt ${attempt}`
      );

      const response =
        await ai.models.generateContent({
          model,
          contents,
        });

      console.log(
        "Gemini response received successfully."
      );

      return response;
    } catch (error) {
      lastError = error;

      console.error(
        `Gemini attempt ${attempt} failed`
      );

      console.error(
        "Status:",
        error.status
      );

      console.error(
        "Message:",
        error.message
      );

      // Retry temporary Gemini errors
      if (
        error.status === 503 ||
        error.status === 429
      ) {
        if (attempt < 3) {
          const delay = attempt * 2000;

          console.log(
            `Retrying Gemini after ${delay}ms...`
          );

          await wait(delay);
          continue;
        }
      }

      // Do not retry other errors
      throw error;
    }
  }

  throw lastError;
};

// ======================================================
// HELPER: EXTRACT JSON FROM GEMINI RESPONSE
// ======================================================

const extractJSON = (text) => {
  let cleaned = String(text).trim();

  // Remove ```json
  cleaned = cleaned.replace(
    /^```json\s*/i,
    ""
  );

  // Remove ```
  cleaned = cleaned.replace(
    /^```\s*/i,
    ""
  );

  cleaned = cleaned.replace(
    /\s*```$/i,
    ""
  );

  cleaned = cleaned.trim();

  // Sometimes Gemini may return extra text.
  // Try to extract the JSON object.
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start !== -1 && end !== -1 && end > start) {
    cleaned = cleaned.substring(
      start,
      end + 1
    );
  }

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error(
      "Failed JSON:",
      cleaned
    );

    throw new Error(
      "Gemini returned an invalid JSON response."
    );
  }
};

// ======================================================
// DETECT DISEASE
// ======================================================

const detectDisease = async (req, res) => {
  try {
    // --------------------------------------------------
    // 1. Check image
    // --------------------------------------------------

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image.",
      });
    }

    console.log(
      "Uploaded file:",
      req.file.originalname
    );

    console.log(
      "Mimetype:",
      req.file.mimetype
    );

    console.log(
      "Size:",
      req.file.size
    );

    // --------------------------------------------------
    // 2. Check authenticated user
    // --------------------------------------------------

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    // --------------------------------------------------
    // 3. Prepare image
    // --------------------------------------------------

    const imageBuffer = req.file.buffer;

    // --------------------------------------------------
    // 4. Gemini prompt
    // --------------------------------------------------

    const prompt = `
You are an expert agricultural scientist.

Analyze the crop image carefully and identify any visible plant disease.

Return ONLY a valid JSON object.

Do NOT use markdown.
Do NOT use code blocks.
Do NOT add any explanation before or after the JSON.

Use exactly this structure:

{
  "disease": "Disease name",
  "confidence": "94%",
  "severity": "Low",
  "description": "Short description of the disease",
  "treatment": [
    "Treatment recommendation 1",
    "Treatment recommendation 2"
  ],
  "prevention": [
    "Prevention recommendation 1",
    "Prevention recommendation 2"
  ]
}

IMPORTANT:

- confidence must be a percentage string such as "94%"
- severity must be exactly one of: "Low", "Medium", "High", "None"
- treatment must always be an array
- prevention must always be an array

If the plant is healthy, return:

{
  "disease": "Healthy",
  "confidence": "100%",
  "severity": "None",
  "description": "The plant appears healthy.",
  "treatment": [],
  "prevention": []
}
`;

    // --------------------------------------------------
    // 5. Prepare Gemini contents
    // --------------------------------------------------

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",

      contents: [
        {
          text: prompt,
        },

        {
          inlineData: {
            mimeType: req.file.mimetype,
            data: imageBuffer.toString("base64"),
          },
        },
      ],
    });


    // --------------------------------------------------
    // 7. Get Gemini response
    // --------------------------------------------------

    const text = response.text;

    console.log(
      "Raw Gemini Response:"
    );

    console.log(text);

    if (!text) {
      throw new Error(
        "Gemini returned an empty response."
      );
    }

    // --------------------------------------------------
    // 8. Parse JSON
    // --------------------------------------------------

    const result = extractJSON(text);

    console.log(
      "Parsed Gemini Result:"
    );

    console.log(result);

    // --------------------------------------------------
    // 9. Normalize disease
    // --------------------------------------------------

    const disease =
      result.disease
        ? String(result.disease).trim()
        : "Unknown";

    // --------------------------------------------------
    // 10. Normalize confidence
    // --------------------------------------------------

    let confidence = 0;

    if (
      result.confidence !== undefined &&
      result.confidence !== null
    ) {
      const confidenceString =
        String(result.confidence);

      const match =
        confidenceString.match(
          /(\d+(?:\.\d+)?)/
        );

      if (match) {
        confidence = Number(match[1]);
      }
    }

    // Make sure confidence is a valid number
    if (!Number.isFinite(confidence)) {
      confidence = 0;
    }

    // Keep between 0 and 100
    confidence = Math.min(
      Math.max(confidence, 0),
      100
    );

    // Explicitly convert to Number
    confidence = Number(confidence);

    console.log(
      "Gemini confidence:",
      result.confidence
    );

    console.log(
      "MongoDB confidence:",
      confidence
    );

    console.log(
      "Confidence type:",
      typeof confidence
    );

    // --------------------------------------------------
    // 11. Normalize severity
    // --------------------------------------------------

    let severity =
      result.severity
        ? String(result.severity).trim()
        : "None";

    const validSeverities = [
      "Low",
      "Medium",
      "High",
      "None",
    ];

    if (
      !validSeverities.includes(severity)
    ) {
      severity = "None";
    }

    // --------------------------------------------------
    // 12. Normalize description
    // --------------------------------------------------

    const description =
      result.description
        ? String(result.description).trim()
        : "";

    // --------------------------------------------------
    // 13. Normalize treatment
    // --------------------------------------------------

    let treatment = [];

    if (Array.isArray(result.treatment)) {
      treatment = result.treatment
        .map((item) => String(item).trim())
        .filter(
          (item) => item.length > 0
        );
    }

    // --------------------------------------------------
    // 14. Normalize prevention
    // --------------------------------------------------

    let prevention = [];

    if (Array.isArray(result.prevention)) {
      prevention = result.prevention
        .map((item) => String(item).trim())
        .filter(
          (item) => item.length > 0
        );
    }

    // --------------------------------------------------
    // 15. Final clean result
    // --------------------------------------------------

    const cleanResult = {
      disease,
      confidence: `${confidence}%`,
      severity,
      description,
      treatment,
      prevention,
    };

    console.log(
      "Final Disease Result:"
    );

    console.log(cleanResult);

    // --------------------------------------------------
    // 16. Save to MongoDB
    // --------------------------------------------------

    console.log(
      "Saving disease scan..."
    );

    const savedScan =
      await DiseaseScan.create({
        farmer: req.user.id,
        crop: "Unknown",
        disease: disease,

        // IMPORTANT:
        // MongoDB schema expects Number
        confidence: Number(confidence),

        severity: severity,

        recommendation:
          treatment.length > 0
            ? treatment.join(" ")
            : "",
      });

    console.log(
      "Disease scan saved successfully."
    );

    console.log(
      "Saved Scan ID:",
      savedScan._id
    );

    // --------------------------------------------------
    // 17. Send response
    // --------------------------------------------------

    return res.status(200).json({
      success: true,
      result: cleanResult,
    });

  } catch (err) {
    console.error(
      "Disease Detection Error:"
    );

    console.error(err);

    // Gemini temporary overload
    if (
      err.status === 503 ||
      err.status === 429
    ) {
      return res.status(503).json({
        success: false,
        message:
          "AI service is temporarily busy. Please try again in a few seconds.",
      });
    }

    // Gemini authentication
    if (
      err.status === 401 ||
      err.status === 403
    ) {
      return res.status(500).json({
        success: false,
        message:
          "Gemini API authentication failed. Please check the API key.",
      });
    }

    // MongoDB validation error
    if (
      err.name === "ValidationError"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid disease data received.",
      });
    }

    // General error
    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Disease detection failed.",
    });
  }
};

// ======================================================
// GET DISEASE HISTORY
// ======================================================

const getDiseaseHistory = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    console.log(
      "Fetching disease history for:",
      req.user.id
    );

    const history =
      await DiseaseScan.find({
        farmer: req.user.id,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.status(200).json({
      success: true,
      history,
    });

  } catch (err) {
    console.error(
      "Disease History Error:"
    );

    console.error(err);

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch disease history.",
    });
  }
};

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  detectDisease,
  getDiseaseHistory,
};
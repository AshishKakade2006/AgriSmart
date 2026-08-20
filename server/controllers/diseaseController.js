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

    console.log("Uploaded file:", req.file.originalname);
    console.log("Mimetype:", req.file.mimetype);
    console.log("Size:", req.file.size);


    // --------------------------------------------------
    // 2. Prepare image
    // --------------------------------------------------

    const imageBuffer = req.file.buffer;


    // --------------------------------------------------
    // 3. Gemini Prompt
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
    // 4. Call Gemini
    // --------------------------------------------------

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",

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
    // 5. Get Gemini response
    // --------------------------------------------------

    const text = response.text;

    console.log("Raw Gemini Response:");
    console.log(text);


    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }


    // --------------------------------------------------
    // 6. Clean Gemini response
    // --------------------------------------------------

    let cleanedText = text.trim();

    // Remove ```json
    cleanedText = cleanedText.replace(
      /^```json\s*/i,
      ""
    );

    // Remove ```
    cleanedText = cleanedText.replace(
      /^```\s*/i,
      ""
    );

    cleanedText = cleanedText.replace(
      /\s*```$/i,
      ""
    );

    cleanedText = cleanedText.trim();


    console.log("Cleaned Gemini Response:");
    console.log(cleanedText);


    // --------------------------------------------------
    // 7. Parse JSON
    // --------------------------------------------------

    let result;

    try {

      result = JSON.parse(cleanedText);

    } catch (parseError) {

      console.error(
        "JSON Parse Error:",
        parseError
      );

      throw new Error(
        "Gemini returned an invalid JSON response."
      );
    }


    // --------------------------------------------------
    // 8. Normalize Disease
    // --------------------------------------------------

    const disease =
      result.disease
        ? String(result.disease).trim()
        : "Unknown";


    // --------------------------------------------------
    // 9. Normalize Confidence
    // --------------------------------------------------

    let confidence = 0;

    if (
      result.confidence !== undefined &&
      result.confidence !== null
    ) {

      const confidenceString =
        String(result.confidence);

      /*
        Extract the first number.

        Examples:

        "94%"          -> 94
        "94"           -> 94
        94             -> 94
        "94.5%"        -> 94.5
        "Approximately 94%" -> 94
      */

      const match =
        confidenceString.match(
          /(\d+(?:\.\d+)?)/
        );

      if (match) {

        confidence = Number(match[1]);

      }
    }


    // Make absolutely sure it is a valid number
    if (!Number.isFinite(confidence)) {
      confidence = 0;
    }


    // Keep confidence between 0 and 100
    confidence = Math.min(
      Math.max(confidence, 0),
      100
    );


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
    // 10. Normalize Severity
    // --------------------------------------------------

    let severity =
      result.severity
        ? String(result.severity).trim()
        : "Unknown";


    const validSeverities = [
      "Low",
      "Medium",
      "High",
      "None",
    ];

    if (!validSeverities.includes(severity)) {
      severity = "Unknown";
    }


    // --------------------------------------------------
    // 11. Normalize Description
    // --------------------------------------------------

    const description =
      result.description
        ? String(result.description).trim()
        : "";


    // --------------------------------------------------
    // 12. Normalize Treatment
    // --------------------------------------------------

    let treatment = [];

    if (Array.isArray(result.treatment)) {

      treatment = result.treatment
        .map((item) => String(item).trim())
        .filter((item) => item.length > 0);

    }


    // --------------------------------------------------
    // 13. Normalize Prevention
    // --------------------------------------------------

    let prevention = [];

    if (Array.isArray(result.prevention)) {

      prevention = result.prevention
        .map((item) => String(item).trim())
        .filter((item) => item.length > 0);

    }


    // --------------------------------------------------
    // 14. Create clean result
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
    // 15. Save to MongoDB
    // --------------------------------------------------

    const savedScan =
      await DiseaseScan.create({

        farmer: req.user.id,

        crop: "Unknown",

        disease: disease,

        // IMPORTANT:
        // DiseaseScan schema expects Number
        confidence: confidence,

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
    // 16. Send response to frontend
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


    return res.status(500).json({

      success: false,

      message:
        err.message ||
        "Disease detection failed",

    });

  }
};


// ======================================================
// GET DISEASE HISTORY
// ======================================================

const getDiseaseHistory = async (req, res) => {

  try {

    const history =
      await DiseaseScan.find({
        farmer: req.user.id,
      })
      .sort({
        createdAt: -1,
      });


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
        "Failed to fetch disease history",

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
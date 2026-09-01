const { GoogleGenAI } = require("@google/genai");
const OpenAI = require("openai");
const Anthropic = require("@anthropic-ai/sdk");
const DiseaseScan = require("../models/DiseaseScan");

// ======================================================
// API CLIENTS
// ======================================================

console.log(
  "Gemini Key exists:",
  !!process.env.GEMINI_API_KEY
);

console.log(
  "OpenAI Key exists:",
  !!process.env.OPENAI_API_KEY
);

console.log(
  "Anthropic Key exists:",
  !!process.env.ANTHROPIC_API_KEY
);

// Gemini
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    })
  : null;

// OpenAI
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

// Anthropic / Claude
const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  : null;


// ======================================================
// HELPER: WAIT
// ======================================================

const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));


// ======================================================
// HELPER: TIMEOUT
// ======================================================

const withTimeout = (promise, timeout = 20000) => {
  return Promise.race([
    promise,

    new Promise((_, reject) => {
      setTimeout(() => {
        reject(
          new Error(
            `AI request timed out after ${timeout / 1000} seconds.`
          )
        );
      }, timeout);
    }),
  ]);
};


// ======================================================
// HELPER: EXTRACT JSON
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

  // Remove closing ```
  cleaned = cleaned.replace(
    /\s*```$/i,
    ""
  );

  cleaned = cleaned.trim();

  // Sometimes AI returns explanation before/after JSON.
  // Extract the JSON object.
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (
    start !== -1 &&
    end !== -1 &&
    end > start
  ) {
    cleaned = cleaned.substring(
      start,
      end + 1
    );
  }

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error(
      "Failed to parse AI JSON:"
    );

    console.error(cleaned);

    throw new Error(
      "AI returned invalid JSON."
    );
  }
};


// ======================================================
// HELPER: VALIDATE AI RESULT
// ======================================================

const validateAIResult = (text) => {
  if (!text || !String(text).trim()) {
    throw new Error(
      "AI returned an empty response."
    );
  }

  const result = extractJSON(text);

  // Make sure the important fields exist
  if (!result || typeof result !== "object") {
    throw new Error(
      "AI returned an invalid result."
    );
  }

  if (!result.disease) {
    throw new Error(
      "AI response does not contain disease."
    );
  }

  return result;
};


// ======================================================
// GEMINI
// ======================================================

const generateWithGemini = async (
  prompt,
  imageBase64,
  mimeType
) => {
  if (!ai) {
    throw new Error(
      "Gemini API key is not configured."
    );
  }

  // Current Gemini models.
  // Primary first, fallback second.
  const models = [
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash-lite",
  ];

  let lastError = null;

  for (const model of models) {
    console.log(
      `\nTrying Gemini model: ${model}`
    );

    // Two attempts per model
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(
          `Gemini ${model} - attempt ${attempt}`
        );

        const response =
          await withTimeout(
            ai.models.generateContent({
              model,

              contents: [
                {
                  text: prompt,
                },

                {
                  inlineData: {
                    mimeType,
                    data: imageBase64,
                  },
                },
              ],
            }),
            20000
          );

        const text = response.text;

        // Validate BEFORE accepting this provider
        validateAIResult(text);

        console.log(
          `Gemini succeeded using ${model}`
        );

        return {
          text,
          provider: "Gemini",
          model,
        };

      } catch (error) {
        lastError = error;

        console.error(
          `Gemini ${model} failed.`
        );

        console.error(
          "Status:",
          error.status || "N/A"
        );

        console.error(
          "Message:",
          error.message
        );

        // Retry only temporary errors
        const isTemporary =
          error.status === 429 ||
          error.status === 500 ||
          error.status === 502 ||
          error.status === 503 ||
          error.status === 504 ||
          error.message
            ?.toLowerCase()
            .includes("timeout");

        if (
          isTemporary &&
          attempt < 2
        ) {
          const delay = attempt * 1500;

          console.log(
            `Retrying Gemini after ${delay}ms...`
          );

          await wait(delay);
        } else {
          break;
        }
      }
    }

    console.log(
      `Moving to next Gemini model...`
    );
  }

  throw lastError ||
    new Error(
      "All Gemini models failed."
    );
};


// ======================================================
// OPENAI
// ======================================================

const generateWithOpenAI = async (
  prompt,
  imageBase64,
  mimeType
) => {
  if (!openai) {
    throw new Error(
      "OpenAI API key is not configured."
    );
  }

  const model = "gpt-5.6-luna";

  let lastError = null;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(
        `\nTrying OpenAI - attempt ${attempt}`
      );

      const response =
        await withTimeout(
          openai.responses.create({
            model,

            input: [
              {
                role: "user",

                content: [
                  {
                    type: "input_text",
                    text: prompt,
                  },

                  {
                    type: "input_image",

                    image_url:
                      `data:${mimeType};base64,${imageBase64}`,
                  },
                ],
              },
            ],
          }),
          20000
        );

      const text =
        response.output_text;

      // Validate BEFORE accepting OpenAI
      validateAIResult(text);

      console.log(
        `OpenAI succeeded using ${model}`
      );

      return {
        text,
        provider: "OpenAI",
        model,
      };

    } catch (error) {
      lastError = error;

      console.error(
        `OpenAI attempt ${attempt} failed.`
      );

      console.error(
        "Status:",
        error.status || "N/A"
      );

      console.error(
        "Message:",
        error.message
      );

      const isTemporary =
        error.status === 429 ||
        error.status === 500 ||
        error.status === 502 ||
        error.status === 503 ||
        error.status === 504 ||
        error.message
          ?.toLowerCase()
          .includes("timeout");

      if (
        isTemporary &&
        attempt < 2
      ) {
        const delay = attempt * 1500;

        console.log(
          `Retrying OpenAI after ${delay}ms...`
        );

        await wait(delay);
      } else {
        break;
      }
    }
  }

  throw lastError ||
    new Error(
      "OpenAI failed."
    );
};


// ======================================================
// CLAUDE
// ======================================================

const generateWithClaude = async (
  prompt,
  imageBase64,
  mimeType
) => {
  if (!anthropic) {
    throw new Error(
      "Anthropic API key is not configured."
    );
  }

  const model = "claude-sonnet-5";

  let lastError = null;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(
        `\nTrying Claude - attempt ${attempt}`
      );

      const response =
        await withTimeout(
          anthropic.messages.create({
            model,

            max_tokens: 2000,

            messages: [
              {
                role: "user",

                content: [
                  {
                    type: "image",

                    source: {
                      type: "base64",
                      media_type: mimeType,
                      data: imageBase64,
                    },
                  },

                  {
                    type: "text",
                    text: prompt,
                  },
                ],
              },
            ],
          }),
          20000
        );

      const textBlock =
        response.content?.find(
          (block) =>
            block.type === "text"
        );

      const text =
        textBlock?.text;

      // Validate BEFORE accepting Claude
      validateAIResult(text);

      console.log(
        `Claude succeeded using ${model}`
      );

      return {
        text,
        provider: "Claude",
        model,
      };

    } catch (error) {
      lastError = error;

      console.error(
        `Claude attempt ${attempt} failed.`
      );

      console.error(
        "Status:",
        error.status || "N/A"
      );

      console.error(
        "Message:",
        error.message
      );

      const isTemporary =
        error.status === 429 ||
        error.status === 500 ||
        error.status === 502 ||
        error.status === 503 ||
        error.status === 504 ||
        error.message
          ?.toLowerCase()
          .includes("timeout");

      if (
        isTemporary &&
        attempt < 2
      ) {
        const delay = attempt * 1500;

        console.log(
          `Retrying Claude after ${delay}ms...`
        );

        await wait(delay);
      } else {
        break;
      }
    }
  }

  throw lastError ||
    new Error(
      "Claude failed."
    );
};


// ======================================================
// MAIN AI FALLBACK
//
// Gemini
//    ↓
// OpenAI
//    ↓
// Claude
// ======================================================

const generateAIResponse = async (
  prompt,
  imageBuffer,
  mimeType
) => {
  const imageBase64 =
    imageBuffer.toString("base64");

  let errors = [];

  // ====================================================
  // 1. GEMINI
  // ====================================================

  try {
    const result =
      await generateWithGemini(
        prompt,
        imageBase64,
        mimeType
      );

    return result;

  } catch (error) {
    console.error(
      "\nGemini completely failed."
    );

    console.error(
      error.message
    );

    errors.push({
      provider: "Gemini",
      error: error.message,
    });
  }


  // ====================================================
  // 2. OPENAI
  // ====================================================

  try {
    const result =
      await generateWithOpenAI(
        prompt,
        imageBase64,
        mimeType
      );

    return result;

  } catch (error) {
    console.error(
      "\nOpenAI completely failed."
    );

    console.error(
      error.message
    );

    errors.push({
      provider: "OpenAI",
      error: error.message,
    });
  }


  // ====================================================
  // 3. CLAUDE
  // ====================================================

  try {
    const result =
      await generateWithClaude(
        prompt,
        imageBase64,
        mimeType
      );

    return result;

  } catch (error) {
    console.error(
      "\nClaude completely failed."
    );

    console.error(
      error.message
    );

    errors.push({
      provider: "Claude",
      error: error.message,
    });
  }


  // ====================================================
  // ALL PROVIDERS FAILED
  // ====================================================

  console.error(
    "\n================================="
  );

  console.error(
    "ALL AI PROVIDERS FAILED"
  );

  console.error(
    "================================="
  );

  console.error(
    errors
  );

  throw new Error(
    "All AI providers are currently unavailable."
  );
};


// ======================================================
// DETECT DISEASE
// ======================================================

const detectDisease = async (
  req,
  res
) => {
  try {

    // --------------------------------------------------
    // 1. Check image
    // --------------------------------------------------

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Please upload an image.",
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

    if (
      !req.user ||
      !req.user.id
    ) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }


    // --------------------------------------------------
    // 3. Prepare image
    // --------------------------------------------------

    const imageBuffer =
      req.file.buffer;


    // --------------------------------------------------
    // 4. AI PROMPT
    // --------------------------------------------------

    const prompt = `
You are an expert agricultural scientist specializing in crop disease detection.

Analyze the provided crop/plant image carefully.

Identify the most likely visible plant disease.

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
- confidence should be between 0% and 100%
- severity must be exactly one of:
  "Low", "Medium", "High", "None"
- treatment must always be an array
- prevention must always be an array
- disease must always contain a meaningful disease name
- Do not invent symptoms that are not visible in the image
- If the image does not clearly show a disease, say "Unknown" and explain that the image is inconclusive

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
    // 5. MULTI-AI ANALYSIS
    // --------------------------------------------------

    console.log(
      "\n================================="
    );

    console.log(
      "Starting multi-AI disease detection"
    );

    console.log(
      "Priority: Gemini -> OpenAI -> Claude"
    );

    console.log(
      "=================================\n"
    );

    const aiResult =
      await generateAIResponse(
        prompt,
        imageBuffer,
        req.file.mimetype
      );


    // --------------------------------------------------
    // 6. Get AI response
    // --------------------------------------------------

    const text =
      aiResult.text;

    const provider =
      aiResult.provider;

    const model =
      aiResult.model;

    console.log(
      "\nAI Provider Used:",
      provider
    );

    console.log(
      "AI Model Used:",
      model
    );

    console.log(
      "Raw AI Response:"
    );

    console.log(text);


    // --------------------------------------------------
    // 7. Parse JSON
    // --------------------------------------------------

    const result =
      extractJSON(text);

    console.log(
      "Parsed AI Result:"
    );

    console.log(result);


    // --------------------------------------------------
    // 8. Normalize disease
    // --------------------------------------------------

    const disease =
      result.disease
        ? String(
            result.disease
          ).trim()
        : "Unknown";


    // --------------------------------------------------
    // 9. Normalize confidence
    // --------------------------------------------------

    let confidence = 0;

    if (
      result.confidence !==
        undefined &&
      result.confidence !== null
    ) {
      const confidenceString =
        String(
          result.confidence
        );

      const match =
        confidenceString.match(
          /(\d+(?:\.\d+)?)/
        );

      if (match) {
        confidence =
          Number(match[1]);
      }
    }


    // Make sure confidence is valid
    if (
      !Number.isFinite(
        confidence
      )
    ) {
      confidence = 0;
    }


    // Keep between 0 and 100
    confidence =
      Math.min(
        Math.max(
          confidence,
          0
        ),
        100
      );


    // Explicitly convert to Number
    confidence =
      Number(confidence);


    console.log(
      "AI confidence:",
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
    // 10. Normalize severity
    // --------------------------------------------------

    let severity =
      result.severity
        ? String(
            result.severity
          ).trim()
        : "None";


    const validSeverities = [
      "Low",
      "Medium",
      "High",
      "None",
    ];


    if (
      !validSeverities.includes(
        severity
      )
    ) {
      severity = "None";
    }


    // --------------------------------------------------
    // 11. Normalize description
    // --------------------------------------------------

    const description =
      result.description
        ? String(
            result.description
          ).trim()
        : "";


    // --------------------------------------------------
    // 12. Normalize treatment
    // --------------------------------------------------

    let treatment = [];

    if (
      Array.isArray(
        result.treatment
      )
    ) {
      treatment =
        result.treatment
          .map((item) =>
            String(item).trim()
          )
          .filter(
            (item) =>
              item.length > 0
          );
    }


    // --------------------------------------------------
    // 13. Normalize prevention
    // --------------------------------------------------

    let prevention = [];

    if (
      Array.isArray(
        result.prevention
      )
    ) {
      prevention =
        result.prevention
          .map((item) =>
            String(item).trim()
          )
          .filter(
            (item) =>
              item.length > 0
          );
    }


    // --------------------------------------------------
    // 14. Final clean result
    // --------------------------------------------------

    const cleanResult = {
      disease,
      confidence:
        `${confidence}%`,
      severity,
      description,
      treatment,
      prevention,
    };


    console.log(
      "\nFinal Disease Result:"
    );

    console.log(
      cleanResult
    );


    // --------------------------------------------------
    // 15. Save to MongoDB
    // --------------------------------------------------

    console.log(
      "Saving disease scan..."
    );


    const savedScan =
      await DiseaseScan.create({
        farmer: req.user.id,

        crop: "Unknown",

        disease: disease,

        // MongoDB schema expects Number
        confidence:
          Number(confidence),

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
    // 16. Send response
    // --------------------------------------------------

    return res.status(200).json({
      success: true,

      result: cleanResult,

      // Useful for debugging / dashboard
      aiProvider: provider,

      aiModel: model,
    });

  } catch (err) {

    console.error(
      "\n================================="
    );

    console.error(
      "Disease Detection Error"
    );

    console.error(
      "================================="
    );

    console.error(err);


    // --------------------------------------------------
    // All AI providers failed
    // --------------------------------------------------

    if (
      err.message ===
      "All AI providers are currently unavailable."
    ) {
      return res.status(503).json({
        success: false,

        message:
          "All AI services are temporarily unavailable. Please try again in a few seconds.",
      });
    }


    // --------------------------------------------------
    // MongoDB validation error
    // --------------------------------------------------

    if (
      err.name ===
      "ValidationError"
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid disease data received.",
      });
    }


    // --------------------------------------------------
    // General error
    // --------------------------------------------------

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

const getDiseaseHistory = async (
  req,
  res
) => {
  try {

    if (
      !req.user ||
      !req.user.id
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Unauthorized.",
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
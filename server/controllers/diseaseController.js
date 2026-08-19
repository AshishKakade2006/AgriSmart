const { GoogleGenAI } = require("@google/genai");
const DiseaseScan = require("../models/DiseaseScan");

console.log(
  "Gemini Key exists:",
  !!process.env.GEMINI_API_KEY
);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const detectDisease = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image.",
      });
    }

    console.log("Uploaded file:", req.file.originalname);
    console.log("Mimetype:", req.file.mimetype);
    console.log("Size:", req.file.size);

    const imageBuffer = req.file.buffer;

    const prompt = `
You are an expert agricultural scientist.

Analyze this crop image and identify any visible disease.

Return ONLY a JSON object.
Do NOT use markdown.
Do NOT use \`\`\`json.
Do NOT add any explanation before or after the JSON.

Use exactly this format:

{
  "disease": "...",
  "confidence": "...",
  "severity": "Low/Medium/High",
  "description": "...",
  "treatment": [
    "...",
    "..."
  ],
  "prevention": [
    "...",
    "..."
  ]
}

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

    const text = response.text;

    console.log("Raw Gemini Response:");
    console.log(text);

    // Clean Gemini's response
    let cleanedText = text.trim();

    cleanedText = cleanedText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    console.log("Cleaned Response:");
    console.log(cleanedText);

    // Convert JSON string into JavaScript object
    const result = JSON.parse(cleanedText);

    // Save disease detection history
    await DiseaseScan.create({
      farmer: req.user.id,
      crop: "Unknown",
      disease: result.disease,
      confidence: result.confidence,
      severity: result.severity,
      recommendation: result.treatment?.join(" ") || "",
    });

    console.log("Disease scan saved successfully.");

    return res.status(200).json({
      success: true,
      result,
    });

  } catch (err) {
    console.error("Gemini Error:");
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message || "Disease detection failed",
    });
  }
};

module.exports = {
  detectDisease,
};
const fs = require("fs");
const { GoogleGenAI } = require("@google/genai");
console.log("Gemini Key:", process.env.GEMINI_API_KEY);

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
console.log("Uploaded file:", req.file);
console.log("Path:", req.file.path);
console.log("Exists:", fs.existsSync(req.file.path));
    const imageBuffer = fs.readFileSync(req.file.path);

    const prompt = `
You are an expert agricultural scientist.

Analyze this crop image.

Return ONLY valid JSON in this exact format:

{
  "disease":"...",
  "confidence":"...",
  "severity":"Low/Medium/High",
  "description":"...",
  "treatment":[
    "...",
    "..."
  ],
  "prevention":[
    "...",
    "..."
  ]
}

If the plant is healthy, return:

{
  "disease":"Healthy",
  "confidence":"100%",
  "severity":"None",
  "description":"The plant appears healthy.",
  "treatment":[],
  "prevention":[]
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

    const result = JSON.parse(text);

    res.json({
      success: true,
      result,
    });

  } catch (err) {
  console.error("Gemini Error:");
  console.error(err);

  if (err.response) {
    console.error(err.response.data);
  }

  res.status(500).json({
    success: false,
    message: err.message,
  });
}
};

module.exports = {
  detectDisease,
};
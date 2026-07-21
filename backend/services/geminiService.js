const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateResponse = async (prompt, imageBase64 = null, mimeType = null) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-latest" // use full standard model name to be safe
        });

        const parts = [{ text: prompt }];

        if (imageBase64 && mimeType) {
            parts.push({
                inlineData: {
                    data: imageBase64,
                    mimeType: mimeType
                }
            });
        }

        const result = await model.generateContent(parts);

        const response = result.response;

        return response.text();

    } catch (error) {

        console.error("Gemini Error:", error);

        throw new Error("AI response failed");
    }
};

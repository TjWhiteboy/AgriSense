const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function testGemini() {
    console.log("Key:", process.env.GEMINI_API_KEY ? "Found" : "Missing");
    if (!process.env.GEMINI_API_KEY) return;

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent("Hello?");
        console.log("Success! AI Response:", result.response.text());
    } catch (error) {
        console.error("Gemini Test Failed:");
        console.error(error);
    }
}

testGemini();

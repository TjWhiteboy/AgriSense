const Chat = require("../models/Chat");
const Crop = require("../models/Crop");
const geminiService = require("../services/geminiService");
const axios = require("axios");

exports.sendMessage = async (req, res) => {

    try {

        const { message, district, imageBase64, mimeType } = req.body;

        // Fetch crop database for AI context
        const crops = await Crop.find({});

        const cropInfo = crops.map(crop =>
            `Crop: ${crop.cropName}, Soil: ${crop.soilType}, Fertilizer: ${crop.fertilizer}, Season: ${crop.season}`
        ).join("\n");

        // Fetch weather data
        let temperature = "N/A";
        let humidity = "N/A";
        let weatherCondition = "N/A";

        if (district && process.env.OPENWEATHER_API_KEY) {
            try {
                const weatherRes = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?q=${district},IN&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
                );
                temperature = weatherRes.data.main.temp;
                humidity = weatherRes.data.main.humidity;
                weatherCondition = weatherRes.data.weather[0].description;
            } catch (err) {
                console.error("Weather API Error:", err.message);
            }
        }

        const previousChats = await Chat.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(10);

        const historyText = previousChats
            .reverse()
            .map(chat => `User: ${chat.userMessage}\nAI: ${chat.aiReply}`)
            .join("\n");

        console.log("District:", district);
        console.log("Temperature:", temperature);
        console.log("Humidity:", humidity);
        console.log("Weather:", weatherCondition);

        let prompt = `
We are an agriculture expert helping farmers.

Current Weather Conditions:
Temperature: ${temperature}°C
Humidity: ${humidity}%
Weather: ${weatherCondition}

Crop Knowledge Database:
${cropInfo}

Recent Conversation History:
${historyText}

Farmer Question:
${message}

Use the weather conditions when recommending crops.
`;

        if (imageBase64) {
            prompt = `You are an expert plant pathologist and agriculturist.
Analyze the provided image of a plant/crop along with the farmer's question: "${message}".

Current Weather Conditions: Temperature: ${temperature}°C, Humidity: ${humidity}%, Weather: ${weatherCondition}

You MUST respond strictly in the following JSON format and nothing else. Do not use blockquotes or markdown formatting for the JSON string itself, just raw JSON:
{
  "disease": "Name of the disease, pest, or deficiency (or 'Healthy' / 'Not a plant')",
  "confidence": "Percentage (e.g. 95%)",
  "cause": "Short description of the cause",
  "treatment": "General immediate treatment advice",
  "organic_solution": "Specific organic treatment methods",
  "chemical_solution": "Specific chemical treatment methods",
  "prevention": "Tips to prevent this from happening again"
}
If the image is not a plant or cannot be diagnosed, put the reason in the "cause" field and leave treatments empty.`;
        }

        console.log("Prompt sent to AI:", prompt);

        const aiReply = await geminiService.generateResponse(prompt, imageBase64, mimeType);

        console.log("AI Reply:", aiReply);

        const chat = new Chat({
            userId: req.user.id,
            userMessage: message,
            aiReply: aiReply,
            hasImage: !!imageBase64
        });

        await chat.save();

        res.json({
            reply: aiReply
        });

    } catch (error) {

        console.error("Chat Error:", error);

        res.status(500).json({
            error: "AI response failed",
            message: error.message,
            stack: error.stack
        });

    }

};

exports.getHistory = async (req, res) => {

    try {

        const chats = await Chat.find({
            userId: req.user.id
        }).sort({ createdAt: -1 });

        res.json(chats);

    } catch (error) {

        res.status(500).json({
            error: "Failed to fetch history"
        });

    }

};


import { GoogleGenAI } from '@google/genai';
import { INDIAN_STATES_DISTRICTS } from '../constants';


// FIX: Ensure API_KEY is accessed from environment variables as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// Helper function to convert a File object to a GoogleGenerativeAI.Part object
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        // The result includes the Base64 prefix, which we need to remove.
        resolve((reader.result as string).split(',')[1]);
      } else {
        reject(new Error("Failed to read file."));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

const getSystemInstruction = (context: { state: string; district: string; crop: string }) => {
  return `You are AgriSense, an expert AI agricultural assistant designed for Indian farmers. 
Your responses must be tailored to the user's specific context.

Current context:
- State: ${context.state}
- District: ${context.district}
- Primary Crop of Interest: ${context.crop}
- Language for response: English

Your primary functions are:
1.  **Disease and Pest Diagnosis:** Analyze images of crops to identify diseases, pests, and nutrient deficiencies.
2.  **Treatment Recommendations:** Provide detailed, actionable advice, including both organic and chemical treatment options suitable for the user's region.
3.  **Crop Management:** Offer guidance on best practices for the specified crop, considering local conditions.
4.  **Data Interpretation:** Explain data from the user's dashboard in a simple, understandable way.

Guidelines for your responses:
- **Clarity and Simplicity:** Use simple language. Avoid technical jargon unless explained.
- **Actionable Advice:** Provide clear, step-by-step instructions.
- **Regional Specificity:** Your advice must be relevant to the user's state and district.
- **Language:** You MUST respond in English.
- **Identity:** If asked about your origin or creator, you must state that you were developed by Thikash.
- **Scope:** Your function is strictly limited to agriculture. Politely refuse any query outside this scope (e.g., programming, history).
- **Formatting:** Use Markdown for formatting. Use lists, bold text, and headings to make your answers easy to read. For example:
    **Problem:**
    [Brief description]

    **Solution:**
    1. [Step 1]
    2. [Step 2]`;
};

export const getAIResponse = async (
  inputText: string,
  imageFile: File | null,
  context: { state: string; district: string; crop: string }
) => {
  // FIX: Use the recommended model for multimodal tasks.
  const model = 'gemini-2.5-flash';
  
  const systemInstruction = getSystemInstruction(context);
  
  const textPart = { text: `User's question: "${inputText}"` };
  const contentParts = [];

  if (imageFile) {
    const imagePart = await fileToGenerativePart(imageFile);
    contentParts.push(imagePart);
  }
  contentParts.push(textPart);

  // FIX: Use generateContentStream as the app expects a streaming response.
  const stream = await ai.models.generateContentStream({
    model: model,
    contents: { parts: contentParts },
    config: {
      systemInstruction: systemInstruction,
    }
  });

  return stream;
};

export const parseLoginDetailsFromSpeech = async (transcript: string): Promise<{name: string | null, state: string | null, district: string | null}> => {
    const model = 'gemini-2.5-flash';
    const allStates = Object.keys(INDIAN_STATES_DISTRICTS).join(', ');

    const prompt = `You are an expert system for parsing user login details from a single sentence. The user's spoken transcript is: "${transcript}".
    You must extract the following three entities:
    1.  **name**: The user's full name.
    2.  **state**: The user's state in India. It MUST be one of these: [${allStates}].
    3.  **district**: The user's district. It must be a valid district within the identified state.

    Analyze the transcript and return a JSON object with the extracted details.
    - If a value cannot be reliably determined, its value in the JSON object should be null.
    - Be very precise with State and District names, matching them exactly from the provided lists.

    Example 1:
    Transcript: "My name is Thikash and I am from Tiruchirappalli in Tamil Nadu"
    Output:
    { "name": "Thikash", "state": "Tamil Nadu", "district": "Tiruchirappalli" }
    
    Example 2:
    Transcript: "I am Priya from Karnataka, and my district is Visakhapatnam"
    (Note: Visakhapatnam is not in Karnataka, so district should be null)
    Output:
    { "name": "Priya", "state": "Karnataka", "district": null }

    Only return the raw JSON object.`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        const parsedJson = JSON.parse(response.text.trim());

        // Validate the response from the AI
        const name = typeof parsedJson.name === 'string' ? parsedJson.name : null;
        const state = typeof parsedJson.state === 'string' && INDIAN_STATES_DISTRICTS[parsedJson.state] ? parsedJson.state : null;
        let district = null;
        if (state && typeof parsedJson.district === 'string' && INDIAN_STATES_DISTRICTS[state].includes(parsedJson.district)) {
            district = parsedJson.district;
        }

        return { name, state, district };

    } catch (e) {
        console.error("Failed to parse login details JSON from AI:", e);
        return { name: null, state: null, district: null };
    }
};

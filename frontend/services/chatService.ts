import { apiClient } from './apiClient';
import { INDIAN_STATES_DISTRICTS } from '../constants';

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
- **Greeting:** Get straight to the point. Do not start your response with greetings like "Hello", "Hi", or "Namaste!".
- **Identity:** If asked about your origin or creator, you must state that you were developed by Thikash.
- **Scope:** Your function is strictly limited to agriculture. Politely refuse any query outside this scope (e.g., programming, history).
- **Formatting:** Use Markdown for formatting. Use lists, bold text, and headings to make your answers easy to read. For example:
    **Problem:**
    [Brief description]

    **Solution:**
    1. [Step 1]
    2. [Step 2]`;
};

export const chatService = {
  sendMessage: async (
    inputText: string, 
    imageFile: File | null = null, 
    context: { state: string; district: string; crop: string } | null = null
  ) => {
    let prompt = inputText;
    let imageBase64: string | undefined;
    let mimeType: string | undefined;

    if (imageFile) {
      mimeType = imageFile.type;
      const arrayBuffer = await imageFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      let binary = '';
      for (let i = 0; i < uint8Array.byteLength; i++) {
        binary += String.fromCharCode(uint8Array[i]);
      }
      imageBase64 = btoa(binary);
    }

    if (context) {
      const systemInstruction = getSystemInstruction(context);
      prompt = `${systemInstruction}\n\nUser's question: "${inputText}"`;
    }

    // Ensure we send message, district, state, crop, and image data explicitly to fix the weather functionality
    const data = await apiClient.post('/chat', { 
        message: prompt,
        district: context?.district,
        state: context?.state,
        crop: context?.crop,
        imageBase64,
        mimeType
    });

    if (!data.reply) {
      throw new Error(data.error || "AI response failed");
    }

    return data.reply;
  },

  getHistory: async () => {
    return apiClient.get('/history');
  },

  deleteHistory: async (id: string) => {
    // Note: Backend does not have a DELETE route currently. Stubbing for frontend integration.
    console.warn("deleteHistory not implemented in backend yet");
  },

  clearHistory: async () => {
    // Note: Backend does not have a DELETE route currently. Stubbing for frontend integration.
    console.warn("clearHistory not implemented in backend yet");
  },

  parseLoginDetailsFromSpeech: async (transcript: string) => {
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
        // NOTE: This endpoint naturally fails right now if no token is in localStorage 
        // since `/chat` requires authMiddleware. We will still call it via apiClient
        // but if it fails (e.g. 401), we catch it here.
        const data = await apiClient.post('/chat', { message: prompt });
  
        if (!data || !data.reply) throw new Error("Invalid response");

        let responseText = data.reply.trim();
        // Remove markdown formatting
        if (responseText.startsWith('\`\`\`json')) {
          responseText = responseText.replace('\`\`\`json', '').replace('\`\`\`', '').trim();
        } else if (responseText.startsWith('\`\`\`')) {
          responseText = responseText.replace('\`\`\`', '').replace('\`\`\`', '').trim();
        }
  
        const parsedJson = JSON.parse(responseText);
  
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
  }
};

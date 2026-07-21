
import type { Language, LanguageCode } from './types';
import LeafLogoIcon from './components/icons/LeafLogoIcon';

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English' },
];

export const TRANSLATIONS: Record<string, string> = {
    // Header & Titles
    headerTitle: 'AgriSense',
    headerSubtitle: 'Nurturing Growth with Intelligence',
    welcomeTitle: 'How can I help you today?',
    loginTitle: 'AgriSense',
    loginSubtitle: 'Your smart farming assistant awaits. Log in to get started.',

    // Common UI
    sendMessagePlaceholder: 'Ask AgriSense a question or describe your issue...',
    newChat: 'New Chat',
    searchChats: 'Search past conversations...',
    initialMessage: "Namaste, {name}! Welcome to AgriSense. I'm here to help with your farming questions. To get started, you can ask me about crop diseases, soil health, or market prices. How can I assist you today?",
    errorMessage: "I'm sorry, but I encountered an error while processing your request. Please try again in a few moments.",
    
    // Login Screen
    loginGreeting: 'Welcome to AgriSense',
    loginGreetingSpokenFull: 'Welcome to AgriSense, your AI farming companion. Please tell me your full name, state, and district to begin.',
    loginStartPrompt: 'Nurturing Growth with Intelligence. Tap the mic to begin.',
    loginListenPrompt: 'I\'m ready when you are...',
    loginListeningPrompt: 'Listening for your details...',
    loginProcessing: 'Analyzing your response...',
    loginManualHeader: 'Or, enter your details below:',
    loginManualButton: 'Enter details manually',
    loginButton: 'Log In & Start Farming Smarter',
    nameLabel: 'Your Name',
    stateLabel: 'State',
    locationLabel: 'District',
    cropLabel: 'Primary Crop',
    
    // Chat Actions
    startRecording: 'Start voice input',
    stopRecording: 'Stop voice input',
    removeImage: 'Remove image',
    liveSession: 'Start Live Video Analysis',
    liveSessionGreeting: "Hi {name}, welcome to your live analysis session. Please point your camera at the area you'd like me to examine.",

    // Tooltips
    attachTooltip: 'Upload an image for disease or soil analysis',
    micTooltipStart: 'Use voice input for hands-free operation',
    micTooltipStop: 'Stop voice recording',
    videoTooltip: 'Start a live video session for real-time assistance',
    sendTooltip: 'Submit your query',

    // Message Actions
    readAloud: 'Read summary aloud',
    stopReading: 'Stop reading',
    copy: 'Copy text',
    copied: 'Copied!',
    goodResponse: 'Good response',
    badResponse: 'Bad response',
    feedbackSent: 'Feedback sent!',

    // Dashboard
    dashboard: 'Dashboard',
    chat: 'Chat',
    weatherTitle: 'Current Weather',
    pestAlertsTitle: 'Pest & Disease Alerts',
    soilHealthTitle: 'Soil Health Overview',
    resourceInsightsTitle: 'Resource Insights',
    marketTrendsTitle: 'Market Trends',
    yieldPredictionTitle: 'Yield Prediction',
    plantingAdvisorTitle: 'Planting Advisor',
    districtBenchmarkTitle: 'District Benchmark',
    pestOutbreakPredictionTitle: 'Pest Outbreak Prediction',
    readoutIntro: 'Here is your dashboard summary for {location}.',
    readoutWeather: 'The current weather is {condition} at {temp}.',
    readoutPestAlert: 'Pest and disease alert level is {level}.',
    readoutSoilHealth: 'Soil health shows Nitrogen at {nValue} which is {nStatus}, Phosphorus at {pValue} which is {pStatus}, Potassium at {kValue} which is {kStatus}, and a pH of {ph}.',
    readoutYieldPrediction: 'The predicted yield for {crop} is {yield} tons per hectare with {confidence} percent confidence.',
    readoutPlantingAdvisor: 'The recommended crop for planting is {crop} because {reason}.',
    readoutDistrictBenchmark: 'Your farm\'s yield is in the {rank} for the district.',
    confidence: 'Confidence',
    probability: 'Probability',
    reason: 'Reason',
    alertLow: 'Low',
    alertMedium: 'Medium',
    alertHigh: 'High',
    optimal: 'Optimal',
    low: 'Low',
    high: 'High',
    strong: 'Strong',
    stable: 'Stable',
    weak: 'Weak',
    
    // Sidebar & Modals
    welcomeBack: 'Welcome back!',
    logoutButton: 'Log out',
    cancelButton: 'Cancel',
    confirmButton: 'Confirm',
    deleteChatConfirmTitle: 'Delete Chat',
    deleteChatConfirmMessage: 'Are you sure you want to permanently delete this chat?',
    logoutConfirmTitle: 'Confirm Logout',
    logoutConfirmMessage: 'Are you sure you want to log out of your AgriSense account?',

    // Footer
    footerText: 'AgriSense is an AI-powered tool. Always verify critical information with a local expert.',
};

export const WELCOME_PROMPTS = [
    'What are the common diseases for rice in Thanjavur?',
    'Show me the market trend for sugarcane.',
    'My tomato plant\'s leaves are yellowing, what should I do?',
];

export const DISTRICT_CROP_DATA: Record<string, { crops: string[] }> = {
    "Ariyalur": { "crops": ["Rice", "Cumbu", "Maize", "Cholam", "Ragi", "Black Gram", "Green Gram", "Coconut", "Gingelly", "Castor", "Groundnut", "Banana", "Mango", "Onion", "Cashew", "Betelvine", "Citrus", "Jack", "Other Vegetables"] },
    "Chengalpattu": { "crops": ["Rice", "Groundnut", "Blackgram", "Greengram", "Redgram", "Sugarcane", "Ragi", "Gingelly", "Cotton", "Sorghum", "Cumbu", "Vegetables", "Banana", "Coconut", "Mango"] },
    "Coimbatore": { "crops": ["Sorghum", "Pulses", "Groundnut", "Rice", "Millets", "Cumbu", "Cotton", "Sugarcane", "Ragi", "Black Gram", "Sunflower", "Green Gram", "Gingelly", "Red Gram", "Turmeric", "Maize", "Banana", "Onion", "Castor", "Spices & Plantation Crops", "Tobacco", "Vegetables", "Tuber Crops", "Flowers", "Tapioca", "Curry Leaves", "Mango"] },
    "Cuddalore": { "crops": ["Paddy", "Cumbu", "Maize", "Cholam", "Ragi", "Sugarcane", "Millets", "Black Gram", "Green Gram", "Coconut", "Gingelly", "Castor", "Groundnut", "Banana", "Guava", "Mango", "Gooseberry", "Onion", "Cashew", "Betelvine", "Citrus", "Jack", "Tomato", "Brinjal", "Ladies Finger", "Tapioca", "Cotton", "Chillies", "Jasmine"] },
    "Dharmapuri": { "crops": ["Sorghum", "Rice", "Ragi", "Maize", "Cumbu", "Samai", "Minor Millets", "Groundnut", "Red Gram", "Black Gram", "Green Gram", "Cowpea", "Bengal Gram", "Horse Gram", "Cotton", "Sugarcane", "Coconut", "Gingelly", "Tapioca", "Chillies", "Mango", "Banana", "Tobacco", "Pulses", "Jack", "Tomato", "Radish", "Bhendi", "Vegetables"] },
    "Dindigul": { "crops": ["Sorghum", "Pulses", "Groundnut", "Rice", "Millets", "Cumbu", "Cotton", "Sugarcane", "Ragi", "Black Gram", "Sunflower", "Green Gram", "Gingelly", "Red Gram", "Turmeric", "Maize", "Banana", "Onion", "Castor", "Spices & Plantation Crops", "Tobacco", "Vegetables", "Tuber Crops", "Flowers", "Tapioca", "Mango"] },
    "Erode": { "crops": ["Sorghum", "Pulses", "Groundnut", "Rice", "Millets", "Cumbu", "Cotton", "Sugarcane", "Ragi", "Black Gram", "Sunflower", "Green Gram", "Gingelly", "Red Gram", "Turmeric", "Maize", "Banana", "Onion", "Castor", "Spices & Plantation Crops", "Tobacco", "Vegetables", "Tuber Crops", "Flowers", "Tapioca", "Coconut"] },
    "Kallakurichi": { "crops": ["Paddy", "Maize", "Pearl Millet", "Sorghum", "Gingelly", "Finger Millet", "Groundnut", "Black Gram", "Cotton", "Sugarcane", "Coconut", "Tapioca", "Vegetables", "Coleus", "Cashew", "Mango"] },
    "Kanchipuram": { "crops": ["Paddy", "Ragi", "Gingelly", "Groundnut", "Black Gram", "Sugarcane", "Greengram", "Coconut", "Mango", "Guava", "Other Vegetables", "Banana", "Flower Crops", "Eucalyptus", "Teak", "Casurina"] },
    "Kanyakumari": { "crops": ["Rice", "Banana", "Jackfruit", "Mango", "Tapioca", "Cashew Nut", "Coconut", "Clove", "Vegetables", "Tamarind", "Rubber", "Blackgram", "Flowers", "Forest Crops", "Pineapple", "Nutmeg", "Pepper", "Cardamom", "Betelvine"] },
    "Karur": { "crops": ["Sorghum", "Pulses", "Groundnut", "Rice", "Cumbu", "Cotton", "Sugarcane", "Ragi", "Black Gram", "Sunflower", "Green Gram", "Gingelly", "Red Gram", "Maize", "Betelvine", "Banana", "Onion", "Coconut", "Vegetables", "Moringa", "Tuber Crops", "Flowers", "Tapioca"] },
    "Krishnagiri": { "crops": ["Sorghum", "Rice", "Millet", "Groundnut", "Horse Gram", "Cotton", "Sugarcane", "Tapioca", "Coconut", "Gingelly", "Chillies", "Mango", "Banana", "Tobacco", "Pulses", "Jack", "Tomato", "Ragi", "Redgram", "Compos", "Frenchbean", "Cabbage", "Cauliflower", "Carrot", "Potato", "Chrysanthemum", "Marigold", "Rose"] },
    "Madurai": { "crops": ["Rice", "Maize", "Cumbu", "Cholam", "Ragi", "Black Gram", "Greengram", "Groundnut", "Fodder Crops", "Gingelly", "Castor", "Cotton", "Chillies", "Banana", "Jasmine", "Coir", "Onion", "Lime", "Cashew", "Amla"] },
    "Mayiladuthurai": { "crops": ["Rice", "Cumbu", "Maize", "Cholam", "Ragi", "Black Gram", "Green Gram", "Coconut", "Gingelly", "Castor", "Groundnut", "Banana", "Mango", "Onion", "Cashew", "Betelvine", "Citrus", "Jack", "Other Vegetables"] },
    "Nagapattinam": { "crops": ["Rice", "Black Gram", "Green Gram", "Coconut", "Gingelly", "Groundnut", "Banana", "Cashew", "Citrus", "Cotton", "Other Vegetables", "Flower Crops"] },
    "Namakkal": { "crops": ["Sorghum", "Paddy", "Groundnut", "Horse Gram", "Green Gram", "Black Gram", "Red Gram", "Maize", "Castor", "Pepper", "Turmeric", "Onion", "Betelvine", "Jasmine", "Coconut", "Coffee", "Cotton", "Sugarcane", "Tapioca", "Cotton", "Gingelly", "Chillies", "Mango", "Banana", "Jack", "Tomato", "Radish"] },
    "Perambalur": { "crops": ["Maize", "Cotton", "Rice", "Sorghum", "Pulses", "Groundnut", "Millets", "Cumbu", "Sugarcane", "Ragi", "Black Gram", "Sunflower", "Green Gram", "Gingelly", "Red Gram", "Turmeric", "Banana", "Onion", "Castor", "Spices & Plantation Crops", "Vegetables", "Tuber Crops", "Flowers", "Tapioca"] },
    "Pudukkottai": { "crops": ["Rice", "Cumbu", "Maize", "Cholam", "Ragi", "Black Gram", "Green Gram", "Coconut", "Gingelly", "Castor", "Groundnut", "Banana", "Onion", "Cashew", "Betelvine", "Citrus", "Jack", "Other Vegetables", "Flower Crops", "Sugarcane", "Redgram"] },
    "Ramanathapuram": { "crops": ["Rice", "Maize", "Cumbu", "Cholam", "Ragi", "Black Gram", "Greengram", "Groundnut", "Fodder Crops", "Gingelly", "Castor", "Cotton", "Chillies", "Banana", "Jasmine", "Coir", "Onion", "Lime", "Cashew", "Amla", "Coconut"] },
    "Ranipet": { "crops": ["Rice", "Groundnut", "Blackgram", "Greengram", "Redgram", "Sugarcane", "Ragi", "Gingelly", "Cotton", "Sorghum", "Cumbu", "Vegetables", "Banana", "Coconut", "Mango"] },
    "Salem": { "crops": ["Sorghum", "Paddy", "Millet", "Groundnut", "Horse Gram", "Cotton", "Sugarcane", "Tapioca", "Gingelly", "Chillies", "Mango", "Banana", "Tobacco", "Pulses", "Jack", "Tomato", "Radish", "Brinjal", "Ladies Finger", "Pepper", "Arecanut", "Cocoa", "Coconut", "Palmarosa", "Chrysanthemum", "Jasmine", "Marigold", "Rose"] },
    "Sivagangai": { "crops": ["Rice", "Maize", "Cumbu", "Cholam", "Ragi", "Black Gram", "Greengram", "Groundnut", "Fodder Crops", "Gingelly", "Castor", "Cotton", "Chillies", "Banana", "Jasmine", "Coconut", "Onion", "Lime", "Cashew", "Amla", "Sugarcane", "Kudhiraiyali"] },
    "Tenkasi": { "crops": ["Paddy", "Maize", "Cumbu", "Cholam", "Ragi", "Black Gram", "Greengram", "Groundnut", "Fodder Crops", "Gingelly", "Castor", "Cotton", "Chillies", "Banana", "Jasmine", "Coir", "Onion", "Lime", "Cashew", "Amla", "Sunflower", "Sugarcane", "Mango"] },
    "Thanjavur": { "crops": ["Rice", "Cumbu", "Maize", "Cholam", "Ragi", "Black Gram", "Green Gram", "Coconut", "Gingelly", "Castor", "Groundnut", "Banana", "Onion", "Cashew", "Betelvine", "Citrus", "Jack", "Other Vegetables"] },
    "Theni": { "crops": ["Rice", "Cumbu", "Maize", "Cholam", "Ragi", "Black Gram", "Green Gram", "Coconut", "Groundnut", "Banana", "Onion", "Cashew", "Betelvine", "Mango", "Sugarcane", "Tea", "Coffee", "Cardamom", "Cauliflower", "Beetroot", "Flower Crops", "Other Vegetables"] },
    "Thirupathur": { "crops": ["Rice", "Pearl Millet", "Sorghum", "Gingelly", "Finger Millet", "Horsegram", "Groundnut", "Red Gram", "Castor", "Sugarcane", "Vegetables", "Cotton", "Coconut", "Banana", "Mango"] },
    "Thiruvallur": { "crops": ["Paddy", "Pearl Millet", "Blackgram", "Gingelly", "Finger Millet", "Groundnut", "Red Gram", "Sugarcane", "Mango"] },
    "Thiruvarur": { "crops": ["Rice", "Black Gram", "Green Gram", "Coconut", "Gingelly", "Groundnut", "Banana", "Citrus", "Cotton", "Brinjal", "Ladiesfinger", "Chillies", "Other Vegetables"] },
    "Thoothukudi": { "crops": ["Rice", "Maize", "Cumbu", "Cholam", "Ragi", "Black Gram", "Greengram", "Groundnut", "Fodder Crops", "Gingelly", "Castor", "Cotton", "Chillies", "Banana", "Jasmine", "Coir", "Onion", "Lime", "Cashew", "Amla"] },
    "Tirunelveli": { "crops": ["Paddy", "Maize", "Cumbu", "Cholam", "Ragi", "Blackgram", "Greengram", "Groundnut", "Fodder Crops", "Gingelly", "Castor", "Coconut", "Cotton", "Sunflower", "Sugarcane", "Chillies", "Banana", "Jasmine", "Coir", "Onion", "Acid Lime", "Cashew", "Amla", "Vegetables", "Mango", "Guava"] },
    "Tiruppur": { "crops": ["Sorghum", "Pulses", "Groundnut", "Rice", "Cumbu", "Cotton", "Sugarcane", "Ragi", "Black Gram", "Sunflower", "Green Gram", "Gingelly", "Red Gram", "Turmeric", "Maize", "Banana", "Onion", "Castor", "Coconut", "Tobacco", "Vegetables", "Tuber Crops", "Flowers", "Tapioca"] },
    "Tiruvannamalai": { "crops": ["Paddy", "Pearl Millet", "Sorghum", "Gingelly", "Finger Millet", "Groundnut", "Red Gram", "Sugarcane", "Mango", "Black Gram", "Cowpea", "Cotton", "Sama", "Minor Millets", "Coconut", "Red Chillies", "Banana", "Brinjal", "Tomato", "Tapioca", "Chrysanthemum", "Jasmine", "Marigold", "Tuberose", "Bhendi"] },
    "Tiruchirappalli": { "crops": ["Rice", "Cumbu", "Maize", "Cholam", "Ragi", "Black Gram", "Green Gram", "Cotton", "Sugarcane", "Red Gram", "Coconut", "Gingelly", "Castor", "Groundnut", "Banana", "Onion", "Cashew", "Betelvine", "Citrus", "Jack", "Other Vegetables"] },
    "Vellore": { "crops": ["Groundnut", "Coconut", "Mango", "Paddy", "Redgram", "Sorghum", "Horsegram", "Blackgram", "Banana", "Ragi"] },
    "Villupuram": { "crops": ["Paddy", "Pearl Millet", "Black Gram", "Sorghum", "Gingelly", "Finger Millet", "Groundnut", "Red Gram", "Sugarcane", "Cotton", "Cashewnut", "Tapioca", "Guava", "Mango"] },
    "Virudhunagar": { "crops": ["Rice", "Maize", "Cumbu", "Cholam", "Ragi", "Black Gram", "Greengram", "Groundnut", "Fodder Crops", "Gingelly", "Castor", "Cotton", "Chillies", "Banana", "Jasmine", "Coir", "Onion", "Lime", "Cashew", "Mulberry", "Amla", "Coconut", "Guava", "Sapota", "Barnyard Millet"] }
};

export const INDIAN_STATES_DISTRICTS: Record<string, string[]> = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Alappuzha'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
  'Tamil Nadu': [
    'Ariyalur', 'Chengalpattu', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul',
    'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri',
    'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Perambalur', 'Pudukkottai',
    'Ramanathapuram', 'Ranipet', 'Salem', 'Sivagangai', 'Tenkasi', 'Thanjavur', 'Theni',
    'Thirupathur', 'Thiruvallur', 'Thiruvarur', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli',
    'Tiruppur', 'Tiruvannamalai', 'Vellore', 'Villupuram', 'Virudhunagar'
  ],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Meerut'],
};

export const COMMON_CROPS: string[] = [
    'Acid Lime', 'Amla', 'Apple', 'Arecanut', 'Banana', 'Barnyard Millet', 'Beetroot',
    'Bengal Gram', 'Betelvine', 'Bhendi', 'Black Gram', 'Blackgram', 'Brinjal',
    'Cabbage', 'Cardamom', 'Carrot', 'Cashew', 'Cashew Nut', 'Cashewnut', 'Castor',
    'Casurina', 'Cauliflower', 'Chillies', 'Cholam', 'Chrysanthemum', 'Citrus',
    'Clove', 'Cocoa', 'Coconut', 'Coffee', 'Coir', 'Coleus', 'Compos', 'Cotton',
    'Cowpea', 'Cumbu', 'Curry Leaves', 'Eucalyptus', 'Finger Millet', 'Flower Crops',
    'Flowers', 'Fodder Crops', 'Forest Crops', 'Frenchbean', 'Gingelly', 'Gooseberry',
    'Grapes', 'Green Gram', 'Greengram', 'Groundnut', 'Guava', 'Horse Gram', 'Horsegram',
    'Jack', 'Jackfruit', 'Jasmine', 'Jute', 'KidneyBeans', 'Kudhiraiyali', 'Ladies Finger',
    'Ladiesfinger', 'Lentil', 'Lime', 'Maize', 'Mango', 'Marigold', 'Millet', 'Millets',
    'Minor Millets', 'Moringa', 'MothBeans', 'Mulberry', 'MungBean', 'Muskmelon', 'Nutmeg',
    'Onion', 'Other Vegetables', 'Paddy', 'Palmarosa', 'Papaya', 'Pearl Millet', 'Pepper',
    'PigeonPeas', 'Pineapple', 'Pomegranate', 'Potato', 'Pulses', 'Radish', 'Ragi', 'Red Chillies',
    'Red Gram', 'Redgram', 'Rice', 'Rose', 'Rubber', 'Sama', 'Samai', 'Sapota', 'Sorghum',
    'Soybean', 'Spices & Plantation Crops', 'Sugarcane', 'Sunflower', 'Tamarind', 'Tapioca',
    'Tea', 'Teak', 'Tobacco', 'Tomato', 'Tuber Crops', 'Tuberose', 'Turmeric', 'Vegetables',
    'Watermelon', 'Wheat'
];

export const CROP_DATA = [
    {"pH_Value":6.502985292,"Nitrogen":90,"Phosphorus":42,"Potassium":43,"Humidity":82.00274423,"Crop":"Rice"},
    {"pH_Value":7.038096361,"Nitrogen":85,"Phosphorus":58,"Potassium":41,"Humidity":80.31964408,"Crop":"Rice"},
    {"pH_Value":7.840207144,"Nitrogen":60,"Phosphorus":55,"Potassium":44,"Humidity":82.3207629,"Crop":"Rice"},
    {"pH_Value":6.980400905,"Nitrogen":74,"Phosphorus":35,"Potassium":40,"Humidity":80.15836264,"Crop":"Rice"},
    {"pH_Value":7.628472891,"Nitrogen":78,"Phosphorus":42,"Potassium":42,"Humidity":81.60487287,"Crop":"Rice"},
    {"pH_Value":7.073453503,"Nitrogen":69,"Phosphorus":37,"Potassium":42,"Humidity":83.37011772,"Crop":"Rice"},
    {"pH_Value":5.70080568,"Nitrogen":69,"Phosphorus":55,"Potassium":38,"Humidity":82.63941394,"Crop":"Rice"},
    {"pH_Value":5.718627178,"Nitrogen":94,"Phosphorus":53,"Potassium":40,"Humidity":82.89408619,"Crop":"Rice"},
    {"pH_Value":6.685346424,"Nitrogen":89,"Phosphorus":54,"Potassium":38,"Humidity":83.5352163,"Crop":"Rice"}
];

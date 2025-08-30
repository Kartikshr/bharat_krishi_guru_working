import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getAgriculturalAdvice(query: string, location?: string, language?: string, context?: any[]): Promise<string> {
  try {
    const isHindi = language === 'hi' || /[\u0900-\u097F]/.test(query);
    
    const systemPrompt = isHindi 
      ? `आप एक विशेषज्ञ कृषि सलाहकार हैं जो भारतीय किसानों की मदद करते हैं। 
आप हिंदी और अंग्रेजी दोनों भाषाओं में उत्तर दे सकते हैं। 
कृषि, फसलों, बीमारियों, सिंचाई, उर्वरक, कीटनाशक, सरकारी योजनाओं, बाजार भाव, मौसम आधारित सलाह, और आधुनिक खेती तकनीकों के बारे में व्यावहारिक सलाह दें।
${location ? `स्थान: ${location}` : ""}

महत्वपूर्ण निर्देश:
- हमेशा व्यावहारिक और क्रियान्वित करने योग्य सलाह दें
- स्थानीय परिस्थितियों को ध्यान में रखें
- सरकारी योजनाओं की जानकारी दें
- आधुनिक तकनीक और पारंपरिक ज्ञान दोनों का उपयोग करें
- सुरक्षा और पर्यावरण का ध्यान रखें`
      : `You are an expert agricultural advisor helping Indian farmers. 
You can respond in both Hindi and English languages. 
Provide practical advice about agriculture, crops, diseases, irrigation, fertilizers, pesticides, government schemes, market prices, weather-based recommendations, and modern farming techniques.
${location ? `Location: ${location}` : ""}

Important guidelines:
- Always provide practical and actionable advice
- Consider local conditions and climate
- Include information about government schemes
- Use both modern technology and traditional knowledge
- Focus on safety and environmental considerations
- Provide cost-effective solutions for small farmers`;

    // Include conversation context if available
    let contextualQuery = query;
    if (context && context.length > 0) {
      const recentContext = context.slice(-3).map(msg => `${msg.sender}: ${msg.text}`).join('\n');
      contextualQuery = `Previous conversation:\n${recentContext}\n\nCurrent question: ${query}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      },
      contents: contextualQuery,
    });

    const responseText = response.text;
    
    if (!responseText) {
      return isHindi 
        ? "माफ करें, मैं आपकी मदद नहीं कर सकता। कृपया दोबारा प्रयास करें।"
        : "Sorry, I couldn't help you. Please try again.";
    }

    return responseText;
  } catch (error) {
    console.error("Gemini API error:", error);
    
    const isHindi = language === 'hi' || /[\u0900-\u097F]/.test(query);
    throw new Error(isHindi 
      ? "AI सलाहकार सेवा में समस्या है। कृपया बाद में प्रयास करें।"
      : "AI advisory service is experiencing issues. Please try again later.");
  }
}

export async function analyzeWeatherForFarming(weatherData: any, location: string): Promise<string> {
  try {
    const systemPrompt = `आप एक कृषि मौसम विशेषज्ञ हैं। मौसम डेटा के आधार पर भारतीय किसानों को व्यावहारिक सुझाव दें।
सिंचाई, बुआई, कटाई, फसल सुरक्षा, कीट प्रबंधन, और उर्वरक प्रयोग के बारे में विस्तृत सलाह दें। हिंदी और अंग्रेजी में उत्तर दें।

मौसम आधारित सलाह में शामिल करें:
- तत्काल करने योग्य कार्य
- अगले 3-7 दिनों की योजना
- फसल सुरक्षा के उपाय
- सिंचाई की आवश्यकता
- कीट-रोग की संभावना
- उर्वरक प्रयोग का समय`;

    const weatherQuery = `स्थान: ${location}
तापमान: ${weatherData.temperature}°C
नमी: ${weatherData.humidity}%
हवा की गति: ${weatherData.windSpeed} m/s
मौसम: ${weatherData.condition}
बारिश: ${weatherData.rainfall}mm

इस मौसम के आधार पर विस्तृत कृषि सलाह दें। तत्काल करने योग्य कार्यों और आने वाले दिनों की योजना के बारे में बताएं।`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.6,
        maxOutputTokens: 1024,
      },
      contents: weatherQuery,
    });

    return response.text || "मौसम आधारित सलाह उपलब्ध नहीं है।";
  } catch (error) {
    console.error("Weather analysis error:", error);
    throw new Error("मौसम विश्लेषण सेवा में समस्या है।");
  }
}

export async function analyzeMarketPrices(marketData: any[], location: string): Promise<string> {
  try {
    const systemPrompt = `आप एक कृषि बाजार विशेषज्ञ हैं। बाजार भावों का विस्तृत विश्लेषण करके भारतीय किसानों को बिक्री और खरीदारी की सलाह दें।

विश्लेषण में शामिल करें:
- कब बेचना चाहिए और कब प्रतीक्षा करनी चाहिए
- कौन सी फसल अच्छी कीमत पर मिल सकती है
- मौसमी मांग और आपूर्ति का प्रभाव
- भंडारण की सलाह
- परिवहन और बाजार पहुंच की जानकारी
- जोखिम प्रबंधन के उपाय

हिंदी और अंग्रेजी दोनों भाषाओं में व्यापक सलाह दें।`;

    const marketQuery = `स्थान: ${location}
बाजार भाव डेटा: ${JSON.stringify(marketData.slice(0, 15), null, 2)}

इस बाजार डेटा के आधार पर किसानों को विस्तृत बिक्री और खरीदारी की रणनीति बताएं। तत्काल और दीर्घकालिक दोनों सलाह दें।`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.6,
        maxOutputTokens: 1024,
      },
      contents: marketQuery,
    });

    return response.text || "बाजार विश्लेषण उपलब्ध नहीं है।";
  } catch (error) {
    console.error("Market analysis error:", error);
    throw new Error("बाजार विश्लेषण सेवा में समस्या है।");
  }
}

export async function analyzeCropDisease(imageDescription: string): Promise<any> {
  try {
    const systemPrompt = `आप एक फसल रोग विशेषज्ञ हैं। छवि विवरण के आधार पर फसल की बीमारी की पहचान करें।
रोग का नाम, कारण, इलाज, और रोकथाम के उपाय बताएं। JSON format में उत्तर दें:
{
  "disease": "रोग का नाम (हिंदी और अंग्रेजी में)",
  "confidence": कॉन्फिडेंस (1-100),
  "description": "रोग का विस्तृत विवरण",
  "symptoms": ["लक्षणों की सूची"],
  "causes": ["कारणों की सूची"],
  "treatments": {
    "immediate": ["तत्काल उपचार"],
    "chemical": ["रासायनिक इलाज"],
    "organic": ["जैविक इलाज"],
    "cultural": ["सांस्कृतिक नियंत्रण"]
  },
  "prevention": ["रोकथाम के उपाय"],
  "cost_estimate": "उपचार की अनुमानित लागत",
  "timeline": "ठीक होने का समय"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.5,
      },
      contents: `फसल की छवि विवरण: ${imageDescription}। कृपया इस आधार पर विस्तृत बीमारी का विश्लेषण करें।`,
    });

    const result = response.text;
    if (result) {
      return JSON.parse(result);
    }

    return {
      disease: "अज्ञात रोग / Unknown Disease",
      confidence: 50,
      description: "पूर्ण विश्लेषण के लिए विशेषज्ञ से संपर्क करें। / Contact expert for complete analysis.",
      symptoms: ["स्पष्ट लक्षण दिखाई नहीं दे रहे / Symptoms not clearly visible"],
      causes: ["अधिक जानकारी की आवश्यकता / More information needed"],
      treatments: {
        immediate: ["स्थानीय कृषि विशेषज्ञ से संपर्क करें / Contact local agricultural expert"],
        chemical: ["विशेषज्ञ की सलाह पर रासायनिक उपचार / Chemical treatment as per expert advice"],
        organic: ["नीम का तेल का प्रयोग करें / Use neem oil", "जैविक कवकनाशी का प्रयोग / Use organic fungicide"],
        cultural: ["उचित सफाई बनाए रखें / Maintain proper hygiene", "संक्रमित भागों को हटाएं / Remove infected parts"]
      },
      prevention: ["उचित सफाई / Proper sanitation", "फसल चक्र अपनाएं / Follow crop rotation", "प्रतिरोधी किस्मों का चयन / Choose resistant varieties"],
      cost_estimate: "₹500-2000 प्रति एकड़ / per acre",
      timeline: "2-4 सप्ताह / weeks"
    };
  } catch (error) {
    console.error("Crop disease analysis error:", error);
    throw new Error("फसल रोग विश्लेषण में समस्या है। / Crop disease analysis error.");
  }
}
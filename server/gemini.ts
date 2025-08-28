import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getAgriculturalAdvice(query: string, location?: string): Promise<string> {
  try {
    const systemPrompt = `आप एक विशेषज्ञ कृषि सलाहकार हैं जो भारतीय किसानों की मदद करते हैं। 
आप हिंदी और अंग्रेजी दोनों भाषाओं में उत्तर दे सकते हैं। 
कृषि, फसलों, बीमारियों, सिंचाई, उर्वरक, कीटनाशक, सरकारी योजनाओं, और आधुनिक खेती तकनीकों के बारे में व्यावहारिक सलाह दें।
${location ? `स्थान: ${location}` : ""}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
      contents: query,
    });

    return response.text || "माफ करें, मैं आपकी मदद नहीं कर सकता। कृपया दोबारा प्रयास करें।";
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("AI सलाहकार सेवा में समस्या है। कृपया बाद में प्रयास करें।");
  }
}

export async function analyzeWeatherForFarming(weatherData: any, location: string): Promise<string> {
  try {
    const systemPrompt = `आप एक कृषि मौसम विशेषज्ञ हैं। मौसम डेटा के आधार पर भारतीय किसानों को व्यावहारिक सुझाव दें।
सिंचाई, बुआई, कटाई, फसल सुरक्षा के बारे में बताएं। हिंदी और अंग्रेजी में उत्तर दें।`;

    const weatherQuery = `स्थान: ${location}
तापमान: ${weatherData.temperature}°C
नमी: ${weatherData.humidity}%
हवा की गति: ${weatherData.windSpeed} m/s
मौसम: ${weatherData.condition}
बारिश: ${weatherData.rainfall}mm

इस मौसम के आधार पर कृषि सलाह दें।`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
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
    const systemPrompt = `आप एक कृषि बाजार विशेषज्ञ हैं। बाजार भावों का विश्लेषण करके भारतीय किसानों को बिक्री की सलाह दें।
कब बेचना चाहिए, कौन सी फसल अच्छी कीमत पर मिल सकती है, इसकी जानकारी दें।`;

    const marketQuery = `स्थान: ${location}
बाजार भाव डेटा: ${JSON.stringify(marketData.slice(0, 10), null, 2)}

इस बाजार डेटा के आधार पर किसानों को बिक्री की सलाह दें।`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
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
  "disease": "रोग का नाम",
  "confidence": कॉन्फिडेंस (1-100),
  "description": "रोग का विवरण",
  "treatments": {
    "chemical": ["रासायनिक इलाज"],
    "organic": ["जैविक इलाज"]
  },
  "prevention": ["रोकथाम के उपाय"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
      contents: `फसल की छवि विवरण: ${imageDescription}। कृपया इस आधार पर बीमारी का विश्लेषण करें।`,
    });

    const result = response.text;
    if (result) {
      return JSON.parse(result);
    }

    return {
      disease: "अज्ञात रोग",
      confidence: 50,
      description: "पूर्ण विश्लेषण के लिए विशेषज्ञ से संपर्क करें।",
      treatments: {
        chemical: ["स्थानीय कृषि विशेषज्ञ से सलाह लें"],
        organic: ["नीम का तेल का प्रयोग करें"]
      },
      prevention: ["उचित सफाई", "फसल चक्र अपनाएं"]
    };
  } catch (error) {
    console.error("Crop disease analysis error:", error);
    throw new Error("फसल रोग विश्लेषण में समस्या है।");
  }
}
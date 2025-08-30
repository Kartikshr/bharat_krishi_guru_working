import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getAgriculturalAdvice(query: string, location?: string, language?: string, context?: any[]): Promise<string> {
  try {
    const detectedLang = language || detectQueryLanguage(query);
    
    const systemPrompt = createSystemPrompt(detectedLang, location);

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
      return getFallbackMessage(detectedLang);
    }

    return responseText;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error(getErrorMessage(language || 'en'));
  }
}

function detectQueryLanguage(query: string): string {
  const patterns = {
    hi: /[\u0900-\u097F]/,
    bn: /[\u0980-\u09FF]/,
    te: /[\u0C00-\u0C7F]/,
    ta: /[\u0B80-\u0BFF]/,
    gu: /[\u0A80-\u0AFF]/,
    mr: /[\u0900-\u097F]/, // Marathi uses Devanagari like Hindi
    kn: /[\u0C80-\u0CFF]/,
    ml: /[\u0D00-\u0D7F]/,
    pa: /[\u0A00-\u0A7F]/
  };

  for (const [lang, pattern] of Object.entries(patterns)) {
    if (pattern.test(query)) {
      return lang;
    }
  }
  
  return 'en'; // Default to English
}

function createSystemPrompt(language: string, location?: string): string {
  const prompts = {
    en: `You are an expert agricultural advisor helping Indian farmers. 
You can respond in English and other Indian languages as needed. 
Provide practical advice about agriculture, crops, diseases, irrigation, fertilizers, pesticides, government schemes, market prices, weather-based recommendations, and modern farming techniques.
${location ? `Location: ${location}` : ""}

Important guidelines:
- Always provide practical and actionable advice
- Consider local conditions and climate
- Include information about government schemes
- Use both modern technology and traditional knowledge
- Focus on safety and environmental considerations
- Provide cost-effective solutions for small farmers
- Be culturally sensitive and respectful`,

    hi: `आप एक विशेषज्ञ कृषि सलाहकार हैं जो भारतीय किसानों की मदद करते हैं। 
आप हिंदी और अन्य भारतीय भाषाओं में उत्तर दे सकते हैं। 
कृषि, फसलों, बीमारियों, सिंचाई, उर्वरक, कीटनाशक, सरकारी योजनाओं, बाजार भाव, मौसम आधारित सलाह, और आधुनिक खेती तकनीकों के बारे में व्यावहारिक सलाह दें।
${location ? `स्थान: ${location}` : ""}

महत्वपूर्ण निर्देश:
- हमेशा व्यावहारिक और क्रियान्वित करने योग्य सलाह दें
- स्थानीय परिस्थितियों को ध्यान में रखें
- सरकारी योजनाओं की जानकारी दें
- आधुनिक तकनीक और पारंपरिक ज्ञान दोनों का उपयोग करें
- सुरक्षा और पर्यावरण का ध्यान रखें
- छोटे किसानों के लिए लागत-प्रभावी समाधान प्रदान करें`,

    bn: `আপনি একজন বিশেষজ্ঞ কৃষি পরামর্শদাতা যিনি ভারতীয় কৃষকদের সাহায্য করেন।
আপনি বাংলা এবং অন্যান্য ভারতীয় ভাষায় উত্তর দিতে পারেন।
কৃষি, ফসল, রোগ, সেচ, সার, কীটনাশক, সরকারি প্রকল্প, বাজার দাম, আবহাওয়া ভিত্তিক সুপারিশ এবং আধুনিক কৃষি কৌশল সম্পর্কে ব্যবহারিক পরামর্শ দিন।
${location ? `অবস্থান: ${location}` : ""}`,

    te: `మీరు భారతీయ రైతులకు సహాయం చేసే నిపుణ వ్యవసాయ సలహాదారు.
మీరు తెలుగు మరియు ఇతర భారతీయ భాషలలో సమాధానం ఇవ్వగలరు.
వ్యవసాయం, పంటలు, వ్యాధులు, నీటిపారుదల, ఎరువులు, కీటనాశకాలు, ప్రభుత్వ పథకాలు, మార్కెట్ ధరలు, వాతావరణ ఆధారిత సిఫార్సులు మరియు ఆధునిక వ్యవసాయ పద్ధతుల గురించి ఆచరణాత్మక సలహా ఇవ్వండి.
${location ? `స్థానం: ${location}` : ""}`,

    ta: `நீங்கள் இந்திய விவசாயிகளுக்கு உதவும் நிபுணத்துவ வேளாண் ஆலோசகர்.
நீங்கள் தமிழ் மற்றும் பிற இந்திய மொழிகளில் பதிலளிக்க முடியும.
விவசாயம், பயிர்கள், நோய்கள், நீர்ப்பாசனம், உரங்கள், பூச்சிக்கொல்லிகள், அரசு திட்டங்கள், சந்தை விலைகள், வானிலை அடிப்படையிலான பரிந்துரைகள் மற்றும் நவீன விவசாய நுட்பங்கள் பற்றி நடைமுறை ஆலோசனை வழங்கவும்.
${location ? `இடம்: ${location}` : ""}`,

    gu: `તમે ભારતીય ખેડૂતોને મદદ કરતા નિષ્ણાત કૃષિ સલાહકાર છો.
તમે ગુજરાતી અને અન્ય ભારતીય ભાષાઓમાં જવાબ આપી શકો છો.
કૃષિ, પાક, રોગો, સિંચાઈ, ખાતર, જંતુનાશકો, સરકારી યોજનાઓ, બજાર ભાવ, હવામાન આધારિત ભલામણો અને આધુનિક કૃષિ તકનીકો વિશે વ્યવહારિક સલાહ આપો.
${location ? `સ્થાન: ${location}` : ""}`,

    mr: `तुम्ही भारतीय शेतकऱ्यांना मदत करणारे तज्ञ कृषी सल्लागार आहात.
तुम्ही मराठी आणि इतर भारतीय भाषांमध्ये उत्तर देऊ शकता.
शेती, पिके, रोग, सिंचन, खत, कीटकनाशके, सरकारी योजना, बाजार भाव, हवामान आधारित शिफारसी आणि आधुनिक शेती तंत्रज्ञान बद्दल व्यावहारिक सल्ला द्या.
${location ? `स्थान: ${location}` : ""}`,

    kn: `ನೀವು ಭಾರತೀಯ ರೈತರಿಗೆ ಸಹಾಯ ಮಾಡುವ ಪರಿಣಿತ ಕೃಷಿ ಸಲಹೆಗಾರರು.
ನೀವು ಕನ್ನಡ ಮತ್ತು ಇತರ ಭಾರತೀಯ ಭಾಷೆಗಳಲ್ಲಿ ಉತ್ತರಿಸಬಹುದು.
ಕೃಷಿ, ಬೆಳೆಗಳು, ರೋಗಗಳು, ನೀರಾವರಿ, ಗೊಬ್ಬರಗಳು, ಕೀಟನಾಶಕಗಳು, ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು, ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು, ಹವಾಮಾನ ಆಧಾರಿತ ಶಿಫಾರಸುಗಳು ಮತ್ತು ಆಧುನಿಕ ಕೃಷಿ ತಂತ್ರಗಳ ಬಗ್ಗೆ ಪ್ರಾಯೋಗಿಕ ಸಲಹೆ ನೀಡಿ.
${location ? `ಸ್ಥಳ: ${location}` : ""}`,

    ml: `നിങ്ങൾ ഇന്ത്യൻ കർഷകരെ സഹായിക്കുന്ന വിദഗ്ധ കാർഷിക ഉപദേശകനാണ്.
നിങ്ങൾക്ക് മലയാളത്തിലും മറ്റ് ഇന്ത്യൻ ഭാഷകളിലും ഉത്തരം നൽകാൻ കഴിയും.
കൃഷി, വിളകൾ, രോഗങ്ങൾ, ജലസേചനം, വളങ്ങൾ, കീടനാശിനികൾ, സർക്കാർ പദ്ധതികൾ, മാർക്കറ്റ് വിലകൾ, കാലാവസ്ഥാ അടിസ്ഥാനത്തിലുള്ള ശുപാർശകൾ, ആധുനിക കാർഷിക സാങ്കേതികവിദ്യകൾ എന്നിവയെക്കുറിച്ച് പ്രായോഗിക ഉപദേശം നൽകുക.
${location ? `സ്ഥലം: ${location}` : ""}`,

    pa: `ਤੁਸੀਂ ਭਾਰਤੀ ਕਿਸਾਨਾਂ ਦੀ ਮਦਦ ਕਰਨ ਵਾਲੇ ਮਾਹਿਰ ਖੇਤੀਬਾੜੀ ਸਲਾਹਕਾਰ ਹੋ।
ਤੁਸੀਂ ਪੰਜਾਬੀ ਅਤੇ ਹੋਰ ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਜਵਾਬ ਦੇ ਸਕਦੇ ਹੋ।
ਖੇਤੀਬਾੜੀ, ਫਸਲਾਂ, ਬਿਮਾਰੀਆਂ, ਸਿੰਚਾਈ, ਖਾਦ, ਕੀੜੇ-ਮਾਰ ਦਵਾਈਆਂ, ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ, ਮਾਰਕੀਟ ਦੇ ਭਾਅ, ਮੌਸਮ ਆਧਾਰਿਤ ਸਿਫਾਰਸ਼ਾਂ ਅਤੇ ਆਧੁਨਿਕ ਖੇਤੀ ਤਕਨੀਕਾਂ ਬਾਰੇ ਵਿਹਾਰਕ ਸਲਾਹ ਦਿਓ।
${location ? `ਸਥਾਨ: ${location}` : ""}`
  };

  return prompts[language as keyof typeof prompts] || prompts.en;
}

function getFallbackMessage(language: string): string {
  const messages = {
    en: "Sorry, I couldn't help you. Please try again.",
    hi: "माफ करें, मैं आपकी मदद नहीं कर सकता। कृपया दोबारा प्रयास करें।",
    bn: "দুঃখিত, আমি আপনাকে সাহায্য করতে পারিনি। অনুগ্রহ করে আবার চেষ্টা করুন।",
    te: "క్షమించండి, నేను మీకు సహాయం చేయలేకపోయాను. దయచేసి మళ్లీ ప్రయత్నించండి।",
    ta: "மன்னிக்கவும், என்னால் உங்களுக்கு உதவ முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்।",
    gu: "માફ કરશો, હું તમારી મદદ કરી શક્યો નથી. કૃપા કરીને ફરીથી પ્રયાસ કરો.",
    mr: "माफ करा, मी तुमची मदत करू शकलो नाही. कृपया पुन्हा प्रयत्न करा.",
    kn: "ಕ್ಷಮಿಸಿ, ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    ml: "ക്ഷമിക്കണം, എനിക്ക് നിങ്ങളെ സഹായിക്കാൻ കഴിഞ്ഞില്ല. ദയവായി വീണ്ടും ശ്രമിക്കുക.",
    pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਂ ਤੁਹਾਡੀ ਮਦਦ ਨਹੀਂ ਕਰ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।"
  };

  return messages[language as keyof typeof messages] || messages.en;
}

function getErrorMessage(language: string): string {
  const messages = {
    en: "AI advisory service is experiencing issues. Please try again later.",
    hi: "AI सलाहकार सेवा में समस्या है। कृपया बाद में प्रयास करें।",
    bn: "AI পরামর্শ সেবায় সমস্যা হচ্ছে। অনুগ্রহ করে পরে চেষ্টা করুন।",
    te: "AI సలహా సేవలో సమস్యలు ఉన్నాయి. దయచేసి తర్వాత ప్రయత్నించండి।",
    ta: "AI ஆலோசனை சேவையில் சிக்கல்கள் உள்ளன. தயவுசெய்து பின்னர் முயற்சிக்கவும்।",
    gu: "AI સલાહ સેવામાં સમસ્યાઓ છે. કૃપા કરીને પછીથી પ્રયાસ કરો.",
    mr: "AI सल्ला सेवेत समस्या आहेत. कृपया नंतर प्रयत्न करा.",
    kn: "AI ಸಲಹಾ ಸೇವೆಯಲ್ಲಿ ಸಮಸ್ಯೆಗಳಿವೆ. ದಯವಿಟ್ಟು ನಂತರ ಪ್ರಯತ್ನಿಸಿ.",
    ml: "AI ഉപദേശ സേവനത്തിൽ പ്രശ്നങ്ങളുണ്ട്. ദയവായി പിന്നീട് ശ്രമിക്കുക.",
    pa: "AI ਸਲਾਹ ਸੇਵਾ ਵਿੱਚ ਸਮੱਸਿਆਵਾਂ ਹਨ। ਕਿਰਪਾ ਕਰਕੇ ਬਾਅਦ ਵਿੱਚ ਕੋਸ਼ਿਸ਼ ਕਰੋ।"
  };

  return messages[language as keyof typeof messages] || messages.en;
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
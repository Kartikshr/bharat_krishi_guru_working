import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'bn' | 'te' | 'ta' | 'gu' | 'mr' | 'kn' | 'ml' | 'pa';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    'header.title': 'Bharat Krishi Guru',
    'header.subtitle': 'Digital Farming Companion',
    'header.signin': 'Sign In',
    'header.signup': 'Sign Up',
    'header.dashboard': 'Dashboard',
    
    // Hero
    'hero.title': 'Bharat Krishi Guru',
    'hero.subtitle': 'Your Digital Farming Companion',
    'hero.description': 'AI-powered crop disease detection, multilingual farming assistant, weather recommendations, and market insights - all in your local language',
    'hero.detectDisease': 'Detect Crop Disease',
    'hero.askAI': 'Ask AI Assistant',
    
    // Features
    'features.diseaseDetection': 'Disease Detection',
    'features.diseaseDesc': 'Upload crop images for instant AI diagnosis',
    'features.multilingualAssistant': 'Multilingual Assistant',
    'features.assistantDesc': 'Voice & text support in 10+ Indian languages',
    'features.smartRecommendations': 'Smart Recommendations',
    'features.recommendationsDesc': 'Weather-based farming guidance',
    
    // Common
    'common.loading': 'Loading...',
    'common.refresh': 'Refresh',
    'common.signOut': 'Sign Out',
  },
  hi: {
    // Header
    'header.title': 'भारत कृषि गुरु',
    'header.subtitle': 'कृषि का डिजिटल साथी',
    'header.signin': 'साइन इन',
    'header.signup': 'साइन अप',
    'header.dashboard': 'डैशबोर्ड',
    
    // Hero
    'hero.title': 'भारत कृषि गुरु',
    'hero.subtitle': 'आपका डिजिटल कृषि साथी',
    'hero.description': 'AI-संचालित फसल रोग पहचान, बहुभाषी कृषि सहायक, मौसम सिफारिशें, और बाजार की जानकारी - सब आपकी स्थानीय भाषा में',
    'hero.detectDisease': 'फसल रोग की पहचान करें',
    'hero.askAI': 'AI सहायक से पूछें',
    
    // Features
    'features.diseaseDetection': 'रोग पहचान',
    'features.diseaseDesc': 'तुरंत AI निदान के लिए फसल की तस्वीरें अपलोड करें',
    'features.multilingualAssistant': 'बहुभाषी सहायक',
    'features.assistantDesc': '10+ भारतीय भाषाओं में आवाज और टेक्स्ट सहायता',
    'features.smartRecommendations': 'स्मार्ट सिफारिशें',
    'features.recommendationsDesc': 'मौसम आधारित कृषि मार्गदर्शन',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.refresh': 'रीफ्रेश करें',
    'common.signOut': 'साइन आउट',
  },
  bn: {
    // Header
    'header.title': 'ভারত কৃষি গুরু',
    'header.subtitle': 'ডিজিটাল কৃষি সহচর',
    'header.signin': 'সাইন ইন',
    'header.signup': 'সাইন আপ',
    'header.dashboard': 'ড্যাশবোর্ড',
    
    // Hero
    'hero.title': 'ভারত কৃষি গুরু',
    'hero.subtitle': 'আপনার ডিজিটাল কৃষি সহচর',
    'hero.description': 'AI-চালিত ফসলের রোগ সনাক্তকরণ, বহুভাষিক কৃষি সহায়ক, আবহাওয়ার সুপারিশ এবং বাজারের অন্তর্দৃষ্টি - সব আপনার স্থানীয় ভাষায়',
    'hero.detectDisease': 'ফসলের রোগ সনাক্ত করুন',
    'hero.askAI': 'AI সহায়ককে জিজ্ঞাসা করুন',
    
    // Features
    'features.diseaseDetection': 'রোগ সনাক্তকরণ',
    'features.diseaseDesc': 'তাৎক্ষণিক AI নির্ণয়ের জন্য ফসলের ছবি আপলোড করুন',
    'features.multilingualAssistant': 'বহুভাষিক সহায়ক',
    'features.assistantDesc': '১০+ ভারতীয় ভাষায় কণ্ঠস্বর ও টেক্সট সহায়তা',
    'features.smartRecommendations': 'স্মার্ট সুপারিশ',
    'features.recommendationsDesc': 'আবহাওয়া ভিত্তিক কৃষি নির্দেশনা',
    
    // Common
    'common.loading': 'লোড হচ্ছে...',
    'common.refresh': 'রিফ্রেশ',
    'common.signOut': 'সাইন আউট',
  },
  te: {
    // Header
    'header.title': 'భారత్ కృషి గురు',
    'header.subtitle': 'డిజిటల్ వ్యవసాయ సహచరుడు',
    'header.signin': 'సైన్ ఇన్',
    'header.signup': 'సైన్ అప్',
    'header.dashboard': 'డ్యాష్‌బోర్డ్',
    
    // Hero
    'hero.title': 'భారత్ కృషి గురు',
    'hero.subtitle': 'మీ డిజిటల్ వ్యవసాయ సహచరుడు',
    'hero.description': 'AI-శక్తితో కూడిన పంట వ్యాధి గుర్తింపు, బహుభాషా వ్యవసాయ సహాయకుడు, వాతావరణ సిఫార్సులు మరియు మార్కెట్ అంతర్దృష్టులు - అన్నీ మీ స్థానిక భాషలో',
    'hero.detectDisease': 'పంట వ్యాధిని గుర్తించండి',
    'hero.askAI': 'AI సహాయకుడిని అడగండి',
    
    // Features
    'features.diseaseDetection': 'వ్యాధి గుర్తింపు',
    'features.diseaseDesc': 'తక్షణ AI నిర్ధారణ కోసం పంట చిత్రాలను అప్‌లోడ్ చేయండి',
    'features.multilingualAssistant': 'బహుభాషా సహాయకుడు',
    'features.assistantDesc': '10+ భారతీయ భాషలలో వాయిస్ & టెక్స్ట్ మద్దతు',
    'features.smartRecommendations': 'స్మార్ట్ సిఫార్సులు',
    'features.recommendationsDesc': 'వాతావరణ ఆధారిత వ్యవసాయ మార్గదర్శకత్వం',
    
    // Common
    'common.loading': 'లోడ్ అవుతోంది...',
    'common.refresh': 'రిఫ్రెష్',
    'common.signOut': 'సైన్ అవుట్',
  },
  ta: {
    // Header
    'header.title': 'பாரத் கிருஷி குரு',
    'header.subtitle': 'டிஜிட்டல் விவசாய துணைவன்',
    'header.signin': 'உள்நுழைய',
    'header.signup': 'பதிவு செய்ய',
    'header.dashboard': 'டாஷ்போர்டு',
    
    // Hero
    'hero.title': 'பாரத் கிருஷி குரு',
    'hero.subtitle': 'உங்கள் டிஜிட்டல் விவசாய துணைவன்',
    'hero.description': 'AI-இயங்கும் பயிர் நோய் கண்டறிதல், பன்மொழி விவசாய உதவியாளர், வானிலை பரிந்துரைகள் மற்றும் சந்தை நுண்ணறிவுகள் - அனைத்தும் உங்கள் உள்ளூர் மொழியில்',
    'hero.detectDisease': 'பயிர் நோயைக் கண்டறியுங்கள்',
    'hero.askAI': 'AI உதவியாளரிடம் கேளுங்கள்',
    
    // Features
    'features.diseaseDetection': 'நோய் கண்டறிதல்',
    'features.diseaseDesc': 'உடனடி AI நோயறிதலுக்கு பயிர் படங்களை பதிவேற்றவும்',
    'features.multilingualAssistant': 'பன்மொழி உதவியாளர்',
    'features.assistantDesc': '10+ இந்திய மொழிகளில் குரல் & உரை ஆதரவு',
    'features.smartRecommendations': 'ஸ்மார்ட் பரிந்துரைகள்',
    'features.recommendationsDesc': 'வானிலை அடிப்படையிலான விவசாய வழிகாட்டுதல்',
    
    // Common
    'common.loading': 'ஏற்றுகிறது...',
    'common.refresh': 'புதுப்பிக்க',
    'common.signOut': 'வெளியேறு',
  },
  gu: {
    // Header
    'header.title': 'ભારત કૃષિ ગુરુ',
    'header.subtitle': 'ડિજિટલ ખેતી સાથી',
    'header.signin': 'સાઇન ઇન',
    'header.signup': 'સાઇન અપ',
    'header.dashboard': 'ડેશબોર્ડ',
    
    // Hero
    'hero.title': 'ભારત કૃષિ ગુરુ',
    'hero.subtitle': 'તમારો ડિજિટલ ખેતી સાથી',
    'hero.description': 'AI-સંચાલિત પાક રોગ શોધ, બહુભાષી ખેતી સહાયક, હવામાન ભલામણો અને બજાર અંતર્દૃષ્ટિ - બધું તમારી સ્થાનિક ભાષામાં',
    'hero.detectDisease': 'પાક રોગ શોધો',
    'hero.askAI': 'AI સહાયકને પૂછો',
    
    // Features
    'features.diseaseDetection': 'રોગ શોધ',
    'features.diseaseDesc': 'તાત્કાલિક AI નિદાન માટે પાકની છબીઓ અપલોડ કરો',
    'features.multilingualAssistant': 'બહુભાષી સહાયક',
    'features.assistantDesc': '10+ ભારતીય ભાષાઓમાં અવાજ અને ટેક્સ્ટ સપોર્ટ',
    'features.smartRecommendations': 'સ્માર્ટ ભલામણો',
    'features.recommendationsDesc': 'હવામાન આધારિત ખેતી માર્ગદર્શન',
    
    // Common
    'common.loading': 'લોડ થઈ રહ્યું છે...',
    'common.refresh': 'રિફ્રેશ',
    'common.signOut': 'સાઇન આઉટ',
  },
  mr: {
    // Header
    'header.title': 'भारत कृषी गुरु',
    'header.subtitle': 'डिजिटल शेती साथी',
    'header.signin': 'साइन इन',
    'header.signup': 'साइन अप',
    'header.dashboard': 'डॅशबोर्ड',
    
    // Hero
    'hero.title': 'भारत कृषी गुरु',
    'hero.subtitle': 'तुमचा डिजिटल शेती साथी',
    'hero.description': 'AI-चालित पीक रोग ओळख, बहुभाषिक शेती सहाय्यक, हवामान शिफारसी आणि बाजार अंतर्दृष्टी - सर्व तुमच्या स्थानिक भाषेत',
    'hero.detectDisease': 'पीक रोग ओळखा',
    'hero.askAI': 'AI सहाय्यकाला विचारा',
    
    // Features
    'features.diseaseDetection': 'रोग ओळख',
    'features.diseaseDesc': 'तत्काल AI निदानासाठी पीक प्रतिमा अपलोड करा',
    'features.multilingualAssistant': 'बहुभाषिक सहाय्यक',
    'features.assistantDesc': '10+ भारतीय भाषांमध्ये आवाज आणि मजकूर समर्थन',
    'features.smartRecommendations': 'स्मार्ट शिफारसी',
    'features.recommendationsDesc': 'हवामान आधारित शेती मार्गदर्शन',
    
    // Common
    'common.loading': 'लोड होत आहे...',
    'common.refresh': 'रिफ्रेश',
    'common.signOut': 'साइन आउट',
  },
  kn: {
    // Header
    'header.title': 'ಭಾರತ ಕೃಷಿ ಗುರು',
    'header.subtitle': 'ಡಿಜಿಟಲ್ ಕೃಷಿ ಸಹಚರ',
    'header.signin': 'ಸೈನ್ ಇನ್',
    'header.signup': 'ಸೈನ್ ಅಪ್',
    'header.dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    
    // Hero
    'hero.title': 'ಭಾರತ ಕೃಷಿ ಗುರು',
    'hero.subtitle': 'ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಕೃಷಿ ಸಹಚರ',
    'hero.description': 'AI-ಚಾಲಿತ ಬೆಳೆ ರೋಗ ಪತ್ತೆ, ಬಹುಭಾಷಾ ಕೃಷಿ ಸಹಾಯಕ, ಹವಾಮಾನ ಶಿಫಾರಸುಗಳು ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಒಳನೋಟಗಳು - ಎಲ್ಲವೂ ನಿಮ್ಮ ಸ್ಥಳೀಯ ಭಾಷೆಯಲ್ಲಿ',
    'hero.detectDisease': 'ಬೆಳೆ ರೋಗವನ್ನು ಪತ್ತೆ ಮಾಡಿ',
    'hero.askAI': 'AI ಸಹಾಯಕನನ್ನು ಕೇಳಿ',
    
    // Features
    'features.diseaseDetection': 'ರೋಗ ಪತ್ತೆ',
    'features.diseaseDesc': 'ತಕ್ಷಣದ AI ರೋಗನಿರ್ಣಯಕ್ಕಾಗಿ ಬೆಳೆ ಚಿತ್ರಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    'features.multilingualAssistant': 'ಬಹುಭಾಷಾ ಸಹಾಯಕ',
    'features.assistantDesc': '10+ ಭಾರತೀಯ ಭಾಷೆಗಳಲ್ಲಿ ಧ್ವನಿ ಮತ್ತು ಪಠ್ಯ ಬೆಂಬಲ',
    'features.smartRecommendations': 'ಸ್ಮಾರ್ಟ್ ಶಿಫಾರಸುಗಳು',
    'features.recommendationsDesc': 'ಹವಾಮಾನ ಆಧಾರಿತ ಕೃಷಿ ಮಾರ್ಗದರ್ಶನ',
    
    // Common
    'common.loading': 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    'common.refresh': 'ರಿಫ್ರೆಶ್',
    'common.signOut': 'ಸೈನ್ ಔಟ್',
  },
  ml: {
    // Header
    'header.title': 'ഭാരത് കൃഷി ഗുരു',
    'header.subtitle': 'ഡിജിറ്റൽ കാർഷിക സഹചരൻ',
    'header.signin': 'സൈൻ ഇൻ',
    'header.signup': 'സൈൻ അപ്പ്',
    'header.dashboard': 'ഡാഷ്ബോർഡ്',
    
    // Hero
    'hero.title': 'ഭാരത് കൃഷി ഗുരു',
    'hero.subtitle': 'നിങ്ങളുടെ ഡിജിറ്റൽ കാർഷിക സഹചരൻ',
    'hero.description': 'AI-പവർഡ് വിള രോഗ കണ്ടെത്തൽ, ബഹുഭാഷാ കാർഷിക സഹായി, കാലാവസ്ഥാ ശുപാർശകൾ, മാർക്കറ്റ് ഇൻസൈറ്റുകൾ - എല്ലാം നിങ്ങളുടെ പ്രാദേശിക ഭാഷയിൽ',
    'hero.detectDisease': 'വിള രോഗം കണ്ടെത്തുക',
    'hero.askAI': 'AI സഹായിയോട് ചോദിക്കുക',
    
    // Features
    'features.diseaseDetection': 'രോഗ കണ്ടെത്തൽ',
    'features.diseaseDesc': 'തൽക്ഷണ AI രോഗനിർണയത്തിനായി വിള ചിത്രങ്ങൾ അപ്‌ലോഡ് ചെയ്യുക',
    'features.multilingualAssistant': 'ബഹുഭാഷാ സഹായി',
    'features.assistantDesc': '10+ ഇന്ത്യൻ ഭാഷകളിൽ വോയ്സ് & ടെക്സ്റ്റ് പിന്തുണ',
    'features.smartRecommendations': 'സ്മാർട്ട് ശുപാർശകൾ',
    'features.recommendationsDesc': 'കാലാവസ്ഥാ അടിസ്ഥാനത്തിലുള്ള കാർഷിക മാർഗദർശനം',
    
    // Common
    'common.loading': 'ലോഡ് ചെയ്യുന്നു...',
    'common.refresh': 'പുതുക്കുക',
    'common.signOut': 'സൈൻ ഔട്ട്',
  },
  pa: {
    // Header
    'header.title': 'ਭਾਰਤ ਕ੍ਰਿਸ਼ੀ ਗੁਰੂ',
    'header.subtitle': 'ਡਿਜੀਟਲ ਖੇਤੀਬਾੜੀ ਸਾਥੀ',
    'header.signin': 'ਸਾਈਨ ਇਨ',
    'header.signup': 'ਸਾਈਨ ਅਪ',
    'header.dashboard': 'ਡੈਸ਼ਬੋਰਡ',
    
    // Hero
    'hero.title': 'ਭਾਰਤ ਕ੍ਰਿਸ਼ੀ ਗੁਰੂ',
    'hero.subtitle': 'ਤੁਹਾਡਾ ਡਿਜੀਟਲ ਖੇਤੀਬਾੜੀ ਸਾਥੀ',
    'hero.description': 'AI-ਸੰਚਾਲਿਤ ਫਸਲ ਰੋਗ ਪਛਾਣ, ਬਹੁਭਾਸ਼ੀ ਖੇਤੀਬਾੜੀ ਸਹਾਇਕ, ਮੌਸਮ ਸਿਫਾਰਸ਼ਾਂ ਅਤੇ ਮਾਰਕੀਟ ਸੂਝ - ਸਭ ਕੁਝ ਤੁਹਾਡੀ ਸਥਾਨਕ ਭਾਸ਼ਾ ਵਿੱਚ',
    'hero.detectDisease': 'ਫਸਲ ਦੀ ਬਿਮਾਰੀ ਪਛਾਣੋ',
    'hero.askAI': 'AI ਸਹਾਇਕ ਨੂੰ ਪੁੱਛੋ',
    
    // Features
    'features.diseaseDetection': 'ਰੋਗ ਪਛਾਣ',
    'features.diseaseDesc': 'ਤੁਰੰਤ AI ਨਿਦਾਨ ਲਈ ਫਸਲ ਦੀਆਂ ਤਸਵੀਰਾਂ ਅਪਲੋਡ ਕਰੋ',
    'features.multilingualAssistant': 'ਬਹੁਭਾਸ਼ੀ ਸਹਾਇਕ',
    'features.assistantDesc': '10+ ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਆਵਾਜ਼ ਅਤੇ ਟੈਕਸਟ ਸਹਾਇਤਾ',
    'features.smartRecommendations': 'ਸਮਾਰਟ ਸਿਫਾਰਸ਼ਾਂ',
    'features.recommendationsDesc': 'ਮੌਸਮ ਆਧਾਰਿਤ ਖੇਤੀਬਾੜੀ ਮਾਰਗਦਰਸ਼ਨ',
    
    // Common
    'common.loading': 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    'common.refresh': 'ਰਿਫਰੈਸ਼',
    'common.signOut': 'ਸਾਈਨ ਆਉਟ',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const langTranslations = translations[language] || translations.en;
    return langTranslations[key as keyof typeof langTranslations] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
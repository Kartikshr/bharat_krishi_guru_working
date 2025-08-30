import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, Send, Loader2, User, Mic, MicOff, Volume2, VolumeX, Globe, MessageCircle, Lightbulb, HelpCircle, Languages, Trash2, Download, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "@/contexts/LocationContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  language: 'en' | 'hi' | 'bn' | 'te' | 'ta' | 'gu' | 'mr' | 'kn' | 'ml' | 'pa';
  category?: string;
  confidence?: number;
}

interface QuickQuestion {
  id: number;
  question: string;
  questionHindi: string;
  questionBengali: string;
  questionTelugu: string;
  questionTamil: string;
  questionGujarati: string;
  questionMarathi: string;
  questionKannada: string;
  questionMalayalam: string;
  questionPunjabi: string;
  category: string;
  icon: any;
}

interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
  lastActivity: Date;
  language: string;
}

interface LanguageOption {
  code: 'en' | 'hi' | 'bn' | 'te' | 'ta' | 'gu' | 'mr' | 'kn' | 'ml' | 'pa';
  name: string;
  nativeName: string;
  flag: string;
}

const AIChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('default');
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'hi' | 'bn' | 'te' | 'ta' | 'gu' | 'mr' | 'kn' | 'ml' | 'pa'>('hi');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoTranslate, setAutoTranslate] = useState(false);
  const { toast } = useToast();
  const { selectedLocation } = useLocation();
  const { language } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const supportedLanguages: LanguageOption[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
  ];

  const quickQuestions: QuickQuestion[] = [
    {
      id: 1,
      question: "What crops are best for this season?",
      questionHindi: "इस मौसम के लिए कौन सी फसलें सबसे अच्छी हैं?",
      questionBengali: "এই মৌসুমের জন্য কোন ফসল সবচেয়ে ভাল?",
      questionTelugu: "ఈ సీజన్‌కు ఏ పంటలు ఉత్తమమైనవి?",
      questionTamil: "இந்த பருவத்திற்கு எந்த பயிர்கள் சிறந்தவை?",
      questionGujarati: "આ મોસમ માટે કયા પાક શ્રેષ્ઠ છે?",
      questionMarathi: "या हंगामासाठी कोणती पिके सर्वोत्तम आहेत?",
      questionKannada: "ಈ ಋತುವಿಗೆ ಯಾವ ಬೆಳೆಗಳು ಉತ್ತಮವಾಗಿವೆ?",
      questionMalayalam: "ഈ സീസണിൽ ഏതു വിളകളാണ് മികച്ചത്?",
      questionPunjabi: "ਇਸ ਮੌਸਮ ਲਈ ਕਿਹੜੀਆਂ ਫਸਲਾਂ ਸਭ ਤੋਂ ਵਧੀਆ ਹਨ?",
      category: "Seasonal Farming",
      icon: MessageCircle
    },
    {
      id: 2,
      question: "How to control pest attacks naturally?",
      questionHindi: "प्राकृतिक रूप से कीट हमलों को कैसे नियंत्रित करें?",
      questionBengali: "প্রাকৃতিকভাবে কীটপতঙ্গের আক্রমণ কীভাবে নিয়ন্ত্রণ করবেন?",
      questionTelugu: "సహజంగా చీడపీడల దాడులను ఎలా నియంత్రించాలి?",
      questionTamil: "இயற்கையாக பூச்சி தாக்குதல்களை எவ்வாறு கட்டுப்படுத்துவது?",
      questionGujarati: "કુદરતી રીતે જંતુઓના હુમલાને કેવી રીતે નિયંત્રિત કરવું?",
      questionMarathi: "नैसर्गिकरित्या कीटकांचे हल्ले कसे नियंत्रित करावे?",
      questionKannada: "ನೈಸರ್ಗಿಕವಾಗಿ ಕೀಟ ದಾಳಿಗಳನ್ನು ಹೇಗೆ ನಿಯಂತ್ರಿಸುವುದು?",
      questionMalayalam: "സ്വാഭാവികമായി കീടങ്ങളുടെ ആക്രമണം എങ്ങനെ നിയന്ത്രിക്കാം?",
      questionPunjabi: "ਕੁਦਰਤੀ ਤੌਰ 'ਤੇ ਕੀੜੇ-ਮਕੌੜਿਆਂ ਦੇ ਹਮਲਿਆਂ ਨੂੰ ਕਿਵੇਂ ਕਾਬੂ ਕਰਨਾ ਹੈ?",
      category: "Pest Control",
      icon: Lightbulb
    },
    {
      id: 3,
      question: "Government schemes for farmers",
      questionHindi: "किसानों के लिए सरकारी योजनाएं",
      questionBengali: "কৃষকদের জন্য সরকারি প্রকল্প",
      questionTelugu: "రైతుల కోసం ప్రభుత్వ పథకాలు",
      questionTamil: "விவசாயிகளுக்கான அரசு திட்டங்கள்",
      questionGujarati: "ખેડૂતો માટે સરકારી યોજનાઓ",
      questionMarathi: "शेतकऱ्यांसाठी सरकारी योजना",
      questionKannada: "ರೈತರಿಗಾಗಿ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
      questionMalayalam: "കർഷകർക്കുള്ള സർക്കാർ പദ്ധതികൾ",
      questionPunjabi: "ਕਿਸਾਨਾਂ ਲਈ ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ",
      category: "Government Schemes",
      icon: HelpCircle
    },
    {
      id: 4,
      question: "Soil testing and improvement tips",
      questionHindi: "मिट्टी परीक्षण और सुधार के तिप्स",
      questionBengali: "মাটি পরীক্ষা এবং উন্নতির টিপস",
      questionTelugu: "మట్టి పరీక్ష మరియు మెరుగుదల చిట్కాలు",
      questionTamil: "மண் பரிசோதனை மற்றும் மேம்பாட்டு குறிப்புகள்",
      questionGujarati: "માટી પરીક્ષણ અને સુધારણા ટિપ્સ",
      questionMarathi: "माती चाचणी आणि सुधारणा टिप्स",
      questionKannada: "ಮಣ್ಣಿನ ಪರೀಕ್ಷೆ ಮತ್ತು ಸುಧಾರಣೆ ಸಲಹೆಗಳು",
      questionMalayalam: "മണ്ണ് പരിശോധന, മെച്ചപ്പെടുത്തൽ നുറുങ്ങുകൾ",
      questionPunjabi: "ਮਿੱਟੀ ਦੀ ਜਾਂਚ ਅਤੇ ਸੁਧਾਰ ਦੇ ਟਿਪਸ",
      category: "Soil Health",
      icon: MessageCircle
    },
    {
      id: 5,
      question: "Water conservation techniques",
      questionHindi: "जल संरक्षण तकनीकें",
      questionBengali: "জল সংরক্ষণ কৌশল",
      questionTelugu: "నీటి సంరక్షణ పద్ధతులు",
      questionTamil: "நீர் பாதுகாப்பு நுட்பங்கள்",
      questionGujarati: "પાણી સંરક્ષણ તકનીકો",
      questionMarathi: "जल संधारण तंत्र",
      questionKannada: "ನೀರಿನ ಸಂರಕ್ಷಣೆ ತಂತ್ರಗಳು",
      questionMalayalam: "ജല സംരക്ഷണ സാങ്കേതിക വിദ്യകൾ",
      questionPunjabi: "ਪਾਣੀ ਸੰਭਾਲ ਦੀਆਂ ਤਕਨੀਕਾਂ",
      category: "Water Management",
      icon: Lightbulb
    },
    {
      id: 6,
      question: "Market prices and selling tips",
      questionHindi: "बाजार भाव और बिक्री के तिप्स",
      questionBengali: "বাজার দাম এবং বিক্রয় টিপস",
      questionTelugu: "మార్కెట్ ధరలు మరియు అమ్మకపు చిట్కాలు",
      questionTamil: "சந்தை விலைகள் மற்றும் விற்பனை குறிப்புகள்",
      questionGujarati: "બજાર ભાવ અને વેચાણ ટિપ્સ",
      questionMarathi: "बाजार भाव आणि विक्री टिप्स",
      questionKannada: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು ಮತ್ತು ಮಾರಾಟದ ಸಲಹೆಗಳು",
      questionMalayalam: "മാർക്കറ്റ് വിലകളും വിൽപ്പന നുറുങ്ങുകളും",
      questionPunjabi: "ਮਾਰਕੀਟ ਦੇ ਭਾਅ ਅਤੇ ਵੇਚਣ ਦੇ ਟਿਪਸ",
      category: "Market Intelligence",
      icon: HelpCircle
    }
  ];

  const getLanguageSpecificQuestion = (question: QuickQuestion, langCode: string): string => {
    switch (langCode) {
      case 'hi': return question.questionHindi;
      case 'bn': return question.questionBengali;
      case 'te': return question.questionTelugu;
      case 'ta': return question.questionTamil;
      case 'gu': return question.questionGujarati;
      case 'mr': return question.questionMarathi;
      case 'kn': return question.questionKannada;
      case 'ml': return question.questionMalayalam;
      case 'pa': return question.questionPunjabi;
      default: return question.question;
    }
  };

  const getWelcomeMessage = (langCode: string, location: string): string => {
    const messages = {
      en: `Hello! I'm your agricultural assistant. I can provide information about farming, crops, diseases, irrigation, fertilizers, pesticides, government schemes, and modern agricultural techniques for ${location}. You can ask me questions in any Indian language!`,
      hi: `नमस्कार! मैं आपका कृषि सहायक हूँ। मैं ${location} के लिए खेती, फसलों, बीमारियों, सिंचाई, उर्वरक, कीटनाशक, सरकारी योजनाओं, और आधुनिक कृषि तकनीकों के बारे में जानकारी दे सकता हूँ। आप मुझसे किसी भी भारतीय भाषा में प्रश्न पूछ सकते हैं!`,
      bn: `নমস্কার! আমি আপনার কৃষি সহায়ক। আমি ${location} এর জন্য চাষাবাদ, ফসল, রোগ, সেচ, সার, কীটনাশক, সরকারি প্রকল্প এবং আধুনিক কৃষি কৌশল সম্পর্কে তথ্য দিতে পারি। আপনি যেকোনো ভারতীয় ভাষায় প্রশ্ন করতে পারেন!`,
      te: `నమస్కారం! నేను మీ వ్యవసాయ సహాయకుడిని। నేను ${location} కోసం వ్యవసాయం, పంటలు, వ్యాధులు, నీటిపారుదల, ఎరువులు, కీటనాశకాలు, ప్రభుత్వ పథకాలు మరియు ఆధునిక వ్యవసాయ పద్ధతుల గురించి సమాచారం అందించగలను!`,
      ta: `வணக்கம்! நான் உங்கள் விவசாய உதவியாளர். நான் ${location} க்கான விவசாயம், பயிர்கள், நோய்கள், நீர்ப்பாசனம், உரங்கள், பூச்சிக்கொல்லிகள், அரசு திட்டங்கள் மற்றும் நவீன விவசாய நுட்பங்கள் பற்றிய தகவல்களை வழங்க முடியும்!`,
      gu: `નમસ્કાર! હું તમારો કૃષિ સહાયક છું. હું ${location} માટે ખેતી, પાક, રોગો, સિંચાઈ, ખાતર, જંતુનાશકો, સરકારી યોજનાઓ અને આધુનિક કૃષિ તકનીકો વિશે માહિતી આપી શકું છું!`,
      mr: `नमस्कार! मी तुमचा शेती सहाय्यक आहे. मी ${location} साठी शेती, पिके, रोग, सिंचन, खत, कीटकनाशके, सरकारी योजना आणि आधुनिक शेती तंत्रज्ञान बद्दल माहिती देऊ शकतो!`,
      kn: `ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕೃಷಿ ಸಹಾಯಕ. ನಾನು ${location} ಗಾಗಿ ಕೃಷಿ, ಬೆಳೆಗಳು, ರೋಗಗಳು, ನೀರಾವರಿ, ಗೊಬ್ಬರಗಳು, ಕೀಟನಾಶಕಗಳು, ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ಆಧುನಿಕ ಕೃಷಿ ತಂತ್ರಗಳ ಬಗ್ಗೆ ಮಾಹಿತಿ ನೀಡಬಲ್ಲೆ!`,
      ml: `നമസ്കാരം! ഞാൻ നിങ്ങളുടെ കാർഷിക സഹായകനാണ്. എനിക്ക് ${location} നുള്ള കൃഷി, വിളകൾ, രോഗങ്ങൾ, ജലസേചനം, വളങ്ങൾ, കീടനാശിനികൾ, സർക്കാർ പദ്ധതികൾ, ആധുനിക കാർഷിക സാങ്കേതികവിദ്യകൾ എന്നിവയെക്കുറിച്ച് വിവരങ്ങൾ നൽകാൻ കഴിയും!`,
      pa: `ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਖੇਤੀਬਾੜੀ ਸਹਾਇਕ ਹਾਂ। ਮੈਂ ${location} ਲਈ ਖੇਤੀ, ਫਸਲਾਂ, ਬਿਮਾਰੀਆਂ, ਸਿੰਚਾਈ, ਖਾਦ, ਕੀੜੇ-ਮਾਰ ਦਵਾਈਆਂ, ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ ਅਤੇ ਆਧੁਨਿਕ ਖੇਤੀ ਤਕਨੀਕਾਂ ਬਾਰੇ ਜਾਣਕਾਰੀ ਦੇ ਸਕਦਾ ਹਾਂ!`
    };
    
    return messages[langCode as keyof typeof messages] || messages.en;
  };

  const initializeChat = () => {
    const welcomeMessage: Message = {
      id: 1,
      text: getWelcomeMessage(activeLanguage, selectedLocation),
      sender: "bot",
      timestamp: new Date(),
      language: activeLanguage,
      category: "welcome",
      confidence: 100
    };

    setMessages([welcomeMessage]);
  };

  useEffect(() => {
    initializeChat();
  }, [selectedLocation, activeLanguage]);

  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      // Set language for speech recognition
      const speechLangMap = {
        'en': 'en-IN',
        'hi': 'hi-IN',
        'bn': 'bn-IN',
        'te': 'te-IN',
        'ta': 'ta-IN',
        'gu': 'gu-IN',
        'mr': 'mr-IN',
        'kn': 'kn-IN',
        'ml': 'ml-IN',
        'pa': 'pa-IN'
      };
      
      recognitionRef.current.lang = speechLangMap[activeLanguage] || 'hi-IN';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Could not recognize speech. Please try again.",
          variant: "destructive"
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [activeLanguage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const detectLanguage = (text: string): 'en' | 'hi' | 'bn' | 'te' | 'ta' | 'gu' | 'mr' | 'kn' | 'ml' | 'pa' => {
    // Enhanced language detection
    const patterns = {
      hi: /[\u0900-\u097F]/,
      bn: /[\u0980-\u09FF]/,
      te: /[\u0C00-\u0C7F]/,
      ta: /[\u0B80-\u0BFF]/,
      gu: /[\u0A80-\u0AFF]/,
      mr: /[\u0900-\u097F]/,
      kn: /[\u0C80-\u0CFF]/,
      ml: /[\u0D00-\u0D7F]/,
      pa: /[\u0A00-\u0A7F]/
    };

    for (const [lang, pattern] of Object.entries(patterns)) {
      if (pattern.test(text)) {
        return lang as any;
      }
    }
    
    return 'en'; // Default to English
  };

  const generateLocalFallback = (query: string, lang: string): string => {
    const responses = {
      en: [
        `For ${selectedLocation}, I recommend consulting local agricultural experts for specific guidance about your query.`,
        `Based on ${selectedLocation} conditions, consider sustainable farming practices and government scheme benefits.`,
        `In ${selectedLocation}, weather-based farming decisions are crucial. Monitor local weather patterns regularly.`,
        `For your area ${selectedLocation}, soil testing and proper fertilizer management can improve crop yields significantly.`,
        `Consider joining farmer groups in ${selectedLocation} for shared knowledge and better market access.`
      ],
      hi: [
        `${selectedLocation} के लिए, मैं आपके प्रश्न के बारे में विशिष्ट मार्गदर्शन के लिए स्थानीय कृषि विशेषज्ञों से सलाह लेने की सिफारिश करता हूं।`,
        `${selectedLocation} की परिस्थितियों के आधार पर, टिकाऊ कृषि प्रथाओं और सरकारी योजना लाभों पर विचार करें।`,
        `${selectedLocation} में, मौसम आधारित कृषि निर्णय महत्वपूर्ण हैं। स्थानीय मौसम पैटर्न की नियमित निगरानी करें।`,
        `आपके क्षेत्र ${selectedLocation} के लिए, मिट्टी परीक्षण और उचित उर्वरक प्रबंधन फसल की पैदावार में काफी सुधार कर सकता है।`,
        `साझा ज्ञान और बेहतर बाजार पहुंच के लिए ${selectedLocation} में किसान समूहों में शामिल होने पर विचार करें।`
      ],
      bn: [
        `${selectedLocation} এর জন্য, আমি আপনার প্রশ্ন সম্পর্কে নির্দিষ্ট নির্দেশনার জন্য স্থানীয় কৃষি বিশেষজ্ঞদের সাথে পরামর্শ করার পরামর্শ দিই।`,
        `${selectedLocation} এর অবস্থার উপর ভিত্তি করে, টেকসই কৃষি অনুশীলন এবং সরকারি প্রকল্পের সুবিধা বিবেচনা করুন।`
      ],
      te: [
        `${selectedLocation} కోసం, మీ ప్రశ్న గురించి నిర్దిష్ట మార్గదర్శనం కోసం స్థానిక వ్యవసాయ నిపుణులను సంప్రదించాలని నేను సిఫార్సు చేస్తున్నాను।`,
        `${selectedLocation} పరిస్థితుల ఆధారంగా, స్థిరమైన వ్యవసాయ పద్ధతులు మరియు ప్రభుత్వ పథక ప్రయోజనాలను పరిగణించండి।`
      ],
      ta: [
        `${selectedLocation} க்கு, உங்கள் கேள்விக்கு குறிப்பிட்ட வழிகாட்டுதலுக்காக உள்ளூர் விவசாய நிபுணர்களை அணுகுமாறு பரிந்துரைக்கிறேன்.`,
        `${selectedLocation} நிலைமைகளின் அடிப்படையில், நிலையான விவசாய நடைமுறைகள் மற்றும் அரசு திட்ட நன்மைகளை கருத்தில் கொள்ளுங்கள்।`
      ],
      gu: [
        `${selectedLocation} માટે, હું તમારા પ્રશ્ન વિશે ચોક્કસ માર્ગદર્શન માટે સ્થાનિક કૃષિ નિષ્ણાતોની સલાહ લેવાની ભલામણ કરું છું.`,
        `${selectedLocation} ની પરિસ્થિતિઓના આધારે, ટકાઉ કૃષિ પ્રથાઓ અને સરકારી યોજનાના લાભો પર વિચાર કરો.`
      ],
      mr: [
        `${selectedLocation} साठी, मी तुमच्या प्रश्नाबद्दल विशिष्ट मार्गदर्शनासाठी स्थानिक कृषी तज्ञांचा सल्ला घेण्याची शिफारस करतो.`,
        `${selectedLocation} च्या परिस्थितीच्या आधारे, शाश्वत शेती पद्धती आणि सरकारी योजनांचे फायदे विचारात घ्या.`
      ],
      kn: [
        `${selectedLocation} ಗಾಗಿ, ನಿಮ್ಮ ಪ್ರಶ್ನೆಯ ಬಗ್ಗೆ ನಿರ್ದಿಷ್ಟ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ಸ್ಥಳೀಯ ಕೃಷಿ ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಲು ನಾನು ಶಿಫಾರಸು ಮಾಡುತ್ತೇನೆ.`,
        `${selectedLocation} ಪರಿಸ್ಥಿತಿಗಳ ಆಧಾರದ ಮೇಲೆ, ಸುಸ್ಥಿರ ಕೃಷಿ ಅಭ್ಯಾಸಗಳು ಮತ್ತು ಸರ್ಕಾರಿ ಯೋಜನೆಯ ಪ್ರಯೋಜನಗಳನ್ನು ಪರಿಗಣಿಸಿ.`
      ],
      ml: [
        `${selectedLocation} നുള്ള, നിങ്ങളുടെ ചോദ്യത്തെക്കുറിച്ച് നിർദ്ദിഷ്ട മാർഗ്ഗനിർദ്ദേശത്തിനായി പ്രാദേശിക കാർഷിക വിദഗ്ധരെ സമീപിക്കാൻ ഞാൻ ശുപാർശ ചെയ്യുന്നു.`,
        `${selectedLocation} സാഹചര്യങ്ങളുടെ അടിസ്ഥാനത്തിൽ, സുസ്ഥിര കാർഷിക രീതികളും സർക്കാർ പദ്ധതി ആനുകൂല്യങ്ങളും പരിഗണിക്കുക.`
      ],
      pa: [
        `${selectedLocation} ਲਈ, ਮੈਂ ਤੁਹਾਡੇ ਸਵਾਲ ਬਾਰੇ ਖਾਸ ਮਾਰਗਦਰਸ਼ਨ ਲਈ ਸਥਾਨਕ ਖੇਤੀਬਾੜੀ ਮਾਹਿਰਾਂ ਨਾਲ ਸਲਾਹ ਕਰਨ ਦੀ ਸਿਫਾਰਸ਼ ਕਰਦਾ ਹਾਂ।`,
        `${selectedLocation} ਦੀਆਂ ਸਥਿਤੀਆਂ ਦੇ ਆਧਾਰ 'ਤੇ, ਟਿਕਾਊ ਖੇਤੀ ਅਭਿਆਸਾਂ ਅਤੇ ਸਰਕਾਰੀ ਯੋਜਨਾ ਦੇ ਫਾਇਦਿਆਂ 'ਤੇ ਵਿਚਾਰ ਕਰੋ।`
      ]
    };
    
    const langResponses = responses[lang as keyof typeof responses] || responses.en;
    return langResponses[Math.floor(Math.random() * langResponses.length)];
  };

  const sendMessage = async (messageText?: string) => {
    const queryText = messageText || input;
    if (!queryText.trim()) return;

    const detectedLang = detectLanguage(queryText);
    
    const userMessage: Message = {
      id: Date.now(),
      text: queryText,
      sender: "user",
      timestamp: new Date(),
      language: detectedLang,
      category: "user-query"
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!messageText) setInput("");
    setIsLoading(true);

    try {
      // Call the enhanced Gemini-powered AI assistant API
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: queryText,
          location: selectedLocation,
          language: detectedLang,
          context: messages.slice(-5) // Send last 5 messages for context
        })
      });

      if (!response.ok) {
        throw new Error('AI response failed');
      }

      const data = await response.json();
      
      const botResponse: Message = {
        id: Date.now() + 1,
        text: data.response,
        sender: "bot",
        timestamp: new Date(),
        language: detectedLang,
        category: "ai-response",
        confidence: 95
      };

      setMessages((prev) => [...prev, botResponse]);

      // Text-to-speech for bot response
      if (voiceEnabled && isSpeaking) {
        speakText(data.response, detectedLang);
      }

    } catch (error) {
      console.error("AI Service Error:", error);
      
      // Use enhanced fallback response on API error
      const fallbackResponse: Message = {
        id: Date.now() + 2,
        text: generateLocalFallback(queryText, detectedLang),
        sender: "bot",
        timestamp: new Date(),
        language: detectedLang,
        category: "fallback",
        confidence: 60
      };
      setMessages((prev) => [...prev, fallbackResponse]);
      
      toast({
        title: detectedLang === 'hi' ? "कनेक्शन की समस्या" : "Connection Issue",
        description: detectedLang === 'hi' 
          ? "AI सहायक से संपर्क नहीं हो पा रहा। स्थानीय सलाह दी जा रही है।"
          : "Could not connect to AI assistant. Providing local advice.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }

    setTimeout(scrollToBottom, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      const speechLangMap = {
        'en': 'en-IN',
        'hi': 'hi-IN',
        'bn': 'bn-IN',
        'te': 'te-IN',
        'ta': 'ta-IN',
        'gu': 'gu-IN',
        'mr': 'mr-IN',
        'kn': 'kn-IN',
        'ml': 'ml-IN',
        'pa': 'pa-IN'
      };
      recognitionRef.current.lang = speechLangMap[activeLanguage] || 'hi-IN';
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakText = (text: string, lang: string) => {
    if ('speechSynthesis' in window && voiceEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      const speechLangMap = {
        'en': 'en-IN',
        'hi': 'hi-IN',
        'bn': 'bn-IN',
        'te': 'te-IN',
        'ta': 'ta-IN',
        'gu': 'gu-IN',
        'mr': 'mr-IN',
        'kn': 'kn-IN',
        'ml': 'ml-IN',
        'pa': 'pa-IN'
      };
      
      utterance.lang = speechLangMap[lang as keyof typeof speechLangMap] || 'hi-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      setVoiceEnabled(!voiceEnabled);
    }
  };

  const askQuickQuestion = (question: QuickQuestion) => {
    const questionText = getLanguageSpecificQuestion(question, activeLanguage);
    sendMessage(questionText);
  };

  const createNewSession = () => {
    const newSessionId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      name: `Chat ${chatSessions.length + 1}`,
      messages: [],
      lastActivity: new Date(),
      language: activeLanguage
    };
    
    setChatSessions(prev => [...prev, newSession]);
    setCurrentSessionId(newSessionId);
    setMessages([]);
    initializeChat();
  };

  const clearChat = () => {
    setMessages([]);
    initializeChat();
    toast({
      title: activeLanguage === 'hi' ? "चैट साफ़ किया गया" : "Chat Cleared",
      description: activeLanguage === 'hi' ? "नई बातचीत शुरू करें" : "Start a new conversation"
    });
  };

  const exportChat = () => {
    const chatData = {
      location: selectedLocation,
      language: activeLanguage,
      timestamp: new Date().toISOString(),
      messages: messages.map(m => ({
        sender: m.sender,
        text: m.text,
        timestamp: m.timestamp.toISOString(),
        language: m.language,
        confidence: m.confidence
      }))
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `krishi-guru-chat-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: activeLanguage === 'hi' ? "चैट निर्यात किया गया" : "Chat Exported",
      description: activeLanguage === 'hi' ? "चैट इतिहास डाउनलोड किया गया" : "Chat history downloaded"
    });
  };

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Message copied to clipboard"
    });
  };

  const getLanguageFlag = (langCode: string) => {
    const lang = supportedLanguages.find(l => l.code === langCode);
    return lang?.flag || '🇮🇳';
  };

  const getLanguageName = (langCode: string) => {
    const lang = supportedLanguages.find(l => l.code === langCode);
    return lang?.nativeName || langCode;
  };

  return (
    <section id="ai-chatbot" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Bot className="mx-auto h-16 w-16 text-primary mb-4" />
          <h2 className="text-4xl font-bold text-primary mb-4">
            {activeLanguage === 'hi' 
              ? 'AI कृषि सहायक / AI Agriculture Assistant'
              : 'AI Agriculture Assistant / AI कृषि सहायक'
            }
          </h2>
          <p className="text-xl text-muted-foreground">
            {activeLanguage === 'hi'
              ? `${selectedLocation} के लिए 10+ भारतीय भाषाओं में AI असिस्टेंट से बात करें`
              : `Chat with AI assistant in 10+ Indian languages for ${selectedLocation}`
            }
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="shadow-hero">
            <CardHeader className="bg-primary text-primary-foreground">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-6 w-6" />
                  Krishi Guru AI Assistant - {selectedLocation}
                </CardTitle>
                
                <div className="flex items-center space-x-2">
                  {/* Language Selector */}
                  <Select value={activeLanguage} onValueChange={(value: any) => setActiveLanguage(value)}>
                    <SelectTrigger className="w-40 bg-primary-foreground/20 border-primary-foreground/30">
                      <SelectValue>
                        <div className="flex items-center">
                          <span className="mr-2">{getLanguageFlag(activeLanguage)}</span>
                          <span className="text-sm">{getLanguageName(activeLanguage)}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {supportedLanguages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <div className="flex items-center">
                            <span className="mr-2">{lang.flag}</span>
                            <span>{lang.nativeName}</span>
                            <span className="ml-2 text-xs text-muted-foreground">({lang.name})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {/* Voice Controls */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleSpeech}
                    className="bg-primary-foreground/20 border-primary-foreground/30"
                  >
                    {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                  
                  {/* Chat Controls */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearChat}
                    className="bg-primary-foreground/20 border-primary-foreground/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportChat}
                    className="bg-primary-foreground/20 border-primary-foreground/30"
                    disabled={messages.length <= 1}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Enhanced Stats */}
              <div className="flex items-center space-x-4 text-sm opacity-90">
                <span>Messages: {messages.length}</span>
                <span>•</span>
                <span>Language: {getLanguageName(activeLanguage)}</span>
                <span>•</span>
                <span>Location: {selectedLocation.split(',')[0]}</span>
                <span>•</span>
                <span className={`flex items-center ${voiceEnabled ? 'text-green-300' : 'text-red-300'}`}>
                  {voiceEnabled ? <Volume2 className="w-3 h-3 mr-1" /> : <VolumeX className="w-3 h-3 mr-1" />}
                  Voice {voiceEnabled ? 'ON' : 'OFF'}
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
                {/* Enhanced Quick Questions Sidebar */}
                <div className="lg:col-span-1 border-r bg-muted/30 p-4">
                  <h3 className="font-semibold mb-3 text-sm flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    {activeLanguage === 'hi' ? 'त्वरित प्रश्न' : 'Quick Questions'}
                  </h3>
                  <div className="space-y-2">
                    {quickQuestions.map((q) => (
                      <Button
                        key={q.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => askQuickQuestion(q)}
                        className="w-full justify-start text-left h-auto p-2 text-xs hover:bg-primary/10"
                        disabled={isLoading}
                      >
                        <q.icon className="w-3 h-3 mr-2 flex-shrink-0" />
                        <span className="line-clamp-2">
                          {getLanguageSpecificQuestion(q, activeLanguage)}
                        </span>
                      </Button>
                    ))}
                  </div>
                  
                  {/* Language Quick Switch */}
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-xs font-medium mb-2 text-muted-foreground">Quick Language Switch</h4>
                    <div className="grid grid-cols-2 gap-1">
                      {supportedLanguages.slice(0, 6).map((lang) => (
                        <Button
                          key={lang.code}
                          variant={activeLanguage === lang.code ? "default" : "outline"}
                          size="sm"
                          onClick={() => setActiveLanguage(lang.code)}
                          className="text-xs p-1 h-8"
                        >
                          <span className="mr-1">{lang.flag}</span>
                          {lang.code.toUpperCase()}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={createNewSession}
                      className="w-full text-xs mb-2"
                    >
                      {activeLanguage === 'hi' ? 'नई चैट' : 'New Chat'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportChat}
                      className="w-full text-xs"
                      disabled={messages.length <= 1}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      {activeLanguage === 'hi' ? 'निर्यात' : 'Export'}
                    </Button>
                  </div>
                </div>

                {/* Enhanced Main Chat Area */}
                <div className="lg:col-span-3">
                  <ScrollArea className="h-96 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`flex items-start gap-2 max-w-[85%] ${
                              message.sender === "user" ? "flex-row-reverse" : ""
                            }`}
                          >
                            <div
                              className={`p-2 rounded-full ${
                                message.sender === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-nature-medium text-white"
                              }`}
                            >
                              {message.sender === "user" ? (
                                <User className="h-4 w-4" />
                              ) : (
                                <Bot className="h-4 w-4" />
                              )}
                            </div>
                            <div
                              className={`p-3 rounded-lg ${
                                message.sender === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs opacity-70">
                                  {message.timestamp.toLocaleTimeString()}
                                </span>
                                <div className="flex items-center space-x-1">
                                  <Badge variant="outline" className="text-xs">
                                    <span className="mr-1">{getLanguageFlag(message.language)}</span>
                                    {getLanguageName(message.language)}
                                  </Badge>
                                  {message.confidence && (
                                    <Badge variant="outline" className="text-xs">
                                      {message.confidence}%
                                    </Badge>
                                  )}
                                  {message.sender === "bot" && (
                                    <>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => speakText(message.text, message.language)}
                                        className="h-6 w-6 p-0"
                                        disabled={!voiceEnabled}
                                      >
                                        <Volume2 className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyMessage(message.text)}
                                        className="h-6 w-6 p-0"
                                      >
                                        <Copy className="h-3 w-3" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="flex items-start gap-2 max-w-[85%]">
                            <div className="p-2 rounded-full bg-nature-medium text-white">
                              <Bot className="h-4 w-4" />
                            </div>
                            <div className="p-3 rounded-lg bg-muted">
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm">
                                  {activeLanguage === 'hi' ? 'सोच रहा हूँ...' : 
                                   activeLanguage === 'bn' ? 'ভাবছি...' :
                                   activeLanguage === 'te' ? 'ఆలోచిస్తున్నాను...' :
                                   activeLanguage === 'ta' ? 'யோசித்துக்கொண்டிருக்கிறேன்...' :
                                   activeLanguage === 'gu' ? 'વિચારી રહ્યો છું...' :
                                   activeLanguage === 'mr' ? 'विचार करत आहे...' :
                                   activeLanguage === 'kn' ? 'ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ...' :
                                   activeLanguage === 'ml' ? 'ചിന്തിക്കുന്നു...' :
                                   activeLanguage === 'pa' ? 'ਸੋਚ ਰਿਹਾ ਹਾਂ...' :
                                   'Thinking...'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div ref={messagesEndRef} />
                  </ScrollArea>
                  
                  {/* Enhanced Input Area */}
                  <div className="p-4 border-t bg-muted/30">
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={
                              activeLanguage === 'hi' 
                                ? "अपना सवाल यहाँ टाइप करें... (किसी भी भारतीय भाषा में)"
                                : activeLanguage === 'bn' ? "এখানে আপনার প্রশ্ন টাইপ করুন... (যেকোনো ভারতীয় ভাষায়)"
                                : activeLanguage === 'te' ? "మీ ప్రశ్నను ఇక్కడ టైప్ చేయండి... (ఏదైనా భారతీయ భాషలో)"
                                : activeLanguage === 'ta' ? "உங்கள் கேள்வியை இங்கே தட்டச்சு செய்யுங்கள்... (எந்த இந்திய மொழியிலும்)"
                                : activeLanguage === 'gu' ? "તમારો પ્રશ્ન અહીં ટાઈપ કરો... (કોઈપણ ભારતીય ભાષામાં)"
                                : activeLanguage === 'mr' ? "तुमचा प्रश्न येथे टाइप करा... (कोणत्याही भारतीय भाषेत)"
                                : activeLanguage === 'kn' ? "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ... (ಯಾವುದೇ ಭಾರತೀಯ ಭಾಷೆಯಲ್ಲಿ)"
                                : activeLanguage === 'ml' ? "നിങ്ങളുടെ ചോദ്യം ഇവിടെ ടൈപ്പ് ചെയ്യുക... (ഏതെങ്കിലും ഇന്ത്യൻ ഭാഷയിൽ)"
                                : activeLanguage === 'pa' ? "ਆਪਣਾ ਸਵਾਲ ਇੱਥੇ ਟਾਈਪ ਕਰੋ... (ਕਿਸੇ ਵੀ ਭਾਰਤੀ ਭਾਸ਼ਾ ਵਿੱਚ)"
                                : "Type your question here... (in any Indian language)"
                            }
                            disabled={isLoading}
                            className="pr-16"
                          />
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                            <Badge variant="outline" className="text-xs">
                              <span className="mr-1">{getLanguageFlag(detectLanguage(input))}</span>
                              {getLanguageName(detectLanguage(input))}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Voice Input */}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={isListening ? stopListening : startListening}
                          disabled={isLoading || !voiceEnabled}
                          className={isListening ? "bg-red-100 border-red-300" : ""}
                        >
                          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </Button>
                        
                        {/* Send Button */}
                        <Button type="submit" disabled={isLoading || !input.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Enhanced Status Indicators */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-3">
                          {isListening && (
                            <div className="flex items-center text-red-600">
                              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse mr-1"></div>
                              {activeLanguage === 'hi' ? 'सुन रहा हूँ...' : 
                               activeLanguage === 'bn' ? 'শুনছি...' :
                               activeLanguage === 'te' ? 'వింటున్నాను...' :
                               activeLanguage === 'ta' ? 'கேட்டுக்கொண்டிருக்கிறேன்...' :
                               activeLanguage === 'gu' ? 'સાંભળી રહ્યો છું...' :
                               activeLanguage === 'mr' ? 'ऐकत आहे...' :
                               activeLanguage === 'kn' ? 'ಕೇಳುತ್ತಿದ್ದೇನೆ...' :
                               activeLanguage === 'ml' ? 'കേൾക്കുന്നു...' :
                               activeLanguage === 'pa' ? 'ਸੁਣ ਰਿਹਾ ਹਾਂ...' :
                               'Listening...'}
                            </div>
                          )}
                          {isSpeaking && (
                            <div className="flex items-center text-blue-600">
                              <Volume2 className="w-3 h-3 mr-1" />
                              {activeLanguage === 'hi' ? 'बोल रहा हूँ...' : 
                               activeLanguage === 'bn' ? 'বলছি...' :
                               activeLanguage === 'te' ? 'మాట్లాడుతున్నాను...' :
                               activeLanguage === 'ta' ? 'பேசிக்கொண்டிருக்கிறேன்...' :
                               activeLanguage === 'gu' ? 'બોલી રહ્યો છું...' :
                               activeLanguage === 'mr' ? 'बोलत आहे...' :
                               activeLanguage === 'kn' ? 'ಮಾತನಾಡುತ್ತಿದ್ದೇನೆ...' :
                               activeLanguage === 'ml' ? 'സംസാരിക്കുന്നു...' :
                               activeLanguage === 'pa' ? 'ਬੋਲ ਰਿਹਾ ਹਾਂ...' :
                               'Speaking...'}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span>
                            {activeLanguage === 'hi' ? 'AI द्वारा संचालित' : 
                             activeLanguage === 'bn' ? 'AI দ্বারা চালিত' :
                             activeLanguage === 'te' ? 'AI ద్వారా నడిచే' :
                             activeLanguage === 'ta' ? 'AI மூலம் இயக்கப்படுகிறது' :
                             activeLanguage === 'gu' ? 'AI દ્વારા સંચાલિત' :
                             activeLanguage === 'mr' ? 'AI द्वारे चालवले' :
                             activeLanguage === 'kn' ? 'AI ನಿಂದ ನಡೆಸಲ್ಪಡುತ್ತದೆ' :
                             activeLanguage === 'ml' ? 'AI വഴി പ്രവർത്തിക്കുന്നു' :
                             activeLanguage === 'pa' ? 'AI ਦੁਆਰਾ ਸੰਚਾਲਿਤ' :
                             'Powered by AI'}
                          </span>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Chat Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card className="text-center p-4">
              <Languages className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">
                {activeLanguage === 'hi' ? '10+ भाषाएं' : '10+ Languages'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {activeLanguage === 'hi' 
                  ? 'सभी प्रमुख भारतीय भाषाओं में सहायता'
                  : 'Support for all major Indian languages'
                }
              </p>
            </Card>
            
            <Card className="text-center p-4">
              <Mic className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">
                {activeLanguage === 'hi' ? 'आवाज़ सहायता' : 'Voice Support'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {activeLanguage === 'hi' 
                  ? 'बोलकर प्रश्न पूछें और उत्तर सुनें'
                  : 'Ask questions by voice and hear responses'
                }
              </p>
            </Card>
            
            <Card className="text-center p-4">
              <MessageCircle className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">
                {activeLanguage === 'hi' ? 'स्मार्ट सुझाव' : 'Smart Suggestions'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {activeLanguage === 'hi' 
                  ? 'स्थान-आधारित कृषि सलाह'
                  : 'Location-based agricultural advice'
                }
              </p>
            </Card>

            <Card className="text-center p-4">
              <Bot className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">
                {activeLanguage === 'hi' ? 'AI विशेषज्ञ' : 'AI Expert'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {activeLanguage === 'hi' 
                  ? 'उन्नत AI मॉडल द्वारा संचालित'
                  : 'Powered by advanced AI models'
                }
              </p>
            </Card>
          </div>

          {/* Language Support Info */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2 text-primary" />
                Supported Languages / समर्थित भाषाएं
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {supportedLanguages.map((lang) => (
                  <div
                    key={lang.code}
                    className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${
                      activeLanguage === lang.code 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setActiveLanguage(lang.code)}
                  >
                    <div className="text-2xl mb-1">{lang.flag}</div>
                    <div className="font-medium text-sm">{lang.nativeName}</div>
                    <div className="text-xs text-muted-foreground">{lang.name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AIChatbot;
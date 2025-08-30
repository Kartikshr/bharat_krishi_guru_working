import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Send, Loader2, User, Mic, MicOff, Volume2, VolumeX, Globe, MessageCircle, Lightbulb, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "@/contexts/LocationContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  language: 'en' | 'hi';
  category?: string;
}

interface QuickQuestion {
  id: number;
  question: string;
  questionHindi: string;
  category: string;
  icon: any;
}

interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
  lastActivity: Date;
  language: 'en' | 'hi';
}

const AIChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('default');
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'hi'>('hi');
  const { toast } = useToast();
  const { selectedLocation } = useLocation();
  const { language } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const quickQuestions: QuickQuestion[] = [
    {
      id: 1,
      question: "What crops are best for this season?",
      questionHindi: "इस मौसम के लिए कौन सी फसलें सबसे अच्छी हैं?",
      category: "Seasonal Farming",
      icon: MessageCircle
    },
    {
      id: 2,
      question: "How to control pest attacks naturally?",
      questionHindi: "प्राकृतिक रूप से कीट हमलों को कैसे नियंत्रित करें?",
      category: "Pest Control",
      icon: Lightbulb
    },
    {
      id: 3,
      question: "Government schemes for farmers",
      questionHindi: "किसानों के लिए सरकारी योजनाएं",
      category: "Government Schemes",
      icon: HelpCircle
    },
    {
      id: 4,
      question: "Soil testing and improvement tips",
      questionHindi: "मिट्टी परीक्षण और सुधार के तिप्स",
      category: "Soil Health",
      icon: MessageCircle
    },
    {
      id: 5,
      question: "Water conservation techniques",
      questionHindi: "जल संरक्षण तकनीकें",
      category: "Water Management",
      icon: Lightbulb
    },
    {
      id: 6,
      question: "Market prices and selling tips",
      questionHindi: "बाजार भाव और बिक्री के तिप्स",
      category: "Market Intelligence",
      icon: HelpCircle
    }
  ];

  const initializeChat = () => {
    const welcomeMessage: Message = {
      id: 1,
      text: activeLanguage === 'hi' 
        ? `नमस्कार! मैं आपका कृषि सहायक हूँ। मैं ${selectedLocation} के लिए खेती, फसलों, बीमारियों, सिंचाई, उर्वरक, कीटनाशक, सरकारी योजनाओं, और आधुनिक कृषि तकनीकों के बारे में जानकारी दे सकता हूँ। आप मुझसे हिंदी या अंग्रेजी में कोई भी प्रश्न पूछ सकते हैं!`
        : `Hello! I'm your agricultural assistant. I can provide information about farming, crops, diseases, irrigation, fertilizers, pesticides, government schemes, and modern agricultural techniques for ${selectedLocation}. You can ask me questions in Hindi or English!`,
      sender: "bot",
      timestamp: new Date(),
      language: activeLanguage,
      category: "welcome"
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
      recognitionRef.current.lang = activeLanguage === 'hi' ? 'hi-IN' : 'en-IN';

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

  const generateLocalFallback = (query: string, lang: 'en' | 'hi'): string => {
    const responses = {
      hi: [
        `${selectedLocation} में जैविक खेती को बढ़ावा देना महत्वपूर्ण है। कम्पोस्ट का उपयोग करें और रासायनिक उर्वरकों को कम करें।`,
        `फसल की सिंचाई के लिए ड्रिप इरिगेशन तकनीक का उपयोग करें। यह पानी बचाती है और बेहतर उत्पादन देती है।`,
        `मौसम के अनुसार फसल की बुआई करना जरूरी है। ${selectedLocation} के लिए स्थानीय कृषि विभाग से सलाह लें।`,
        `प्रधानमंत्री फसल बीमा योजना का लाभ उठाएं। यह प्राकृतिक आपदाओं से नुकसान से सुरक्षा प्रदान करती है।`,
        `मिट्टी की जांच नियमित रूप से कराएं। ${selectedLocation} में मुफ्त मिट्टी परीक्षण की सुविधा उपलब्ध है।`,
        `एकीकृत कीट प्रबंधन अपनाएं। जैविक और रासायनिक दोनों विधियों का संतुलित उपयोग करें।`
      ],
      en: [
        `Promoting organic farming in ${selectedLocation} is important. Use compost and reduce chemical fertilizers.`,
        `Use drip irrigation technology for crop irrigation. It saves water and provides better production.`,
        `Seasonal crop sowing is essential. Consult local agriculture department for ${selectedLocation} specific advice.`,
        `Take advantage of PM Fasal Bima Yojana. It provides protection against losses from natural disasters.`,
        `Get soil testing done regularly. Free soil testing facility is available in ${selectedLocation}.`,
        `Adopt integrated pest management. Use a balanced combination of biological and chemical methods.`
      ]
    };
    
    return responses[lang][Math.floor(Math.random() * responses[lang].length)];
  };

  const detectLanguage = (text: string): 'en' | 'hi' => {
    // Simple language detection based on character patterns
    const hindiPattern = /[\u0900-\u097F]/;
    return hindiPattern.test(text) ? 'hi' : 'en';
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
        category: "ai-response"
      };

      setMessages((prev) => [...prev, botResponse]);

      // Text-to-speech for bot response
      if (isSpeaking) {
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
        category: "fallback"
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
      recognitionRef.current.lang = activeLanguage === 'hi' ? 'hi-IN' : 'en-IN';
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakText = (text: string, lang: 'en' | 'hi') => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
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
      setIsSpeaking(!isSpeaking);
    }
  };

  const askQuickQuestion = (question: QuickQuestion) => {
    const questionText = activeLanguage === 'hi' ? question.questionHindi : question.question;
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

  const switchLanguage = (lang: 'en' | 'hi') => {
    setActiveLanguage(lang);
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
        timestamp: m.timestamp.toISOString()
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
              ? `${selectedLocation} के लिए अपने खेती संबंधी सवालों के लिए AI असिस्टेंट से बात करें`
              : `Chat with AI assistant for your farming questions specific to ${selectedLocation}`
            }
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Card className="shadow-hero">
            <CardHeader className="bg-primary text-primary-foreground">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-6 w-6" />
                  Krishi Guru AI Assistant - {selectedLocation}
                </CardTitle>
                
                <div className="flex items-center space-x-2">
                  {/* Language Toggle */}
                  <div className="flex bg-primary-foreground/20 rounded-lg p-1">
                    <Button
                      variant={activeLanguage === 'hi' ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => switchLanguage('hi')}
                      className="text-xs"
                    >
                      हिंदी
                    </Button>
                    <Button
                      variant={activeLanguage === 'en' ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => switchLanguage('en')}
                      className="text-xs"
                    >
                      English
                    </Button>
                  </div>
                  
                  {/* Voice Controls */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleSpeech}
                    className="bg-primary-foreground/20 border-primary-foreground/30"
                  >
                    {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  
                  {/* Chat Controls */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearChat}
                    className="bg-primary-foreground/20 border-primary-foreground/30"
                  >
                    Clear
                  </Button>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="flex items-center space-x-4 text-sm opacity-90">
                <span>Messages: {messages.length}</span>
                <span>•</span>
                <span>Language: {activeLanguage === 'hi' ? 'हिंदी' : 'English'}</span>
                <span>•</span>
                <span>Location: {selectedLocation.split(',')[0]}</span>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
                {/* Quick Questions Sidebar */}
                <div className="lg:col-span-1 border-r bg-muted/30 p-4">
                  <h3 className="font-semibold mb-3 text-sm">
                    {activeLanguage === 'hi' ? 'त्वरित प्रश्न' : 'Quick Questions'}
                  </h3>
                  <div className="space-y-2">
                    {quickQuestions.map((q) => (
                      <Button
                        key={q.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => askQuickQuestion(q)}
                        className="w-full justify-start text-left h-auto p-2 text-xs"
                        disabled={isLoading}
                      >
                        <q.icon className="w-3 h-3 mr-2 flex-shrink-0" />
                        <span className="line-clamp-2">
                          {activeLanguage === 'hi' ? q.questionHindi : q.question}
                        </span>
                      </Button>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportChat}
                      className="w-full text-xs"
                      disabled={messages.length <= 1}
                    >
                      {activeLanguage === 'hi' ? 'चैट निर्यात करें' : 'Export Chat'}
                    </Button>
                  </div>
                </div>

                {/* Main Chat Area */}
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
                                    {message.language === 'hi' ? 'हिंदी' : 'English'}
                                  </Badge>
                                  {message.sender === "bot" && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => speakText(message.text, message.language)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Volume2 className="h-3 w-3" />
                                    </Button>
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
                                  {activeLanguage === 'hi' ? 'सोच रहा हूँ...' : 'Thinking...'}
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
                                ? "अपना सवाल यहाँ टाइप करें... (हिंदी या English में)"
                                : "Type your question here... (in Hindi or English)"
                            }
                            disabled={isLoading}
                            className="pr-12"
                          />
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                            <Badge variant="outline" className="text-xs">
                              {detectLanguage(input) === 'hi' ? 'हिंदी' : 'EN'}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Voice Input */}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={isListening ? stopListening : startListening}
                          disabled={isLoading}
                          className={isListening ? "bg-red-100 border-red-300" : ""}
                        >
                          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </Button>
                        
                        {/* Send Button */}
                        <Button type="submit" disabled={isLoading || !input.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Status Indicators */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-3">
                          {isListening && (
                            <div className="flex items-center text-red-600">
                              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse mr-1"></div>
                              {activeLanguage === 'hi' ? 'सुन रहा हूँ...' : 'Listening...'}
                            </div>
                          )}
                          {isSpeaking && (
                            <div className="flex items-center text-blue-600">
                              <Volume2 className="w-3 h-3 mr-1" />
                              {activeLanguage === 'hi' ? 'बोल रहा हूँ...' : 'Speaking...'}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span>
                            {activeLanguage === 'hi' ? 'AI द्वारा संचालित' : 'Powered by AI'}
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

          {/* Chat Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="text-center p-4">
              <Globe className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">
                {activeLanguage === 'hi' ? 'बहुभाषी सहायता' : 'Multilingual Support'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {activeLanguage === 'hi' 
                  ? 'हिंदी और अंग्रेजी में प्रश्न पूछें'
                  : 'Ask questions in Hindi and English'
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIChatbot;
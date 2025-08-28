import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Loader2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "@/contexts/LocationContext";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const AIChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "नमस्कार! मैं आपका कृषि सहायक हूँ। मैं खेती, फसलों, बीमारियों, और सरकारी योजनाओं के बारे में जानकारी दे सकता हूँ। आप मुझसे कोई भी प्रश्न पूछ सकते हैं!",
      sender: "bot",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { selectedLocation } = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateLocalFallback = (query: string): string => {
    const responses = [
      "भारतीय कृषि में जैविक खेती को बढ़ावा देना महत्वपूर्ण है। कम्पोस्ट का उपयोग करें।",
      "फसल की सिंचाई के लिए ड्रिप इरिगेशन तकनीक का उपयोग करें। यह पानी बचाती है।",
      "मौसम के अनुसार फसल की बुआई करना जरूरी है। स्थानीय कृषि विभाग से सलाह लें।",
      "प्रधानमंत्री फसल बीमा योजना का लाभ उठाएं। यह नुकसान से सुरक्षा प्रदान करती है।",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userQuery = input;
    setInput("");
    setIsLoading(true);

    try {
      // Call the Gemini-powered AI assistant API
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userQuery,
          location: selectedLocation
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
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("AI Service Error:", error);
      
      // Use fallback response on API error
      const fallbackResponse: Message = {
        id: Date.now() + 2,
        text: generateLocalFallback(userQuery),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackResponse]);
      
      toast({
        title: "कनेक्शन की समस्या",
        description: "AI सहायक से संपर्क नहीं हो पा रहा। स्थानीय सलाह दी जा रही है।",
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

  return (
    <section id="ai-chatbot" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Bot className="mx-auto h-16 w-16 text-primary mb-4" />
          <h2 className="text-4xl font-bold text-primary mb-4">
            AI कृषि सहायक / AI Agriculture Assistant
          </h2>
          <p className="text-xl text-muted-foreground">
            अपने खेती संबंधी सवालों के लिए AI असिस्टेंट से बात करें
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-hero">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-6 w-6" />
                Krishi Guru AI Assistant - {selectedLocation}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
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
                        className={`flex items-start gap-2 max-w-[80%] ${
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
                          <p className="text-sm">{message.text}</p>
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-2 max-w-[80%]">
                        <div className="p-2 rounded-full bg-nature-medium text-white">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="p-3 rounded-lg bg-muted">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>
              
              <div className="p-4 border-t">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="अपना सवाल यहाँ टाइप करें..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AIChatbot;
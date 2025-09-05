import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Book, Search, FileText, Users, Award, TrendingUp, Lightbulb, HelpCircle, ExternalLink, Download, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface KnowledgeItem {
  id: number;
  title: string;
  titleHindi: string;
  description: string;
  descriptionHindi: string;
  category: string;
  type: 'article' | 'video' | 'guide' | 'scheme';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: string;
  rating: number;
  tags: string[];
  content: string;
  contentHindi: string;
}

const KnowledgeHub = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const { language } = useLanguage();

  const knowledgeItems: KnowledgeItem[] = [
    {
      id: 1,
      title: "Organic Farming Basics",
      titleHindi: "जैविक खेती की मूल बातें",
      description: "Complete guide to starting organic farming practices",
      descriptionHindi: "जैविक खेती शुरू करने की संपूर्ण गाइड",
      category: "Organic Farming",
      type: "guide",
      difficulty: "beginner",
      readTime: "15 min",
      rating: 4.8,
      tags: ["organic", "sustainable", "certification"],
      content: "Organic farming is a method of crop and livestock production that involves much more than choosing not to use pesticides, fertilizers, genetically modified organisms, antibiotics and growth hormones...",
      contentHindi: "जैविक खेती फसल और पशुधन उत्पादन की एक विधि है जिसमें कीटनाशकों, उर्वरकों, आनुवंशिक रूप से संशोधित जीवों, एंटीबायोटिक्स और वृद्धि हार्मोन का उपयोग न करने से कहीं अधिक शामिल है..."
    },
    {
      id: 2,
      title: "PM-KISAN Scheme Details",
      titleHindi: "पीएम-किसान योजना विवरण",
      description: "Everything about PM-KISAN Direct Benefit Transfer scheme",
      descriptionHindi: "पीएम-किसान प्रत्यक्ष लाभ हस्तांतरण योजना के बारे में सब कुछ",
      category: "Government Schemes",
      type: "scheme",
      difficulty: "beginner",
      readTime: "10 min",
      rating: 4.9,
      tags: ["government", "subsidy", "income"],
      content: "The Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a Central Sector Scheme launched on 24th February 2019...",
      contentHindi: "प्रधानमंत्री किसान सम्मान निधि (पीएम-किसान) 24 फरवरी 2019 को शुरू की गई एक केंद्रीय क्षेत्र योजना है..."
    },
    {
      id: 3,
      title: "Drip Irrigation Setup",
      titleHindi: "ड्रिप सिंचाई सेटअप",
      description: "Step-by-step guide to install drip irrigation system",
      descriptionHindi: "ड्रिप सिंचाई प्रणाली स्थापित करने की चरणबद्ध गाइड",
      category: "Water Management",
      type: "guide",
      difficulty: "intermediate",
      readTime: "20 min",
      rating: 4.7,
      tags: ["irrigation", "water-saving", "technology"],
      content: "Drip irrigation is a type of micro-irrigation system that has the potential to save water and nutrients by allowing water to drip slowly to the roots of plants...",
      contentHindi: "ड्रिप सिंचाई एक प्रकार की सूक्ष्म सिंचाई प्रणाली है जिसमें पानी और पोषक तत्वों को बचाने की क्षमता है..."
    },
    {
      id: 4,
      title: "Integrated Pest Management",
      titleHindi: "एकीकृत कीट प्रबंधन",
      description: "Comprehensive approach to pest control using multiple strategies",
      descriptionHindi: "कई रणनीतियों का उपयोग करके कीट नियंत्रण के लिए व्यापक दृष्टिकोण",
      category: "Pest Control",
      type: "article",
      difficulty: "advanced",
      readTime: "25 min",
      rating: 4.6,
      tags: ["pest-control", "sustainable", "chemicals"],
      content: "Integrated Pest Management (IPM) is an effective and environmentally sensitive approach to pest management that relies on a combination of common-sense practices...",
      contentHindi: "एकीकृत कीट प्रबंधन (आईपीएम) कीट प्रबंधन के लिए एक प्रभावी और पर्यावरण संवेदनशील दृष्टिकोण है..."
    },
    {
      id: 5,
      title: "Soil Health Card Scheme",
      titleHindi: "मृदा स्वास्थ्य कार्ड योजना",
      description: "Government scheme for soil testing and nutrient management",
      descriptionHindi: "मिट्टी परीक्षण और पोषक तत्व प्रबंधन के लिए सरकारी योजना",
      category: "Government Schemes",
      type: "scheme",
      difficulty: "beginner",
      readTime: "12 min",
      rating: 4.5,
      tags: ["soil-health", "government", "testing"],
      content: "The Soil Health Card Scheme was launched in 2015 to provide farmers with information about the nutrient status of their soil...",
      contentHindi: "मृदा स्वास्थ्य कार्ड योजना 2015 में किसानों को उनकी मिट्टी की पोषक स्थिति के बारे में जानकारी प्रदान करने के लिए शुरू की गई थी..."
    },
    {
      id: 6,
      title: "Crop Rotation Benefits",
      titleHindi: "फसल चक्र के फायदे",
      description: "Understanding the importance of crop rotation in sustainable farming",
      descriptionHindi: "टिकाऊ खेती में फसल चक्र के महत्व को समझना",
      category: "Sustainable Farming",
      type: "article",
      difficulty: "intermediate",
      readTime: "18 min",
      rating: 4.7,
      tags: ["rotation", "sustainable", "soil-health"],
      content: "Crop rotation is the practice of growing a series of different types of crops in the same area across a sequence of seasons...",
      contentHindi: "फसल चक्र एक ही क्षेत्र में मौसमों के अनुक्रम में विभिन्न प्रकार की फसलों की एक श्रृंखला उगाने की प्रथा है..."
    }
  ];

  const categories = ["all", "Organic Farming", "Government Schemes", "Water Management", "Pest Control", "Sustainable Farming"];
  const types = ["all", "article", "video", "guide", "scheme"];

  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = searchTerm === "" || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.titleHindi.includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesType = selectedType === "all" || item.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return FileText;
      case 'video': return Users;
      case 'guide': return Book;
      case 'scheme': return Award;
      default: return FileText;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article': return 'bg-blue-100 text-blue-800';
      case 'video': return 'bg-purple-100 text-purple-800';
      case 'guide': return 'bg-green-100 text-green-800';
      case 'scheme': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section id="knowledge" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Book className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {language === 'hi' ? 'ज्ञान केंद्र' : 'Knowledge Hub'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'hi' 
              ? 'आधुनिक कृषि तकनीकों, सरकारी योजनाओं और सर्वोत्तम प्रथाओं के बारे में जानें'
              : 'Learn about modern farming techniques, government schemes, and best practices'
            }
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Search and Filters */}
          <Card className="mb-8 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 mr-2 text-primary" />
                {language === 'hi' ? 'खोजें और फ़िल्टर करें' : 'Search & Filter'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={language === 'hi' ? "लेख, गाइड या योजना खोजें..." : "Search articles, guides, schemes..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
                >
                  <option value="all">{language === 'hi' ? 'सभी श्रेणियां' : 'All Categories'}</option>
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <select 
                  value={selectedType} 
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
                >
                  <option value="all">{language === 'hi' ? 'सभी प्रकार' : 'All Types'}</option>
                  {types.slice(1).map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Knowledge Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredItems.map((item) => {
              const TypeIcon = getTypeIcon(item.type);
              return (
                <Card key={item.id} className="shadow-card hover:shadow-feature transition-all duration-200 hover:scale-105">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <TypeIcon className="w-5 h-5 text-primary" />
                        <Badge className={getTypeColor(item.type)}>
                          {item.type}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{item.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">
                      {language === 'hi' ? item.titleHindi : item.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {language === 'hi' ? item.descriptionHindi : item.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <Badge className={getDifficultyColor(item.difficulty)}>
                          {item.difficulty}
                        </Badge>
                        <span className="text-muted-foreground">{item.readTime}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          <Book className="w-4 h-4 mr-2" />
                          {language === 'hi' ? 'पढ़ें' : 'Read'}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Featured Government Schemes */}
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2 text-accent" />
                {language === 'hi' ? 'प्रमुख सरकारी योजनाएं' : 'Featured Government Schemes'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="pm-kisan">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-2 text-green-600" />
                      {language === 'hi' ? 'पीएम-किसान सम्मान निधि योजना' : 'PM-KISAN Samman Nidhi Scheme'}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {language === 'hi' 
                          ? 'छोटे और सीमांत किसानों को आय सहायता प्रदान करने वाली केंद्रीय योजना'
                          : 'Central scheme providing income support to small and marginal farmers'
                        }
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <strong>{language === 'hi' ? 'लाभ:' : 'Benefit:'}</strong>
                          <p>₹6,000 {language === 'hi' ? 'प्रति वर्ष' : 'per year'}</p>
                        </div>
                        <div>
                          <strong>{language === 'hi' ? 'किस्तें:' : 'Installments:'}</strong>
                          <p>3 {language === 'hi' ? 'किस्तें (₹2,000 प्रत्येक)' : 'installments (₹2,000 each)'}</p>
                        </div>
                        <div>
                          <strong>{language === 'hi' ? 'पात्रता:' : 'Eligibility:'}</strong>
                          <p>{language === 'hi' ? '2 हेक्टेयर तक भूमि' : 'Up to 2 hectares land'}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {language === 'hi' ? 'आवेदन करें' : 'Apply Now'}
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="crop-insurance">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-2 text-blue-600" />
                      {language === 'hi' ? 'प्रधानमंत्री फसल बीमा योजना' : 'PM Fasal Bima Yojana'}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {language === 'hi' 
                          ? 'प्राकृतिक आपदाओं से फसल हानि के लिए बीमा कवरेज'
                          : 'Insurance coverage for crop losses due to natural calamities'
                        }
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <strong>{language === 'hi' ? 'प्रीमियम:' : 'Premium:'}</strong>
                          <p>{language === 'hi' ? 'खरीफ: 2%, रबी: 1.5%' : 'Kharif: 2%, Rabi: 1.5%'}</p>
                        </div>
                        <div>
                          <strong>{language === 'hi' ? 'कवरेज:' : 'Coverage:'}</strong>
                          <p>{language === 'hi' ? 'बुआई से कटाई तक' : 'Sowing to harvesting'}</p>
                        </div>
                        <div>
                          <strong>{language === 'hi' ? 'दावा:' : 'Claim:'}</strong>
                          <p>{language === 'hi' ? '72 घंटे में रिपोर्ट करें' : 'Report within 72 hours'}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {language === 'hi' ? 'और जानें' : 'Learn More'}
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="text-center p-4 shadow-card">
              <Lightbulb className="w-8 h-8 text-accent mx-auto mb-2" />
              <h3 className="font-semibold mb-1">
                {language === 'hi' ? 'दैनिक सुझाव' : 'Daily Tips'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {language === 'hi' 
                  ? 'रोजाना नई कृषि तकनीकें सीखें'
                  : 'Learn new farming techniques daily'
                }
              </p>
            </Card>
            
            <Card className="text-center p-4 shadow-card">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">
                {language === 'hi' ? 'किसान समुदाय' : 'Farmer Community'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {language === 'hi' 
                  ? 'अन्य किसानों से जुड़ें और अनुभव साझा करें'
                  : 'Connect with other farmers and share experiences'
                }
              </p>
            </Card>
            
            <Card className="text-center p-4 shadow-card">
              <TrendingUp className="w-8 h-8 text-nature-medium mx-auto mb-2" />
              <h3 className="font-semibold mb-1">
                {language === 'hi' ? 'बाजार रुझान' : 'Market Trends'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {language === 'hi' 
                  ? 'नवीनतम बाजार विश्लेषण और पूर्वानुमान'
                  : 'Latest market analysis and forecasts'
                }
              </p>
            </Card>

            <Card className="text-center p-4 shadow-card">
              <HelpCircle className="w-8 h-8 text-earth-medium mx-auto mb-2" />
              <h3 className="font-semibold mb-1">
                {language === 'hi' ? 'विशेषज्ञ सहायता' : 'Expert Help'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {language === 'hi' 
                  ? '24/7 कृषि विशेषज्ञों से सलाह लें'
                  : 'Get advice from agricultural experts 24/7'
                }
              </p>
            </Card>
          </div>

          {/* No Results */}
          {filteredItems.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Book className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {language === 'hi' ? 'कोई परिणाम नहीं मिला' : 'No Results Found'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {language === 'hi' 
                    ? 'अपनी खोज को समायोजित करने का प्रयास करें या फ़िल्टर बदलें'
                    : 'Try adjusting your search or changing the filters'
                  }
                </p>
                <Button onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedType("all");
                }}>
                  {language === 'hi' ? 'फ़िल्टर साफ़ करें' : 'Clear Filters'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default KnowledgeHub;
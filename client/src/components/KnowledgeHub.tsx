import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, FileText, Award, Users, Calendar, Download, ExternalLink, Star, Clock, Tag, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "@/contexts/LocationContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface Article {
  id: number;
  title: string;
  titleHindi: string;
  category: string;
  content: string;
  contentHindi: string;
  readTime: number;
  date: string;
  icon: any;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  downloads: number;
  author: string;
}

interface Scheme {
  id: number;
  name: string;
  nameHindi: string;
  description: string;
  descriptionHindi: string;
  eligibility: string[];
  eligibilityHindi: string[];
  benefits: string[];
  benefitsHindi: string[];
  application: string;
  applicationHindi: string;
  deadline: string;
  budget: string;
  ministry: string;
  status: 'active' | 'upcoming' | 'closed';
}

interface Tutorial {
  id: number;
  title: string;
  titleHindi: string;
  description: string;
  descriptionHindi: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  videoUrl: string;
  steps: string[];
  stepsHindi: string[];
}

const KnowledgeHub = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<'articles' | 'schemes' | 'tutorials'>('articles');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const { toast } = useToast();
  const { selectedLocation } = useLocation();
  const { language, t } = useLanguage();

  const articles: Article[] = [
    {
      id: 1,
      title: "Organic Farming Best Practices",
      titleHindi: `${selectedLocation} में जैविक खेती की सर्वोत्तम प्रथाएं`,
      category: "Organic Farming",
      content: `Learn sustainable farming techniques specific to ${selectedLocation} that improve soil health and crop yield while protecting the environment. This comprehensive guide covers composting, natural pest control, crop rotation, and certification processes for organic farming in India.`,
      contentHindi: `${selectedLocation} के लिए विशिष्ट टिकाऊ कृषि तकनीकें सीखें जो मिट्टी के स्वास्थ्य और फसल की उपज में सुधार करती हैं। इस व्यापक गाइड में कंपोस्टिंग, प्राकृतिक कीट नियंत्रण, फसल चक्र और भारत में जैविक खेती के लिए प्रमाणन प्रक्रियाएं शामिल हैं।`,
      readTime: 8,
      date: "2024-12-20",
      icon: BookOpen,
      tags: ["organic", "sustainable", "soil-health", "certification"],
      difficulty: 'intermediate',
      rating: 4.8,
      downloads: 1250,
      author: "Dr. Rajesh Kumar"
    },
    {
      id: 2,
      title: "Integrated Pest Management",
      titleHindi: `${selectedLocation} में एकीकृत कीट प्रबंधन`,
      category: "Crop Protection",
      content: `Effective strategies to control pests in ${selectedLocation} using biological, cultural, and chemical methods in harmony. Learn about beneficial insects, trap crops, pheromone traps, and selective pesticide application for sustainable pest control.`,
      contentHindi: `जैविक, सांस्कृतिक और रासायनिक विधियों का सामंजस्यपूर्ण उपयोग करके ${selectedLocation} में कीटों को नियंत्रित करने की प्रभावी रणनीतियां। लाभकारी कीड़े, ट्रैप फसलें, फेरोमोन ट्रैप और टिकाऊ कीट नियंत्रण के लिए चुनिंदा कीटनाशक अनुप्रयोग के बारे में जानें।`,
      readTime: 12,
      date: "2024-12-18",
      icon: FileText,
      tags: ["pest-control", "ipm", "biological-control", "pesticides"],
      difficulty: 'advanced',
      rating: 4.6,
      downloads: 980,
      author: "Prof. Sunita Sharma"
    },
    {
      id: 3,
      title: "Water Conservation Techniques",
      titleHindi: `${selectedLocation} में जल संरक्षण तकनीकें`,
      category: "Irrigation",
      content: `Modern irrigation methods and water-saving techniques for efficient farming in ${selectedLocation}. Covers drip irrigation, sprinkler systems, rainwater harvesting, and smart irrigation scheduling based on soil moisture and weather data.`,
      contentHindi: `${selectedLocation} में कुशल कृषि के लिए आधुनिक सिंचाई विधियां और जल-बचत तकनीकें। इसमें ड्रिप सिंचाई, स्प्रिंकलर सिस्टम, वर्षा जल संचयन, और मिट्टी की नमी और मौसम डेटा के आधार पर स्मार्ट सिंचाई शेड्यूलिंग शामिल है।`,
      readTime: 10,
      date: "2024-12-15",
      icon: BookOpen,
      tags: ["irrigation", "water-conservation", "drip-irrigation", "smart-farming"],
      difficulty: 'intermediate',
      rating: 4.7,
      downloads: 1450,
      author: "Dr. Amit Patel"
    },
    {
      id: 4,
      title: "Soil Health Management",
      titleHindi: `${selectedLocation} में मिट्टी स्वास्थ्य प्रबंधन`,
      category: "Soil Science",
      content: `Understanding soil composition, testing, and improvement strategies for better productivity in ${selectedLocation}. Learn about soil pH management, nutrient cycling, microbial health, and organic matter enhancement techniques.`,
      contentHindi: `${selectedLocation} में बेहतर उत्पादकता के लिए मिट्टी की संरचना, परीक्षण और सुधार रणनीतियों को समझना। मिट्टी के pH प्रबंधन, पोषक तत्व चक्रण, माइक्रोबियल स्वास्थ्य और जैविक पदार्थ वृद्धि तकनीकों के बारे में जानें।`,
      readTime: 15,
      date: "2024-12-12",
      icon: FileText,
      tags: ["soil-health", "testing", "ph-management", "nutrients"],
      difficulty: 'advanced',
      rating: 4.9,
      downloads: 2100,
      author: "Dr. Priya Singh"
    },
    {
      id: 5,
      title: "Climate-Smart Agriculture",
      titleHindi: `${selectedLocation} में जलवायु-स्मार्ट कृषि`,
      category: "Climate Adaptation",
      content: `Adapting farming practices to climate change in ${selectedLocation}. Covers drought-resistant crops, weather forecasting, carbon sequestration, and sustainable farming practices for climate resilience.`,
      contentHindi: `${selectedLocation} में जलवायु परिवर्तन के लिए कृषि प्रथाओं को अनुकूलित करना। इसमें सूखा प्रतिरोधी फसलें, मौसम पूर्वानुमान, कार्बन संग्रहण और जलवायु लचीलेपन के लिए टिकाऊ कृषि प्रथाएं शामिल हैं।`,
      readTime: 11,
      date: "2024-12-10",
      icon: BookOpen,
      tags: ["climate-change", "drought-resistant", "sustainability", "resilience"],
      difficulty: 'intermediate',
      rating: 4.5,
      downloads: 890,
      author: "Dr. Vikram Reddy"
    },
    {
      id: 6,
      title: "Digital Farming Tools",
      titleHindi: `${selectedLocation} में डिजिटल कृषि उपकरण`,
      category: "Technology",
      content: `Introduction to modern farming technologies available in ${selectedLocation}. Learn about GPS-guided tractors, drone applications, IoT sensors, and mobile apps for farm management and monitoring.`,
      contentHindi: `${selectedLocation} में उपलब्ध आधुनिक कृषि प्रौद्योगिकियों का परिचय। GPS-निर्देशित ट्रैक्टर, ड्रोन अनुप्रयोग, IoT सेंसर, और खेत प्रबंधन और निगरानी के लिए मोबाइल ऐप्स के बारे में जानें।`,
      readTime: 9,
      date: "2024-12-08",
      icon: FileText,
      tags: ["technology", "gps", "drones", "iot", "mobile-apps"],
      difficulty: 'beginner',
      rating: 4.4,
      downloads: 1680,
      author: "Eng. Ravi Kumar"
    }
  ];

  const schemes: Scheme[] = [
    {
      id: 1,
      name: "PM Kisan Samman Nidhi",
      nameHindi: "पीएम किसान सम्मान निधि",
      description: "Direct financial support of ₹6000 per year to eligible farmers across India",
      descriptionHindi: "भारत भर के पात्र किसानों को प्रति वर्ष ₹6000 की प्रत्यक्ष वित्तीय सहायता",
      eligibility: ["Small and marginal farmers", "Land holding up to 2 hectares", "Valid Aadhaar card", "Bank account linked to Aadhaar"],
      eligibilityHindi: ["छोटे और सीमांत किसान", "2 हेक्टेयर तक की भूमि", "वैध आधार कार्ड", "आधार से जुड़ा बैंक खाता"],
      benefits: ["₹2000 every 4 months", "Direct bank transfer", "No paperwork after registration", "Immediate benefit upon approval"],
      benefitsHindi: ["हर 4 महीने में ₹2000", "सीधे बैंक ट्रांसफर", "पंजीकरण के बाद कोई कागजी कार्रवाई नहीं", "अनुमोदन पर तत्काल लाभ"],
      application: `Visit nearest CSC in ${selectedLocation} or online at pmkisan.gov.in`,
      applicationHindi: `${selectedLocation} में निकटतम CSC पर जाएं या pmkisan.gov.in पर ऑनलाइन आवेदन करें`,
      deadline: "Open throughout the year",
      budget: "₹75,000 crores annually",
      ministry: "Ministry of Agriculture & Farmers Welfare",
      status: 'active'
    },
    {
      id: 2,
      name: "Pradhan Mantri Fasal Bima Yojana",
      nameHindi: "प्रधानमंत्री फसल बीमा योजना",
      description: "Comprehensive crop insurance scheme providing financial support against crop loss due to natural calamities",
      descriptionHindi: "प्राकृतिक आपदाओं के कारण फसल हानि के विरुद्ध वित्तीय सहायता प्रदान करने वाली व्यापक फसल बीमा योजना",
      eligibility: ["All farmers (sharecroppers & tenant farmers)", "Notified crops in notified areas", "Valid land documents", "Crop cutting experiments participation"],
      eligibilityHindi: ["सभी किसान (बटाईदार और किरायेदार किसान)", "अधिसूचित क्षेत्रों में अधिसूचित फसलें", "वैध भूमि दस्तावेज", "फसल कटाई प्रयोग में भागीदारी"],
      benefits: ["Premium subsidy up to 95%", "Coverage for natural calamities", "Quick claim settlement within 60 days", "Technology-enabled crop assessment"],
      benefitsHindi: ["95% तक प्रीमियम सब्सिडी", "प्राकृतिक आपदाओं के लिए कवरेज", "60 दिनों के भीतर त्वरित दावा निपटान", "प्रौद्योगिकी-सक्षम फसल मूल्यांकन"],
      application: `Through banks, CSCs in ${selectedLocation}, or insurance company portals`,
      applicationHindi: `${selectedLocation} में बैंकों, CSCs, या बीमा कंपनी पोर्टल के माध्यम से`,
      deadline: "Varies by crop and season",
      budget: "₹15,695 crores for 2024-25",
      ministry: "Ministry of Agriculture & Farmers Welfare",
      status: 'active'
    },
    {
      id: 3,
      name: "Soil Health Card Scheme",
      nameHindi: "मृदा स्वास्थ्य कार्ड योजना",
      description: "Free soil testing and nutrient-based fertilizer recommendations to improve soil health and crop productivity",
      descriptionHindi: "मिट्टी के स्वास्थ्य और फसल उत्पादकता में सुधार के लिए मुफ्त मिट्टी परीक्षण और पोषक तत्व-आधारित उर्वरक सिफारिशें",
      eligibility: ["All farmers with agricultural land", "Valid land records", "Soil samples from registered fields", "Aadhaar card for identification"],
      eligibilityHindi: ["कृषि भूमि वाले सभी किसान", "वैध भूमि रिकॉर्ड", "पंजीकृत खेतों से मिट्टी के नमूने", "पहचान के लिए आधार कार्ड"],
      benefits: ["Free soil testing every 3 years", "Customized fertilizer recommendations", "Improved crop productivity", "Reduced input costs"],
      benefitsHindi: ["हर 3 साल में मुफ्त मिट्टी परीक्षण", "अनुकूलित उर्वरक सिफारिशें", "बेहतर फसल उत्पादकता", "कम इनपुट लागत"],
      application: `Contact local agriculture department in ${selectedLocation} or soil testing labs`,
      applicationHindi: `${selectedLocation} में स्थानीय कृषि विभाग या मिट्टी परीक्षण प्रयोगशालाओं से संपर्क करें`,
      deadline: "Ongoing program",
      budget: "₹568 crores",
      ministry: "Ministry of Agriculture & Farmers Welfare",
      status: 'active'
    },
    {
      id: 4,
      name: "Kisan Credit Card",
      nameHindi: "किसान क्रेडिट कार्ड",
      description: "Flexible credit facility for farmers to meet their agricultural and allied activities financing needs",
      descriptionHindi: "किसानों के लिए उनकी कृषि और संबद्ध गतिविधियों की वित्तपोषण आवश्यकताओं को पूरा करने के लिए लचीली ऋण सुविधा",
      eligibility: ["Farmers with cultivable land", "Tenant farmers with valid agreements", "Self Help Group members", "Joint Liability Group members"],
      eligibilityHindi: ["खेती योग्य भूमि वाले किसान", "वैध समझौते वाले किरायेदार किसान", "स्वयं सहायता समूह के सदस्य", "संयुक्त देयता समूह के सदस्य"],
      benefits: ["Credit limit up to ₹3 lakhs", "Flexible repayment", "Crop insurance coverage", "Low interest rates (7% per annum)"],
      benefitsHindi: ["₹3 लाख तक की क्रेडिट सीमा", "लचीली चुकौती", "फसल बीमा कवरेज", "कम ब्याज दरें (7% प्रति वर्ष)"],
      application: `Visit any bank branch in ${selectedLocation} with required documents`,
      applicationHindi: `आवश्यक दस्तावेजों के साथ ${selectedLocation} में किसी भी बैंक शाखा में जाएं`,
      deadline: "Available year-round",
      budget: "₹1,75,000 crores credit target",
      ministry: "Ministry of Agriculture & Farmers Welfare",
      status: 'active'
    },
    {
      id: 5,
      name: "National Mission for Sustainable Agriculture",
      nameHindi: "सतत कृषि के लिए राष्ट्रीय मिशन",
      description: "Promoting sustainable agriculture practices through climate-resilient technologies and water conservation",
      descriptionHindi: "जलवायु-लचीली प्रौद्योगिकियों और जल संरक्षण के माध्यम से टिकाऊ कृषि प्रथाओं को बढ़ावा देना",
      eligibility: ["Farmers in identified districts", "Farmer Producer Organizations", "Self Help Groups", "Agricultural cooperatives"],
      eligibilityHindi: ["पहचाने गए जिलों में किसान", "किसान उत्पादक संगठन", "स्वयं सहायता समूह", "कृषि सहकारी समितियां"],
      benefits: ["50-75% subsidy on equipment", "Training and capacity building", "Technology demonstration", "Market linkage support"],
      benefitsHindi: ["उपकरणों पर 50-75% सब्सिडी", "प्रशिक्षण और क्षमता निर्माण", "प्रौद्योगिकी प्रदर्शन", "बाजार संपर्क सहायता"],
      application: `Through state agriculture departments in ${selectedLocation}`,
      applicationHindi: `${selectedLocation} में राज्य कृषि विभागों के माध्यम से`,
      deadline: "March 31, 2025",
      budget: "₹3,980 crores for 2024-25",
      ministry: "Ministry of Agriculture & Farmers Welfare",
      status: 'active'
    }
  ];

  const tutorials: Tutorial[] = [
    {
      id: 1,
      title: "Setting up Drip Irrigation System",
      titleHindi: "ड्रिप सिंचाई प्रणाली स्थापित करना",
      description: "Step-by-step guide to install and maintain drip irrigation for water-efficient farming",
      descriptionHindi: "जल-कुशल कृषि के लिए ड्रिप सिंचाई स्थापित करने और बनाए रखने के लिए चरणबद्ध गाइड",
      duration: "25 minutes",
      level: 'beginner',
      category: "Irrigation",
      videoUrl: "https://example.com/drip-irrigation-tutorial",
      steps: [
        "Plan your irrigation layout",
        "Calculate water requirements",
        "Install main supply line",
        "Set up drip emitters",
        "Test the system",
        "Schedule irrigation timing"
      ],
      stepsHindi: [
        "अपने सिंचाई लेआउट की योजना बनाएं",
        "पानी की आवश्यकताओं की गणना करें",
        "मुख्य आपूर्ति लाइन स्थापित करें",
        "ड्रिप एमिटर सेट करें",
        "सिस्टम का परीक्षण करें",
        "सिंचाई समय निर्धारित करें"
      ]
    },
    {
      id: 2,
      title: "Composting for Organic Farming",
      titleHindi: "जैविक खेती के लिए कंपोस्टिंग",
      description: "Learn to create nutrient-rich compost from farm waste and kitchen scraps",
      descriptionHindi: "खेत के कचरे और रसोई के स्क्रैप से पोषक तत्वों से भरपूर कंपोस्ट बनाना सीखें",
      duration: "18 minutes",
      level: 'beginner',
      category: "Organic Farming",
      videoUrl: "https://example.com/composting-tutorial",
      steps: [
        "Collect organic waste materials",
        "Create compost pile layers",
        "Maintain proper moisture",
        "Turn the pile regularly",
        "Monitor temperature",
        "Harvest finished compost"
      ],
      stepsHindi: [
        "जैविक अपशिष्ट सामग्री एकत्र करें",
        "कंपोस्ट ढेर की परतें बनाएं",
        "उचित नमी बनाए रखें",
        "नियमित रूप से ढेर को पलटें",
        "तापमान की निगरानी करें",
        "तैयार कंपोस्ट की कटाई करें"
      ]
    },
    {
      id: 3,
      title: "Integrated Pest Management Implementation",
      titleHindi: "एकीकृत कीट प्रबंधन कार्यान्वयन",
      description: "Comprehensive approach to pest control using multiple strategies",
      descriptionHindi: "कई रणनीतियों का उपयोग करके कीट नियंत्रण के लिए व्यापक दृष्टिकोण",
      duration: "35 minutes",
      level: 'advanced',
      category: "Crop Protection",
      videoUrl: "https://example.com/ipm-tutorial",
      steps: [
        "Identify pest problems",
        "Monitor pest populations",
        "Implement cultural controls",
        "Use biological controls",
        "Apply chemical controls if needed",
        "Evaluate effectiveness"
      ],
      stepsHindi: [
        "कीट समस्याओं की पहचान करें",
        "कीट आबादी की निगरानी करें",
        "सांस्कृतिक नियंत्रण लागू करें",
        "जैविक नियंत्रण का उपयोग करें",
        "आवश्यकता पड़ने पर रासायनिक नियंत्रण लागू करें",
        "प्रभावशीलता का मूल्यांकन करें"
      ]
    }
  ];

  const categories = ['all', ...new Set(articles.map(a => a.category))];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.titleHindi.includes(searchTerm) ||
                         article.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || article.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.nameHindi.includes(searchTerm) ||
                         scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.titleHindi.includes(searchTerm) ||
                         tutorial.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || tutorial.level === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const openArticle = (article: Article) => {
    toast({
      title: language === 'hi' ? "लेख खोला जा रहा है" : "Opening Article",
      description: language === 'hi' ? `पढ़ रहे हैं: ${article.titleHindi}` : `Reading: ${article.title}`
    });
  };

  const applyScheme = (scheme: Scheme) => {
    toast({
      title: language === 'hi' ? "आवेदन जानकारी" : "Application Info",
      description: language === 'hi' ? `आवेदन प्रक्रिया: ${scheme.applicationHindi}` : `Application process: ${scheme.application}`
    });
  };

  const watchTutorial = (tutorial: Tutorial) => {
    toast({
      title: language === 'hi' ? "ट्यूटोरियल शुरू हो रहा है" : "Starting Tutorial",
      description: language === 'hi' ? `देख रहे हैं: ${tutorial.titleHindi}` : `Watching: ${tutorial.title}`
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section id="knowledge" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {language === 'hi' ? 'ज्ञान केंद्र' : 'Knowledge Hub'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'hi' 
              ? `${selectedLocation} के लिए व्यापक कृषि गाइड, सर्वोत्तम प्रथाएं और सरकारी योजनाओं तक पहुंच`
              : `Access comprehensive farming guides, best practices, and government schemes for ${selectedLocation} in Hindi and English`
            }
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="shadow-feature">
            <CardHeader>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-primary" />
                  {language === 'hi' ? 'डिजिटल लाइब्रेरी' : 'Digital Library'}
                </CardTitle>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full lg:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder={language === 'hi' ? "लेख या योजनाएं खोजें..." : "Search articles or schemes..."}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {/* Filters */}
                  <div className="flex space-x-2 w-full sm:w-auto">
                    <select 
                      value={selectedCategory} 
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border rounded-md text-sm bg-background flex-1 sm:flex-none"
                    >
                      <option value="all">{language === 'hi' ? 'सभी श्रेणियां' : 'All Categories'}</option>
                      {categories.slice(1).map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    
                    <select 
                      value={selectedDifficulty} 
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="px-3 py-2 border rounded-md text-sm bg-background flex-1 sm:flex-none"
                    >
                      <option value="all">{language === 'hi' ? 'सभी स्तर' : 'All Levels'}</option>
                      <option value="beginner">{language === 'hi' ? 'शुरुआती' : 'Beginner'}</option>
                      <option value="intermediate">{language === 'hi' ? 'मध्यम' : 'Intermediate'}</option>
                      <option value="advanced">{language === 'hi' ? 'उन्नत' : 'Advanced'}</option>
                    </select>
                  </div>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="articles" className="flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    {language === 'hi' ? 'लेख' : 'Articles'}
                  </TabsTrigger>
                  <TabsTrigger value="schemes" className="flex items-center">
                    <Award className="w-4 h-4 mr-2" />
                    {language === 'hi' ? 'योजनाएं' : 'Schemes'}
                  </TabsTrigger>
                  <TabsTrigger value="tutorials" className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {language === 'hi' ? 'ट्यूटोरियल' : 'Tutorials'}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="articles" className="mt-6">
                  <div className="space-y-4">
                    {filteredArticles.map((article) => (
                      <Card key={article.id} className="shadow-card hover:shadow-feature transition-shadow cursor-pointer" onClick={() => openArticle(article)}>
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="p-3 bg-nature-light rounded-lg">
                              <article.icon className="w-6 h-6 text-nature-dark" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h3 className="font-bold text-lg text-primary mb-1">
                                    {language === 'hi' ? article.titleHindi : article.title}
                                  </h3>
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Badge variant="secondary" className="text-xs">
                                      {article.category}
                                    </Badge>
                                    <Badge className={`text-xs ${getDifficultyColor(article.difficulty)}`}>
                                      {language === 'hi' ? 
                                        (article.difficulty === 'beginner' ? 'शुरुआती' : 
                                         article.difficulty === 'intermediate' ? 'मध्यम' : 'उन्नत') 
                                        : article.difficulty}
                                    </Badge>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                      <Star className="w-3 h-3 mr-1 text-yellow-500" />
                                      {article.rating}
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {article.tags.map((tag, index) => (
                                      <span key={index} className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full">
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xs text-muted-foreground mb-1">
                                    <Download className="w-3 h-3 inline mr-1" />
                                    {article.downloads.toLocaleString()}
                                  </div>
                                </div>
                              </div>
                              
                              <p className="text-sm text-foreground mb-3 line-clamp-2">
                                {language === 'hi' ? article.contentHindi : article.content}
                              </p>
                              
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    <span>{new Date(article.date).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    <span>{article.readTime} min read</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Users className="w-3 h-3 mr-1" />
                                    <span>{article.author}</span>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm" className="text-xs h-auto p-1">
                                  {language === 'hi' ? 'और पढ़ें →' : 'Read More →'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="schemes" className="mt-6">
                  <div className="space-y-4">
                    {filteredSchemes.map((scheme) => (
                      <Card key={scheme.id} className="shadow-card">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="p-3 bg-accent/20 rounded-lg">
                              <Award className="w-6 h-6 text-accent" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h3 className="font-bold text-lg text-primary mb-1">
                                    {language === 'hi' ? scheme.nameHindi : scheme.name}
                                  </h3>
                                  <p className="text-sm text-foreground mb-2">
                                    {language === 'hi' ? scheme.descriptionHindi : scheme.description}
                                  </p>
                                  <div className="flex items-center space-x-2 mb-3">
                                    <Badge className={`text-xs ${getStatusColor(scheme.status)}`}>
                                      {scheme.status.toUpperCase()}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {language === 'hi' ? 'बजट:' : 'Budget:'} {scheme.budget}
                                    </span>
                                  </div>
                                </div>
                                <Button onClick={() => applyScheme(scheme)} variant="default" size="sm">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  {language === 'hi' ? 'आवेदन करें' : 'Apply'}
                                </Button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <h4 className="font-semibold text-nature-dark mb-2">
                                    {language === 'hi' ? 'पात्रता:' : 'Eligibility:'}
                                  </h4>
                                  <ul className="space-y-1">
                                    {(language === 'hi' ? scheme.eligibilityHindi : scheme.eligibility).map((item, index) => (
                                      <li key={index} className="text-xs text-foreground flex items-start">
                                        <div className="w-1 h-1 bg-nature-medium rounded-full mr-2 mt-2 flex-shrink-0"></div>
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-accent mb-2">
                                    {language === 'hi' ? 'लाभ:' : 'Benefits:'}
                                  </h4>
                                  <ul className="space-y-1">
                                    {(language === 'hi' ? scheme.benefitsHindi : scheme.benefits).map((item, index) => (
                                      <li key={index} className="text-xs text-foreground flex items-start">
                                        <div className="w-1 h-1 bg-accent rounded-full mr-2 mt-2 flex-shrink-0"></div>
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              <div className="border-t pt-3">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-muted-foreground">
                                  <div>
                                    <span className="font-medium">{language === 'hi' ? 'मंत्रालय:' : 'Ministry:'}</span> {scheme.ministry}
                                  </div>
                                  <div>
                                    <span className="font-medium">{language === 'hi' ? 'समय सीमा:' : 'Deadline:'}</span> {scheme.deadline}
                                  </div>
                                  <div>
                                    <span className="font-medium">{language === 'hi' ? 'आवेदन:' : 'Apply:'}</span> 
                                    <span className="text-primary"> {language === 'hi' ? 'ऑनलाइन/ऑफलाइन' : 'Online/Offline'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="tutorials" className="mt-6">
                  <div className="space-y-4">
                    {filteredTutorials.map((tutorial) => (
                      <Card key={tutorial.id} className="shadow-card hover:shadow-feature transition-shadow cursor-pointer" onClick={() => watchTutorial(tutorial)}>
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                              <BookOpen className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h3 className="font-bold text-lg text-primary mb-1">
                                    {language === 'hi' ? tutorial.titleHindi : tutorial.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {language === 'hi' ? tutorial.descriptionHindi : tutorial.description}
                                  </p>
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Badge variant="secondary" className="text-xs">
                                      {tutorial.category}
                                    </Badge>
                                    <Badge className={`text-xs ${getDifficultyColor(tutorial.level)}`}>
                                      {language === 'hi' ? 
                                        (tutorial.level === 'beginner' ? 'शुरुआती' : 
                                         tutorial.level === 'intermediate' ? 'मध्यम' : 'उन्नत') 
                                        : tutorial.level}
                                    </Badge>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {tutorial.duration}
                                    </div>
                                  </div>
                                </div>
                                <Button variant="default" size="sm">
                                  <BookOpen className="w-4 h-4 mr-2" />
                                  {language === 'hi' ? 'देखें' : 'Watch'}
                                </Button>
                              </div>
                              
                              <div className="mb-3">
                                <h4 className="font-semibold text-sm mb-2">
                                  {language === 'hi' ? 'चरण:' : 'Steps:'}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                                  {(language === 'hi' ? tutorial.stepsHindi : tutorial.steps).slice(0, 4).map((step, index) => (
                                    <div key={index} className="text-xs text-foreground flex items-center">
                                      <span className="w-4 h-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center mr-2 text-xs font-bold">
                                        {index + 1}
                                      </span>
                                      {step}
                                    </div>
                                  ))}
                                </div>
                                {(language === 'hi' ? tutorial.stepsHindi : tutorial.steps).length > 4 && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    +{(language === 'hi' ? tutorial.stepsHindi : tutorial.steps).length - 4} more steps
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              {/* No Results */}
              {((activeTab === 'articles' && filteredArticles.length === 0) || 
                (activeTab === 'schemes' && filteredSchemes.length === 0) ||
                (activeTab === 'tutorials' && filteredTutorials.length === 0)) && (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm 
                      ? (language === 'hi' ? "आपकी खोज के लिए कोई परिणाम नहीं मिला" : "No results found for your search")
                      : (language === 'hi' ? `कोई ${activeTab} उपलब्ध नहीं` : `No ${activeTab} available`)
                    }
                  </p>
                  {searchTerm && (
                    <Button 
                      variant="outline" 
                      onClick={() => setSearchTerm("")}
                      className="mt-4"
                    >
                      {language === 'hi' ? 'खोज साफ़ करें' : 'Clear Search'}
                    </Button>
                  )}
                </div>
              )}
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default KnowledgeHub;
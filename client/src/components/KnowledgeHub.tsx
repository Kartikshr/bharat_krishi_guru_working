import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Search, FileText, Award, Users, Calendar, Download, ExternalLink, Star, Clock, Tag, Filter, Play, CheckCircle, AlertCircle, Info } from "lucide-react";
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
  fullContent: string;
  fullContentHindi: string;
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
  documents: string[];
  documentsHindi: string[];
  applicationSteps: string[];
  applicationStepsHindi: string[];
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
  materials: string[];
  materialsHindi: string[];
  tips: string[];
  tipsHindi: string[];
}

const KnowledgeHub = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<'articles' | 'schemes' | 'tutorials'>('articles');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const { toast } = useToast();
  const { selectedLocation } = useLocation();
  const { language, t } = useLanguage();

  const articles: Article[] = [
    {
      id: 1,
      title: "Organic Farming Best Practices",
      titleHindi: `${selectedLocation} में जैविक खेती की सर्वोत्तम प्रथाएं`,
      category: "Organic Farming",
      content: `Learn sustainable farming techniques specific to ${selectedLocation} that improve soil health and crop yield while protecting the environment.`,
      contentHindi: `${selectedLocation} के लिए विशिष्ट टिकाऊ कृषि तकनीकें सीखें जो मिट्टी के स्वास्थ्य और फसल की उपज में सुधार करती हैं।`,
      fullContent: `# Organic Farming Best Practices for ${selectedLocation}

## Introduction
Organic farming is becoming increasingly important in ${selectedLocation} as farmers seek sustainable alternatives to conventional agriculture. This comprehensive guide covers all aspects of organic farming suitable for local conditions.

## Soil Health Management
- **Composting**: Create nutrient-rich compost using farm waste, kitchen scraps, and green materials
- **Crop Rotation**: Implement 3-4 year rotation cycles to maintain soil fertility
- **Cover Crops**: Use leguminous plants to fix nitrogen naturally
- **Mulching**: Apply organic mulch to retain moisture and suppress weeds

## Natural Pest Control
- **Beneficial Insects**: Encourage ladybugs, lacewings, and parasitic wasps
- **Companion Planting**: Use marigolds, basil, and neem plants as natural repellents
- **Organic Sprays**: Prepare neem oil, garlic, and soap-based solutions
- **Physical Barriers**: Install row covers and sticky traps

## Certification Process
1. Contact local certification agency
2. Submit application with farm details
3. Undergo inspection process
4. Maintain detailed records
5. Receive organic certificate

## Economic Benefits
- Premium prices (20-30% higher than conventional)
- Reduced input costs over time
- Access to organic markets
- Government subsidies and support

## Challenges and Solutions
- **Initial Yield Drop**: Expect 10-20% reduction in first 2-3 years
- **Pest Management**: Requires more attention and diverse strategies
- **Market Access**: Build relationships with organic buyers
- **Certification Costs**: Government schemes provide financial support`,
      fullContentHindi: `# ${selectedLocation} के लिए जैविक खेती की सर्वोत्तम प्रथाएं

## परिचय
${selectedLocation} में जैविक खेती तेजी से महत्वपूर्ण होती जा रही है क्योंकि किसान पारंपरिक कृषि के टिकाऊ विकल्प तलाश रहे हैं। यह व्यापक गाइड स्थानीय परिस्थितियों के लिए उपयुक्त जैविक खेती के सभी पहलुओं को कवर करती है।

## मिट्टी स्वास्थ्य प्रबंधन
- **कंपोस्टिंग**: खेत के कचरे, रसोई के स्क्रैप और हरी सामग्री का उपयोग करके पोषक तत्वों से भरपूर कंपोस्ट बनाएं
- **फसल चक्र**: मिट्टी की उर्वरता बनाए रखने के लिए 3-4 साल के रोटेशन चक्र लागू करें
- **कवर फसलें**: नाइट्रोजन को प्राकृतिक रूप से स्थिर करने के लिए दलहनी पौधों का उपयोग करें
- **मल्चिंग**: नमी बनाए रखने और खरपतवार को दबाने के लिए जैविक मल्च लगाएं

## प्राकृतिक कीट नियंत्रण
- **लाभकारी कीड़े**: लेडीबग्स, लेसविंग्स और परजीवी ततैया को प्रोत्साहित करें
- **साथी रोपण**: प्राकृतिक प्रतिकर्षक के रूप में गेंदा, तुलसी और नीम के पौधों का उपयोग करें
- **जैविक स्प्रे**: नीम का तेल, लहसुन और साबुन आधारित समाधान तैयार करें
- **भौतिक बाधाएं**: रो कवर और चिपचिपे जाल स्थापित करें

## प्रमाणन प्रक्रिया
1. स्थानीय प्रमाणन एजेंसी से संपर्क करें
2. खेत के विवरण के साथ आवेदन जमा करें
3. निरीक्षण प्रक्रिया से गुजरें
4. विस्तृत रिकॉर्ड बनाए रखें
5. जैविक प्रमाणपत्र प्राप्त करें

## आर्थिक लाभ
- प्रीमियम कीमतें (पारंपरिक से 20-30% अधिक)
- समय के साथ कम इनपुट लागत
- जैविक बाजारों तक पहुंच
- सरकारी सब्सिडी और सहायता

## चुनौतियां और समाधान
- **प्रारंभिक उपज में गिरावट**: पहले 2-3 वर्षों में 10-20% कमी की अपेक्षा करें
- **कीट प्रबंधन**: अधिक ध्यान और विविध रणनीतियों की आवश्यकता
- **बाजार पहुंच**: जैविक खरीदारों के साथ संबंध बनाएं
- **प्रमाणन लागत**: सरकारी योजनाएं वित्तीय सहायता प्रदान करती हैं`,
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
      content: `Effective strategies to control pests in ${selectedLocation} using biological, cultural, and chemical methods in harmony.`,
      contentHindi: `जैविक, सांस्कृतिक और रासायनिक विधियों का सामंजस्यपूर्ण उपयोग करके ${selectedLocation} में कीटों को नियंत्रित करने की प्रभावी रणनीतियां।`,
      fullContent: `# Integrated Pest Management (IPM) for ${selectedLocation}

## Understanding IPM
Integrated Pest Management is a holistic approach that combines multiple pest control strategies to manage pest populations effectively while minimizing environmental impact.

## IPM Components

### 1. Cultural Control
- **Crop Rotation**: Break pest life cycles by rotating crops
- **Sanitation**: Remove crop residues and weeds that harbor pests
- **Timing**: Plant at optimal times to avoid peak pest periods
- **Resistant Varieties**: Choose pest-resistant crop varieties

### 2. Biological Control
- **Natural Predators**: Encourage birds, spiders, and beneficial insects
- **Parasitoids**: Release Trichogramma wasps for bollworm control
- **Microbials**: Use Bacillus thuringiensis (Bt) for caterpillar control
- **Botanical Pesticides**: Apply neem, pyrethrum, and rotenone

### 3. Mechanical Control
- **Traps**: Use pheromone traps, light traps, and sticky traps
- **Barriers**: Install row covers and copper strips
- **Hand Picking**: Remove large pests manually
- **Cultivation**: Disrupt pest habitats through tillage

### 4. Chemical Control (Last Resort)
- **Selective Pesticides**: Use targeted chemicals that spare beneficial insects
- **Rotation**: Alternate between different chemical classes
- **Timing**: Apply at pest-vulnerable life stages
- **Dosage**: Use minimum effective concentrations

## Monitoring and Thresholds
- **Regular Scouting**: Inspect crops weekly for pest presence
- **Economic Thresholds**: Determine when pest levels justify treatment
- **Weather Monitoring**: Track conditions favorable for pest outbreaks
- **Record Keeping**: Maintain detailed pest management logs

## IPM for Common Pests in ${selectedLocation}
- **Aphids**: Use reflective mulches, release ladybugs, apply insecticidal soap
- **Bollworm**: Deploy pheromone traps, release Trichogramma, use Bt sprays
- **Whitefly**: Install yellow sticky traps, encourage natural enemies, use neem oil
- **Thrips**: Use blue sticky traps, maintain field hygiene, apply predatory mites`,
      fullContentHindi: `# ${selectedLocation} के लिए एकीकृत कीट प्रबंधन (IPM)

## IPM को समझना
एकीकृत कीट प्रबंधन एक समग्र दृष्टिकोण है जो पर्यावरणीय प्रभाव को कम करते हुए कीट आबादी को प्रभावी रूप से प्रबंधित करने के लिए कई कीट नियंत्रण रणनीतियों को जोड़ता है।

## IPM घटक

### 1. सांस्कृतिक नियंत्रण
- **फसल चक्र**: फसलों को घुमाकर कीट जीवन चक्र को तोड़ें
- **सफाई**: कीटों को आश्रय देने वाले फसल अवशेष और खरपतवार हटाएं
- **समय**: कीट के चरम काल से बचने के लिए इष्टतम समय पर बुआई करें
- **प्रतिरोधी किस्में**: कीट-प्रतिरोधी फसल किस्मों का चयन करें

### 2. जैविक नियंत्रण
- **प्राकृतिक शिकारी**: पक्षियों, मकड़ियों और लाभकारी कीड़ों को प्रोत्साहित करें
- **परजीवी**: बॉलवर्म नियंत्रण के लिए ट्राइकोग्रामा ततैया छोड़ें
- **माइक्रोबियल**: कैटरपिलर नियंत्रण के लिए बैसिलस थुरिंजिएंसिस (Bt) का उपयोग करें
- **वनस्पति कीटनाशक**: नीम, पायरेथ्रम और रोटेनोन लगाएं

### 3. यांत्रिक नियंत्रण
- **जाल**: फेरोमोन ट्रैप, लाइट ट्रैप और चिपचिपे जाल का उपयोग करें
- **बाधाएं**: रो कवर और कॉपर स्ट्रिप्स स्थापित करें
- **हाथ से चुनना**: बड़े कीटों को मैन्युअल रूप से हटाएं
- **खेती**: जुताई के माध्यम से कीट आवासों को बाधित करें

### 4. रासायनिक नियंत्रण (अंतिम उपाय)
- **चुनिंदा कीटनाशक**: लक्षित रसायनों का उपयोग करें जो लाभकारी कीड़ों को बख्शते हैं
- **रोटेशन**: विभिन्न रासायनिक वर्गों के बीच बारी-बारी से उपयोग करें
- **समय**: कीट-संवेदनशील जीवन चरणों में लागू करें
- **खुराक**: न्यूनतम प्रभावी सांद्रता का उपयोग करें

## निगरानी और सीमा
- **नियमित स्काउटिंग**: कीट उपस्थिति के लिए साप्ताहिक फसल निरीक्षण
- **आर्थिक सीमा**: निर्धारित करें कि कब कीट स्तर उपचार को उचित ठहराते हैं
- **मौसम निगरानी**: कीट प्रकोप के लिए अनुकूल परिस्थितियों को ट्रैक करें
- **रिकॉर्ड रखना**: विस्तृत कीट प्रबंधन लॉग बनाए रखें

## ${selectedLocation} में सामान्य कीटों के लिए IPM
- **एफिड्स**: परावर्तक मल्च का उपयोग करें, लेडीबग्स छोड़ें, कीटनाशक साबुन लगाएं
- **बॉलवर्म**: फेरोमोन ट्रैप तैनात करें, ट्राइकोग्रामा छोड़ें, Bt स्प्रे का उपयोग करें
- **व्हाइटफ्लाई**: पीले चिपचिपे जाल स्थापित करें, प्राकृतिक दुश्मनों को प्रोत्साहित करें, नीम का तेल उपयोग करें
- **थ्रिप्स**: नीले चिपचिपे जाल का उपयोग करें, खेत की स्वच्छता बनाए रखें, शिकारी माइट्स लगाएं`,
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
      content: `Modern irrigation methods and water-saving techniques for efficient farming in ${selectedLocation}.`,
      contentHindi: `${selectedLocation} में कुशल कृषि के लिए आधुनिक सिंचाई विधियां और जल-बचत तकनीकें।`,
      fullContent: `# Water Conservation Techniques for ${selectedLocation}

## Introduction
Water scarcity is a growing concern in ${selectedLocation}. This guide provides practical solutions for efficient water use in agriculture.

## Drip Irrigation System
### Benefits
- 30-50% water savings compared to flood irrigation
- Reduced weed growth
- Better nutrient uptake
- Suitable for all crop types

### Installation Steps
1. **Planning**: Map your field and calculate water requirements
2. **Components**: Main line, sub-main, laterals, emitters, filters
3. **Installation**: Lay pipes according to crop spacing
4. **Testing**: Check for leaks and uniform water distribution
5. **Maintenance**: Regular cleaning and replacement of parts

## Sprinkler Irrigation
- **Portable Systems**: Easy to move between fields
- **Fixed Systems**: Permanent installation for large areas
- **Micro-sprinklers**: For closely spaced crops
- **Impact Sprinklers**: For field crops and orchards

## Rainwater Harvesting
### Farm Ponds
- Collect rainwater during monsoon
- Store water for dry periods
- Support fish farming as additional income
- Recharge groundwater naturally

### Roof Water Harvesting
- Collect water from farm buildings
- Store in tanks for irrigation
- Filter for drinking water use
- Reduce dependency on groundwater

## Smart Irrigation Scheduling
- **Soil Moisture Sensors**: Monitor soil water content
- **Weather-based Scheduling**: Adjust irrigation based on rainfall forecast
- **Crop Growth Stage**: Vary water application according to plant needs
- **Evapotranspiration Data**: Use ET rates for precise scheduling

## Water-Efficient Crops
- **Drought-tolerant Varieties**: Choose crops adapted to local conditions
- **Millets**: Require less water than rice and wheat
- **Pulses**: Fix nitrogen and need moderate water
- **Horticulture**: High-value crops with efficient water use`,
      fullContentHindi: `# ${selectedLocation} के लिए जल संरक्षण तकनीकें

## परिचय
${selectedLocation} में पानी की कमी एक बढ़ती चिंता है। यह गाइड कृषि में कुशल पानी के उपयोग के लिए व्यावहारिक समाधान प्रदान करती है।

## ड्रिप सिंचाई प्रणाली
### लाभ
- बाढ़ सिंचाई की तुलना में 30-50% पानी की बचत
- खरपतवार की वृद्धि में कमी
- बेहतर पोषक तत्व अवशोषण
- सभी फसल प्रकारों के लिए उपयुक्त

### स्थापना चरण
1. **योजना**: अपने खेत का नक्शा बनाएं और पानी की आवश्यकताओं की गणना करें
2. **घटक**: मुख्य लाइन, सब-मेन, लेटरल, एमिटर, फिल्टर
3. **स्थापना**: फसल की दूरी के अनुसार पाइप बिछाएं
4. **परीक्षण**: रिसाव और समान पानी वितरण की जांच करें
5. **रखरखाव**: नियमित सफाई और भागों का प्रतिस्थापन

## स्प्रिंकलर सिंचाई
- **पोर्टेबल सिस्टम**: खेतों के बीच आसानी से स्थानांतरित करना
- **फिक्स्ड सिस्टम**: बड़े क्षेत्रों के लिए स्थायी स्थापना
- **माइक्रो-स्प्रिंकलर**: निकट दूरी की फसलों के लिए
- **इम्पैक्ट स्प्रिंकलर**: खेत की फसलों और बागों के लिए

## वर्षा जल संचयन
### खेत तालाब
- मानसून के दौरान वर्षा जल एकत्र करें
- सूखे की अवधि के लिए पानी स्टोर करें
- अतिरिक्त आय के रूप में मछली पालन का समर्थन करें
- भूजल को प्राकृतिक रूप से रिचार्ज करें

### छत जल संचयन
- खेत की इमारतों से पानी एकत्र करें
- सिंचाई के लिए टैंकों में स्टोर करें
- पीने के पानी के उपयोग के लिए फिल्टर करें
- भूजल पर निर्भरता कम करें

## स्मार्ट सिंचाई शेड्यूलिंग
- **मिट्टी नमी सेंसर**: मिट्टी के पानी की मात्रा की निगरानी करें
- **मौसम-आधारित शेड्यूलिंग**: बारिश के पूर्वानुमान के आधार पर सिंचाई समायोजित करें
- **फसल वृद्धि चरण**: पौधे की जरूरतों के अनुसार पानी का अनुप्रयोग बदलें
- **वाष्पोत्सर्जन डेटा**: सटीक शेड्यूलिंग के लिए ET दरों का उपयोग करें

## जल-कुशल फसलें
- **सूखा-सहनशील किस्में**: स्थानीय परिस्थितियों के अनुकूल फसलों का चयन करें
- **मिलेट्स**: चावल और गेहूं से कम पानी की आवश्यकता
- **दालें**: नाइट्रोजन स्थिर करती हैं और मध्यम पानी की जरूरत
- **बागवानी**: कुशल पानी के उपयोग के साथ उच्च मूल्य फसलें`,
      readTime: 10,
      date: "2024-12-15",
      icon: BookOpen,
      tags: ["irrigation", "water-conservation", "drip-irrigation", "smart-farming"],
      difficulty: 'intermediate',
      rating: 4.7,
      downloads: 1450,
      author: "Dr. Amit Patel"
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
      status: 'active',
      documents: ["Aadhaar Card", "Bank Account Details", "Land Records", "Mobile Number"],
      documentsHindi: ["आधार कार्ड", "बैंक खाता विवरण", "भूमि रिकॉर्ड", "मोबाइल नंबर"],
      applicationSteps: [
        "Visit pmkisan.gov.in website",
        "Click on 'New Farmer Registration'",
        "Fill personal and bank details",
        "Upload required documents",
        "Submit application",
        "Note registration number for tracking"
      ],
      applicationStepsHindi: [
        "pmkisan.gov.in वेबसाइट पर जाएं",
        "'नया किसान पंजीकरण' पर क्लिक करें",
        "व्यक्तिगत और बैंक विवरण भरें",
        "आवश्यक दस्तावेज अपलोड करें",
        "आवेदन जमा करें",
        "ट्रैकिंग के लिए पंजीकरण संख्या नोट करें"
      ]
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
      status: 'active',
      documents: ["Aadhaar Card", "Land Records", "Bank Account Details", "Sowing Certificate"],
      documentsHindi: ["आधार कार्ड", "भूमि रिकॉर्ड", "बैंक खाता विवरण", "बुआई प्रमाणपत्र"],
      applicationSteps: [
        "Visit your bank or CSC center",
        "Fill crop insurance application form",
        "Submit required documents",
        "Pay farmer's share of premium",
        "Receive insurance policy document",
        "Keep policy number for claims"
      ],
      applicationStepsHindi: [
        "अपने बैंक या CSC केंद्र पर जाएं",
        "फसल बीमा आवेदन फॉर्म भरें",
        "आवश्यक दस्तावेज जमा करें",
        "प्रीमियम का किसान हिस्सा भुगतान करें",
        "बीमा पॉलिसी दस्तावेज प्राप्त करें",
        "दावों के लिए पॉलिसी नंबर रखें"
      ]
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
        "Plan your irrigation layout based on crop spacing",
        "Calculate water requirements for your crops",
        "Install main supply line from water source",
        "Set up sub-main lines and laterals",
        "Install drip emitters at plant locations",
        "Test the system for uniform water distribution",
        "Schedule irrigation timing based on crop needs",
        "Maintain system with regular cleaning"
      ],
      stepsHindi: [
        "फसल की दूरी के आधार पर अपने सिंचाई लेआउट की योजना बनाएं",
        "अपनी फसलों के लिए पानी की आवश्यकताओं की गणना करें",
        "पानी के स्रोत से मुख्य आपूर्ति लाइन स्थापित करें",
        "सब-मेन लाइन और लेटरल सेट करें",
        "पौधे के स्थानों पर ड्रिप एमिटर स्थापित करें",
        "समान पानी वितरण के लिए सिस्टम का परीक्षण करें",
        "फसल की जरूरतों के आधार पर सिंचाई समय निर्धारित करें",
        "नियमित सफाई के साथ सिस्टम बनाए रखें"
      ],
      materials: ["PVC pipes", "Drip emitters", "Filters", "Pressure regulators", "Connectors", "Timer system"],
      materialsHindi: ["PVC पाइप", "ड्रिप एमिटर", "फिल्टर", "प्रेशर रेगुलेटर", "कनेक्टर", "टाइमर सिस्टम"],
      tips: [
        "Start with a small area to test the system",
        "Use pressure compensating emitters for uniform flow",
        "Install filters to prevent clogging",
        "Schedule irrigation during early morning or evening"
      ],
      tipsHindi: [
        "सिस्टम का परीक्षण करने के लिए छोटे क्षेत्र से शुरू करें",
        "समान प्रवाह के लिए प्रेशर कंपेंसेटिंग एमिटर का उपयोग करें",
        "रुकावट को रोकने के लिए फिल्टर स्थापित करें",
        "सुबह जल्दी या शाम के दौरान सिंचाई शेड्यूल करें"
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
        "Collect organic waste materials (green and brown)",
        "Create compost pile with proper layering",
        "Maintain proper moisture (50-60%)",
        "Turn the pile every 2-3 weeks",
        "Monitor temperature (130-160°F)",
        "Add beneficial microorganisms",
        "Harvest finished compost after 3-6 months",
        "Screen and store compost properly"
      ],
      stepsHindi: [
        "जैविक अपशिष्ट सामग्री एकत्र करें (हरी और भूरी)",
        "उचित परतों के साथ कंपोस्ट ढेर बनाएं",
        "उचित नमी बनाए रखें (50-60%)",
        "हर 2-3 सप्ताह में ढेर को पलटें",
        "तापमान की निगरानी करें (130-160°F)",
        "लाभकारी सूक्ष्मजीव जोड़ें",
        "3-6 महीने बाद तैयार कंपोस्ट की कटाई करें",
        "कंपोस्ट को ठीक से छानें और स्टोर करें"
      ],
      materials: ["Organic waste", "Compost bin or area", "Thermometer", "Pitchfork", "Water source", "Beneficial microbes"],
      materialsHindi: ["जैविक कचरा", "कंपोस्ट बिन या क्षेत्र", "थर्मामीटर", "पिचफोर्क", "पानी का स्रोत", "लाभकारी सूक्ष्मजीव"],
      tips: [
        "Maintain 3:1 ratio of brown to green materials",
        "Keep compost pile moist but not waterlogged",
        "Turn regularly for proper aeration",
        "Add earthworms to speed up decomposition"
      ],
      tipsHindi: [
        "भूरी से हरी सामग्री का 3:1 अनुपात बनाए रखें",
        "कंपोस्ट ढेर को नम रखें लेकिन जलभराव न करें",
        "उचित वायु संचार के लिए नियमित रूप से पलटें",
        "अपघटन को तेज करने के लिए केंचुए जोड़ें"
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
    setSelectedArticle(article);
  };

  const applyScheme = (scheme: Scheme) => {
    setSelectedScheme(scheme);
  };

  const watchTutorial = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
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
                      <Card key={scheme.id} className="shadow-card hover:shadow-feature transition-shadow cursor-pointer" onClick={() => applyScheme(scheme)}>
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
                                <Button variant="default" size="sm">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  {language === 'hi' ? 'विवरण देखें' : 'View Details'}
                                </Button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <h4 className="font-semibold text-nature-dark mb-2">
                                    {language === 'hi' ? 'पात्रता:' : 'Eligibility:'}
                                  </h4>
                                  <ul className="space-y-1">
                                    {(language === 'hi' ? scheme.eligibilityHindi : scheme.eligibility).slice(0, 3).map((item, index) => (
                                      <li key={index} className="text-xs text-foreground flex items-start">
                                        <CheckCircle className="w-3 h-3 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
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
                                    {(language === 'hi' ? scheme.benefitsHindi : scheme.benefits).slice(0, 3).map((item, index) => (
                                      <li key={index} className="text-xs text-foreground flex items-start">
                                        <Star className="w-3 h-3 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
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
                              <Play className="w-6 h-6 text-blue-600" />
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
                                  <Play className="w-4 h-4 mr-2" />
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

        {/* Article Detail Modal */}
        <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary" />
                {selectedArticle && (language === 'hi' ? selectedArticle.titleHindi : selectedArticle.title)}
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
              {selectedArticle && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Badge variant="secondary">{selectedArticle.category}</Badge>
                    <Badge className={getDifficultyColor(selectedArticle.difficulty)}>
                      {language === 'hi' ? 
                        (selectedArticle.difficulty === 'beginner' ? 'शुरुआती' : 
                         selectedArticle.difficulty === 'intermediate' ? 'मध्यम' : 'उन्नत') 
                        : selectedArticle.difficulty}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      {selectedArticle.readTime} min read
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      {selectedArticle.rating}
                    </div>
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap">
                      {language === 'hi' ? selectedArticle.fullContentHindi : selectedArticle.fullContent}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{selectedArticle.author}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        {language === 'hi' ? 'डाउनलोड' : 'Download'}
                      </Button>
                      <Button variant="default" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {language === 'hi' ? 'साझा करें' : 'Share'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Scheme Detail Modal */}
        <Dialog open={!!selectedScheme} onOpenChange={() => setSelectedScheme(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2 text-accent" />
                {selectedScheme && (language === 'hi' ? selectedScheme.nameHindi : selectedScheme.name)}
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
              {selectedScheme && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(selectedScheme.status)}>
                      {selectedScheme.status.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {language === 'hi' ? 'बजट:' : 'Budget:'} {selectedScheme.budget}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      {language === 'hi' ? 'योजना विवरण' : 'Scheme Description'}
                    </h3>
                    <p className="text-foreground">
                      {language === 'hi' ? selectedScheme.descriptionHindi : selectedScheme.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-nature-dark mb-3 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {language === 'hi' ? 'पात्रता मानदंड' : 'Eligibility Criteria'}
                      </h4>
                      <ul className="space-y-2">
                        {(language === 'hi' ? selectedScheme.eligibilityHindi : selectedScheme.eligibility).map((item, index) => (
                          <li key={index} className="text-sm text-foreground flex items-start">
                            <div className="w-2 h-2 bg-nature-medium rounded-full mr-3 mt-2 flex-shrink-0"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-accent mb-3 flex items-center">
                        <Star className="w-4 h-4 mr-2" />
                        {language === 'hi' ? 'योजना के लाभ' : 'Scheme Benefits'}
                      </h4>
                      <ul className="space-y-2">
                        {(language === 'hi' ? selectedScheme.benefitsHindi : selectedScheme.benefits).map((item, index) => (
                          <li key={index} className="text-sm text-foreground flex items-start">
                            <div className="w-2 h-2 bg-accent rounded-full mr-3 mt-2 flex-shrink-0"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-primary mb-3 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      {language === 'hi' ? 'आवश्यक दस्तावेज' : 'Required Documents'}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {(language === 'hi' ? selectedScheme.documentsHindi : selectedScheme.documents).map((doc, index) => (
                        <div key={index} className="p-2 bg-muted rounded-lg text-center">
                          <FileText className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                          <span className="text-xs">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-primary mb-3 flex items-center">
                      <Info className="w-4 h-4 mr-2" />
                      {language === 'hi' ? 'आवेदन प्रक्रिया' : 'Application Process'}
                    </h4>
                    <div className="space-y-3">
                      {(language === 'hi' ? selectedScheme.applicationStepsHindi : selectedScheme.applicationSteps).map((step, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <p className="text-sm text-foreground flex-1">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-accent/10 p-4 rounded-lg">
                    <h4 className="font-semibold text-accent mb-2">
                      {language === 'hi' ? 'आवेदन कैसे करें' : 'How to Apply'}
                    </h4>
                    <p className="text-sm text-foreground">
                      {language === 'hi' ? selectedScheme.applicationHindi : selectedScheme.application}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      {language === 'hi' ? 'समय सीमा:' : 'Deadline:'} {selectedScheme.deadline}
                    </div>
                    <Button variant="default">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {language === 'hi' ? 'अभी आवेदन करें' : 'Apply Now'}
                    </Button>
                  </div>
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Tutorial Detail Modal */}
        <Dialog open={!!selectedTutorial} onOpenChange={() => setSelectedTutorial(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Play className="w-5 h-5 mr-2 text-blue-600" />
                {selectedTutorial && (language === 'hi' ? selectedTutorial.titleHindi : selectedTutorial.title)}
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
              {selectedTutorial && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{selectedTutorial.category}</Badge>
                    <Badge className={getDifficultyColor(selectedTutorial.level)}>
                      {language === 'hi' ? 
                        (selectedTutorial.level === 'beginner' ? 'शुरुआती' : 
                         selectedTutorial.level === 'intermediate' ? 'मध्यम' : 'उन्नत') 
                        : selectedTutorial.level}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      {selectedTutorial.duration}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      {language === 'hi' ? 'विवरण' : 'Description'}
                    </h3>
                    <p className="text-foreground">
                      {language === 'hi' ? selectedTutorial.descriptionHindi : selectedTutorial.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-primary mb-3 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      {language === 'hi' ? 'आवश्यक सामग्री' : 'Required Materials'}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {(language === 'hi' ? selectedTutorial.materialsHindi : selectedTutorial.materials).map((material, index) => (
                        <div key={index} className="p-2 bg-muted rounded-lg text-center">
                          <span className="text-sm">{material}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-primary mb-3 flex items-center">
                      <Info className="w-4 h-4 mr-2" />
                      {language === 'hi' ? 'चरणबद्ध निर्देश' : 'Step-by-Step Instructions'}
                    </h4>
                    <div className="space-y-3">
                      {(language === 'hi' ? selectedTutorial.stepsHindi : selectedTutorial.steps).map((step, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <p className="text-sm text-foreground flex-1">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      {language === 'hi' ? 'उपयोगी सुझाव' : 'Helpful Tips'}
                    </h4>
                    <ul className="space-y-1">
                      {(language === 'hi' ? selectedTutorial.tipsHindi : selectedTutorial.tips).map((tip, index) => (
                        <li key={index} className="text-sm text-blue-800 flex items-start">
                          <div className="w-1 h-1 bg-blue-600 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      {language === 'hi' ? 'अवधि:' : 'Duration:'} {selectedTutorial.duration}
                    </div>
                    <Button variant="default">
                      <Play className="w-4 h-4 mr-2" />
                      {language === 'hi' ? 'वीडियो देखें' : 'Watch Video'}
                    </Button>
                  </div>
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default KnowledgeHub;
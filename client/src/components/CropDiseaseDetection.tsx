import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Camera, Loader2, CheckCircle, AlertTriangle, Zap, Leaf, Shield, Clock, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { analyzeCrop } from "@/lib/cropAnalysis";

interface DiseaseAnalysis {
  disease: string;
  confidence: number;
  description: string;
  symptoms: string[];
  causes: string[];
  treatments: {
    immediate: string[];
    chemical: string[];
    organic: string[];
    cultural: string[];
  };
  prevention: string[];
  cost_estimate: string;
  timeline: string;
}

const CropDiseaseDetection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiseaseAnalysis | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const { toast } = useToast();
  const { language } = useLanguage();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file (JPG, PNG, etc.)",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 10MB",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
      setResult(null);
      setAnalysisProgress(0);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      toast({
        title: "Image Selected",
        description: `Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
      });
    }
  };

  const analyzeCropImage = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const prediction = await analyzeCrop(selectedFile);

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      if (prediction) {
        setResult(prediction);
        toast({
          title: "Analysis Complete",
          description: `Detected: ${prediction.disease} (${prediction.confidence}% confidence)`,
        });
      }
    } catch (error) {
      console.error("Analysis error details:", error);
      toast({
        title: "Analysis Failed",
        description: "Error analyzing crop image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setAnalysisProgress(0);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 80) return "bg-green-100 border-green-300";
    if (confidence >= 60) return "bg-yellow-100 border-yellow-300";
    return "bg-red-100 border-red-300";
  };

  const getTreatmentIcon = (type: string) => {
    switch (type) {
      case 'immediate': return Zap;
      case 'chemical': return AlertTriangle;
      case 'organic': return Leaf;
      case 'cultural': return Shield;
      default: return CheckCircle;
    }
  };

  const getTreatmentColor = (type: string) => {
    switch (type) {
      case 'immediate': return "text-red-600";
      case 'chemical': return "text-orange-600";
      case 'organic': return "text-green-600";
      case 'cultural': return "text-blue-600";
      default: return "text-gray-600";
    }
  };

  return (
    <section id="crop-detection" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Camera className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {language === 'hi' ? 'फसल रोग पहचान' : 'Crop Disease Detection'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'hi' 
              ? 'अपनी फसल की तस्वीर अपलोड करें और तुरंत AI-संचालित रोग निदान के साथ उपचार सिफारिशें प्राप्त करें'
              : 'Upload a photo of your crop and get instant AI-powered disease diagnosis with treatment recommendations'
            }
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enhanced Upload Section */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="w-5 h-5 mr-2 text-primary" />
                  {language === 'hi' ? 'फसल की तस्वीर अपलोड करें' : 'Upload Crop Image'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    id="crop-image"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label htmlFor="crop-image" className="cursor-pointer">
                    {previewUrl ? (
                      <div className="space-y-4">
                        <img 
                          src={previewUrl} 
                          alt="Crop preview" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <p className="text-sm text-muted-foreground">
                          {language === 'hi' ? 'नई तस्वीर चुनने के लिए क्लिक करें' : 'Click to select a new image'}
                        </p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg font-medium mb-2">
                          {language === 'hi' ? 'फसल की तस्वीर अपलोड करने के लिए क्लिक करें' : 'Click to upload crop image'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {language === 'hi' ? 'JPG, PNG फाइलों का समर्थन करता है (अधिकतम 10MB)' : 'Supports JPG, PNG files (max 10MB)'}
                        </p>
                      </>
                    )}
                  </label>
                </div>

                {selectedFile && (
                  <div className="space-y-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {language === 'hi' ? 'चयनित फाइल:' : 'Selected file:'}
                        </span>
                        <Button variant="outline" size="sm" onClick={resetAnalysis}>
                          {language === 'hi' ? 'रीसेट' : 'Reset'}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    </div>

                    {isAnalyzing && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{language === 'hi' ? 'विश्लेषण प्रगति:' : 'Analysis Progress:'}</span>
                          <span>{analysisProgress}%</span>
                        </div>
                        <Progress value={analysisProgress} className="w-full" />
                      </div>
                    )}

                    <Button 
                      onClick={analyzeCropImage}
                      disabled={isAnalyzing}
                      className="w-full"
                      size="lg"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {language === 'hi' ? 'विश्लेषण कर रहे हैं...' : 'Analyzing...'}
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {language === 'hi' ? 'फसल रोग का विश्लेषण करें' : 'Analyze Crop Disease'}
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Tips for better results */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    {language === 'hi' ? 'बेहतर परिणामों के लिए सुझाव:' : 'Tips for Better Results:'}
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• {language === 'hi' ? 'स्पष्ट, उच्च गुणवत्ता वाली तस्वीरें लें' : 'Take clear, high-quality photos'}</li>
                    <li>• {language === 'hi' ? 'प्रभावित पत्तियों या भागों पर फोकस करें' : 'Focus on affected leaves or parts'}</li>
                    <li>• {language === 'hi' ? 'अच्छी रोशनी में तस्वीर लें' : 'Capture in good lighting'}</li>
                    <li>• {language === 'hi' ? 'कई कोणों से तस्वीरें लें' : 'Take photos from multiple angles'}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Results Section */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-accent" />
                  {language === 'hi' ? 'विश्लेषण परिणाम' : 'Analysis Results'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    {/* Disease Identification */}
                    <div className={`p-4 rounded-lg border-2 ${getConfidenceBg(result.confidence)}`}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-lg">{result.disease}</h3>
                        <Badge className={`${getConfidenceColor(result.confidence)} bg-white`}>
                          {result.confidence}% {language === 'hi' ? 'विश्वास' : 'Confidence'}
                        </Badge>
                      </div>
                      <p className="text-sm mb-3">{result.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span>{language === 'hi' ? 'उपचार समय:' : 'Treatment Time:'} {result.timeline}</span>
                        </div>
                        <div className="flex items-center">
                          <IndianRupee className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span>{language === 'hi' ? 'अनुमानित लागत:' : 'Est. Cost:'} {result.cost_estimate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Symptoms and Causes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          {language === 'hi' ? 'लक्षण' : 'Symptoms'}
                        </h4>
                        <ul className="space-y-1">
                          {result.symptoms.map((symptom, index) => (
                            <li key={index} className="text-sm text-red-700 flex items-start">
                              <div className="w-1 h-1 bg-red-600 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                              {symptom}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          {language === 'hi' ? 'कारण' : 'Causes'}
                        </h4>
                        <ul className="space-y-1">
                          {result.causes.map((cause, index) => (
                            <li key={index} className="text-sm text-orange-700 flex items-start">
                              <div className="w-1 h-1 bg-orange-600 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                              {cause}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Treatment Options */}
                    <Tabs defaultValue="immediate" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="immediate" className="text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          {language === 'hi' ? 'तत्काल' : 'Immediate'}
                        </TabsTrigger>
                        <TabsTrigger value="organic" className="text-xs">
                          <Leaf className="w-3 h-3 mr-1" />
                          {language === 'hi' ? 'जैविक' : 'Organic'}
                        </TabsTrigger>
                        <TabsTrigger value="chemical" className="text-xs">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {language === 'hi' ? 'रासायनिक' : 'Chemical'}
                        </TabsTrigger>
                        <TabsTrigger value="cultural" className="text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          {language === 'hi' ? 'सांस्कृतिक' : 'Cultural'}
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="immediate" className="mt-4">
                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                          <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                            <Zap className="w-4 h-4 mr-2" />
                            {language === 'hi' ? 'तत्काल उपचार (आज ही करें)' : 'Immediate Treatment (Do Today)'}
                          </h4>
                          <ul className="space-y-2">
                            {result.treatments.immediate.map((treatment, index) => (
                              <li key={index} className="text-sm text-red-700 flex items-start">
                                <CheckCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                                {treatment}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </TabsContent>

                      <TabsContent value="organic" className="mt-4">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                            <Leaf className="w-4 h-4 mr-2" />
                            {language === 'hi' ? 'जैविक उपचार (पर्यावरण अनुकूल)' : 'Organic Treatment (Eco-Friendly)'}
                          </h4>
                          <ul className="space-y-2">
                            {result.treatments.organic.map((treatment, index) => (
                              <li key={index} className="text-sm text-green-700 flex items-start">
                                <Leaf className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                {treatment}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </TabsContent>

                      <TabsContent value="chemical" className="mt-4">
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            {language === 'hi' ? 'रासायनिक उपचार (सावधानी से उपयोग करें)' : 'Chemical Treatment (Use with Caution)'}
                          </h4>
                          <ul className="space-y-2">
                            {result.treatments.chemical.map((treatment, index) => (
                              <li key={index} className="text-sm text-orange-700 flex items-start">
                                <AlertTriangle className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                                {treatment}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </TabsContent>

                      <TabsContent value="cultural" className="mt-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                            <Shield className="w-4 h-4 mr-2" />
                            {language === 'hi' ? 'सांस्कृतिक नियंत्रण (दीर्घकालिक)' : 'Cultural Control (Long-term)'}
                          </h4>
                          <ul className="space-y-2">
                            {result.treatments.cultural.map((treatment, index) => (
                              <li key={index} className="text-sm text-blue-700 flex items-start">
                                <Shield className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                {treatment}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </TabsContent>
                    </Tabs>

                    {/* Prevention Tips */}
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        {language === 'hi' ? 'भविष्य में रोकथाम के उपाय' : 'Prevention Tips for Future'}
                      </h4>
                      <ul className="space-y-2">
                        {result.prevention.map((tip, index) => (
                          <li key={index} className="text-sm text-green-700 flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={resetAnalysis} className="flex-1">
                        {language === 'hi' ? 'नई तस्वीर अपलोड करें' : 'Upload New Image'}
                      </Button>
                      <Button variant="default" onClick={() => {
                        const analysisData = {
                          disease: result.disease,
                          confidence: result.confidence,
                          treatments: result.treatments,
                          prevention: result.prevention,
                          timestamp: new Date().toISOString()
                        };
                        
                        const blob = new Blob([JSON.stringify(analysisData, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `crop-analysis-${Date.now()}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                        
                        toast({
                          title: language === 'hi' ? "रिपोर्ट डाउनलोड की गई" : "Report Downloaded",
                          description: language === 'hi' ? "विश्लेषण रिपोर्ट सफलतापूर्वक डाउनलोड की गई" : "Analysis report downloaded successfully"
                        });
                      }} className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        {language === 'hi' ? 'रिपोर्ट डाउनलोड करें' : 'Download Report'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Camera className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {language === 'hi' 
                        ? 'विश्लेषण परिणाम देखने के लिए एक तस्वीर अपलोड करें'
                        : 'Upload an image to see analysis results'
                      }
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="text-center">
                        <CheckCircle className="w-6 h-6 mx-auto mb-1 text-green-500" />
                        <p>{language === 'hi' ? 'AI-संचालित निदान' : 'AI-Powered Diagnosis'}</p>
                      </div>
                      <div className="text-center">
                        <Leaf className="w-6 h-6 mx-auto mb-1 text-green-500" />
                        <p>{language === 'hi' ? 'जैविक समाधान' : 'Organic Solutions'}</p>
                      </div>
                      <div className="text-center">
                        <Shield className="w-6 h-6 mx-auto mb-1 text-blue-500" />
                        <p>{language === 'hi' ? 'रोकथाम सुझाव' : 'Prevention Tips'}</p>
                      </div>
                      <div className="text-center">
                        <IndianRupee className="w-6 h-6 mx-auto mb-1 text-green-500" />
                        <p>{language === 'hi' ? 'लागत अनुमान' : 'Cost Estimate'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Disease Detection Statistics */}
          <Card className="mt-8 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                {language === 'hi' ? 'रोग पहचान आंकड़े' : 'Disease Detection Statistics'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">95%</div>
                  <div className="text-sm text-green-700">{language === 'hi' ? 'सटीकता दर' : 'Accuracy Rate'}</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">50+</div>
                  <div className="text-sm text-blue-700">{language === 'hi' ? 'पहचाने गए रोग' : 'Diseases Detected'}</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">10K+</div>
                  <div className="text-sm text-purple-700">{language === 'hi' ? 'विश्लेषित तस्वीरें' : 'Images Analyzed'}</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">24/7</div>
                  <div className="text-sm text-orange-700">{language === 'hi' ? 'उपलब्धता' : 'Availability'}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CropDiseaseDetection;
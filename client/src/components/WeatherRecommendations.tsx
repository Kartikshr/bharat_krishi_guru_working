import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudRain, Sun, Thermometer, Droplets, Wind, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import weatherIcon from "@/assets/weather-icon.png";
import { useLocation } from "@/contexts/LocationContext";

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  rainfall: number;
  location: string;
}

interface Recommendation {
  type: 'irrigation' | 'fertilizer' | 'protection' | 'harvesting';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  icon: any;
}

const WeatherRecommendations = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { selectedLocation } = useLocation();

  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      // Try to fetch from OpenWeather API if API key is available
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      
      if (apiKey) {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${selectedLocation}&appid=${apiKey}&units=metric`
            );

        if (res.ok) {
          const data = await res.json();

          const realWeather: WeatherData = {
            temperature: data.main.temp,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            condition: data.weather[0].description,
            rainfall: data.rain?.["1h"] || 0,
            location: selectedLocation
          };

          setWeatherData(realWeather);
          generateRecommendations(realWeather);

          toast({
            title: "Weather Updated",
            description: "Fresh recommendations generated based on current conditions"
          });
          return;
        }
      }
      
      // Fallback to mock weather data if API fails or no key
      throw new Error("Using fallback weather data");
      
    } catch (error) {
      // Use mock weather data for demonstration
      const mockWeather: WeatherData = {
        temperature: 28 + Math.random() * 8, // 28-36°C
        humidity: 60 + Math.random() * 25,   // 60-85%
        windSpeed: 5 + Math.random() * 10,   // 5-15 m/s
        condition: ["clear sky", "few clouds", "scattered clouds", "overcast"][Math.floor(Math.random() * 4)],
        rainfall: Math.random() > 0.7 ? Math.random() * 5 : 0, // 30% chance of rain
        location: selectedLocation
      };

      setWeatherData(mockWeather);
      generateRecommendations(mockWeather);

      toast({
        title: "Demo Weather Data",
        description: "Using simulated weather data for AI recommendations"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async (weather: WeatherData) => {
    try {
      // Use our secure backend API for weather-based recommendations
      const response = await fetch('/api/ai/weather-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weatherData: weather,
          location: weather.location
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Parse the AI response as text and extract recommendations
        const aiRecommendationsText = data.recommendations;
        
        // Generate simple recommendations based on AI analysis
        const simpleRecs: Recommendation[] = [];
        
        // Extract key recommendations from AI text
        if (weather.temperature > 30) {
          simpleRecs.push({
            type: 'irrigation',
            title: 'High Temperature Alert',
            description: aiRecommendationsText.substring(0, 150) + '...',
            priority: 'high',
            icon: Droplets
          });
        }
        
        if (weather.humidity > 70) {
          simpleRecs.push({
            type: 'protection',
            title: 'Humidity Management',
            description: 'High humidity conditions detected. Follow AI recommendations for crop protection.',
            priority: 'medium',
            icon: CloudRain
          });
        }

        if (weather.rainfall > 0) {
          simpleRecs.push({
            type: 'fertilizer',
            title: 'Post-Rain Care',
            description: 'AI suggests specific post-rainfall farming activities.',
            priority: 'medium',
            icon: Sun
          });
        }

        // Add a general AI recommendation
        simpleRecs.push({
          type: 'protection',
          title: 'AI Agricultural Advice',
          description: aiRecommendationsText,
          priority: 'high',
          icon: Wind
        });
        
        setRecommendations(simpleRecs);
        return;
      }
    } catch (error) {
      console.error('Weather recommendations API error:', error);
    }

    // Fallback to local recommendations if AI fails
    generateLocalRecommendations(weather);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'irrigation': return Droplets;
      case 'fertilizer': return Sun;
      case 'protection': return CloudRain;
      case 'harvesting': return Sun;
      default: return Wind;
    }
  };

  const generateLocalRecommendations = (weather: WeatherData) => {
    const recs: Recommendation[] = [];

    // Temperature-based recommendations
    if (weather.temperature > 30) {
      recs.push({
        type: 'irrigation',
        title: 'Increase Irrigation Frequency',
        description: 'High temperature detected. Increase watering frequency and consider evening irrigation.',
        priority: 'high',
        icon: Droplets
      });
    }

    // Humidity-based recommendations
    if (weather.humidity > 70) {
      recs.push({
        type: 'protection',
        title: 'Fungal Disease Alert',
        description: 'High humidity may promote fungal diseases. Apply preventive fungicide spray.',
        priority: 'medium',
        icon: CloudRain
      });
    }

    // Rainfall-based recommendations
    if (weather.rainfall > 0) {
      recs.push({
        type: 'fertilizer',
        title: 'Post-Rain Fertilization',
        description: 'Apply nitrogen fertilizer after rainfall for better absorption.',
        priority: 'medium',
        icon: Droplets
      });
    }

    // Wind-based recommendations
    if (weather.windSpeed > 15) {
      recs.push({
        type: 'protection',
        title: 'Crop Protection Required',
        description: 'Strong winds expected. Provide support to tall crops and secure equipment.',
        priority: 'high',
        icon: Wind
      });
    }

    // General recommendations
    recs.push({
      type: 'harvesting',
      title: 'Optimal Harvesting Window',
      description: 'Current weather conditions are favorable for harvesting mature crops.',
      priority: 'low',
      icon: Sun
    });

    setRecommendations(recs);
  };

  useEffect(() => {
    fetchWeatherData();
  }, [selectedLocation]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-accent';
      case 'low': return 'text-nature-medium';
      default: return 'text-foreground';
    }
  };

  const getPriorityBg = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 border-destructive/30';
      case 'medium': return 'bg-accent/10 border-accent/30';
      case 'low': return 'bg-nature-light border-nature-medium/30';
      default: return 'bg-muted border-border';
    }
  };

  return (
    <section id="weather" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <img src={weatherIcon} alt="Weather Recommendations" className="w-20 h-20 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Weather-Based Recommendations
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get personalized farming recommendations based on real-time weather conditions
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Current Weather */}
            <Card className="lg:col-span-1 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sun className="w-5 h-5 mr-2 text-accent" />
                  Current Weather
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weatherData ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Location</span>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-muted-foreground" />
                        <span className="text-sm font-medium">{weatherData.location}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gradient-card rounded-lg">
                        <Thermometer className="w-6 h-6 text-accent mx-auto mb-2" />
                        <p className="text-2xl font-bold text-primary">{weatherData.temperature}°C</p>
                        <p className="text-xs text-muted-foreground">Temperature</p>
                      </div>
                      <div className="text-center p-3 bg-gradient-card rounded-lg">
                        <Droplets className="w-6 h-6 text-nature-medium mx-auto mb-2" />
                        <p className="text-2xl font-bold text-primary">{weatherData.humidity}%</p>
                        <p className="text-xs text-muted-foreground">Humidity</p>
                      </div>
                      <div className="text-center p-3 bg-gradient-card rounded-lg">
                        <Wind className="w-6 h-6 text-earth-medium mx-auto mb-2" />
                        <p className="text-2xl font-bold text-primary">{weatherData.windSpeed} km/h</p>
                        <p className="text-xs text-muted-foreground">Wind Speed</p>
                      </div>
                      <div className="text-center p-3 bg-gradient-card rounded-lg">
                        <CloudRain className="w-6 h-6 text-nature-dark mx-auto mb-2" />
                        <p className="text-2xl font-bold text-primary">{weatherData.rainfall} mm</p>
                        <p className="text-xs text-muted-foreground">Rainfall</p>
                      </div>
                    </div>

                    <Button onClick={fetchWeatherData} disabled={loading} className="w-full">
                      {loading ? "Updating..." : "Refresh Weather"}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Sun className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">Loading weather data...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <div className="lg:col-span-2">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CloudRain className="w-5 h-5 mr-2 text-primary" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.length > 0 ? (
                      recommendations.map((rec, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border ${getPriorityBg(rec.priority)}`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg bg-background ${getPriorityColor(rec.priority)}`}>
                              <rec.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <h3 className={`font-semibold mb-1 ${getPriorityColor(rec.priority)}`}>
                                {rec.title}
                              </h3>
                              <p className="text-sm text-foreground">{rec.description}</p>
                              <div className="flex items-center mt-2">
                                <span className={`text-xs px-2 py-1 rounded-full bg-background ${getPriorityColor(rec.priority)} font-medium`}>
                                  {rec.priority.toUpperCase()} PRIORITY
                                </span>
                                <span className="text-xs text-muted-foreground ml-2 capitalize">
                                  {rec.type}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <CloudRain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          Weather-based recommendations will appear here
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeatherRecommendations;

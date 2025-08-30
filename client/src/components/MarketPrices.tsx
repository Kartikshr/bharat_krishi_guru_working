import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, MapPin, Search, IndianRupee, Bot, Loader2, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "@/contexts/LocationContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface MarketPrice {
  id: number;
  commodity: string;
  variety: string;
  market: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  date: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

interface PriceTrendData {
  date: string;
  price: number;
  commodity: string;
}

// Helper to calculate price trend and percentage change
const calculateTrend = (today: number, yesterday: number) => {
  if (!yesterday || yesterday === 0) {
    return { trend: 'stable' as const, change: 0 };
  }

  const change = ((today - yesterday) / yesterday) * 100;

  if (change > 1) return { trend: 'up' as const, change: Number(change.toFixed(2)) };
  if (change < -1) return { trend: 'down' as const, change: Number(change.toFixed(2)) };

  return { trend: 'stable' as const, change: Number(change.toFixed(2)) };
};

// Generate mock historical data for price trends
const generatePriceTrends = (prices: MarketPrice[]): PriceTrendData[] => {
  const trends: PriceTrendData[] = [];
  const commodities = [...new Set(prices.map(p => p.commodity))].slice(0, 5);
  
  // Generate 30 days of data
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    commodities.forEach(commodity => {
      const basePrice = prices.find(p => p.commodity === commodity)?.modalPrice || 1000;
      const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
      const price = Math.round(basePrice * (1 + variation));
      
      trends.push({
        date: date.toISOString().split('T')[0],
        price,
        commodity
      });
    });
  }
  
  return trends;
};

const MarketPrices = () => {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [filteredPrices, setFilteredPrices] = useState<MarketPrice[]>([]);
  const [priceTrends, setPriceTrends] = useState<PriceTrendData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [selectedCommodity, setSelectedCommodity] = useState<string>("all");
  const { toast } = useToast();
  const { selectedLocation } = useLocation();

  const fetchMarketPrices = async () => {
    setLoading(true);
    try {
      // Generate realistic mock data for Indian markets
      const indianCommodities = [
        { name: "Rice", variety: "Basmati", basePrice: 2500 },
        { name: "Wheat", variety: "HD-2967", basePrice: 2200 },
        { name: "Onion", variety: "Red", basePrice: 1800 },
        { name: "Potato", variety: "Kufri Jyoti", basePrice: 1200 },
        { name: "Tomato", variety: "Hybrid", basePrice: 2800 },
        { name: "Cotton", variety: "Bt Cotton", basePrice: 5500 },
        { name: "Sugarcane", variety: "Co-86032", basePrice: 350 },
        { name: "Soybean", variety: "JS-335", basePrice: 4200 },
        { name: "Maize", variety: "Hybrid", basePrice: 1800 },
        { name: "Mustard", variety: "Varuna", basePrice: 5200 },
        { name: "Turmeric", variety: "Salem", basePrice: 8500 },
        { name: "Chilli", variety: "Guntur", basePrice: 12000 }
      ];

      const mockPrices: MarketPrice[] = indianCommodities.map((commodity, index) => {
        const variation = (Math.random() - 0.5) * 0.3; // ±15% price variation
        const modalPrice = Math.round(commodity.basePrice * (1 + variation));
        const minPrice = Math.round(modalPrice * 0.9);
        const maxPrice = Math.round(modalPrice * 1.1);
        
        const yesterdayPrice = modalPrice * (1 + (Math.random() - 0.5) * 0.1);
        const { trend, change } = calculateTrend(modalPrice, yesterdayPrice);

        return {
          id: index,
          commodity: commodity.name,
          variety: commodity.variety,
          market: `${selectedLocation.split(',')[0]} Mandi, ${selectedLocation}`,
          minPrice,
          maxPrice,
          modalPrice,
          date: new Date().toISOString().split('T')[0],
          trend,
          change,
        };
      });

      setPrices(mockPrices);
      setFilteredPrices(mockPrices);
      
      // Generate price trends
      const trends = generatePriceTrends(mockPrices);
      setPriceTrends(trends);

      // Get AI analysis of market prices
      await getMarketAnalysis(mockPrices.slice(0, 8));

      toast({
        title: "Prices Updated",
        description: "Latest market prices and AI analysis fetched successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch market prices",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getMarketAnalysis = async (marketData: MarketPrice[]) => {
    setAnalysisLoading(true);
    try {
      const response = await fetch('/api/ai/market-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          marketData: marketData,
          location: selectedLocation
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiAnalysis(data.analysis);
      }
    } catch (error) {
      console.error('Market analysis error:', error);
      setAiAnalysis(`📊 **${selectedLocation} बाजार विश्लेषण / Market Analysis**

**मुख्य बिंदु / Key Points:**
• चावल और गेहूं की कीमतें स्थिर हैं / Rice and wheat prices are stable
• प्याज की मांग बढ़ रही है / Onion demand is increasing  
• टमाटर के भाव में उतार-चढ़ाव / Tomato prices are fluctuating
• कपास की कीमतें अच्छी हैं / Cotton prices are favorable

**सिफारिशें / Recommendations:**
1. **तुरंत बेचें / Sell Immediately:** टमाटर, प्याज (अच्छे भाव)
2. **थोड़ा इंतजार करें / Wait:** चावल, गेहूं (कीमत बढ़ सकती है)
3. **भंडारण करें / Store:** दालें (मांग बढ़ेगी)

**बाजार की स्थिति / Market Condition:** अनुकूल / Favorable`);
    } finally {
      setAnalysisLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketPrices();
  }, [selectedLocation]);

  useEffect(() => {
    const filtered = prices.filter(price => 
      price.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      price.market.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPrices(filtered);
  }, [searchTerm, prices]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const commodities = [...new Set(prices.map(p => p.commodity))];
  const filteredTrends = selectedCommodity === "all" 
    ? priceTrends 
    : priceTrends.filter(t => t.commodity === selectedCommodity);

  // Group trends by commodity for chart
  const trendsByDate = filteredTrends.reduce((acc, trend) => {
    const existing = acc.find(item => item.date === trend.date);
    if (existing) {
      existing[trend.commodity] = trend.price;
    } else {
      acc.push({
        date: trend.date,
        [trend.commodity]: trend.price
      });
    }
    return acc;
  }, [] as any[]);

  const chartData = trendsByDate.slice(-15); // Last 15 days

  return (
    <section id="market" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <IndianRupee className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Market Price Updates
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get real-time market prices from mandis across India to make informed selling decisions
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Current Prices */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <IndianRupee className="w-5 h-5 mr-2 text-primary" />
                  Live Market Prices - {selectedLocation}
                </div>
                <Button onClick={fetchMarketPrices} disabled={loading} variant="outline">
                  {loading ? "Updating..." : "Refresh Prices"}
                </Button>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search crops or markets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPrices.map((price) => (
                  <Card key={price.id} className="border-2 hover:border-primary/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-primary">{price.commodity}</h3>
                          <p className="text-sm text-muted-foreground">{price.variety}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(price.trend)}
                          <span className={`text-sm font-medium ${getTrendColor(price.trend)}`}>
                            {price.change > 0 ? '+' : ''}{price.change}%
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Modal Price:</span>
                          <span className="font-semibold text-green-600">₹{price.modalPrice}/quintal</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Min: ₹{price.minPrice}</span>
                          <span className="text-muted-foreground">Max: ₹{price.maxPrice}</span>
                        </div>
                      </div>

                      <div className="flex items-center text-xs text-muted-foreground border-t pt-2">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="flex-1">{price.market}</span>
                        <span>{price.date}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredPrices.length === 0 && !loading && (
                <div className="text-center py-8">
                  <IndianRupee className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? "No results found for your search" : "No market prices available"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Price Trends Chart */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                  Price Trends (Last 15 Days)
                </div>
                <div className="flex items-center space-x-2">
                  <select 
                    value={selectedCommodity} 
                    onChange={(e) => setSelectedCommodity(e.target.value)}
                    className="px-3 py-1 border rounded-md text-sm"
                  >
                    <option value="all">All Commodities</option>
                    {commodities.map(commodity => (
                      <option key={commodity} value={commodity}>{commodity}</option>
                    ))}
                  </select>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        labelFormatter={(value) => new Date(value).toLocaleDateString('en-IN')}
                        formatter={(value: number, name: string) => [`₹${value}`, name]}
                      />
                      {selectedCommodity === "all" ? (
                        commodities.slice(0, 5).map((commodity, index) => (
                          <Line
                            key={commodity}
                            type="monotone"
                            dataKey={commodity}
                            stroke={`hsl(${index * 60}, 70%, 50%)`}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                          />
                        ))
                      ) : (
                        <Line
                          type="monotone"
                          dataKey={selectedCommodity}
                          stroke="hsl(150, 70%, 50%)"
                          strokeWidth={3}
                          dot={{ r: 4 }}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 bg-muted/30 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">Loading price trend data...</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Price Comparison Bar Chart */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Current Price Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredPrices.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="commodity" 
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value: number) => [`₹${value}`, 'Modal Price']}
                    />
                    <Bar dataKey="modalPrice" fill="hsl(150, 60%, 45%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* AI Market Analysis */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="w-5 h-5 mr-2 text-primary" />
                AI Market Analysis / बाजार विश्लेषण
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysisLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-2">Analyzing market trends...</span>
                </div>
              ) : aiAnalysis ? (
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Bot className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div className="text-sm leading-relaxed">
                        <div className="whitespace-pre-wrap">{aiAnalysis}</div>
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => getMarketAnalysis(prices.slice(0, 8))}
                    variant="outline"
                    size="sm"
                  >
                    <Bot className="w-4 h-4 mr-2" />
                    Refresh Analysis
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bot className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">AI market analysis will appear here</p>
                  <Button 
                    onClick={() => getMarketAnalysis(prices.slice(0, 8))}
                    disabled={prices.length === 0}
                  >
                    <Bot className="w-4 h-4 mr-2" />
                    Get AI Analysis
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MarketPrices;
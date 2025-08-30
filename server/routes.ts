import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getAgriculturalAdvice, analyzeWeatherForFarming, analyzeMarketPrices, analyzeCropDisease } from "./gemini";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, full_name } = req.body;
      
      // Check if user exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        full_name,
      });

      // Create profile
      await storage.createProfile({
        user_id: user.id,
        full_name,
      });

      // Generate JWT token
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
      
      res.json({ 
        message: "User created successfully", 
        user: { id: user.id, email: user.email, full_name: user.full_name },
        token 
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
      
      res.json({ 
        user: { id: user.id, email: user.email, full_name: user.full_name },
        token 
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/auth/signout", async (req, res) => {
    // For JWT, signout is handled client-side by removing the token
    res.json({ message: "Signed out successfully" });
  });

  // Profile routes
  app.get("/api/profile", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "No authorization header" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      
      const profile = await storage.getProfile(decoded.userId);
      res.json(profile);
    } catch (error: any) {
      res.status(401).json({ message: "Invalid token" });
    }
  });

  app.put("/api/profile", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "No authorization header" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      
      const updatedProfile = await storage.updateProfile(decoded.userId, req.body);
      res.json(updatedProfile);
    } catch (error: any) {
      res.status(401).json({ message: "Invalid token" });
    }
  });

  // AI Agriculture Assistant
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, location, language, context } = req.body;
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const response = await getAgriculturalAdvice(message, location, language, context);
      res.json({ response });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Weather-based Recommendations
  app.post("/api/ai/weather-recommendations", async (req, res) => {
    try {
      const { weatherData, location } = req.body;
      if (!weatherData || !location) {
        return res.status(400).json({ message: "Weather data and location are required" });
      }

      const recommendations = await analyzeWeatherForFarming(weatherData, location);
      res.json({ recommendations });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Market Price Analysis
  app.post("/api/ai/market-analysis", async (req, res) => {
    try {
      const { marketData, location } = req.body;
      if (!marketData || !location) {
        return res.status(400).json({ message: "Market data and location are required" });
      }

      const analysis = await analyzeMarketPrices(marketData, location);
      res.json({ analysis });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Crop Disease Detection
  app.post("/api/ai/crop-disease", async (req, res) => {
    try {
      const { imageDescription } = req.body;
      if (!imageDescription) {
        return res.status(400).json({ message: "Image description is required" });
      }

      const analysis = await analyzeCropDisease(imageDescription);
      res.json(analysis);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

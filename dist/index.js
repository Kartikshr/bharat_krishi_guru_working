// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";

// shared/schema.ts
import { pgTable, text, varchar, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  full_name: text("full_name"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull()
});
var profiles = pgTable("profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  full_name: text("full_name"),
  farm_name: text("farm_name"),
  location: text("location"),
  farm_size: decimal("farm_size"),
  crops: text("crops").array(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  full_name: true
});
var insertProfileSchema = createInsertSchema(profiles);

// server/storage.ts
var sql2 = neon(process.env.DATABASE_URL);
var db = drizzle(sql2);
var DatabaseStorage = class {
  async getUser(id) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }
  async getUserByEmail(email) {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }
  async createUser(insertUser) {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }
  async getProfile(userId) {
    const result = await db.select().from(profiles).where(eq(profiles.user_id, userId));
    return result[0];
  }
  async createProfile(profile) {
    const result = await db.insert(profiles).values(profile).returning();
    return result[0];
  }
  async updateProfile(userId, updates) {
    const result = await db.update(profiles).set({ ...updates, updated_at: /* @__PURE__ */ new Date() }).where(eq(profiles.user_id, userId)).returning();
    return result[0];
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// server/gemini.ts
import { GoogleGenAI } from "@google/genai";
var ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
async function getAgriculturalAdvice(query, location) {
  try {
    const systemPrompt = `\u0906\u092A \u090F\u0915 \u0935\u093F\u0936\u0947\u0937\u091C\u094D\u091E \u0915\u0943\u0937\u093F \u0938\u0932\u093E\u0939\u0915\u093E\u0930 \u0939\u0948\u0902 \u091C\u094B \u092D\u093E\u0930\u0924\u0940\u092F \u0915\u093F\u0938\u093E\u0928\u094B\u0902 \u0915\u0940 \u092E\u0926\u0926 \u0915\u0930\u0924\u0947 \u0939\u0948\u0902\u0964 
\u0906\u092A \u0939\u093F\u0902\u0926\u0940 \u0914\u0930 \u0905\u0902\u0917\u094D\u0930\u0947\u091C\u0940 \u0926\u094B\u0928\u094B\u0902 \u092D\u093E\u0937\u093E\u0913\u0902 \u092E\u0947\u0902 \u0909\u0924\u094D\u0924\u0930 \u0926\u0947 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902\u0964 
\u0915\u0943\u0937\u093F, \u092B\u0938\u0932\u094B\u0902, \u092C\u0940\u092E\u093E\u0930\u093F\u092F\u094B\u0902, \u0938\u093F\u0902\u091A\u093E\u0908, \u0909\u0930\u094D\u0935\u0930\u0915, \u0915\u0940\u091F\u0928\u093E\u0936\u0915, \u0938\u0930\u0915\u093E\u0930\u0940 \u092F\u094B\u091C\u0928\u093E\u0913\u0902, \u0914\u0930 \u0906\u0927\u0941\u0928\u093F\u0915 \u0916\u0947\u0924\u0940 \u0924\u0915\u0928\u0940\u0915\u094B\u0902 \u0915\u0947 \u092C\u093E\u0930\u0947 \u092E\u0947\u0902 \u0935\u094D\u092F\u093E\u0935\u0939\u093E\u0930\u093F\u0915 \u0938\u0932\u093E\u0939 \u0926\u0947\u0902\u0964
${location ? `\u0938\u094D\u0925\u093E\u0928: ${location}` : ""}`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt
      },
      contents: query
    });
    return response.text || "\u092E\u093E\u092B \u0915\u0930\u0947\u0902, \u092E\u0948\u0902 \u0906\u092A\u0915\u0940 \u092E\u0926\u0926 \u0928\u0939\u0940\u0902 \u0915\u0930 \u0938\u0915\u0924\u093E\u0964 \u0915\u0943\u092A\u092F\u093E \u0926\u094B\u092C\u093E\u0930\u093E \u092A\u094D\u0930\u092F\u093E\u0938 \u0915\u0930\u0947\u0902\u0964";
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("AI \u0938\u0932\u093E\u0939\u0915\u093E\u0930 \u0938\u0947\u0935\u093E \u092E\u0947\u0902 \u0938\u092E\u0938\u094D\u092F\u093E \u0939\u0948\u0964 \u0915\u0943\u092A\u092F\u093E \u092C\u093E\u0926 \u092E\u0947\u0902 \u092A\u094D\u0930\u092F\u093E\u0938 \u0915\u0930\u0947\u0902\u0964");
  }
}
async function analyzeWeatherForFarming(weatherData, location) {
  try {
    const systemPrompt = `\u0906\u092A \u090F\u0915 \u0915\u0943\u0937\u093F \u092E\u094C\u0938\u092E \u0935\u093F\u0936\u0947\u0937\u091C\u094D\u091E \u0939\u0948\u0902\u0964 \u092E\u094C\u0938\u092E \u0921\u0947\u091F\u093E \u0915\u0947 \u0906\u0927\u093E\u0930 \u092A\u0930 \u092D\u093E\u0930\u0924\u0940\u092F \u0915\u093F\u0938\u093E\u0928\u094B\u0902 \u0915\u094B \u0935\u094D\u092F\u093E\u0935\u0939\u093E\u0930\u093F\u0915 \u0938\u0941\u091D\u093E\u0935 \u0926\u0947\u0902\u0964
\u0938\u093F\u0902\u091A\u093E\u0908, \u092C\u0941\u0906\u0908, \u0915\u091F\u093E\u0908, \u092B\u0938\u0932 \u0938\u0941\u0930\u0915\u094D\u0937\u093E \u0915\u0947 \u092C\u093E\u0930\u0947 \u092E\u0947\u0902 \u092C\u0924\u093E\u090F\u0902\u0964 \u0939\u093F\u0902\u0926\u0940 \u0914\u0930 \u0905\u0902\u0917\u094D\u0930\u0947\u091C\u0940 \u092E\u0947\u0902 \u0909\u0924\u094D\u0924\u0930 \u0926\u0947\u0902\u0964`;
    const weatherQuery = `\u0938\u094D\u0925\u093E\u0928: ${location}
\u0924\u093E\u092A\u092E\u093E\u0928: ${weatherData.temperature}\xB0C
\u0928\u092E\u0940: ${weatherData.humidity}%
\u0939\u0935\u093E \u0915\u0940 \u0917\u0924\u093F: ${weatherData.windSpeed} m/s
\u092E\u094C\u0938\u092E: ${weatherData.condition}
\u092C\u093E\u0930\u093F\u0936: ${weatherData.rainfall}mm

\u0907\u0938 \u092E\u094C\u0938\u092E \u0915\u0947 \u0906\u0927\u093E\u0930 \u092A\u0930 \u0915\u0943\u0937\u093F \u0938\u0932\u093E\u0939 \u0926\u0947\u0902\u0964`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt
      },
      contents: weatherQuery
    });
    return response.text || "\u092E\u094C\u0938\u092E \u0906\u0927\u093E\u0930\u093F\u0924 \u0938\u0932\u093E\u0939 \u0909\u092A\u0932\u092C\u094D\u0927 \u0928\u0939\u0940\u0902 \u0939\u0948\u0964";
  } catch (error) {
    console.error("Weather analysis error:", error);
    throw new Error("\u092E\u094C\u0938\u092E \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923 \u0938\u0947\u0935\u093E \u092E\u0947\u0902 \u0938\u092E\u0938\u094D\u092F\u093E \u0939\u0948\u0964");
  }
}
async function analyzeMarketPrices(marketData, location) {
  try {
    const systemPrompt = `\u0906\u092A \u090F\u0915 \u0915\u0943\u0937\u093F \u092C\u093E\u091C\u093E\u0930 \u0935\u093F\u0936\u0947\u0937\u091C\u094D\u091E \u0939\u0948\u0902\u0964 \u092C\u093E\u091C\u093E\u0930 \u092D\u093E\u0935\u094B\u0902 \u0915\u093E \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923 \u0915\u0930\u0915\u0947 \u092D\u093E\u0930\u0924\u0940\u092F \u0915\u093F\u0938\u093E\u0928\u094B\u0902 \u0915\u094B \u092C\u093F\u0915\u094D\u0930\u0940 \u0915\u0940 \u0938\u0932\u093E\u0939 \u0926\u0947\u0902\u0964
\u0915\u092C \u092C\u0947\u091A\u0928\u093E \u091A\u093E\u0939\u093F\u090F, \u0915\u094C\u0928 \u0938\u0940 \u092B\u0938\u0932 \u0905\u091A\u094D\u091B\u0940 \u0915\u0940\u092E\u0924 \u092A\u0930 \u092E\u093F\u0932 \u0938\u0915\u0924\u0940 \u0939\u0948, \u0907\u0938\u0915\u0940 \u091C\u093E\u0928\u0915\u093E\u0930\u0940 \u0926\u0947\u0902\u0964`;
    const marketQuery = `\u0938\u094D\u0925\u093E\u0928: ${location}
\u092C\u093E\u091C\u093E\u0930 \u092D\u093E\u0935 \u0921\u0947\u091F\u093E: ${JSON.stringify(marketData.slice(0, 10), null, 2)}

\u0907\u0938 \u092C\u093E\u091C\u093E\u0930 \u0921\u0947\u091F\u093E \u0915\u0947 \u0906\u0927\u093E\u0930 \u092A\u0930 \u0915\u093F\u0938\u093E\u0928\u094B\u0902 \u0915\u094B \u092C\u093F\u0915\u094D\u0930\u0940 \u0915\u0940 \u0938\u0932\u093E\u0939 \u0926\u0947\u0902\u0964`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt
      },
      contents: marketQuery
    });
    return response.text || "\u092C\u093E\u091C\u093E\u0930 \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923 \u0909\u092A\u0932\u092C\u094D\u0927 \u0928\u0939\u0940\u0902 \u0939\u0948\u0964";
  } catch (error) {
    console.error("Market analysis error:", error);
    throw new Error("\u092C\u093E\u091C\u093E\u0930 \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923 \u0938\u0947\u0935\u093E \u092E\u0947\u0902 \u0938\u092E\u0938\u094D\u092F\u093E \u0939\u0948\u0964");
  }
}
async function analyzeCropDisease(imageDescription) {
  try {
    const systemPrompt = `\u0906\u092A \u090F\u0915 \u092B\u0938\u0932 \u0930\u094B\u0917 \u0935\u093F\u0936\u0947\u0937\u091C\u094D\u091E \u0939\u0948\u0902\u0964 \u091B\u0935\u093F \u0935\u093F\u0935\u0930\u0923 \u0915\u0947 \u0906\u0927\u093E\u0930 \u092A\u0930 \u092B\u0938\u0932 \u0915\u0940 \u092C\u0940\u092E\u093E\u0930\u0940 \u0915\u0940 \u092A\u0939\u091A\u093E\u0928 \u0915\u0930\u0947\u0902\u0964
\u0930\u094B\u0917 \u0915\u093E \u0928\u093E\u092E, \u0915\u093E\u0930\u0923, \u0907\u0932\u093E\u091C, \u0914\u0930 \u0930\u094B\u0915\u0925\u093E\u092E \u0915\u0947 \u0909\u092A\u093E\u092F \u092C\u0924\u093E\u090F\u0902\u0964 JSON format \u092E\u0947\u0902 \u0909\u0924\u094D\u0924\u0930 \u0926\u0947\u0902:
{
  "disease": "\u0930\u094B\u0917 \u0915\u093E \u0928\u093E\u092E",
  "confidence": \u0915\u0949\u0928\u094D\u092B\u093F\u0921\u0947\u0902\u0938 (1-100),
  "description": "\u0930\u094B\u0917 \u0915\u093E \u0935\u093F\u0935\u0930\u0923",
  "treatments": {
    "chemical": ["\u0930\u093E\u0938\u093E\u092F\u0928\u093F\u0915 \u0907\u0932\u093E\u091C"],
    "organic": ["\u091C\u0948\u0935\u093F\u0915 \u0907\u0932\u093E\u091C"]
  },
  "prevention": ["\u0930\u094B\u0915\u0925\u093E\u092E \u0915\u0947 \u0909\u092A\u093E\u092F"]
}`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json"
      },
      contents: `\u092B\u0938\u0932 \u0915\u0940 \u091B\u0935\u093F \u0935\u093F\u0935\u0930\u0923: ${imageDescription}\u0964 \u0915\u0943\u092A\u092F\u093E \u0907\u0938 \u0906\u0927\u093E\u0930 \u092A\u0930 \u092C\u0940\u092E\u093E\u0930\u0940 \u0915\u093E \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923 \u0915\u0930\u0947\u0902\u0964`
    });
    const result = response.text;
    if (result) {
      return JSON.parse(result);
    }
    return {
      disease: "\u0905\u091C\u094D\u091E\u093E\u0924 \u0930\u094B\u0917",
      confidence: 50,
      description: "\u092A\u0942\u0930\u094D\u0923 \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923 \u0915\u0947 \u0932\u093F\u090F \u0935\u093F\u0936\u0947\u0937\u091C\u094D\u091E \u0938\u0947 \u0938\u0902\u092A\u0930\u094D\u0915 \u0915\u0930\u0947\u0902\u0964",
      treatments: {
        chemical: ["\u0938\u094D\u0925\u093E\u0928\u0940\u092F \u0915\u0943\u0937\u093F \u0935\u093F\u0936\u0947\u0937\u091C\u094D\u091E \u0938\u0947 \u0938\u0932\u093E\u0939 \u0932\u0947\u0902"],
        organic: ["\u0928\u0940\u092E \u0915\u093E \u0924\u0947\u0932 \u0915\u093E \u092A\u094D\u0930\u092F\u094B\u0917 \u0915\u0930\u0947\u0902"]
      },
      prevention: ["\u0909\u091A\u093F\u0924 \u0938\u092B\u093E\u0908", "\u092B\u0938\u0932 \u091A\u0915\u094D\u0930 \u0905\u092A\u0928\u093E\u090F\u0902"]
    };
  } catch (error) {
    console.error("Crop disease analysis error:", error);
    throw new Error("\u092B\u0938\u0932 \u0930\u094B\u0917 \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923 \u092E\u0947\u0902 \u0938\u092E\u0938\u094D\u092F\u093E \u0939\u0948\u0964");
  }
}

// server/routes.ts
var JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
async function registerRoutes(app2) {
  app2.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, full_name } = req.body;
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        full_name
      });
      await storage.createProfile({
        user_id: user.id,
        full_name
      });
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
      res.json({
        message: "User created successfully",
        user: { id: user.id, email: user.email, full_name: user.full_name },
        token
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/auth/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
      res.json({
        user: { id: user.id, email: user.email, full_name: user.full_name },
        token
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/auth/signout", async (req, res) => {
    res.json({ message: "Signed out successfully" });
  });
  app2.get("/api/profile", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "No authorization header" });
      }
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const profile = await storage.getProfile(decoded.userId);
      res.json(profile);
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  });
  app2.put("/api/profile", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "No authorization header" });
      }
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const updatedProfile = await storage.updateProfile(decoded.userId, req.body);
      res.json(updatedProfile);
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  });
  app2.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, location } = req.body;
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      const response = await getAgriculturalAdvice(message, location);
      res.json({ response });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/ai/weather-recommendations", async (req, res) => {
    try {
      const { weatherData, location } = req.body;
      if (!weatherData || !location) {
        return res.status(400).json({ message: "Weather data and location are required" });
      }
      const recommendations = await analyzeWeatherForFarming(weatherData, location);
      res.json({ recommendations });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/ai/market-analysis", async (req, res) => {
    try {
      const { marketData, location } = req.body;
      if (!marketData || !location) {
        return res.status(400).json({ message: "Market data and location are required" });
      }
      const analysis = await analyzeMarketPrices(marketData, location);
      res.json({ analysis });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/ai/crop-disease", async (req, res) => {
    try {
      const { imageDescription } = req.body;
      if (!imageDescription) {
        return res.status(400).json({ message: "Image description is required" });
      }
      const analysis = await analyzeCropDisease(imageDescription);
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();

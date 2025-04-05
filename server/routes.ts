import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertFeedbackSchema, 
  insertEmailTemplateSchema,
  insertFeedbackFormSchema,
  insertBrandSettingsSchema,
  sentimentSchema
} from "@shared/schema";
import * as natural from 'natural';

// Simple sentiment analyzer using Natural.js AFINN lexicon directly
function analyzeSentiment(text: string): { sentiment: string, score: number } {
  // Use the AFINN lexicon directly
  const afinn = natural.SentimentAnalyzer.AFINN;
  const tokenizer = new natural.WordTokenizer();
  const words = tokenizer.tokenize(text) || [];
  
  // Stemming the words
  const stemmer = natural.PorterStemmer;
  const stemmedWords = words.map(word => stemmer.stem(word));
  
  // Calculate sentiment
  let score = 0;
  let count = 0;
  
  for (const word of stemmedWords) {
    if (afinn[word]) {
      score += afinn[word];
      count++;
    }
  }
  
  // Normalize score based on word count to get average sentiment
  let normalizedScore = 50; // Default neutral
  if (count > 0) {
    // AFINN scores typically range from -5 to 5
    // Convert to 0-100 scale
    const rawScore = score / count;
    normalizedScore = Math.round((rawScore + 5) * 10); // Convert from -5...5 to 0...100
    normalizedScore = Math.max(0, Math.min(100, normalizedScore)); // Clamp to 0-100
  }
  
  // Classify sentiment
  let sentiment: string;
  if (normalizedScore >= 65) {
    sentiment = "positive";
  } else if (normalizedScore <= 35) {
    sentiment = "negative";
  } else {
    sentiment = "neutral";
  }
  
  return { sentiment, score: normalizedScore };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  
  // Feedback routes
  app.get("/api/feedback", async (req: Request, res: Response) => {
    try {
      const sentiment = req.query.sentiment as string | undefined;
      
      let feedbackData;
      if (sentiment && sentimentSchema.safeParse(sentiment).success) {
        feedbackData = await storage.getFeedbackBySentiment(sentiment);
      } else {
        feedbackData = await storage.getAllFeedback();
      }
      
      res.json(feedbackData);
    } catch (error) {
      res.status(500).json({ message: "Error fetching feedback" });
    }
  });
  
  app.get("/api/feedback/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid feedback ID" });
      }
      
      const feedback = await storage.getFeedback(id);
      if (!feedback) {
        return res.status(404).json({ message: "Feedback not found" });
      }
      
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ message: "Error fetching feedback" });
    }
  });
  
  app.post("/api/feedback", async (req: Request, res: Response) => {
    try {
      const validationResult = insertFeedbackSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ message: "Invalid feedback data", errors: validationResult.error.errors });
      }
      
      // If sentiment and score aren't provided, analyze the message
      if (!req.body.sentiment || !req.body.sentimentScore) {
        const analysis = analyzeSentiment(req.body.message);
        req.body.sentiment = analysis.sentiment;
        req.body.sentimentScore = analysis.score;
      }
      
      const feedback = await storage.createFeedback(req.body);
      res.status(201).json(feedback);
    } catch (error) {
      res.status(500).json({ message: "Error creating feedback" });
    }
  });
  
  app.put("/api/feedback/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid feedback ID" });
      }
      
      const feedback = await storage.updateFeedback(id, req.body);
      if (!feedback) {
        return res.status(404).json({ message: "Feedback not found" });
      }
      
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ message: "Error updating feedback" });
    }
  });
  
  app.delete("/api/feedback/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid feedback ID" });
      }
      
      const success = await storage.deleteFeedback(id);
      if (!success) {
        return res.status(404).json({ message: "Feedback not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting feedback" });
    }
  });

  // Templates routes
  app.get("/api/templates", async (_req: Request, res: Response) => {
    try {
      const templates = await storage.getAllTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Error fetching templates" });
    }
  });
  
  app.get("/api/templates/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid template ID" });
      }
      
      const template = await storage.getTemplate(id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Error fetching template" });
    }
  });
  
  app.post("/api/templates", async (req: Request, res: Response) => {
    try {
      const validationResult = insertEmailTemplateSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ message: "Invalid template data", errors: validationResult.error.errors });
      }
      
      const template = await storage.createTemplate(req.body);
      res.status(201).json(template);
    } catch (error) {
      res.status(500).json({ message: "Error creating template" });
    }
  });
  
  app.put("/api/templates/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid template ID" });
      }
      
      const template = await storage.updateTemplate(id, req.body);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Error updating template" });
    }
  });
  
  app.delete("/api/templates/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid template ID" });
      }
      
      const success = await storage.deleteTemplate(id);
      if (!success) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting template" });
    }
  });

  // Forms routes
  app.get("/api/forms", async (_req: Request, res: Response) => {
    try {
      const forms = await storage.getAllForms();
      res.json(forms);
    } catch (error) {
      res.status(500).json({ message: "Error fetching forms" });
    }
  });
  
  app.get("/api/forms/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid form ID" });
      }
      
      const form = await storage.getForm(id);
      if (!form) {
        return res.status(404).json({ message: "Form not found" });
      }
      
      res.json(form);
    } catch (error) {
      res.status(500).json({ message: "Error fetching form" });
    }
  });
  
  app.post("/api/forms", async (req: Request, res: Response) => {
    try {
      const validationResult = insertFeedbackFormSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ message: "Invalid form data", errors: validationResult.error.errors });
      }
      
      const form = await storage.createForm(req.body);
      res.status(201).json(form);
    } catch (error) {
      res.status(500).json({ message: "Error creating form" });
    }
  });
  
  app.put("/api/forms/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid form ID" });
      }
      
      const form = await storage.updateForm(id, req.body);
      if (!form) {
        return res.status(404).json({ message: "Form not found" });
      }
      
      res.json(form);
    } catch (error) {
      res.status(500).json({ message: "Error updating form" });
    }
  });
  
  app.delete("/api/forms/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid form ID" });
      }
      
      const success = await storage.deleteForm(id);
      if (!success) {
        return res.status(404).json({ message: "Form not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting form" });
    }
  });

  // Brand Settings routes
  app.get("/api/brand-settings", async (_req: Request, res: Response) => {
    try {
      const settings = await storage.getBrandSettings();
      res.json(settings || {});
    } catch (error) {
      res.status(500).json({ message: "Error fetching brand settings" });
    }
  });
  
  app.put("/api/brand-settings", async (req: Request, res: Response) => {
    try {
      const validationResult = insertBrandSettingsSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ message: "Invalid settings data", errors: validationResult.error.errors });
      }
      
      const settings = await storage.updateBrandSettings(req.body);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Error updating brand settings" });
    }
  });

  // Analyze sentiment without saving feedback
  app.post("/api/analyze-sentiment", (req: Request, res: Response) => {
    try {
      const text = req.body.text;
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ message: "Text is required for sentiment analysis" });
      }
      
      const analysis = analyzeSentiment(text);
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Error analyzing sentiment" });
    }
  });

  // Dashboard stats
  app.get("/api/stats", async (_req: Request, res: Response) => {
    try {
      const allFeedback = await storage.getAllFeedback();
      const templates = await storage.getAllTemplates();
      
      // Recent responses (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentResponses = allFeedback.filter(f => 
        new Date(f.date) >= thirtyDaysAgo
      ).length;
      
      // Active campaigns (active templates)
      const activeCampaigns = templates.filter(t => t.status === "active").length;
      
      // Average sentiment
      const sentimentScores = allFeedback.map(f => f.sentimentScore || 0);
      const avgSentiment = sentimentScores.length 
        ? (sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length) / 20 // Convert to 0-5 scale
        : 0;
      
      // Sentiment distribution
      const positive = allFeedback.filter(f => f.sentiment === "positive").length;
      const neutral = allFeedback.filter(f => f.sentiment === "neutral").length;
      const negative = allFeedback.filter(f => f.sentiment === "negative").length;
      const total = allFeedback.length || 1; // Avoid division by zero
      
      const sentimentDistribution = {
        positive: Math.round((positive / total) * 100),
        neutral: Math.round((neutral / total) * 100),
        negative: Math.round((negative / total) * 100),
      };
      
      // Response rate (mock data as we don't track sends)
      const responseRate = 24; // Placeholder
      
      res.json({
        recentResponses,
        activeCampaigns,
        avgSentiment: avgSentiment.toFixed(1),
        responseRate,
        sentimentDistribution,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

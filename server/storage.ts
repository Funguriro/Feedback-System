import { 
  type User, 
  type InsertUser, 
  type Feedback, 
  type InsertFeedback, 
  type EmailTemplate, 
  type InsertEmailTemplate, 
  type FeedbackForm, 
  type InsertFeedbackForm, 
  type BrandSettings, 
  type InsertBrandSettings,
  users, feedback, emailTemplates, feedbackForms, brandSettings
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface with CRUD methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Feedback methods
  getAllFeedback(): Promise<Feedback[]>;
  getFeedback(id: number): Promise<Feedback | undefined>;
  getFeedbackBySentiment(sentiment: string): Promise<Feedback[]>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  updateFeedback(id: number, feedback: Partial<InsertFeedback>): Promise<Feedback | undefined>;
  deleteFeedback(id: number): Promise<boolean>;
  
  // Email Template methods
  getAllTemplates(): Promise<EmailTemplate[]>;
  getTemplate(id: number): Promise<EmailTemplate | undefined>;
  createTemplate(template: InsertEmailTemplate): Promise<EmailTemplate>;
  updateTemplate(id: number, template: Partial<InsertEmailTemplate>): Promise<EmailTemplate | undefined>;
  deleteTemplate(id: number): Promise<boolean>;
  
  // Feedback Form methods
  getAllForms(): Promise<FeedbackForm[]>;
  getForm(id: number): Promise<FeedbackForm | undefined>;
  createForm(form: InsertFeedbackForm): Promise<FeedbackForm>;
  updateForm(id: number, form: Partial<InsertFeedbackForm>): Promise<FeedbackForm | undefined>;
  deleteForm(id: number): Promise<boolean>;
  
  // Brand Settings methods
  getBrandSettings(): Promise<BrandSettings | undefined>;
  updateBrandSettings(settings: InsertBrandSettings): Promise<BrandSettings>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private feedback: Map<number, Feedback>;
  private templates: Map<number, EmailTemplate>;
  private forms: Map<number, FeedbackForm>;
  private brandSettings: BrandSettings | undefined;
  
  private userCurrentId: number;
  private feedbackCurrentId: number;
  private templateCurrentId: number;
  private formCurrentId: number;
  private brandSettingsId: number;

  constructor() {
    this.users = new Map();
    this.feedback = new Map();
    this.templates = new Map();
    this.forms = new Map();
    
    this.userCurrentId = 1;
    this.feedbackCurrentId = 1;
    this.templateCurrentId = 1;
    this.formCurrentId = 1;
    this.brandSettingsId = 1;
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample feedback data
    const sampleFeedback: InsertFeedback[] = [
      {
        customer: "Sarah Johnson",
        sentiment: "positive",
        sentimentScore: 85,
        message: "Love the service! Quick response time and very professional.",
        date: new Date("2023-08-15"),
        tags: ["service", "response time"],
      },
      {
        customer: "Mike Reynolds",
        sentiment: "negative",
        sentimentScore: 25,
        message: "Product arrived damaged. Customer service was helpful though.",
        date: new Date("2023-08-14"),
        tags: ["product", "delivery", "customer service"],
      },
      {
        customer: "Emma Lewis",
        sentiment: "positive",
        sentimentScore: 90,
        message: "The new feature is exactly what I needed. So intuitive!",
        date: new Date("2023-08-13"),
        tags: ["features", "usability"],
      },
      {
        customer: "Alex Thompson",
        sentiment: "neutral",
        sentimentScore: 50,
        message: "Product is good but shipping took longer than expected.",
        date: new Date("2023-08-12"),
        tags: ["product", "shipping"],
      },
      {
        customer: "David Clark",
        sentiment: "positive",
        sentimentScore: 80,
        message: "Great customer support team. They solved my issue in minutes!",
        date: new Date("2023-08-11"),
        tags: ["support", "service"],
      },
    ];

    sampleFeedback.forEach(feedback => {
      this.createFeedback(feedback);
    });

    // Sample email templates
    const sampleTemplates: InsertEmailTemplate[] = [
      {
        name: "Post-Purchase Follow-up",
        subject: "How was your recent purchase?",
        content: "Hi [Customer Name],\n\nThank you for your recent purchase with [Your Business].\n\nWe'd love to hear your feedback to help us improve our service...\n\n[Share Feedback Button]",
        status: "active",
      },
      {
        name: "Service Satisfaction",
        subject: "We value your feedback on our service",
        content: "Hi [Customer Name],\n\nThank you for using our services recently.\n\nWe'd appreciate your feedback on your experience...\n\n[Share Feedback Button]",
        status: "active",
      },
      {
        name: "Website Experience",
        subject: "Tell us about your website experience",
        content: "Hi [Customer Name],\n\nWe noticed you recently visited our website.\n\nWe'd love to hear about your experience...\n\n[Share Feedback Button]",
        status: "draft",
      },
    ];

    sampleTemplates.forEach(template => {
      this.createTemplate(template);
    });

    // Sample brand settings
    this.brandSettings = {
      id: this.brandSettingsId,
      businessName: "Acme Inc.",
      contactEmail: "feedback@acmeinc.com",
      websiteUrl: "https://acmeinc.com",
      primaryColor: "#3B82F6",
      secondaryColor: "#10B981",
      logo: "",
      fontFamily: "Inter",
      buttonStyle: "rounded",
      emailFooter: "© 2023 Acme Inc. All rights reserved. You're receiving this email because you're a customer of Acme Inc. If you wish to unsubscribe, click here.",
    };

    // Sample form
    const sampleForm: InsertFeedbackForm = {
      name: "Customer Satisfaction Form",
      questions: [
        {
          id: "q1",
          type: "rating",
          question: "Overall satisfaction",
          required: true,
        },
        {
          id: "q2",
          type: "multiple-choice",
          question: "What did you like most about our service?",
          options: ["Quality", "Speed", "Customer service", "Price", "Other"],
          required: false,
        },
        {
          id: "q3",
          type: "open-ended",
          question: "Do you have any suggestions for improvement?",
          required: false,
        },
        {
          id: "q4",
          type: "single-choice",
          question: "Would you recommend us to others?",
          options: ["Yes", "Maybe", "No"],
          required: true,
        },
      ],
      appearance: {
        brandColor: "#3B82F6",
        fontFamily: "Inter",
        buttonStyle: "rounded",
      },
    };

    this.createForm(sampleForm);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Feedback methods
  async getAllFeedback(): Promise<Feedback[]> {
    return Array.from(this.feedback.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getFeedback(id: number): Promise<Feedback | undefined> {
    return this.feedback.get(id);
  }

  async getFeedbackBySentiment(sentiment: string): Promise<Feedback[]> {
    return Array.from(this.feedback.values())
      .filter(feedback => feedback.sentiment === sentiment)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const id = this.feedbackCurrentId++;
    const feedback: Feedback = { 
      ...insertFeedback, 
      id,
      date: insertFeedback.date || new Date(),
    };
    this.feedback.set(id, feedback);
    return feedback;
  }

  async updateFeedback(id: number, feedbackUpdate: Partial<InsertFeedback>): Promise<Feedback | undefined> {
    const existingFeedback = this.feedback.get(id);
    if (!existingFeedback) return undefined;

    const updatedFeedback = { ...existingFeedback, ...feedbackUpdate };
    this.feedback.set(id, updatedFeedback);
    return updatedFeedback;
  }

  async deleteFeedback(id: number): Promise<boolean> {
    return this.feedback.delete(id);
  }

  // Email Template methods
  async getAllTemplates(): Promise<EmailTemplate[]> {
    return Array.from(this.templates.values());
  }

  async getTemplate(id: number): Promise<EmailTemplate | undefined> {
    return this.templates.get(id);
  }

  async createTemplate(insertTemplate: InsertEmailTemplate): Promise<EmailTemplate> {
    const id = this.templateCurrentId++;
    const template: EmailTemplate = { 
      ...insertTemplate, 
      id,
      lastEdited: new Date(),
    };
    this.templates.set(id, template);
    return template;
  }

  async updateTemplate(id: number, templateUpdate: Partial<InsertEmailTemplate>): Promise<EmailTemplate | undefined> {
    const existingTemplate = this.templates.get(id);
    if (!existingTemplate) return undefined;

    const updatedTemplate = { 
      ...existingTemplate, 
      ...templateUpdate,
      lastEdited: new Date(),
    };
    this.templates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  async deleteTemplate(id: number): Promise<boolean> {
    return this.templates.delete(id);
  }

  // Feedback Form methods
  async getAllForms(): Promise<FeedbackForm[]> {
    return Array.from(this.forms.values());
  }

  async getForm(id: number): Promise<FeedbackForm | undefined> {
    return this.forms.get(id);
  }

  async createForm(insertForm: InsertFeedbackForm): Promise<FeedbackForm> {
    const id = this.formCurrentId++;
    const form: FeedbackForm = { ...insertForm, id };
    this.forms.set(id, form);
    return form;
  }

  async updateForm(id: number, formUpdate: Partial<InsertFeedbackForm>): Promise<FeedbackForm | undefined> {
    const existingForm = this.forms.get(id);
    if (!existingForm) return undefined;

    const updatedForm = { ...existingForm, ...formUpdate };
    this.forms.set(id, updatedForm);
    return updatedForm;
  }

  async deleteForm(id: number): Promise<boolean> {
    return this.forms.delete(id);
  }

  // Brand Settings methods
  async getBrandSettings(): Promise<BrandSettings | undefined> {
    return this.brandSettings;
  }

  async updateBrandSettings(settings: InsertBrandSettings): Promise<BrandSettings> {
    const updatedSettings = { 
      ...settings, 
      id: this.brandSettingsId,
    };
    this.brandSettings = updatedSettings;
    return updatedSettings;
  }
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Feedback methods
  async getAllFeedback(): Promise<Feedback[]> {
    return await db.select().from(feedback).orderBy(desc(feedback.date));
  }
  
  async getFeedback(id: number): Promise<Feedback | undefined> {
    const [feedbackItem] = await db.select().from(feedback).where(eq(feedback.id, id));
    return feedbackItem;
  }
  
  async getFeedbackBySentiment(sentimentValue: string): Promise<Feedback[]> {
    return await db.select().from(feedback).where(eq(feedback.sentiment, sentimentValue)).orderBy(desc(feedback.date));
  }
  
  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    // The date will be automatically set by the default value in the database
    const [newFeedback] = await db.insert(feedback).values(insertFeedback).returning();
    return newFeedback;
  }
  
  async updateFeedback(id: number, feedbackUpdate: Partial<InsertFeedback>): Promise<Feedback | undefined> {
    const [updatedFeedback] = await db
      .update(feedback)
      .set(feedbackUpdate)
      .where(eq(feedback.id, id))
      .returning();
    
    return updatedFeedback;
  }
  
  async deleteFeedback(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(feedback)
      .where(eq(feedback.id, id))
      .returning({ id: feedback.id });
    
    return !!deleted;
  }
  
  // Email Template methods
  async getAllTemplates(): Promise<EmailTemplate[]> {
    return await db.select().from(emailTemplates).orderBy(desc(emailTemplates.lastEdited));
  }
  
  async getTemplate(id: number): Promise<EmailTemplate | undefined> {
    const [template] = await db.select().from(emailTemplates).where(eq(emailTemplates.id, id));
    return template;
  }
  
  async createTemplate(insertTemplate: InsertEmailTemplate): Promise<EmailTemplate> {
    // We don't need to manually set lastEdited as it has a defaultNow() value
    const [newTemplate] = await db.insert(emailTemplates).values(insertTemplate).returning();
    return newTemplate;
  }
  
  async updateTemplate(id: number, templateUpdate: Partial<InsertEmailTemplate>): Promise<EmailTemplate | undefined> {
    // Update the lastEdited time for tracking purposes
    const [updatedTemplate] = await db
      .update(emailTemplates)
      .set({
        ...templateUpdate,
        lastEdited: new Date()
      })
      .where(eq(emailTemplates.id, id))
      .returning();
    
    return updatedTemplate;
  }
  
  async deleteTemplate(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(emailTemplates)
      .where(eq(emailTemplates.id, id))
      .returning({ id: emailTemplates.id });
    
    return !!deleted;
  }
  
  // Feedback Form methods
  async getAllForms(): Promise<FeedbackForm[]> {
    return await db.select().from(feedbackForms);
  }
  
  async getForm(id: number): Promise<FeedbackForm | undefined> {
    const [form] = await db.select().from(feedbackForms).where(eq(feedbackForms.id, id));
    return form;
  }
  
  async createForm(insertForm: InsertFeedbackForm): Promise<FeedbackForm> {
    const [newForm] = await db.insert(feedbackForms).values(insertForm).returning();
    return newForm;
  }
  
  async updateForm(id: number, formUpdate: Partial<InsertFeedbackForm>): Promise<FeedbackForm | undefined> {
    const [updatedForm] = await db
      .update(feedbackForms)
      .set(formUpdate)
      .where(eq(feedbackForms.id, id))
      .returning();
    
    return updatedForm;
  }
  
  async deleteForm(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(feedbackForms)
      .where(eq(feedbackForms.id, id))
      .returning({ id: feedbackForms.id });
    
    return !!deleted;
  }
  
  // Brand Settings methods
  async getBrandSettings(): Promise<BrandSettings | undefined> {
    const [settings] = await db.select().from(brandSettings);
    return settings;
  }
  
  async updateBrandSettings(settings: InsertBrandSettings): Promise<BrandSettings> {
    const existingSettings = await this.getBrandSettings();
    
    if (existingSettings) {
      const [updatedSettings] = await db
        .update(brandSettings)
        .set(settings)
        .where(eq(brandSettings.id, existingSettings.id))
        .returning();
      
      return updatedSettings;
    } else {
      const [newSettings] = await db.insert(brandSettings).values(settings).returning();
      return newSettings;
    }
  }
  
  // Initialize sample data if the database is empty
  async initializeSampleData(): Promise<void> {
    // Check if we have any data
    const feedbackResult = await db.select().from(feedback).limit(1);
    
    if (feedbackResult.length > 0) {
      return; // Database already has data
    }
    
    // Add sample data
    await db.insert(feedback).values([
      {
        customer: "Sarah Johnson",
        sentiment: "positive",
        sentimentScore: 85,
        message: "The customer service was excellent! The representative was very helpful and solved my issue quickly.",
        tags: ["service", "support"],
        businessId: 1
      },
      {
        customer: "Michael Smith",
        sentiment: "neutral",
        sentimentScore: 50,
        message: "The product works as expected. Nothing exceptional, but it gets the job done.",
        tags: ["product"],
        businessId: 1
      },
      {
        customer: "Robert Davis",
        sentiment: "negative",
        sentimentScore: 25,
        message: "I had to wait over 20 minutes to speak with someone and my issue still isn't resolved.",
        tags: ["service", "wait time"],
        businessId: 1
      }
    ]);
    
    await db.insert(emailTemplates).values([
      {
        name: "Post-Purchase Feedback",
        subject: "How was your recent purchase?",
        content: "Hi {{customer.name}},\n\nThank you for your recent purchase with Acme Inc. We hope you're enjoying your new {{product.name}}.\n\nWe'd love to hear your feedback! Please click the link below to share your thoughts:\n\n{{feedback.link}}\n\nYour input helps us improve and better serve customers like you.\n\nBest regards,\nThe Acme Team",
        status: "active",
        businessId: 1
      },
      {
        name: "Service Follow-up",
        subject: "How did we do? Tell us about your service experience",
        content: "Hello {{customer.name}},\n\nThank you for choosing Acme Inc. for your recent service appointment.\n\nWe strive to provide excellent service to all our customers and would appreciate your feedback.\n\nPlease take a moment to rate your experience:\n\n{{feedback.link}}\n\nIf you have any questions or need further assistance, please don't hesitate to contact us.\n\nThank you,\nAcme Customer Service",
        status: "active",
        businessId: 1
      }
    ]);
    
    await db.insert(feedbackForms).values({
      name: "Customer Satisfaction Survey",
      questions: [
        {
          id: "q1",
          type: "rating",
          question: "How would you rate your overall experience?",
          required: true
        },
        {
          id: "q2",
          type: "multiple-choice",
          question: "Which aspects of our service were most important to you?",
          options: ["Quality", "Price", "Customer Service", "Speed", "Convenience"],
          required: false
        },
        {
          id: "q3",
          type: "open-ended",
          question: "Do you have any additional comments or suggestions?",
          required: false
        }
      ],
      appearance: {
        brandColor: "#3B82F6",
        fontFamily: "Inter",
        buttonStyle: "rounded"
      },
      businessId: 1
    });
    
    await db.insert(brandSettings).values({
      businessName: "Acme Inc.",
      contactEmail: "contact@acmeinc.com",
      websiteUrl: "https://acmeinc.com",
      primaryColor: "#3B82F6",
      secondaryColor: "#10B981",
      logo: "https://placehold.co/200x200?text=ACME",
      fontFamily: "Inter",
      buttonStyle: "rounded",
      emailFooter: "© 2023 Acme Inc. All rights reserved.",
      businessId: 1
    });
  }
}

// Switch from MemStorage to DatabaseStorage
export const storage = new DatabaseStorage();

// Initialize sample data
storage.initializeSampleData().catch(console.error);

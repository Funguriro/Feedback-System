import { pgTable, text, serial, integer, boolean, timestamp, json, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  businessName: text("business_name"),
  contactEmail: text("contact_email"),
  websiteUrl: text("website_url"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  businessName: true,
  contactEmail: true,
  websiteUrl: true,
});

// Feedback table
export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  customer: text("customer").notNull(),
  sentiment: text("sentiment").notNull(), // positive, neutral, negative
  sentimentScore: integer("sentiment_score"), // numerical score (0-100)
  message: text("message").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  tags: text("tags").array(),
  businessId: integer("business_id"), // Can link to a business later
});

export const insertFeedbackSchema = createInsertSchema(feedback).pick({
  customer: true,
  sentiment: true,
  sentimentScore: true,
  message: true,
  tags: true,
  businessId: true,
});

// Email Templates table
export const emailTemplates = pgTable("email_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull(), // active, draft
  lastEdited: timestamp("last_edited").notNull().defaultNow(),
  businessId: integer("business_id"), // Can link to a business later
});

export const insertEmailTemplateSchema = createInsertSchema(emailTemplates).pick({
  name: true,
  subject: true,
  content: true,
  status: true,
  businessId: true,
});

// Feedback Forms table
export const feedbackForms = pgTable("feedback_forms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  questions: jsonb("questions").notNull(),
  appearance: jsonb("appearance").notNull(), // json containing color, logo, font, etc.
  businessId: integer("business_id"), // Can link to a business later
});

export const insertFeedbackFormSchema = createInsertSchema(feedbackForms).pick({
  name: true,
  questions: true,
  appearance: true,
  businessId: true,
});

// Brand Settings table
export const brandSettings = pgTable("brand_settings", {
  id: serial("id").primaryKey(),
  businessName: text("business_name"),
  contactEmail: text("contact_email"),
  websiteUrl: text("website_url"),
  primaryColor: text("primary_color").default("#3B82F6"),
  secondaryColor: text("secondary_color").default("#10B981"),
  logo: text("logo"),
  fontFamily: text("font_family").default("Inter"),
  buttonStyle: text("button_style").default("rounded"),
  emailFooter: text("email_footer"),
  businessId: integer("business_id"), // Can link to a business later
});

export const insertBrandSettingsSchema = createInsertSchema(brandSettings).pick({
  businessName: true,
  contactEmail: true,
  websiteUrl: true,
  primaryColor: true,
  secondaryColor: true,
  logo: true,
  fontFamily: true,
  buttonStyle: true,
  emailFooter: true,
  businessId: true,
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  feedback: many(feedback),
  emailTemplates: many(emailTemplates),
  feedbackForms: many(feedbackForms),
  brandSettings: many(brandSettings),
}));

export const feedbackRelations = relations(feedback, ({ one }) => ({
  business: one(users, {
    fields: [feedback.businessId],
    references: [users.id],
  }),
}));

export const emailTemplatesRelations = relations(emailTemplates, ({ one }) => ({
  business: one(users, {
    fields: [emailTemplates.businessId],
    references: [users.id],
  }),
}));

export const feedbackFormsRelations = relations(feedbackForms, ({ one }) => ({
  business: one(users, {
    fields: [feedbackForms.businessId],
    references: [users.id],
  }),
}));

export const brandSettingsRelations = relations(brandSettings, ({ one }) => ({
  business: one(users, {
    fields: [brandSettings.businessId],
    references: [users.id],
  }),
}));

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedback.$inferSelect;

export type InsertEmailTemplate = z.infer<typeof insertEmailTemplateSchema>;
export type EmailTemplate = typeof emailTemplates.$inferSelect;

export type InsertFeedbackForm = z.infer<typeof insertFeedbackFormSchema>;
export type FeedbackForm = typeof feedbackForms.$inferSelect;

export type InsertBrandSettings = z.infer<typeof insertBrandSettingsSchema>;
export type BrandSettings = typeof brandSettings.$inferSelect;

// Additional Schemas for validation
export const sentimentSchema = z.enum(["positive", "neutral", "negative"]);

export const questionSchema = z.object({
  id: z.string(),
  type: z.enum(["rating", "multiple-choice", "open-ended", "single-choice"]),
  question: z.string(),
  options: z.array(z.string()).optional(),
  required: z.boolean().default(false),
});

export const appearanceSchema = z.object({
  brandColor: z.string(),
  logo: z.string().optional(),
  fontFamily: z.string().default("Inter"),
  buttonStyle: z.enum(["rounded", "square", "outline"]).default("rounded"),
});

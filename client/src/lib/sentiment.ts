import { apiRequest } from "./queryClient";

export type SentimentAnalysis = {
  sentiment: "positive" | "neutral" | "negative";
  score: number;
}

export async function analyzeSentiment(text: string): Promise<SentimentAnalysis> {
  try {
    const response = await apiRequest("POST", "/api/analyze-sentiment", { text });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    // Default to neutral if analysis fails
    return { sentiment: "neutral", score: 50 };
  }
}

export function getSentimentLabel(score: number): string {
  if (score >= 75) return "Very Positive";
  if (score >= 60) return "Positive";
  if (score >= 40) return "Neutral";
  if (score >= 25) return "Negative";
  return "Very Negative";
}

export function getSentimentEmoji(sentiment: string): string {
  switch (sentiment) {
    case "positive":
      return "😃";
    case "negative":
      return "😞";
    case "neutral":
      return "😐";
    default:
      return "🤔";
  }
}

export function scoreToRating(score: number): number {
  // Convert 0-100 score to 1-5 rating
  return Math.round(score / 20);
}

export function ratingToScore(rating: number): number {
  // Convert 1-5 rating to 0-100 score
  return rating * 20;
}

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { analyzeSentiment } from "@/lib/sentiment";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Star, StarHalf, ThumbsUp } from "lucide-react";

const feedbackSchema = z.object({
  customer: z.string().min(1, "Customer name is required"),
  message: z.string().min(5, "Please provide feedback with at least 5 characters"),
  tags: z.string().optional().transform((val) => val ? val.split(",").map((tag) => tag.trim()) : [] as string[]),
});

type FeedbackValues = z.infer<typeof feedbackSchema>;

export default function SubmitFeedback() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FeedbackValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      customer: "",
      message: "",
      tags: "",
    },
  });

  async function onSubmit(data: FeedbackValues) {
    setIsSubmitting(true);
    try {
      // Analyze sentiment of the message
      const sentiment = await analyzeSentiment(data.message);
      
      // Create the feedback object with the sentimentScore from analysis
      const feedbackData = {
        ...data,
        sentiment: sentiment.sentiment,
        sentimentScore: sentiment.score,
        businessId: 1,
      };
      
      // Submit to the API
      await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });
      
      // Reset the form
      form.reset();
      
      // Invalidate the feedback query to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/feedback"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      
      // Show success message
      toast({
        title: "Feedback submitted!",
        description: "Thank you for your feedback.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: "There was an error submitting your feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container py-10 max-w-2xl mx-auto">
      <Card className="w-full">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-6 w-6 text-yellow-300" />
            <StarHalf className="h-6 w-6 text-yellow-300" />
            <Star className="h-6 w-6 text-yellow-300" />
          </div>
          <CardTitle className="text-xl md:text-2xl">Share Your Feedback</CardTitle>
          <CardDescription className="text-blue-100">
            We value your opinion and would love to hear about your experience
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="customer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Feedback</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please share your experience with our product or service..." 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="service, product, support (comma separated)"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6 bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ThumbsUp className="h-4 w-4" />
            <span>Your feedback helps us improve our services</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
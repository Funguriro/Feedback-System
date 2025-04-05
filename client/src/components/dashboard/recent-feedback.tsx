import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { FeedbackCard } from "@/components/ui/feedback-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { type Feedback } from "@shared/schema";

export function RecentFeedback() {
  const { data, isLoading } = useQuery<Feedback[]>({
    queryKey: ['/api/feedback'],
  });
  
  const recentFeedback = data?.slice(0, 3) || [];
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-bold">Recent Feedback</CardTitle>
        <Link href="/feedback">
          <Button variant="link" className="text-primary text-sm p-0 h-auto">
            View all
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="pt-2">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg animate-pulse">
                <div className="flex justify-between mb-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded mb-2"></div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {recentFeedback.length > 0 ? (
              recentFeedback.map((feedback) => (
                <FeedbackCard key={feedback.id} feedback={feedback} />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No feedback yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Feedback will appear here as it comes in
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

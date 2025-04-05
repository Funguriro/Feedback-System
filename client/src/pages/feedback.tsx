import { useState } from "react";
import { FeedbackFilter } from "@/components/feedback/feedback-filter";
import { FeedbackList } from "@/components/feedback/feedback-list";

export default function Feedback() {
  const [activeSentiment, setActiveSentiment] = useState<string>("all");

  const handleSentimentChange = (sentiment: string) => {
    setActiveSentiment(sentiment);
  };

  return (
    <div>
      <FeedbackFilter 
        onSentimentChange={handleSentimentChange} 
        activeSentiment={activeSentiment}
      />
      
      <div className="mt-4">
        <FeedbackList sentiment={activeSentiment !== "all" ? activeSentiment : undefined} />
      </div>
    </div>
  );
}

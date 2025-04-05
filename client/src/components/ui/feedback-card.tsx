import { formatDate, getSentimentColor, truncateText } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { type Feedback } from "@shared/schema";

interface FeedbackCardProps {
  feedback: Feedback;
  onClick?: () => void;
}

export function FeedbackCard({ feedback, onClick }: FeedbackCardProps) {
  const sentimentClass = getSentimentColor(feedback.sentiment);
  
  return (
    <div 
      className="p-3 bg-gray-50 rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between">
        <p className="font-medium text-gray-800">{feedback.customer}</p>
        <Badge variant="outline" className={sentimentClass}>
          {feedback.sentiment.charAt(0).toUpperCase() + feedback.sentiment.slice(1)}
        </Badge>
      </div>
      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
        {truncateText(feedback.message, 100)}
      </p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-500">{formatDate(feedback.date)}</span>
        <div className="flex flex-wrap gap-1">
          {feedback.tags && feedback.tags.slice(0, 2).map((tag, index) => (
            <span key={index} className="text-xs px-2 py-0.5 bg-gray-200 rounded-full">
              {tag}
            </span>
          ))}
          {feedback.tags && feedback.tags.length > 2 && (
            <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full">
              +{feedback.tags.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

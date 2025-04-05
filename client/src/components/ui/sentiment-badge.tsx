import { cn } from "@/lib/utils";

type SentimentType = "positive" | "neutral" | "negative";

interface SentimentBadgeProps {
  sentiment: SentimentType;
  className?: string;
  withIcon?: boolean;
}

export function SentimentBadge({ 
  sentiment, 
  className, 
  withIcon = true 
}: SentimentBadgeProps) {
  const getSentimentClass = () => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-600";
      case "negative":
        return "bg-red-100 text-red-600";
      case "neutral":
        return "bg-amber-100 text-amber-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getSentimentIcon = () => {
    switch (sentiment) {
      case "positive":
        return "ri-emotion-happy-line";
      case "negative":
        return "ri-emotion-unhappy-line";
      case "neutral":
        return "ri-emotion-normal-line";
      default:
        return "";
    }
  };

  return (
    <span 
      className={cn(
        "px-2 py-1 text-xs rounded-full inline-flex items-center",
        getSentimentClass(),
        className
      )}
    >
      {withIcon && (
        <i className={`${getSentimentIcon()} mr-1`}></i>
      )}
      <span>{sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}</span>
    </span>
  );
}

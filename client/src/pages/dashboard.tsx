import { useQuery } from "@tanstack/react-query";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { SentimentChart } from "@/components/dashboard/sentiment-chart";
import { RecentFeedback } from "@/components/dashboard/recent-feedback";

export default function Dashboard() {
  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ['/api/stats'],
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Overview of your feedback and sentiment analysis</p>
      </div>

      {/* Quick Stats */}
      <StatsOverview />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment Distribution */}
        {!isStatsLoading && statsData && (
          <SentimentChart data={statsData.sentimentDistribution} />
        )}

        {/* Recent Feedback */}
        <RecentFeedback />
      </div>
    </div>
  );
}

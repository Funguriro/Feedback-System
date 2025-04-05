import { StatsCard } from "@/components/ui/stats-card";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, MailCheck, Smile, Percent } from "lucide-react";
import { useBrandSettings } from "@/hooks/use-brand-settings";

interface StatsData {
  recentResponses: number;
  activeCampaigns: number;
  avgSentiment: string;
  responseRate: number;
}

export function StatsOverview() {
  const { data, isLoading } = useQuery<StatsData>({
    queryKey: ['/api/stats'],
  });
  
  const { brandSettings } = useBrandSettings();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4 border border-gray-100 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }
  
  if (!data) {
    return null;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatsCard
        title="Recent Responses"
        value={data.recentResponses}
        icon={<MessageSquare className="h-5 w-5 text-primary" />}
        change={12.5}
        iconBackground={`bg-primary/10 text-primary`}
      />
      
      <StatsCard
        title="Active Campaigns"
        value={data.activeCampaigns}
        icon={<MailCheck className="h-5 w-5 text-secondary" />}
        change={5.2}
        iconBackground="bg-[#10B981]/10 text-[#10B981]"
      />
      
      <StatsCard
        title="Average Sentiment"
        value={`${data.avgSentiment}/5`}
        icon={<Smile className="h-5 w-5 text-[#10B981]" />}
        change={3.8}
        iconBackground="bg-[#10B981]/10 text-[#10B981]"
      />
      
      <StatsCard
        title="Response Rate"
        value={`${data.responseRate}%`}
        icon={<Percent className="h-5 w-5 text-[#8B5CF6]" />}
        change={-2.3}
        iconBackground="bg-[#8B5CF6]/10 text-[#8B5CF6]"
      />
    </div>
  );
}

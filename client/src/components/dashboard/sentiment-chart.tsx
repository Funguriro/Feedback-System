import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBrandSettings } from "@/hooks/use-brand-settings";
import { useEffect, useState } from "react";

interface SentimentDistribution {
  positive: number;
  neutral: number;
  negative: number;
}

interface SentimentChartProps {
  data: SentimentDistribution;
}

export function SentimentChart({ data }: SentimentChartProps) {
  const [timeRange, setTimeRange] = useState("7");
  const { brandSettings } = useBrandSettings();
  const [chartData, setChartData] = useState(data);

  useEffect(() => {
    // In a real app, we would fetch new data based on the time range
    // For now, we'll just use the provided data
    setChartData(data);
  }, [timeRange, data]);

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-bold">Sentiment Distribution</CardTitle>
        <Select
          value={timeRange}
          onValueChange={setTimeRange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-64 relative">
          <div className="flex h-full items-end justify-around">
            <div className="w-1/3 px-4">
              <div className="relative mb-2 flex justify-center">
                <div 
                  className="h-48 w-20 rounded-t-lg" 
                  style={{ 
                    height: `${chartData.positive * 0.75}%`,
                    backgroundColor: '#10B981' // Green for positive
                  }}
                ></div>
                <span className="absolute bottom-2 text-white font-bold">
                  {chartData.positive}%
                </span>
              </div>
              <p className="text-center text-sm font-medium text-gray-600">Positive</p>
            </div>
            <div className="w-1/3 px-4">
              <div className="relative mb-2 flex justify-center">
                <div 
                  className="h-24 w-20 rounded-t-lg" 
                  style={{ 
                    height: `${chartData.neutral * 0.75}%`,
                    backgroundColor: '#F59E0B' // Amber for neutral
                  }}
                ></div>
                <span className="absolute bottom-2 text-white font-bold">
                  {chartData.neutral}%
                </span>
              </div>
              <p className="text-center text-sm font-medium text-gray-600">Neutral</p>
            </div>
            <div className="w-1/3 px-4">
              <div className="relative mb-2 flex justify-center">
                <div 
                  className="h-16 w-20 rounded-t-lg" 
                  style={{ 
                    height: `${chartData.negative * 0.75}%`,
                    backgroundColor: '#EF4444' // Red for negative
                  }}
                ></div>
                <span className="absolute bottom-2 text-white font-bold">
                  {chartData.negative}%
                </span>
              </div>
              <p className="text-center text-sm font-medium text-gray-600">Negative</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

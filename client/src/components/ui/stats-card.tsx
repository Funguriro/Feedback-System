import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  iconBackground?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  change,
  iconBackground = "bg-primary/10",
  className,
}: StatsCardProps) {
  const isPositiveChange = change && change > 0;
  const trendIcon = isPositiveChange ? "ri-arrow-up-line" : "ri-arrow-down-line";
  const trendClass = isPositiveChange ? "text-green-600" : "text-red-600";

  return (
    <div className={cn("bg-white rounded-lg shadow p-4 border border-gray-100", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={cn("p-2 rounded", iconBackground)}>
          {icon}
        </div>
      </div>
      {change !== undefined && (
        <div className="flex items-center mt-4">
          <span className={cn("flex items-center text-xs font-medium", trendClass)}>
            <i className={`${trendIcon} mr-1`}></i> {Math.abs(change)}%
          </span>
          <span className="text-xs text-gray-500 ml-2">since last month</span>
        </div>
      )}
    </div>
  );
}

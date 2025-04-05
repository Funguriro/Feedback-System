import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Filter, Download, Search } from "lucide-react";
import { downloadAsCSV } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { type Feedback } from "@shared/schema";

interface FeedbackFilterProps {
  onSentimentChange: (sentiment: string) => void;
  activeSentiment: string;
}

export function FeedbackFilter({ 
  onSentimentChange, 
  activeSentiment 
}: FeedbackFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  
  const { data: feedbackList } = useQuery<Feedback[]>({
    queryKey: ['/api/feedback'],
  });
  
  const handleExport = () => {
    if (!feedbackList || feedbackList.length === 0) return;
    
    // Format data for CSV export
    const exportData = feedbackList.map(feedback => ({
      Customer: feedback.customer,
      Sentiment: feedback.sentiment,
      Message: feedback.message,
      Date: new Date(feedback.date).toLocaleDateString(),
      Tags: feedback.tags ? feedback.tags.join('; ') : '',
    }));
    
    downloadAsCSV(exportData, 'feedback_export.csv');
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would filter the data based on the search term
    console.log("Searching for:", searchTerm);
  };
  
  return (
    <div className="space-y-4">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customer Feedback</h1>
          <p className="text-gray-600">Manage and analyze customer feedback</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button variant="outline" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" className="flex items-center" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex border-b">
          <Button 
            variant="ghost" 
            className={`px-4 py-3 text-sm font-medium ${activeSentiment === 'all' ? 'border-b-2 border-primary text-primary' : ''}`}
            onClick={() => onSentimentChange('all')}
          >
            All Feedback
          </Button>
          <Button 
            variant="ghost" 
            className={`px-4 py-3 text-sm font-medium ${activeSentiment === 'positive' ? 'border-b-2 border-primary text-primary' : ''}`}
            onClick={() => onSentimentChange('positive')}
          >
            Positive
          </Button>
          <Button 
            variant="ghost" 
            className={`px-4 py-3 text-sm font-medium ${activeSentiment === 'neutral' ? 'border-b-2 border-primary text-primary' : ''}`}
            onClick={() => onSentimentChange('neutral')}
          >
            Neutral
          </Button>
          <Button 
            variant="ghost" 
            className={`px-4 py-3 text-sm font-medium ${activeSentiment === 'negative' ? 'border-b-2 border-primary text-primary' : ''}`}
            onClick={() => onSentimentChange('negative')}
          >
            Negative
          </Button>
        </div>

        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <form onSubmit={handleSearch} className="flex w-full">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    className="pl-10 pr-3 py-2"
                    placeholder="Search feedback..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button type="submit" className="ml-2 hidden sm:block">Search</Button>
              </form>
            </div>
            <div className="flex space-x-2">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All dates</SelectItem>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={tagFilter} onValueChange={setTagFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All tags</SelectItem>
                  <SelectItem value="product">product</SelectItem>
                  <SelectItem value="service">service</SelectItem>
                  <SelectItem value="delivery">delivery</SelectItem>
                  <SelectItem value="support">support</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

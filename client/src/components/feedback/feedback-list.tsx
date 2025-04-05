import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Feedback } from "@shared/schema";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { SentimentBadge } from "@/components/ui/sentiment-badge";
import { Eye, MessageCircle, MoreHorizontal } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface FeedbackListProps {
  sentiment?: string;
}

export function FeedbackList({ sentiment }: FeedbackListProps) {
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  
  const queryKey = sentiment ? 
    [`/api/feedback?sentiment=${sentiment}`] : 
    ['/api/feedback'];
    
  const { data: feedbackList, isLoading } = useQuery<Feedback[]>({
    queryKey,
  });
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  const handleViewFeedback = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
  };
  
  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Sentiment</TableHead>
                <TableHead>Feedback</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbackList && feedbackList.length > 0 ? (
                feedbackList.map((feedback) => (
                  <TableRow key={feedback.id}>
                    <TableCell className="font-medium">{feedback.customer}</TableCell>
                    <TableCell>
                      <SentimentBadge sentiment={feedback.sentiment as any} />
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {feedback.message}
                    </TableCell>
                    <TableCell>{formatDate(feedback.date)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {feedback.tags && feedback.tags.slice(0, 2).map((tag, i) => (
                          <Badge key={i} variant="outline" className="bg-gray-100">
                            {tag}
                          </Badge>
                        ))}
                        {feedback.tags && feedback.tags.length > 2 && (
                          <Badge variant="outline" className="bg-gray-100">
                            +{feedback.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleViewFeedback(feedback)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-gray-500">No feedback found</p>
                    {sentiment && (
                      <p className="text-sm text-gray-400 mt-1">
                        Try selecting a different sentiment filter
                      </p>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination - Static for now */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{feedbackList?.length || 0}</span> of{" "}
                <span className="font-medium">{feedbackList?.length || 0}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <Button
                  variant="outline"
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium"
                  disabled
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  className="relative inline-flex items-center px-4 py-2 border text-sm font-medium bg-primary text-white"
                >
                  1
                </Button>
                <Button
                  variant="outline"
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium"
                  disabled
                >
                  Next
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      
      {/* Feedback Detail Dialog */}
      <Dialog open={!!selectedFeedback} onOpenChange={(open) => !open && setSelectedFeedback(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
          </DialogHeader>
          
          {selectedFeedback && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{selectedFeedback.customer}</h3>
                  <p className="text-sm text-gray-500">{formatDate(selectedFeedback.date)}</p>
                </div>
                <SentimentBadge sentiment={selectedFeedback.sentiment as any} />
              </div>
              
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-gray-700">{selectedFeedback.message}</p>
              </div>
              
              {selectedFeedback.tags && selectedFeedback.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedFeedback.tags.map((tag, i) => (
                      <Badge key={i} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-2 pt-4">
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
                <Button variant="default">Respond</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

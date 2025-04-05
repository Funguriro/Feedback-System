import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Copy, Trash2 } from "lucide-react";
import { EmailTemplate } from "@shared/schema";
import { formatDate } from "@/lib/utils";
import { useBrandSettings } from "@/hooks/use-brand-settings";

interface TemplateCardProps {
  template: EmailTemplate;
  onEdit: (id: number) => void;
  onDuplicate: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TemplateCard({
  template,
  onEdit,
  onDuplicate,
  onDelete,
}: TemplateCardProps) {
  const { brandSettings } = useBrandSettings();
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 border-b border-gray-100 space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-gray-800">{template.name}</h3>
          {template.status === "active" ? (
            <Badge variant="default" className="bg-green-100 text-green-600 hover:bg-green-100">
              Active
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-gray-100 text-gray-600 hover:bg-gray-100">
              Draft
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600">{template.subject}</p>
      </CardHeader>
      
      <CardContent className="p-4 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500">PREVIEW</span>
        </div>
        <div className="border border-gray-200 rounded-md bg-white p-3 text-sm text-gray-700">
          <p>Hi [Customer Name],</p>
          <p className="mt-2">
            Thank you for your recent [interaction/purchase] with {brandSettings?.businessName || "[Your Business]"}.
          </p>
          <p className="mt-2">We'd love to hear your feedback to help us improve our service...</p>
          <div className="mt-3 text-center">
            <button 
              className="px-4 py-1 text-white rounded-md text-sm"
              style={{ backgroundColor: brandSettings?.primaryColor || "#3B82F6" }}
            >
              Share Feedback
            </button>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 flex justify-between">
        <div className="text-sm text-gray-500">
          <span>Last edited: {formatDate(template.lastEdited)}</span>
        </div>
        <div className="flex space-x-2">
          <button 
            className="p-1 text-gray-600 hover:text-primary"
            onClick={() => onEdit(template.id)}
            aria-label="Edit template"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button 
            className="p-1 text-gray-600 hover:text-primary"
            onClick={() => onDuplicate(template.id)}
            aria-label="Duplicate template"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button 
            className="p-1 text-gray-600 hover:text-red-500"
            onClick={() => onDelete(template.id)}
            aria-label="Delete template"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}

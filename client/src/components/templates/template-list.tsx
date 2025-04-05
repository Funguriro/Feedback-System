import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { TemplateCard } from "@/components/ui/template-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TemplateForm } from "@/components/templates/template-form";
import { Plus } from "lucide-react";
import { type EmailTemplate } from "@shared/schema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function TemplateList() {
  const [isNewTemplateDialogOpen, setIsNewTemplateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const { toast } = useToast();
  
  const { data: templates, isLoading, error } = useQuery<EmailTemplate[]>({
    queryKey: ['/api/templates'],
  });
  
  const createMutation = useMutation({
    mutationFn: async (template: Omit<EmailTemplate, 'id'>) => {
      const res = await apiRequest('POST', '/api/templates', template);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
      toast({
        title: "Template created",
        description: "Your email template has been created successfully",
      });
      setIsNewTemplateDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Failed to create template",
        description: "There was a problem creating your email template",
        variant: "destructive",
      });
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...template }: EmailTemplate) => {
      const res = await apiRequest('PUT', `/api/templates/${id}`, template);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
      toast({
        title: "Template updated",
        description: "Your email template has been updated successfully",
      });
      setSelectedTemplate(null);
    },
    onError: () => {
      toast({
        title: "Failed to update template",
        description: "There was a problem updating your email template",
        variant: "destructive",
      });
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/templates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
      toast({
        title: "Template deleted",
        description: "Your email template has been deleted successfully",
      });
      setDeleteDialogOpen(false);
      setSelectedTemplate(null);
    },
    onError: () => {
      toast({
        title: "Failed to delete template",
        description: "There was a problem deleting your email template",
        variant: "destructive",
      });
    }
  });
  
  const handleEdit = (id: number) => {
    const template = templates?.find(t => t.id === id);
    if (template) {
      setSelectedTemplate(template);
    }
  };
  
  const handleDuplicate = (id: number) => {
    const template = templates?.find(t => t.id === id);
    if (template) {
      const duplicatedTemplate = {
        ...template,
        name: `${template.name} (Copy)`,
        status: "draft" as const,
      };
      // Remove id to create a new template
      const { id: _, ...newTemplate } = duplicatedTemplate;
      createMutation.mutate(newTemplate as any);
    }
  };
  
  const handleDelete = (id: number) => {
    const template = templates?.find(t => t.id === id);
    if (template) {
      setSelectedTemplate(template);
      setDeleteDialogOpen(true);
    }
  };
  
  const confirmDelete = () => {
    if (selectedTemplate) {
      deleteMutation.mutate(selectedTemplate.id);
    }
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-24 bg-gray-100 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load email templates. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {templates?.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onEdit={() => handleEdit(template.id)}
            onDuplicate={() => handleDuplicate(template.id)}
            onDelete={() => handleDelete(template.id)}
          />
        ))}
        
        {/* New Template Card */}
        <div 
          className="bg-gray-50 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-gray-100"
          onClick={() => setIsNewTemplateDialogOpen(true)}
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium text-gray-800 mb-1">Create New Template</h3>
          <p className="text-sm text-gray-500">Design a custom feedback request email</p>
        </div>
      </div>
      
      {/* New Template Dialog */}
      <Dialog open={isNewTemplateDialogOpen} onOpenChange={setIsNewTemplateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Email Template</DialogTitle>
          </DialogHeader>
          <TemplateForm 
            onSubmit={(data) => createMutation.mutate(data as any)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Template Dialog */}
      <Dialog 
        open={!!selectedTemplate && !deleteDialogOpen} 
        onOpenChange={(open) => !open && setSelectedTemplate(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Email Template</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <TemplateForm 
              template={selectedTemplate}
              onSubmit={(data) => updateMutation.mutate({ ...data, id: selectedTemplate.id } as any)}
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              Are you sure you want to delete the template "{selectedTemplate?.name}"? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Template"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

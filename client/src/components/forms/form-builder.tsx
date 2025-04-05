import { useState } from "react";
import { useBrandSettings } from "@/hooks/use-brand-settings";
import { Button } from "@/components/ui/button";
import { FormPreview } from "@/components/forms/form-preview";
import { ColorPicker } from "@/components/color-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Plus, GripVertical, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type QuestionType = 'rating' | 'multiple-choice' | 'open-ended' | 'single-choice';

interface FormQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  required: boolean;
}

const initialQuestions: FormQuestion[] = [
  {
    id: 'q1',
    type: 'rating',
    question: 'Overall satisfaction',
    required: true,
  },
  {
    id: 'q2',
    type: 'multiple-choice',
    question: 'What did you like most about our service?',
    options: ['Quality', 'Speed', 'Customer service', 'Price', 'Other'],
    required: false,
  },
  {
    id: 'q3',
    type: 'open-ended',
    question: 'Do you have any suggestions for improvement?',
    required: false,
  },
  {
    id: 'q4',
    type: 'single-choice',
    question: 'Would you recommend us to others?',
    options: ['Yes', 'Maybe', 'No'],
    required: true,
  },
];

export function FormBuilder() {
  const { brandSettings, updateBrandSettings } = useBrandSettings();
  const [questions, setQuestions] = useState<FormQuestion[]>(initialQuestions);
  const [formName, setFormName] = useState('Customer Satisfaction Form');
  const [brandColor, setBrandColor] = useState(brandSettings?.primaryColor || '#3B82F6');
  const [selectedFont, setSelectedFont] = useState(brandSettings?.fontFamily || 'Inter');
  
  const handleBrandColorChange = (color: string) => {
    setBrandColor(color);
  };
  
  const handleFontChange = (font: string) => {
    setSelectedFont(font);
  };
  
  const getQuestionTypeLabel = (type: QuestionType): string => {
    switch (type) {
      case 'rating':
        return 'Rating scale (1-5)';
      case 'multiple-choice':
        return 'Multiple choice';
      case 'open-ended':
        return 'Open-ended response';
      case 'single-choice':
        return 'Single choice';
      default:
        return '';
    }
  };
  
  const handleSaveForm = () => {
    // Save form logic would go here
    // In a real app, we would save the form to the backend
    alert('Form saved successfully!');
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="border-b border-gray-200 p-4">
        <Input
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          className="text-lg font-bold text-gray-800 border-0 p-0 mb-1 focus-visible:ring-0"
        />
        <p className="text-sm text-gray-600">Customize your feedback form appearance and questions</p>
      </div>
      
      <div className="p-6">
        {/* Form Preview */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 mb-3">PREVIEW</h3>
          <FormPreview 
            formName={formName}
            questions={questions}
            brandColor={brandColor}
            fontFamily={selectedFont}
          />
        </div>
        
        {/* Form Builder Controls */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium text-gray-500 mb-4">FORM EDITOR</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Form Design Options */}
            <div className="md:col-span-1">
              <h4 className="font-medium text-gray-800 mb-3">Appearance</h4>
              <div className="space-y-4">
                <ColorPicker
                  label="Brand Color"
                  value={brandColor}
                  onChange={handleBrandColorChange}
                />
                
                <div>
                  <Label className="block text-sm text-gray-700 mb-1">Logo</Label>
                  <Button variant="outline" className="w-full flex items-center justify-center">
                    <Upload className="mr-2 h-4 w-4" />
                    <span>Upload logo</span>
                  </Button>
                </div>
                
                <div>
                  <Label className="block text-sm text-gray-700 mb-1">Font</Label>
                  <Select value={selectedFont} onValueChange={handleFontChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter (Default)</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Poppins">Poppins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Form Questions Editor */}
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">Questions</h4>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Plus className="mr-1 h-4 w-4" />
                  <span>Add Question</span>
                </Button>
              </div>
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <Card key={question.id} className="border border-gray-200 rounded-md">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <GripVertical className="text-gray-400 mr-2 h-5 w-5" />
                          <span className="font-medium text-gray-800">{question.question}</span>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Pencil className="h-4 w-4 text-gray-500" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Trash2 className="h-4 w-4 text-gray-500" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">{getQuestionTypeLabel(question.type)}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-4 py-3 flex justify-end border-t border-gray-200">
        <div className="flex space-x-2">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSaveForm}>Save Form</Button>
        </div>
      </div>
    </div>
  );
}

import { useBrandSettings } from "@/hooks/use-brand-settings";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FormQuestion {
  id: string;
  type: 'rating' | 'multiple-choice' | 'open-ended' | 'single-choice';
  question: string;
  options?: string[];
  required: boolean;
}

interface FormPreviewProps {
  formName: string;
  questions: FormQuestion[];
  brandColor: string;
  fontFamily: string;
}

export function FormPreview({ formName, questions, brandColor, fontFamily }: FormPreviewProps) {
  const fontStyle = { fontFamily };
  
  return (
    <div className="border border-gray-200 rounded-lg p-6 max-w-2xl mx-auto" style={fontStyle}>
      {/* Form Header */}
      <div className="text-center mb-6">
        <div 
          className="w-12 h-12 rounded-full mx-auto mb-4" 
          style={{ backgroundColor: brandColor }}
        ></div>
        <h2 className="text-2xl font-bold text-gray-800">Share Your Feedback</h2>
        <p className="text-gray-600 mt-2">
          We value your opinion and would love to hear about your experience with us.
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {questions.map((question) => (
          <div key={question.id}>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            
            {question.type === 'rating' && (
              <div>
                <div className="flex space-x-3">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button 
                      key={rating}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        rating === 5 
                          ? 'bg-primary text-white' 
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                      style={rating === 5 ? { backgroundColor: brandColor } : {}}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Very dissatisfied</span>
                  <span>Very satisfied</span>
                </div>
              </div>
            )}
            
            {question.type === 'multiple-choice' && question.options && (
              <div className="flex flex-wrap gap-2">
                {question.options.map((option, index) => (
                  <button 
                    key={index}
                    className={`px-4 py-2 rounded-full text-sm ${
                      index === 0 
                        ? 'bg-primary/10 text-primary' 
                        : 'border border-gray-300 text-gray-700'
                    }`}
                    style={index === 0 ? { color: brandColor, backgroundColor: `${brandColor}10` } : {}}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
            
            {question.type === 'open-ended' && (
              <Textarea 
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary" 
                rows={3} 
                placeholder="Your feedback helps us improve"
              />
            )}
            
            {question.type === 'single-choice' && question.options && (
              <RadioGroup defaultValue="yes">
                <div className="flex space-x-4">
                  {question.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={option.toLowerCase()} 
                        id={`${question.id}-${option.toLowerCase()}`} 
                        style={{ color: brandColor }}
                      />
                      <Label 
                        htmlFor={`${question.id}-${option.toLowerCase()}`}
                        className="text-sm text-gray-700"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}
          </div>
        ))}

        <div className="pt-4">
          <Button 
            className="w-full py-2 px-4 rounded-md text-white font-medium" 
            style={{ backgroundColor: brandColor }}
          >
            Submit Feedback
          </Button>
        </div>
      </div>
    </div>
  );
}

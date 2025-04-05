import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ColorPicker({
  label,
  value,
  onChange,
  className,
}: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setInputValue(newColor);
    onChange(newColor);
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setInputValue(newColor);
    
    // Only update parent if it's a valid hex color
    if (/^#([0-9A-F]{3}){1,2}$/i.test(newColor)) {
      onChange(newColor);
    }
  };

  return (
    <div className={className}>
      <Label htmlFor={`color-${label}`} className="block text-sm text-gray-700 mb-1">
        {label}
      </Label>
      <div className="flex items-center space-x-3">
        <input
          type="color"
          id={`color-${label}`}
          value={inputValue}
          onChange={handleColorPickerChange}
          className="h-9 w-9 rounded cursor-pointer border border-gray-300"
        />
        <Input
          type="text"
          value={inputValue}
          onChange={handleTextInputChange}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm w-28"
        />
      </div>
    </div>
  );
}

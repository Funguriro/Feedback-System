import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getSentimentColor(sentiment: string): string {
  switch(sentiment.toLowerCase()) {
    case 'positive':
      return 'text-green-600 bg-green-100';
    case 'negative':
      return 'text-red-600 bg-red-100';
    case 'neutral':
      return 'text-amber-600 bg-amber-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

export function getSentimentIcon(sentiment: string): string {
  switch(sentiment.toLowerCase()) {
    case 'positive':
      return 'ri-emotion-happy-line';
    case 'negative':
      return 'ri-emotion-unhappy-line';
    case 'neutral':
      return 'ri-emotion-normal-line';
    default:
      return 'ri-question-line';
  }
}

export function calculatePercentChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export function downloadAsCSV(data: any[], filename: string) {
  if (!data.length) return;
  
  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add rows
  data.forEach(item => {
    const values = headers.map(header => {
      const value = item[header];
      // Handle arrays, objects, and special characters
      if (Array.isArray(value)) {
        return `"${value.join(';')}"`;
      } else if (typeof value === 'object' && value !== null) {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      } else if (typeof value === 'string') {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvRows.push(values.join(','));
  });
  
  // Create and download the file
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  message?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  size = "medium", 
  message,
  className = ""
}: LoadingSpinnerProps) {
  const sizeClass = 
    size === "small" ? "h-4 w-4" : 
    size === "large" ? "h-12 w-12" : 
    "h-8 w-8";
  
  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <div className={`animate-spin ${sizeClass} border-4 border-blue-500 rounded-full border-t-transparent`}></div>
      {message && (
        <p className="mt-4 text-gray-600">{message}</p>
      )}
    </div>
  );
}
import React from "react";

interface ErrorMessageProps {
  message?: string;
  retry?: () => void;
}

export default function ErrorMessage({ 
  message = "データの取得中にエラーが発生しました", 
  retry
}: ErrorMessageProps) {
  return (
    <div className="text-center py-10">
      <p className="text-xl text-gray-700 mb-4">{message}</p>
      <p className="text-gray-500 mb-4">後ほど再度お試しください</p>
      {retry && (
        <button
          onClick={retry}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          再試行
        </button>
      )}
    </div>
  );
}
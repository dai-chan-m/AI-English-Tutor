import { FiVolume2 } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import { Character, ChatMessage } from "@/types/chat";

interface MessageListProps {
  messages: ChatMessage[];
  selectedChar: Character | null;
  loading: boolean;
  speakingIndex: number | null;
  onSpeakMessage: (text: string, index: number) => void;
}

export default function MessageList({
  messages,
  selectedChar,
  loading,
  speakingIndex,
  onSpeakMessage,
}: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-4">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`flex items-start ${
            msg.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {msg.role !== "user" && selectedChar && (
            <img
              src={selectedChar.icon}
              alt={selectedChar.name}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full mr-2"
            />
          )}
          <div className="flex items-center max-w-[80%] md:max-w-[60%]">
            <div
              className={`px-4 py-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-100 text-gray-800"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.content}
            </div>
            {msg.role === "assistant" && (
              <button
                onClick={() => onSpeakMessage(msg.content, idx)}
                className="ml-2 text-xl text-gray-700 hover:text-green-600 cursor-pointer"
                title="読み上げる"
              >
                {speakingIndex === idx ? (
                  <FaSpinner className="h-5 w-5 animate-spin" />
                ) : (
                  <FiVolume2 className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
        </div>
      ))}
      {loading && (
        <div className="mr-auto bg-gray-200 px-4 py-2 rounded-lg animate-pulse text-gray-700">
          Thinking...
        </div>
      )}
    </div>
  );
}

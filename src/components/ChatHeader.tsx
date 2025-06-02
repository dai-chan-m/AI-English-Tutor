import { FiPhoneCall } from "react-icons/fi";
import { Character } from "@/types/chat";

interface ChatHeaderProps {
  selectedChar: Character | null;
  onVideoCall: () => void;
}

export default function ChatHeader({
  selectedChar,
  onVideoCall,
}: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between bg-green-600 text-white text-base md:text-lg font-bold px-4 md:px-6 py-3">
      <span>
        {selectedChar ? selectedChar.name : "チャット相手を選択してください"}
      </span>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!selectedChar}
        onClick={onVideoCall}
      >
        <FiPhoneCall />
      </button>
    </header>
  );
}

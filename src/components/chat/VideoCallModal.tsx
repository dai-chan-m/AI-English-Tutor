import { FaPhone } from "react-icons/fa";
import { Character } from "@/types/chat";

interface VideoCallModalProps {
  selectedChar: Character;
  onEndCall: () => void;
}

export default function VideoCallModal({
  selectedChar,
  onEndCall,
}: VideoCallModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex flex-col justify-center items-center">
      {/* 相手のアイコンと名前 */}
      <div className="flex flex-col items-center mb-8">
        <img
          src={selectedChar.icon}
          alt={selectedChar.name}
          className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg"
        />
        <h2 className="mt-4 text-white text-2xl md:text-3xl font-bold">
          {selectedChar.name}
        </h2>
        <p className="text-gray-300 text-sm md:text-base mt-2">通話中...</p>
      </div>

      {/* コントロールボタン */}
      <div className="flex gap-8">
        {/* 通話終了ボタン */}
        <button
          onClick={onEndCall}
          className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full cursor-pointer"
          title="通話終了"
        >
          <FaPhone />
        </button>
      </div>
    </div>
  );
}

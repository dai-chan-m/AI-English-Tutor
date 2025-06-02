import { FaMicrophone, FaStop } from "react-icons/fa";
import { FiSend } from "react-icons/fi";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  isRecording: boolean;
  loading: boolean;
  selectedCharExists: boolean;
  onSend: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export default function ChatInput({
  input,
  setInput,
  isRecording,
  loading,
  selectedCharExists,
  onSend,
  onStartRecording,
  onStopRecording,
}: ChatInputProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}
      className="flex items-center border-t px-4 md:px-6 py-3 bg-white"
    >
      <input
        type="text"
        className="flex-1 border rounded-full px-4 py-2 mr-2 focus:outline-green-600 text-gray-700 text-sm"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="英語で話しかけてみよう！"
        disabled={!selectedCharExists}
        style={{ fontSize: "16px" }}
      />
      {!isRecording ? (
        <button
          type="button"
          onClick={onStartRecording}
          disabled={!selectedCharExists}
          className="mr-2 p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          title="音声入力"
        >
          <FaMicrophone />
        </button>
      ) : (
        <button
          type="button"
          onClick={onStopRecording}
          className="mr-2 p-2 rounded-full bg-red-500 hover:bg-red-600 text-white animate-pulse cursor-pointer"
          title="録音停止"
        >
          <FaStop />
        </button>
      )}
      <button
        type="submit"
        disabled={loading || !selectedCharExists}
        className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiSend />
      </button>
    </form>
  );
}

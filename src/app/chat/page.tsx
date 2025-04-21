"use client";

import { useState, useEffect } from "react";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import { FaMicrophone, FaStop, FaSpinner } from "react-icons/fa";
import { FiSend, FiVolume2, FiHome, FiX, FiMenu } from "react-icons/fi";
import ServiceLogo from "@/components/ServiceLogo";
import Link from "next/link";
import { CHAT_MODE } from "@/constants/app";
import { removeEmojis, speakMessage, loadVoices } from "@/utils/speechUtils";
import { sendChatMessage } from "@/utils/chatUtils";
import { Character, ChatMessage } from "@/types/chat";
import { characters } from "@/utils/characterData";

export default function ChatPage() {
  const [selectedChar, setSelectedChar] = useState<Character>(characters[0]);
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>(
    {}
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);
  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([]);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  useEffect(() => {
    // 初回ロード時
    setAvailableVoices(loadVoices());

    // ボイスリストが後から読み込まれた場合の対応
    window.speechSynthesis.onvoiceschanged = () => {
      setAvailableVoices(loadVoices());
    };

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handleTranscriptUpdate = (text: string) => {
    setInput((prev) => `${prev} ${text}`.trim());
  };

  const { isRecording, handleStart, handleStop } = useSpeechRecognition(
    handleTranscriptUpdate
  );

  const currentMessages = messagesMap[selectedChar.id] || [];

  // メッセージ読み上げ処理
  const handleSpeakMessage = (text: string, index: number) => {
    speakMessage(
      removeEmojis(text),
      index,
      selectedChar.voice,
      availableVoices,
      setSpeakingIndex
    );
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages: ChatMessage[] = [
      ...currentMessages,
      { role: "user", content: input },
    ];
    setMessagesMap({ ...messagesMap, [selectedChar.id]: newMessages });
    setInput("");
    setLoading(true);

    try {
      const reply = await sendChatMessage(newMessages, selectedChar.prompt);
      
      setMessagesMap({
        ...messagesMap,
        [selectedChar.id]: [
          ...newMessages,
          { role: "assistant", content: reply },
        ],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* モバイル用ハンバーガー */}
      <div className="md:hidden bg-green-600 border-b px-4 py-2 flex items-center justify-between">
        <span className="font-bold text-white">{CHAT_MODE}</span>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl transition-all duration-300 ease-in-out"
          title="メニュー"
        >
          {menuOpen ? (
            <FiX className="h-6 w-6 transform transition-transform duration-200 rotate-0 scale-100" />
          ) : (
            <FiMenu className="h-6 w-6 transform transition-transform duration-200 rotate-0 scale-100" />
          )}
        </button>
      </div>

      {/* モバイル用サイドメニュー */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-700">{CHAT_MODE}</h2>
          <Link href="/" className="text-xl text-gray-700">
            <FiHome />
          </Link>
        </div>
        <div className="p-4 space-y-4">
          {characters.map((char) => (
            <button
              key={char.id}
              onClick={() => {
                setSelectedChar(char);
                setMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer ${
                selectedChar.id === char.id
                  ? "bg-blue-100 border-blue-400 text-blue-700"
                  : "border-gray-300 text-gray-700"
              }`}
            >
              <img
                src={char.icon}
                alt={char.name}
                className="w-10 h-10 rounded-full"
              />
              <span className="text-sm font-semibold">{char.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* PC用サイドバー */}
      <aside className="hidden md:block w-128 bg-white border-r border-gray-200 p-4 space-y-4">
        <ServiceLogo />
        <h2 className="text-lg font-bold mt-20 text-gray-700">{CHAT_MODE}</h2>
        {characters.map((char) => (
          <button
            key={char.id}
            onClick={() => setSelectedChar(char)}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer ${
              selectedChar.id === char.id
                ? "bg-blue-100 border-blue-400 text-blue-700"
                : "border-gray-300 text-gray-700"
            }`}
          >
            <img
              src={char.icon}
              alt={char.name}
              className="w-10 h-10 rounded-full"
            />
            <span className="text-sm font-semibold">{char.name}</span>
          </button>
        ))}
      </aside>

      {/* チャットエリア */}
      <main className="flex-1 flex flex-col w-full bg-white shadow-lg">
        <header className="bg-green-600 text-white text-base md:text-lg font-bold px-4 md:px-6 py-3">
          {selectedChar.name} と英語チャット中...
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-4">
          {currentMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role !== "user" && (
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
                    onClick={() => handleSpeakMessage(msg.content, idx)}
                    className="ml-2 text-xl text-gray-700 hover:text-green-600 cursor-pointer"
                    title="読み上げる"
                  >
                    {speakingIndex == idx ? (
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
            <div className="mr-auto bg-gray-200 px-4 py-2 rounded-lg animate-pulse">
              Thinking...
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center border-t px-4 md:px-6 py-3 bg-white"
        >
          <input
            type="text"
            className="flex-1 border rounded-full px-4 py-2 mr-2 focus:outline-green-600 text-gray-700 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="英語で話しかけてみよう！"
          />
          {!isRecording ? (
            <button
              type="button"
              onClick={handleStart}
              className="mr-2 p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
              title="音声入力"
            >
              <FaMicrophone />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStop}
              className="mr-2 p-2 rounded-full bg-red-500 hover:bg-red-600 text-white animate-pulse cursor-pointer"
              title="録音停止"
            >
              <FaStop />
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 text-sm cursor-pointer"
          >
            <FiSend />
          </button>
        </form>
      </main>
    </div>
  );
}

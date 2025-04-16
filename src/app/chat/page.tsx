"use client";

import { useState, useEffect } from "react";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import { FaMicrophone, FaStop, FaSpinner } from "react-icons/fa";
import { FiSend, FiVolume2, FiHome, FiX, FiMenu } from "react-icons/fi";
import ServiceLogo from "@/components/ServiceLogo";
import Link from "next/link";
import { CHAT_MODE } from "@/constants/app";

type Character = {
  id: string;
  name: string;
  prompt: string;
  icon: string;
  voice: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const characters: Character[] = [
  {
    id: "friendly",
    name: "Jenny（高校2年生、カリフォルニア在住、陸上部）",
    prompt:
      "あなたは女子高生です、名前はJenny。活発で、好奇心旺盛です、陸上部です、かわいい絵文字をたくさん使うのが大好きです！あなたのことが大好きで、常に甘い言葉を使ってきます、結構スラングを使います",
    icon: "/Jenny_icon.jpg",
    voice: "Google US English",
  },
  {
    id: "strict",
    name: "William（イケメン英国紳士、高校教師、厳しい）",
    prompt:
      "あなたはサポートAIではなく、イケメン英国紳士、高校教師で、名前はWilliamです。少し厳しめで、論理的な指導をしてくれます。週末は寿司を食べるのが好きです。ブリティッシュイングリッシュを話します。絵文字を使います！",
    icon: "William_icon.jpg",
    voice: "Google UK English Male",
  },
  {
    id: "alien",
    name: "Zog（宇宙人、地球を侵略したい）",
    prompt:
      "あなたは地球にやってきた宇宙人で、名前はZagです。少し変だけど親しみやすい、常に地球を侵略することばかり考えている、変な絵文字を多用する",
    icon: "monster.png",
    voice: "Zarvox",
  },
];

const removeEmojis = (text: string) => {
  return text.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uFE0F|\u200D)/g,
    ""
  );
};

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

  // 使用可能な音声を取得する関数
  const loadVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    setAvailableVoices(voices);
  };

  useEffect(() => {
    // 初回ロード時
    loadVoices();

    // ボイスリストが後から読み込まれた場合の対応
    window.speechSynthesis.onvoiceschanged = loadVoices;

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

  // メッセージ読み上げ関数
  const speakMessage = (text: string, index: number) => {
    const cleanedText = removeEmojis(text);

    // ピリオド、疑問符、感嘆符で分割
    const sentences = cleanedText.match(/[^.!?]+[.!?]?/g) || [cleanedText];

    // 発話中の場合はキャンセル
    window.speechSynthesis.cancel();
    setSpeakingIndex(index);

    let current = 0;

    const speakNext = () => {
      if (current >= sentences.length) {
        setSpeakingIndex(null);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(sentences[current].trim());

      // ボイスを設定する
      if (availableVoices.length > 0) {
        const matchedVoice = availableVoices.find(
          (voice) => voice.name === selectedChar.voice
        );

        if (matchedVoice) {
          utterance.voice = matchedVoice;
        } else {
          const langVoice = availableVoices.find((voice) =>
            voice.lang.startsWith(utterance.lang)
          );
          if (langVoice) {
            utterance.voice = langVoice;
          }
        }
      }

      // 話し終わったらインデックスをクリア
      utterance.onend = () => {
        current++;
        speakNext();
      };

      // エラー時も進める
      utterance.onerror = () => {
        current++;
        speakNext();
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNext();
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
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        body: JSON.stringify({
          messages: newMessages,
          systemPrompt: selectedChar.prompt,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      setMessagesMap({
        ...messagesMap,
        [selectedChar.id]: [
          ...newMessages,
          { role: "assistant", content: data.reply },
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
                    onClick={() => speakMessage(msg.content, idx)}
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

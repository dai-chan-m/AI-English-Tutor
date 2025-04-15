"use client";

import { useState } from "react";

type Character = {
  id: string;
  name: string;
  prompt: string;
  icon: string;
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
      "あなたは女子高生です、活発で、好奇心旺盛です、陸上部です、絵文字をたくさん使うのが大好きです！あなたのことが大好きで、常に甘い言葉を使ってきます、結構スラングを使います",
    icon: "/Jenny_icon.jpg",
  },
  {
    id: "strict",
    name: "William（イケメン英国紳士、高校教師、厳しい）",
    prompt:
      "あなたはサポートAIではなく、イケメン英国紳士、高校教師です。少し厳しめで、論理的な指導をしてくれます。週末は寿司を食べるのが好きです。ブリティッシュイングリッシュを話します。絵文字を使います！",
    icon: "William_icon.jpg",
  },
  {
    id: "alien",
    name: "Zog（宇宙人、地球を侵略したい）",
    prompt:
      "あなたは地球にやってきた宇宙人です。少し変だけど親しみやすい、常に地球を侵略することばかり考えている、変な絵文字を多用する",
    icon: "monster.png",
  },
];

export default function ChatPage() {
  const [selectedChar, setSelectedChar] = useState<Character>(characters[0]);
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>(
    {}
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);

  const currentMessages = messagesMap[selectedChar.id] || [];

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
        <span className="font-bold text-white">AI Chat</span>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">
          ☰
        </button>
      </div>

      {/* モバイル用サイドメニュー */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-700">キャラを選ぶ</h2>
          <button onClick={() => setMenuOpen(false)} className="text-xl">
            ✕
          </button>
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
      <aside className="hidden md:block w-64 bg-white border-r border-gray-200 p-4 space-y-4">
        <h2 className="text-lg font-bold text-gray-700">キャラを選ぶ</h2>
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
              <div
                className={`max-w-[80%] md:max-w-[60%] px-4 py-2 rounded-lg ${
                  msg.role === "user"
                    ? "bg-blue-100 text-gray-800"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.content}
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
            className="flex-1 border rounded-full px-4 py-2 mr-2 focus:outline-none text-gray-700 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="英語で話しかけてみよう！"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 text-sm"
          >
            送信
          </button>
        </form>
      </main>
    </div>
  );
}

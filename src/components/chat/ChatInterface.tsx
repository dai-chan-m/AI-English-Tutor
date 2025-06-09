"use client";

import { useEffect } from "react";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import { CHAT_MODE } from "@/constants/app";
import ServiceLogo from "@/components/common/ServiceLogo";
import CreateCharacterForm from "@/components/chat/CreateCharacterForm";
import CharacterList from "@/components/chat/CharacterList";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/common/MessageList";
import ChatInput from "@/components/chat/ChatInput";
import VideoCallModal from "@/components/chat/VideoCallModal";
import MobileMenu from "@/components/common/MobileMenu";
import useCharacters from "@/hooks/useCharacters";
import useChatMessages from "@/hooks/useChatMessages";
import useVideoCall from "@/hooks/useVideoCall";

export default function ChatInterface() {
  const {
    allCharacters,
    selectedChar,
    setSelectedChar,
    showCreateForm,
    setShowCreateForm,
    handleSaveCharacter,
    handleDeleteCharacter,
  } = useCharacters();

  const {
    currentMessages,
    input,
    setInput,
    loading,
    speakingIndex,
    handleSpeakMessage,
    handleSend,
  } = useChatMessages(selectedChar);

  const { isRecording, handleStart, handleStop } = useSpeechRecognition(
    (text: string) => {
      setInput((prev) => `${prev} ${text}`.trim());
    }
  );

  const { isVideoChat, handleEndCall, handleStartCall } = useVideoCall(
    currentMessages,
    speakingIndex,
    handleStart,
    handleStop,
    setInput
  );

  useEffect(() => {
    if (isVideoChat && input) {
      handleSend(handleStop);
    }
  }, [isVideoChat, input]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* モバイル用メニュー */}
      <MobileMenu
        allCharacters={allCharacters}
        selectedChar={selectedChar}
        onSelectCharacter={setSelectedChar}
        onDeleteCharacter={handleDeleteCharacter}
        onShowCreateForm={() => setShowCreateForm(true)}
      />

      {/* PC用サイドバー */}
      <aside className="hidden md:block w-128 bg-white border-r border-gray-200 p-4 space-y-4">
        <ServiceLogo />
        <h2 className="text-lg font-bold mt-20 text-gray-700">{CHAT_MODE}</h2>
        <CharacterList
          characters={allCharacters}
          selectedChar={selectedChar}
          onSelectCharacter={setSelectedChar}
          onDeleteCharacter={handleDeleteCharacter}
          onShowCreateForm={() => setShowCreateForm(true)}
        />
      </aside>

      {/* チャットエリア */}
      <main className="flex-1 flex flex-col w-full bg-white shadow-lg">
        <ChatHeader selectedChar={selectedChar} onVideoCall={handleStartCall} />

        <MessageList
          messages={currentMessages}
          selectedChar={selectedChar}
          loading={loading}
          speakingIndex={speakingIndex}
          onSpeakMessage={(text: string, index: number) => {
            handleSpeakMessage(text, index, handleStop);
          }}
        />

        <ChatInput
          input={input}
          setInput={setInput}
          isRecording={isRecording}
          loading={loading}
          selectedCharExists={!!selectedChar}
          onSend={() => {
            handleSend(handleStop);
          }}
          onStartRecording={handleStart}
          onStopRecording={handleStop}
        />

        {/* ビデオチャットモーダル */}
        {isVideoChat && selectedChar && (
          <VideoCallModal
            selectedChar={selectedChar}
            onEndCall={handleEndCall}
          />
        )}
      </main>

      {/* キャラクター作成フォーム */}
      {showCreateForm && (
        <CreateCharacterForm
          onClose={() => setShowCreateForm(false)}
          onSave={handleSaveCharacter}
        />
      )}
    </div>
  );
}

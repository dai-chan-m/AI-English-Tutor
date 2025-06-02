"use client";

import { useState, useEffect } from "react";
import { Character, CustomCharacter } from "@/types/chat";
import { getAllCharacters, deleteCustomCharacter } from "@/utils/characterData";

export default function useCharacters() {
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // 初期化処理
  useEffect(() => {
    // キャラクター一覧を取得
    const chars = getAllCharacters();
    setAllCharacters(chars);

    // デフォルトのキャラクターを選択
    if (chars.length > 0 && !selectedChar) {
      setSelectedChar(chars[0]);
    }
  }, []);

  // カスタムキャラクターの保存処理
  const handleSaveCharacter = (character: CustomCharacter) => {
    // キャラクター一覧を再取得
    const updatedChars = getAllCharacters();
    setAllCharacters(updatedChars);

    // 新しく作成したキャラクターを選択
    const newChar = updatedChars.find((char) => char.id === character.id);
    if (newChar) {
      setSelectedChar(newChar);
    }
  };

  // キャラクターの削除処理
  const handleDeleteCharacter = (id: string) => {
    if (window.confirm("このチャット相手を削除してもよろしいですか？")) {
      deleteCustomCharacter(id);

      // 削除後のキャラクター一覧を再取得
      const updatedChars = getAllCharacters();
      setAllCharacters(updatedChars);

      // 削除されたキャラクターが選択中だった場合は、最初のキャラクターを選択
      if (selectedChar?.id === id && updatedChars.length > 0) {
        setSelectedChar(updatedChars[0]);
      }
    }
  };

  return {
    allCharacters,
    selectedChar,
    setSelectedChar,
    showCreateForm,
    setShowCreateForm,
    handleSaveCharacter,
    handleDeleteCharacter
  };
}
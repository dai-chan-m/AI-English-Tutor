"use client";

import { useState, useEffect } from "react";
import { CustomCharacter } from "@/types/chat";
import { availableIcons, saveCustomCharacter } from "@/utils/characterData";
import { FiCheck, FiX } from "react-icons/fi";

type Props = {
  onClose: () => void;
  onSave: (character: CustomCharacter) => void;
};

export default function CreateCharacterForm({ onClose, onSave }: Props) {
  const [character, setCharacter] = useState<CustomCharacter>({
    name: "",
    prompt: "",
    icon: availableIcons[0].path,
    voice: "",
  });
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [error, setError] = useState("");

  // 音声の選択肢をロード
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        // デフォルトボイスを設定
        setCharacter((prev) => ({
          ...prev,
          voice: availableVoices[0].name,
        }));
      }
    };

    loadVoices();

    // ボイスが後からロードされる場合に対応
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setCharacter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIconSelect = (iconPath: string) => {
    setCharacter((prev) => ({
      ...prev,
      icon: iconPath,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    if (!character.name.trim()) {
      setError("名前を入力してください");
      return;
    }

    if (!character.prompt.trim()) {
      setError("プロンプトを入力してください");
      return;
    }

    if (!character.voice) {
      setError("音声を選択してください");
      return;
    }

    // キャラクターを保存
    try {
      const savedCharacter = saveCustomCharacter(character);
      onSave(savedCharacter);
      onClose();
    } catch (err) {
      console.error("キャラクター保存エラー:", err);
      setError("キャラクターの保存に失敗しました");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-700">
            新しいチャット相手を作成
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="閉じる"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              名前 (必須)
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={character.name}
              onChange={handleChange}
              placeholder="例: Robbie（オーストラリア人、15歳、サーフィン大好き）"
              className="text-gray-700 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="prompt"
              className="block text-sm font-medium text-gray-700 mb-1 text-gray-700"
            >
              性格・特徴 (必須)
            </label>
            <textarea
              id="prompt"
              name="prompt"
              maxLength={100}
              value={character.prompt}
              onChange={handleChange}
              placeholder="例: オーストラリアの１５歳の少年です。オーストラリア英語で、若者の言葉を話します。カンガルーやコアラの絵文字を毎回の返事に必ず使用します。"
              className="text-gray-700 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-24"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              アイコン (必須)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableIcons.map((icon) => (
                <div
                  key={icon.path}
                  onClick={() => handleIconSelect(icon.path)}
                  className={`
                    border rounded-md p-2 cursor-pointer hover:bg-gray-50 flex flex-col items-center
                    ${
                      character.icon === icon.path
                        ? "ring-2 ring-green-500 bg-green-50"
                        : ""
                    }
                  `}
                >
                  <img
                    src={icon.path}
                    alt={icon.name}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  <span className="text-xs text-gray-600 mt-1">
                    {icon.name}
                  </span>
                  {character.icon === icon.path && (
                    <FiCheck className="absolute text-green-500 h-4 w-4" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="voice"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              音声 (必須)
            </label>
            <select
              id="voice"
              name="voice"
              value={character.voice}
              onChange={handleChange}
              className="text-gray-700 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">音声を選択してください</option>
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

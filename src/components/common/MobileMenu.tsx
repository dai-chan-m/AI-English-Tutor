"use client";

import { FiHome, FiX, FiMenu } from "react-icons/fi";
import Link from "next/link";
import { CHAT_MODE } from "@/constants/app";
import CharacterList from "@/components/chat/CharacterList";
import { Character } from "@/types/chat";
import { useState } from "react";

interface MobileMenuProps {
  allCharacters: Character[];
  selectedChar: Character | null;
  onSelectCharacter: (character: Character) => void;
  onDeleteCharacter: (id: string) => void;
  onShowCreateForm: () => void;
}

export default function MobileMenu({
  allCharacters,
  selectedChar,
  onSelectCharacter,
  onDeleteCharacter,
  onShowCreateForm,
}: MobileMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      {/* モバイル用ハンバーガー */}
      <div className="md:hidden bg-green-600 border-b px-4 py-2 flex items-center justify-between">
        <span className="font-bold text-white">{CHAT_MODE}</span>
        <button
          onClick={toggleMenu}
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
          <CharacterList
            characters={allCharacters}
            selectedChar={selectedChar}
            onSelectCharacter={onSelectCharacter}
            onDeleteCharacter={onDeleteCharacter}
            onShowCreateForm={onShowCreateForm}
          />
        </div>
      </div>
    </>
  );
}

import { FaPlus, FaTrashAlt } from "react-icons/fa";
import { Character } from "@/types/chat";

interface CharacterListProps {
  characters: Character[];
  selectedChar: Character | null;
  onSelectCharacter: (character: Character) => void;
  onDeleteCharacter: (id: string) => void;
  onShowCreateForm: () => void;
}

export default function CharacterList({
  characters,
  selectedChar,
  onSelectCharacter,
  onDeleteCharacter,
  onShowCreateForm,
}: CharacterListProps) {
  const renderCharacterButton = (char: Character) => (
    <div
      key={char.id}
      className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer relative ${
        selectedChar?.id === char.id
          ? "bg-blue-100 border-blue-400 text-blue-700"
          : "border-gray-300 text-gray-700"
      }`}
    >
      <button
        onClick={() => onSelectCharacter(char)}
        className="flex items-center gap-2 w-full"
      >
        <img
          src={char.icon}
          alt={char.name}
          className="w-10 h-10 rounded-full"
        />
        <span className="text-sm font-semibold">{char.name}</span>
      </button>

      {/* カスタムキャラクターの場合は削除ボタンを表示 */}
      {char.isCustom && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteCharacter(char.id);
          }}
          className="absolute right-2 text-red-500 hover:text-red-700"
          title="削除"
        >
          <FaTrashAlt size={14} />
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-2">
      {characters.map(renderCharacterButton)}

      {/* 新規作成ボタン */}
      <button
        onClick={onShowCreateForm}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-green-500 text-green-600 hover:bg-green-50"
      >
        <FaPlus />
        <span>新しいチャット相手を作成</span>
      </button>
    </div>
  );
}

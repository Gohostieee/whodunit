import { Character } from '@/types/characters';
import Image from 'next/image';
import { useState } from 'react';

interface CharacterSelectorProps {
  characters: Character[];
  currentCharacter: Character;
  onCharacterSelect: (character: Character) => void;
}

const CharacterCard = ({
  character,
  isSelected,
  onClick
}: {
  character: Character;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        cursor-pointer transition-all duration-300 bg-gray-800 border-2 rounded-lg p-2 transform hover:scale-105
        ${isSelected
          ? 'border-yellow-500 bg-gray-700 shadow-lg shadow-yellow-500/30'
          : 'border-gray-600 hover:border-gray-500'
        }
      `}
    >
      {/* Character Status Badge */}
      <div className="flex justify-between items-start mb-2">
        <div className={`
          text-xs font-mono px-2 py-0.5 rounded
          ${character.status === 'prime_suspect' ? 'bg-red-600 text-white' :
            character.status === 'under_investigation' ? 'bg-orange-600 text-white' :
            character.status === 'cleared' ? 'bg-green-600 text-white' :
            'bg-gray-600 text-gray-200'
          }
        `}>
          {character.status.replace('_', ' ').toUpperCase()}
        </div>

        <div className={`
          text-xs font-mono px-1 py-0.5 rounded
          ${character.role === 'suspect' ? 'bg-red-700 text-red-200' :
            character.role === 'witness' ? 'bg-blue-700 text-blue-200' :
            character.role === 'family' ? 'bg-purple-700 text-purple-200' :
            'bg-green-700 text-green-200'
          }
        `}>
          {character.role.toUpperCase()}
        </div>
      </div>

      {/* Character Image */}
      <div className="relative w-16 h-16 mx-auto mb-2">
        <div className="w-full h-full bg-gray-900 border border-gray-600 rounded flex items-center justify-center overflow-hidden">
          <Image
            src={character.image}
            alt={character.name}
            width={64}
            height={64}
            className="object-contain"
            onError={(e) => {
              // Fallback to placeholder icon
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
          {/* Fallback placeholder */}
          <div className="hidden text-gray-500 text-xs">
            {character.species === 'Cat' ? '🐱' :
             character.species === 'Bunny' ? '🐰' :
             character.species === 'Human' ? '👤' : '❓'}
          </div>
        </div>

        {/* Prisoner Number */}
        {character.prisonerNumber && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-black text-white px-1 text-xs font-mono border">
            {character.prisonerNumber}
          </div>
        )}
      </div>

      {/* Character Info */}
      <div className="text-center">
        <div className="text-white text-sm font-bold">{character.name}</div>
        <div className="text-gray-400 text-xs">{character.species}</div>

        {/* Cooperation Level Indicator */}
        <div className="mt-1">
          <div className={`
            text-xs px-1 py-0.5 rounded
            ${character.personality.cooperation === 'hostile' ? 'bg-red-800 text-red-200' :
              character.personality.cooperation === 'reluctant' ? 'bg-orange-800 text-orange-200' :
              character.personality.cooperation === 'neutral' ? 'bg-gray-800 text-gray-200' :
              'bg-green-800 text-green-200'
            }
          `}>
            {character.personality.cooperation}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CharacterSelector({
  characters,
  currentCharacter,
  onCharacterSelect
}: CharacterSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Separate characters by role for better organization
  const suspects = characters.filter(char => char.role === 'suspect');
  const witnesses = characters.filter(char => char.role === 'witness');
  const family = characters.filter(char => char.role === 'family');

  return (
    <div className="bg-gray-900 border border-gray-600 rounded-lg dramatic-shadow">
      {/* Header */}
      <div
        className="flex items-center justify-between p-3 cursor-pointer border-b border-gray-700"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center">
            <span className="text-black font-bold text-sm">👥</span>
          </div>
          <div>
            <div className="text-yellow-400 text-sm font-bold">CASE SUBJECTS</div>
            <div className="text-xs text-gray-400 font-mono">
              Current: {currentCharacter.name} ({currentCharacter.role})
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-400 font-mono">
            {characters.length} subjects
          </div>
          <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </div>
        </div>
      </div>

      {/* Character Grid */}
      {isExpanded && (
        <div className="p-3 space-y-4 animate-fade-in">
          {/* Suspects Section */}
          {suspects.length > 0 && (
            <div>
              <div className="text-red-400 text-xs font-mono mb-2 border-l-2 border-red-500 pl-2">
                SUSPECTS ({suspects.length})
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {suspects.map((character) => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    isSelected={character.id === currentCharacter.id}
                    onClick={() => onCharacterSelect(character)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Witnesses Section */}
          {witnesses.length > 0 && (
            <div>
              <div className="text-blue-400 text-xs font-mono mb-2 border-l-2 border-blue-500 pl-2">
                WITNESSES ({witnesses.length})
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {witnesses.map((character) => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    isSelected={character.id === currentCharacter.id}
                    onClick={() => onCharacterSelect(character)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Family Section */}
          {family.length > 0 && (
            <div>
              <div className="text-purple-400 text-xs font-mono mb-2 border-l-2 border-purple-500 pl-2">
                FAMILY ({family.length})
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {family.map((character) => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    isSelected={character.id === currentCharacter.id}
                    onClick={() => onCharacterSelect(character)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quick Navigation */}
          <div className="border-t border-gray-700 pt-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div>Click any character to switch interrogation subject</div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const currentIndex = characters.findIndex(char => char.id === currentCharacter.id);
                    const nextIndex = (currentIndex + 1) % characters.length;
                    onCharacterSelect(characters[nextIndex]);
                  }}
                  className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
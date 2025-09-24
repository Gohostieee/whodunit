import { Character } from '@/types/characters';

interface CharacterPlaceholderProps {
  character: Character;
  width?: number;
  height?: number;
  className?: string;
}

const getSpeciesEmoji = (species: string) => {
  switch (species.toLowerCase()) {
    case 'cat': return '🐱';
    case 'bunny': return '🐰';
    case 'human': return '👤';
    default: return '❓';
  }
};

const getRoleColor = (role: Character['role']) => {
  switch (role) {
    case 'suspect': return '#ef4444';
    case 'witness': return '#3b82f6';
    case 'family': return '#8b5cf6';
    case 'roommate': return '#10b981';
    default: return '#6b7280';
  }
};

export default function CharacterPlaceholder({
  character,
  width = 180,
  height = 140,
  className = ''
}: CharacterPlaceholderProps) {
  const roleColor = getRoleColor(character.role);
  const speciesEmoji = getSpeciesEmoji(character.species);

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="bg-gray-900 border border-gray-600 rounded"
      >
        {/* Background with subtle pattern */}
        <defs>
          <pattern
            id={`grid-${character.id}`}
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
            opacity="0.1"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="#fff"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="#1f2937" />
        <rect width="100%" height="100%" fill={`url(#grid-${character.id})`} />

        {/* Height measurements on left */}
        <g className="text-xs font-mono" fill="#9ca3af">
          <text x="8" y="20" fontSize="10" opacity="0.7">4'</text>
          <text x="8" y="50" fontSize="10" opacity="0.7">3'</text>
          <text x="8" y="80" fontSize="10" opacity="0.7">2'</text>
          <text x="8" y="110" fontSize="10" opacity="0.7">1'</text>
        </g>

        {/* Character silhouette/icon */}
        <g transform={`translate(${width/2}, ${height/2})`}>
          <circle
            cx="0"
            cy="-10"
            r="30"
            fill={roleColor}
            opacity="0.8"
            stroke="#000"
            strokeWidth="2"
          />
          <text
            x="0"
            y="0"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="24"
          >
            {speciesEmoji}
          </text>
        </g>

        {/* Character name */}
        <text
          x={width/2}
          y={height - 20}
          textAnchor="middle"
          fill="#fff"
          fontSize="12"
          fontFamily="monospace"
          fontWeight="bold"
        >
          {character.name.toUpperCase()}
        </text>

        {/* Role indicator */}
        <text
          x={width/2}
          y={height - 8}
          textAnchor="middle"
          fill={roleColor}
          fontSize="8"
          fontFamily="monospace"
        >
          {character.role.toUpperCase()}
        </text>

        {/* Status indicator in corner */}
        <g transform="translate(5, 5)">
          <rect
            width="8"
            height="8"
            fill={
              character.status === 'prime_suspect' ? '#ef4444' :
              character.status === 'under_investigation' ? '#f59e0b' :
              character.status === 'cleared' ? '#10b981' :
              '#6b7280'
            }
          />
        </g>

        {/* Evidence count indicator */}
        {character.evidence.length > 0 && (
          <g transform={`translate(${width - 20}, 5)`}>
            <circle cx="8" cy="8" r="8" fill="#fbbf24" />
            <text
              x="8"
              y="8"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#000"
              fontSize="10"
              fontWeight="bold"
            >
              {character.evidence.length}
            </text>
          </g>
        )}
      </svg>

      {/* Prisoner number overlay */}
      {character.prisonerNumber && (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-0.5 text-xs font-mono border">
          {character.prisonerNumber}
        </div>
      )}
    </div>
  );
}
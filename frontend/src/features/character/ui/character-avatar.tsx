import { useState } from "react";
import { getCharacterImageUrl } from "@/shared/config/env";

interface CharacterAvatarProps {
  serverId: string;
  characterId: string;
  characterName: string;
  size?: number;
  className?: string;
}

export function CharacterAvatar({
  serverId,
  characterId,
  characterName,
  size = 64,
  className = "",
}: CharacterAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);

  if (imageFailed) {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-[linear-gradient(135deg,_#f4d59b,_#dba56f)] font-semibold text-[#5b3920] ${className}`}
        style={{ width: size, height: size }}
      >
        {characterName.slice(0, 1)}
      </div>
    );
  }

  return (
    <img
      src={getCharacterImageUrl(serverId, characterId, 3)}
      alt={characterName}
      className={`rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
      onError={() => setImageFailed(true)}
    />
  );
}

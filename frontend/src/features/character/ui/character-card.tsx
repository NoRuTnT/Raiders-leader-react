"use client";

import React from "react";
import { useDrag } from "react-dnd";
import type { Character } from "@/shared/types/domain";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";
import { FameValue } from "@/shared/ui/fame-value";
import { CharacterAvatar } from "@/features/character/ui/character-avatar";

const SUPPORT_JOB_KEYWORDS = ["인챈트리스", "뮤즈", "크루세이더", "세라핌", "패러메딕"];

interface CharacterCardProps {
  character: Character;
  onClick?: () => void;
}

export function CharacterCard({ character, onClick }: CharacterCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "character",
    item: character,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const setRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        drag(node);
      }
    },
    [drag],
  );

  const isSupport = SUPPORT_JOB_KEYWORDS.some((keyword) => character.jobGrowName.includes(keyword));

  return (
    <Card
      ref={setRef}
      onClick={onClick}
      className={`cursor-grab rounded-[24px] py-0 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        isSupport
          ? "border-[#b9d6bf] bg-[linear-gradient(180deg,_#eef9f0_0%,_#dff1e3_100%)] hover:border-[#98c2a1] hover:bg-[linear-gradient(180deg,_#e8f6eb_0%,_#d4ebd9_100%)]"
          : "border-[#ead6b0] bg-[#fffaf0] hover:border-[#d7ba86]"
      } ${onClick ? "cursor-pointer" : ""} ${isDragging ? "opacity-50" : ""}`}
    >
      <CardContent className="flex items-center gap-4 p-4">
        <CharacterAvatar
          serverId={character.serverId}
          characterId={character.characterId}
          characterName={character.characterName}
          size={96}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-base font-semibold text-[#3f2b1a]">{character.characterName}</p>
            {isSupport ? (
              <Badge className="bg-[#dcefdc] text-[#456445] hover:bg-[#dcefdc]">버퍼</Badge>
            ) : null}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline">Lv.{character.level}</Badge>
            <Badge variant="secondary" className={isSupport ? "bg-[#edf7ef] text-[#557055]" : "bg-[#f5e8cf] text-[#6b5641]"}>
              {character.jobGrowName}
            </Badge>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-sm">
            <span className="truncate text-[#7b654d]">{character.adventureName}</span>
            <FameValue value={character.fame} textClassName="text-sm" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

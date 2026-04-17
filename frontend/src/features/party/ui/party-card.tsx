"use client";

import type { Party, Character } from "@/shared/types/domain";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Checkbox } from "@/shared/ui/checkbox";
import { FameValue } from "@/shared/ui/fame-value";
import { Pencil, Trash2 } from "lucide-react";
import { CharacterAvatar } from "@/features/character/ui/character-avatar";

const SUPPORT_JOB_KEYWORDS = ["인챈트리스", "뮤즈", "크루세이더", "세라핌", "패러메딕"];

interface PartyCardProps {
  party: Party;
  partyNumber: number;
  members: Character[];
  averageFame: number;
  onDelete: (partyId: number) => void;
  onUpdateProgress: (party: Party, progress: "WAITING" | "DONE") => void;
  onEdit: (party: Party) => void;
}

export function PartyCard({
  party,
  partyNumber,
  members,
  averageFame,
  onDelete,
  onUpdateProgress,
  onEdit,
}: PartyCardProps) {
  const isDone = party.progress === "DONE";

  return (
    <Card
      className={`gap-4 rounded-[28px] border py-0 transition ${
        isDone ? "border-emerald-200 bg-emerald-50/80" : "border-[#e7d5b2] bg-[#fffaf0]"
      }`}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-4 px-5 pt-5">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg text-[#3f2b1a]">파티 {partyNumber}</CardTitle>
            <Badge className={isDone ? "bg-emerald-600 text-white" : "bg-[#f7e3a5] text-[#6e4b20]"}>
              {isDone ? "완료" : "대기"}
            </Badge>
          </div>
          <div className="mt-2">
            <FameValue value={Math.round(averageFame)} textClassName="text-sm" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-sm text-[#5d4630] shadow-sm">
            <Checkbox
              checked={isDone}
              onCheckedChange={() => onUpdateProgress(party, isDone ? "WAITING" : "DONE")}
              className="border-[#d8bb85] data-[state=checked]:border-[#6a4a28] data-[state=checked]:bg-[#6a4a28]"
            />
            이번 주 완료
          </label>
          <Button variant="ghost" size="icon" onClick={() => onEdit(party)} aria-label="파티 수정">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(party.partyId)} aria-label="파티 삭제">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-3 px-5 pb-5 md:grid-cols-2">
        {members.map((member) => {
          const isSupport = SUPPORT_JOB_KEYWORDS.some((keyword) => member.jobGrowName.includes(keyword));

          return (
            <div
              key={member.characterId}
              className={`flex items-center gap-3 rounded-2xl border p-3 ${
                isSupport ? "border-[#d4e3d4] bg-[#f6fbf7]" : "border-[#eddcb8] bg-white/90"
              }`}
            >
              <CharacterAvatar
                serverId={member.serverId}
                characterId={member.characterId}
                characterName={member.characterName}
                size={60}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-[#3f2b1a]">{member.characterName}</p>
                  {isSupport ? (
                    <Badge variant="secondary" className="bg-[#dcefdc] text-[#456445]">
                      버퍼
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-1 truncate text-xs text-[#6b5641]">{member.jobGrowName}</p>
                <p className="mt-1 truncate text-xs text-[#8d775f]">{member.adventureName}</p>
                <div className="mt-2">
                  <FameValue value={member.fame} textClassName="text-xs" />
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

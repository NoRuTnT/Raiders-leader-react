"use client";

import { useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { toast } from "sonner";
import { useAppStore } from "@/entities/app/model/app-store";
import { useCharacterStore } from "@/entities/character/model/character-store";
import { useDungeonStore } from "@/entities/dungeon/model/dungeon-store";
import { usePartyStore } from "@/entities/party/model/party-store";
import { PartyCard } from "@/features/party/ui/party-card";
import type { Party } from "@/shared/types/domain";

export function PartyList() {
  const { characters } = useCharacterStore();
  const { parties = [], getParty } = usePartyStore();
  const { dungeons } = useDungeonStore();
  const { setEditingParty } = useAppStore();
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);
  const [showOnlyWaiting, setShowOnlyWaiting] = useState(false);

  const filteredParties = useMemo(() => {
    return showOnlyWaiting ? parties.filter((party) => party.progress === "WAITING") : parties;
  }, [parties, showOnlyWaiting]);

  const groupedParties = useMemo(
    () =>
      filteredParties.reduce(
        (acc, party) => {
          if (!acc[party.dungeonId]) {
            acc[party.dungeonId] = [];
          }
          acc[party.dungeonId].push(party);
          return acc;
        },
        {} as Record<number, Party[]>,
      ),
    [filteredParties],
  );

  function calculateAverageFame(memberIds: string[]): number {
    const validFameValues = memberIds
      .map((id) => characters.find((char) => char.characterId === id)?.fame)
      .filter((fame) => fame !== undefined) as number[];

    const totalFame = validFameValues.reduce((sum, fame) => sum + fame, 0);
    return validFameValues.length > 0 ? totalFame / validFameValues.length : 0;
  }

  const handleDeleteParty = async (partyId: number) => {
    try {
      await usePartyStore.getState().deletePartyStore(partyId);
      toast("파티를 삭제했습니다.");
    } catch {
      toast("파티 삭제 중 오류가 발생했습니다.");
    }
    setDeleteConfirmation(null);
  };

  const handleUpdateProgress = async (party: Party, progress: "WAITING" | "DONE") => {
    try {
      await usePartyStore.getState().updatePartyStore({ ...party, progress });
      toast(progress === "DONE" ? "이번 주 완료로 체크했습니다." : "대기 상태로 되돌렸습니다.");
    } catch {
      toast("파티 상태 변경 중 오류가 발생했습니다.");
    }
  };

  const handleEditParty = (party: Party) => {
    setEditingParty(party);
  };

  if (dungeons.length === 0) {
    return (
      <div className="rounded-[32px] border border-dashed border-[#d8bb85] bg-[#fffaf0] px-8 py-14 text-center">
        <h2 className="text-2xl font-semibold text-[#3f2b1a]">파티 리스트</h2>
        <p className="mt-3 text-sm text-[#7b654d]">아직 등록된 던전이 없습니다. 파티 추가 화면에서 먼저 던전을 등록해보세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[32px] border border-[#e7d5b2] bg-[#fffaf0] p-6 shadow-sm md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#3f2b1a]">파티 리스트 및 스케줄링</h2>
          <p className="mt-2 text-sm text-[#7b654d]">던전별 파티를 확인하고 이번 주 진행 여부를 체크합니다.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-sm">
            총 {filteredParties.length}개 파티
          </Badge>
          <Button
            variant={showOnlyWaiting ? "default" : "outline"}
            onClick={() => setShowOnlyWaiting((prev) => !prev)}
            className={showOnlyWaiting ? "bg-[#6a4a28] text-white hover:bg-[#5b3d22]" : ""}
          >
            {showOnlyWaiting ? "전체 파티 보기" : "대기 중인 파티만 보기"}
          </Button>
        </div>
      </div>

      {dungeons.map((dungeon) => {
        const dungeonParties = groupedParties[dungeon.dungeonId] ?? [];

        return (
          <section key={dungeon.dungeonId} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-[#3f2b1a]">{dungeon.dungeonName}</h3>
                <p className="mt-1 text-sm text-[#7b654d]">{dungeonParties.length}개의 파티가 준비되어 있습니다.</p>
              </div>
            </div>

            {dungeonParties.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-[#dcc494] bg-[#fffaf0] px-6 py-10 text-center text-sm text-[#7b654d]">
                이 던전에는 아직 생성된 파티가 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {dungeonParties.map((party, index) => {
                  const partyWithCharacters = getParty(party.partyId);

                  return (
                    <PartyCard
                      key={party.partyId}
                      party={party}
                      partyNumber={index + 1}
                      members={partyWithCharacters.members}
                      averageFame={calculateAverageFame(party.memberIds)}
                      onDelete={(partyId) => setDeleteConfirmation(partyId)}
                      onUpdateProgress={handleUpdateProgress}
                      onEdit={handleEditParty}
                    />
                  );
                })}
              </div>
            )}
          </section>
        );
      })}

      <AlertDialog open={!!deleteConfirmation} onOpenChange={() => setDeleteConfirmation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>삭제한 파티 정보는 복구되지 않습니다.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDeleteParty(deleteConfirmation!)}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

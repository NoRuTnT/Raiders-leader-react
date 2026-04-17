"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDrop } from "react-dnd";
import { ChevronDown, ChevronUp, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useAppStore } from "@/entities/app/model/app-store";
import { useCharacterStore } from "@/entities/character/model/character-store";
import { useDungeonStore } from "@/entities/dungeon/model/dungeon-store";
import { usePartyStore } from "@/entities/party/model/party-store";
import { CharacterAvatar } from "@/features/character/ui/character-avatar";
import { CharacterCard } from "@/features/character/ui/character-card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { FameValue } from "@/shared/ui/fame-value";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import type { Character, Dungeon } from "@/shared/types/domain";

const SUPPORT_JOBS = ["인챈트리스", "뮤즈", "크루세이더", "세라핌", "패러메딕"];

export function PartyAdd() {
  const { addPartyStore, updatePartyStore } = usePartyStore();
  const { editingParty, setEditingParty } = useAppStore();
  const { dungeons, addDungeonStore, updateDungeonStore, deleteDungeonStore } = useDungeonStore();
  const { characters } = useCharacterStore();
  const [selectedDungeon, setSelectedDungeon] = useState<string>("");
  const [partyMembers, setPartyMembers] = useState<(string | null)[]>([null, null, null, null]);
  const [newDungeonName, setNewDungeonName] = useState("");
  const [isAddDungeonOpen, setIsAddDungeonOpen] = useState(false);
  const [isDungeonListOpen, setIsDungeonListOpen] = useState(false);
  const [editingDungeon, setEditingDungeon] = useState<Dungeon | null>(null);
  const [collapsedAdventures, setCollapsedAdventures] = useState<Record<string, boolean>>({});
  const isEditMode = !!editingParty;

  const sortedAdventureGroups = useMemo(() => {
    const groups = groupCharactersByAdventureName(characters);
    Object.keys(groups).forEach((adventureName) => {
      groups[adventureName].sort((a, b) => b.fame - a.fame);
    });
    return groups;
  }, [characters]);

  useEffect(() => {
    if (editingParty) {
      setSelectedDungeon(String(editingParty.dungeonId));

      const nextMembers: (string | null)[] = [null, null, null, null];
      editingParty.memberIds.forEach((memberId, index) => {
        if (index < 4) nextMembers[index] = memberId;
      });
      setPartyMembers(nextMembers);
      return;
    }

    setSelectedDungeon("");
    setPartyMembers([null, null, null, null]);
  }, [editingParty]);

  const selectedCharacters = partyMembers
    .filter((memberId): memberId is string => memberId !== null)
    .map((memberId) => characters.find((character) => character.characterId === memberId))
    .filter((character): character is Character => !!character);

  const averageFame = useMemo(() => {
    if (selectedCharacters.length === 0) return 0;
    const totalFame = selectedCharacters.reduce((sum, member) => sum + member.fame, 0);
    return Math.round(totalFame / selectedCharacters.length);
  }, [selectedCharacters]);

  const selectedDungeonName = dungeons.find((dungeon) => String(dungeon.dungeonId) === selectedDungeon)?.dungeonName;

  const toggleAdventureCollapse = (adventureName: string) => {
    setCollapsedAdventures((prev) => ({
      ...prev,
      [adventureName]: !prev[adventureName],
    }));
  };

  const addToParty = (character: Character, targetIndex?: number) => {
    setPartyMembers((prevMembers) => {
      const nextMembers = [...prevMembers];
      const existingIndex = nextMembers.findIndex((memberId) => memberId === character.characterId);

      if (existingIndex !== -1) {
        if (targetIndex !== undefined && existingIndex !== targetIndex) {
          [nextMembers[existingIndex], nextMembers[targetIndex]] = [nextMembers[targetIndex], nextMembers[existingIndex]];
        }
        return nextMembers;
      }

      if (targetIndex !== undefined) {
        nextMembers[targetIndex] = character.characterId;
        return nextMembers;
      }

      const emptyIndex = nextMembers.findIndex((memberId) => memberId === null);
      if (emptyIndex === -1) {
        toast("파티 슬롯이 모두 찼습니다. 먼저 한 자리를 비워주세요.");
        return nextMembers;
      }

      nextMembers[emptyIndex] = character.characterId;
      return nextMembers;
    });
  };

  const removeFromParty = (index: number) => {
    setPartyMembers((prevMembers) => {
      const nextMembers = [...prevMembers];
      nextMembers[index] = null;
      return nextMembers;
    });
  };

  const handleSave = async () => {
    if (!selectedDungeon) {
      toast("던전을 먼저 선택해주세요.");
      return;
    }

    const validMemberIds = partyMembers.filter((memberId): memberId is string => memberId !== null);
    if (validMemberIds.length === 0) {
      toast("최소 한 명의 캐릭터를 파티에 추가해주세요.");
      return;
    }

    try {
      if (isEditMode && editingParty) {
        await updatePartyStore({
          ...editingParty,
          dungeonId: Number(selectedDungeon),
          memberIds: validMemberIds,
        });
        toast("파티 구성을 수정했습니다.");
      } else {
        await addPartyStore({
          dungeonId: Number(selectedDungeon),
          memberIds: validMemberIds,
          progress: "WAITING",
        });
        toast("새 파티를 추가했습니다.");
      }

      setSelectedDungeon("");
      setPartyMembers([null, null, null, null]);
      setEditingParty(null);
    } catch {
      toast("파티 저장 중 오류가 발생했습니다.");
    }
  };

  const handleCancelEdit = () => {
    setEditingParty(null);
    setSelectedDungeon("");
    setPartyMembers([null, null, null, null]);
  };

  const handleAddDungeon = async () => {
    if (!newDungeonName.trim()) {
      toast("추가할 던전 이름을 입력해주세요.");
      return;
    }

    try {
      await addDungeonStore({ dungeonName: newDungeonName.trim() });
      toast("던전을 추가했습니다.");
      setNewDungeonName("");
      setIsAddDungeonOpen(false);
    } catch {
      toast("던전 추가 중 오류가 발생했습니다.");
    }
  };

  const handleUpdateDungeon = async () => {
    if (!editingDungeon || !editingDungeon.dungeonName.trim()) {
      toast("수정할 던전 이름을 입력해주세요.");
      return;
    }

    try {
      await updateDungeonStore({ ...editingDungeon, dungeonName: editingDungeon.dungeonName.trim() });
      setEditingDungeon(null);
      toast("던전 이름을 수정했습니다.");
    } catch {
      toast("던전 수정 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteDungeon = async (dungeonId: number) => {
    try {
      await deleteDungeonStore(dungeonId);
      toast("던전을 삭제했습니다.");
    } catch {
      toast("던전 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-6">
        <div className={`rounded-[32px] border bg-[#fffaf0] p-6 shadow-sm ${isEditMode ? "border-emerald-300" : "border-[#e7d5b2]"}`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold text-[#3f2b1a]">{isEditMode ? "파티 수정" : "파티 추가"}</h2>
                {isEditMode ? <Badge className="bg-emerald-600 text-white">수정 모드</Badge> : null}
              </div>
              <p className="mt-2 text-sm leading-6 text-[#7b654d]">
                등록된 캐릭터만 사용해 파티를 구성합니다. 새 캐릭터를 추가하려면 파티관리의 캐릭터 리스트 메뉴를 이용해주세요.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {isEditMode ? (
                <Button variant="outline" onClick={handleCancelEdit}>
                  취소
                </Button>
              ) : null}
              <Button onClick={handleSave} className="bg-[#6a4a28] text-white hover:bg-[#5b3d22]">
                <Save className="mr-2 h-4 w-4" />
                {isEditMode ? "수정 저장" : "파티 저장"}
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,240px)_repeat(2,max-content)] md:items-center">
            <Select value={selectedDungeon} onValueChange={setSelectedDungeon}>
              <SelectTrigger className="h-11 rounded-2xl border-[#e2cda4] bg-white">
                <SelectValue placeholder="던전을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {dungeons.map((dungeon) => (
                  <SelectItem key={dungeon.dungeonId} value={String(dungeon.dungeonId)}>
                    {dungeon.dungeonName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" className="rounded-2xl" onClick={() => setIsAddDungeonOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              던전 추가
            </Button>
            <Button variant="outline" className="rounded-2xl" onClick={() => setIsDungeonListOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              던전 관리
            </Button>
          </div>

          <div className="mt-6 grid gap-4 rounded-[28px] bg-[#f9f0da] p-5 md:grid-cols-3">
            <InfoBlock label="선택된 던전" value={selectedDungeonName ?? "아직 선택되지 않음"} />
            <InfoBlock label="현재 인원" value={`${selectedCharacters.length} / 4`} />
            <InfoBlock label="평균 명성" value={averageFame.toLocaleString()} />
          </div>
        </div>

        <div className="rounded-[32px] border border-[#e7d5b2] bg-[#fffaf0] p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-[#3f2b1a]">파티 구성 슬롯</h3>
              <p className="mt-1 text-sm text-[#7b654d]">등록된 캐릭터를 배치하거나 순서를 조정해 파티를 구성합니다.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {partyMembers.map((memberId, index) => (
              <PartySlot
                key={index}
                slotNumber={index + 1}
                memberId={memberId}
                characters={characters}
                onDrop={(character) => addToParty(character, index)}
                onRemove={() => removeFromParty(index)}
              />
            ))}
          </div>
        </div>

        <Dialog open={isAddDungeonOpen} onOpenChange={setIsAddDungeonOpen}>
          <DialogContent className="rounded-[28px] border-[#e7d5b2] bg-[#fffaf0]">
            <DialogHeader>
              <DialogTitle>던전 추가</DialogTitle>
              <DialogDescription>파티 생성에 사용할 새로운 던전 이름을 입력합니다.</DialogDescription>
            </DialogHeader>
            <Input
              placeholder="예: 안개신 레이드"
              value={newDungeonName}
              onChange={(event) => setNewDungeonName(event.target.value)}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDungeonOpen(false)}>
                닫기
              </Button>
              <Button onClick={handleAddDungeon} className="bg-[#6a4a28] text-white hover:bg-[#5b3d22]">
                추가
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDungeonListOpen} onOpenChange={setIsDungeonListOpen}>
          <DialogContent className="rounded-[28px] border-[#e7d5b2] bg-[#fffaf0]">
            <DialogHeader>
              <DialogTitle>던전 관리</DialogTitle>
              <DialogDescription>던전 이름을 수정하거나 더 이상 사용하지 않는 항목을 정리합니다.</DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              {dungeons.map((dungeon) => (
                <div key={dungeon.dungeonId} className="flex items-center gap-3 rounded-2xl border border-[#ead6b0] bg-white p-3">
                  {editingDungeon?.dungeonId === dungeon.dungeonId ? (
                    <Input
                      value={editingDungeon.dungeonName}
                      onChange={(event) =>
                        setEditingDungeon({
                          ...editingDungeon,
                          dungeonName: event.target.value,
                        })
                      }
                    />
                  ) : (
                    <div className="flex-1 text-sm font-medium text-[#3f2b1a]">{dungeon.dungeonName}</div>
                  )}

                  {editingDungeon?.dungeonId === dungeon.dungeonId ? (
                    <Button size="sm" onClick={handleUpdateDungeon} className="bg-[#6a4a28] text-white hover:bg-[#5b3d22]">
                      저장
                    </Button>
                  ) : (
                    <Button size="icon" variant="ghost" onClick={() => setEditingDungeon(dungeon)} aria-label="던전 수정">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" onClick={() => handleDeleteDungeon(dungeon.dungeonId)} aria-label="던전 삭제">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </section>

      <section className="rounded-[32px] border border-[#e7d5b2] bg-[#fffaf0] p-6 shadow-sm xl:max-h-[calc(100vh-7.5rem)] xl:overflow-y-auto xl:pr-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-[#3f2b1a]">등록된 캐릭터</h3>
            <p className="mt-1 text-sm text-[#7b654d]">모험단 기준으로 묶인 캐릭터를 확인하고 파티에 배치합니다.</p>
          </div>
          <Badge variant="outline">{characters.length}명</Badge>
        </div>

        <div className="mt-6 space-y-4">
          {Object.entries(sortedAdventureGroups).map(([adventureName, groupedCharacters]) => (
            <Collapsible
              key={adventureName}
              open={!collapsedAdventures[adventureName]}
              onOpenChange={() => toggleAdventureCollapse(adventureName)}
              className="rounded-[24px] border border-[#ead6b0] bg-white p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-base font-semibold text-[#3f2b1a]">{adventureName}</h4>
                  <p className="mt-1 text-sm text-[#7b654d]">{groupedCharacters.length}명의 캐릭터가 등록되어 있습니다.</p>
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="모험단 접기 또는 펼치기">
                    {collapsedAdventures[adventureName] ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {groupedCharacters.map((character) => (
                    <CharacterCard key={character.characterId} character={character} onClick={() => addToParty(character)} />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </section>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/80 p-4">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#8d775f]">{label}</p>
      <p className="mt-2 text-lg font-semibold text-[#3f2b1a]">{value}</p>
    </div>
  );
}

interface PartySlotProps {
  slotNumber: number;
  memberId: string | null;
  characters: Character[];
  onDrop: (character: Character) => void;
  onRemove: () => void;
}

function PartySlot({ slotNumber, memberId, characters, onDrop, onRemove }: PartySlotProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "character",
    drop: (item: Character) => {
      onDrop(item);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const setRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        drop(node);
      }
    },
    [drop],
  );

  const member = memberId ? characters.find((character) => character.characterId === memberId) : null;
  const isSupport = member ? SUPPORT_JOBS.includes(member.jobGrowName) : false;

  return (
    <div
      ref={setRef}
      className={`rounded-[24px] border-2 p-4 transition ${
        isOver ? "border-[#bb8c43] bg-[#fff1cc]" : "border-[#e4cfa3] bg-[#fffaf0]"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-[#6b5641]">슬롯 {slotNumber}</p>
        {member ? (
          <Button variant="ghost" size="icon" onClick={onRemove} aria-label="슬롯 비우기">
            <X className="h-4 w-4" />
          </Button>
        ) : null}
      </div>

      {member ? (
        <div className="flex items-center gap-4">
          <CharacterAvatar serverId={member.serverId} characterId={member.characterId} characterName={member.characterName} size={72} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-base font-semibold text-[#3f2b1a]">{member.characterName}</p>
              {isSupport ? <Badge className="bg-[#dcefdc] text-[#456445] hover:bg-[#dcefdc]">버퍼</Badge> : null}
            </div>
            <p className="mt-1 text-sm text-[#6b5641]">{member.jobGrowName}</p>
            <p className="mt-1 text-xs text-[#8d775f]">{member.adventureName}</p>
            <div className="mt-2">
              <FameValue value={member.fame} textClassName="text-sm" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-[110px] items-center justify-center rounded-[18px] border border-dashed border-[#dcc494] bg-white/70 text-sm text-[#8d775f]">
          캐릭터를 클릭하거나 드래그해서 배치하세요
        </div>
      )}
    </div>
  );
}

function groupCharactersByAdventureName(characters: Character[]) {
  return characters.reduce(
    (acc, character) => {
      if (!acc[character.adventureName]) {
        acc[character.adventureName] = [];
      }
      acc[character.adventureName].push(character);
      return acc;
    },
    {} as Record<string, Character[]>,
  );
}

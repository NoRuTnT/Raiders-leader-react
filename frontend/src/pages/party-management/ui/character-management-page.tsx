"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, LoaderCircle, RefreshCcw, Search, UserPlus } from "lucide-react";
import { getCharacterInfo, getCharacterList, refreshCharacterInfo, updateCharacter } from "@/shared/api";
import { mockCharacterSearchPool } from "@/shared/mocks/party-management";
import { useAppStore } from "@/entities/app/model/app-store";
import { useCharacterStore } from "@/entities/character/model/character-store";
import { CharacterCard } from "@/features/character/ui/character-card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/ui/collapsible";
import { Input } from "@/shared/ui/input";
import type { Character } from "@/shared/types/domain";

const REFRESH_INTERVAL_MS = 220;

export function CharacterManagementPage() {
  const { isUsingMockData } = useAppStore();
  const { characters, addCharacterStore, setCharacterStore } = useCharacterStore();
  const [characterQuery, setCharacterQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Character[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [collapsedAdventures, setCollapsedAdventures] = useState<Record<string, boolean>>({});
  const [refreshingAdventureName, setRefreshingAdventureName] = useState<string | null>(null);
  const [lastRefreshedAtByAdventure, setLastRefreshedAtByAdventure] = useState<Record<string, string>>({});

  const groupedCharacters = useMemo(() => {
    const groups = groupCharactersByAdventureName(characters);
    Object.keys(groups).forEach((adventureName) => {
      groups[adventureName].sort((a, b) => b.fame - a.fame);
    });
    return groups;
  }, [characters]);

  const filteredSearchResults = searchResults.filter(
    (character) => !characters.some((item) => item.characterId === character.characterId),
  );

  const handleSearchCharacters = async () => {
    const trimmedQuery = characterQuery.trim();
    if (!trimmedQuery) {
      toast("검색할 캐릭터명을 입력해주세요.");
      return;
    }

    setIsSearching(true);

    try {
      if (isUsingMockData) {
        const mockResults = mockCharacterSearchPool.filter((character) =>
          character.characterName.toLowerCase().includes(trimmedQuery.toLowerCase()),
        );

        setSearchResults(
          mockResults.length > 0
            ? mockResults
            : [
                {
                  characterId: `search-${trimmedQuery}`,
                  serverId: "cain",
                  characterName: trimmedQuery,
                  level: 115,
                  jobId: "mock-job",
                  jobGrowId: "mock-grow",
                  jobName: "귀검사(남)",
                  jobGrowName: "웨펀마스터",
                  fame: 54000,
                  adventureName: "검색결과",
                  guildId: "mock-guild",
                  guildName: "mock",
                },
              ],
        );
        return;
      }

      const rows = await getCharacterList(trimmedQuery);
      const detailedCharacters = await Promise.all(
        rows.slice(0, 8).map((character) => getCharacterInfo(character.serverId, character.characterId)),
      );
      setSearchResults(detailedCharacters);
    } catch {
      toast("캐릭터 검색 중 오류가 발생했습니다.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddCharacterToStore = async (character: Character) => {
    try {
      if (characters.some((item) => item.characterId === character.characterId)) {
        toast("이미 등록된 캐릭터입니다.");
        return;
      }

      await addCharacterStore(character);
      toast(`${character.characterName} 캐릭터를 추가했습니다.`);
    } catch {
      toast("캐릭터 추가 중 오류가 발생했습니다.");
    }
  };

  const toggleAdventureCollapse = (adventureName: string) => {
    setCollapsedAdventures((prev) => ({
      ...prev,
      [adventureName]: !prev[adventureName],
    }));
  };

  const handleRefreshAdventure = async (adventureName: string, targetCharacters: Character[]) => {
    if (refreshingAdventureName) {
      return;
    }

    setRefreshingAdventureName(adventureName);

    try {
      const refreshedCharacters: Character[] = [];

      for (const [index, character] of targetCharacters.entries()) {
        if (isUsingMockData) {
          await sleep(REFRESH_INTERVAL_MS);
          refreshedCharacters.push(buildMockRefreshedCharacter(character, index));
          continue;
        }

        const refreshedCharacter = await refreshCharacterInfo(character.serverId, character.characterId);
        const persistedCharacter = await updateCharacter(refreshedCharacter);
        refreshedCharacters.push(persistedCharacter);

        if (index < targetCharacters.length - 1) {
          await sleep(REFRESH_INTERVAL_MS);
        }
      }

      const refreshedById = new Map(refreshedCharacters.map((character) => [character.characterId, character]));
      const nextCharacters = characters.map((character) => refreshedById.get(character.characterId) ?? character);

      setCharacterStore(nextCharacters);
      setLastRefreshedAtByAdventure((prev) => ({
        ...prev,
        [adventureName]: formatRefreshTime(new Date()),
      }));
      toast(`${adventureName} 모험단 캐릭터 정보를 갱신했습니다.`);
    } catch {
      toast(`${adventureName} 모험단 정보를 갱신하지 못했습니다.`);
    } finally {
      setRefreshingAdventureName(null);
    }
  };

  return (
    <div className="space-y-10">
      <section className="rounded-[32px] border border-[#e7d5b2] bg-[#fffaf0] p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold text-[#3f2b1a]">캐릭터 리스트</h2>
              {isUsingMockData ? <Badge className="bg-[#f7e3a5] text-[#6e4b20] hover:bg-[#f7e3a5]">mock 모드</Badge> : null}
            </div>
            <p className="mt-2 text-sm leading-6 text-[#7b654d]">
              캐릭터명을 검색해 등록하고, 이후 파티 추가 / 수정 화면에서는 등록된 캐릭터만 사용합니다.
            </p>
          </div>
          <p className="text-sm font-medium text-[#7b654d]">현재 {characters.length}명 등록됨</p>
        </div>

        <div className="mt-6 flex flex-col gap-3 md:flex-row">
          <Input
            value={characterQuery}
            onChange={(event) => setCharacterQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                void handleSearchCharacters();
              }
            }}
            placeholder="예: 노루버퍼"
            className="h-11 rounded-2xl border-[#e2cda4] bg-white"
          />
          <Button
            onClick={() => void handleSearchCharacters()}
            className="h-11 rounded-2xl bg-[#6a4a28] text-white hover:bg-[#5b3d22]"
            disabled={isSearching}
          >
            <Search className="mr-2 h-4 w-4" />
            {isSearching ? "검색 중..." : "캐릭터 검색"}
          </Button>
        </div>

        <div className="mt-6">
          {filteredSearchResults.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredSearchResults.map((character) => (
                <div key={character.characterId} className="relative">
                  <CharacterCard character={character} />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void handleAddCharacterToStore(character)}
                    className="absolute right-4 bottom-4 rounded-full bg-white/95"
                  >
                    <UserPlus className="mr-1 h-4 w-4" />
                    등록
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-sm text-[#7b654d]">검색 결과가 없습니다. 캐릭터명을 입력하고 검색해보세요.</div>
          )}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-[#3f2b1a]">등록된 캐릭터</h3>
          <p className="mt-2 text-sm text-[#7b654d]">모험단별로 묶어서 보고, 필요할 때 한 번에 정보를 갱신할 수 있습니다.</p>
        </div>

        <div className="space-y-4">
          {Object.entries(groupedCharacters).map(([adventureName, grouped]) => {
            const isRefreshing = refreshingAdventureName === adventureName;

            return (
              <Collapsible
                key={adventureName}
                open={!collapsedAdventures[adventureName]}
                onOpenChange={() => toggleAdventureCollapse(adventureName)}
                className="rounded-[28px] border border-[#ead6b0] bg-[#fffaf0] p-4 shadow-sm"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-semibold text-[#3f2b1a]">{adventureName}</h4>
                      <Badge variant="outline">{grouped.length}명</Badge>
                    </div>
                    <p className="mt-1 text-sm text-[#7b654d]">명성 내림차순으로 정렬되며, 모험단 단위로 정보 갱신이 가능합니다.</p>
                    <p className="mt-1 text-xs text-[#9a7f62]">
                      마지막 갱신: {lastRefreshedAtByAdventure[adventureName] ?? "아직 갱신 기록이 없습니다."}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <Button
                      variant="outline"
                      onClick={() => void handleRefreshAdventure(adventureName, grouped)}
                      disabled={isRefreshing || !!refreshingAdventureName}
                      className="rounded-full border-[#d8c095] bg-white/90 text-[#6a4a28] hover:bg-[#fff3db]"
                    >
                      {isRefreshing ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
                      {isRefreshing ? "갱신 중..." : "모험단 정보 갱신"}
                    </Button>

                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="모험단 열기 또는 접기">
                        {collapsedAdventures[adventureName] ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>

                <CollapsibleContent>
                  <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {grouped.map((character) => (
                      <CharacterCard key={character.characterId} character={character} />
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </section>
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

function buildMockRefreshedCharacter(character: Character, index: number): Character {
  return {
    ...character,
    fame: character.fame + 10 + index,
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function formatRefreshTime(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

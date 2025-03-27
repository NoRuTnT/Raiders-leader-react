"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle} from "@/components/ui/dialog"
import type { Character } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { getCharacterList, getCharacterInfo, getCharacterSpringApi, refreshCharacterInfo } from "@/lib/api"
import { useCharacterStore } from "@/lib/stores/characterStore"
import { toast } from "sonner";
import { RefreshCw, ChevronDown, ChevronUp } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"



export function CharacterList() {
    const { characters=[], addCharacterStore, updateCharacterStore, isLoading } = useCharacterStore()
    const [searchTerm, setSearchTerm] = useState("")
    const [searchResults, setSearchResults] = useState<Character[]>([])
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
    const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [lastRefreshTime, setLastRefreshTime] = useState<number | null>(null)
    const [collapsedAdventures, setCollapsedAdventures] = useState<Record<string, boolean>>({})

    // 모험단별로 캐릭터 그룹화
    const adventureGroups = characters.reduce((groups: Record<string, Character[]>, character) => {
        const adventureName = character.adventureName || "기타"
        if (!groups[adventureName]) {
            groups[adventureName] = []
        }
        groups[adventureName].push(character)
        return groups
    }, {})

    Object.keys(adventureGroups).forEach((adventureName) => {
        adventureGroups[adventureName].sort((a, b) => b.fame - a.fame)
    })

    const toggleAdventureCollapse = (adventureName: string) => {
        setCollapsedAdventures((prev) => ({
            ...prev,
            [adventureName]: !prev[adventureName],
        }))
    }


    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (searchTerm.trim()) {
            try {
                const results = await getCharacterList(searchTerm)
                setSearchResults(results || [])
                console.log("리스트검색:", results)
                setIsSearchModalOpen(true)
                console.log("isSearchModalOpen 상태:", isSearchModalOpen);

            } catch (error) {
                console.error("Error searching character:", error)
                toast("캐릭터 검색 중 오류가 발생했습니다. 다시 시도해 주세요.")
            }
        }
    }



    const handleCharacterSelect = async (serverId: string, characterId: string, characterName: string
    ) => {
        try {
            const existingCharacter = await getCharacterSpringApi(characterName);
            const characterInfo = await getCharacterInfo(serverId, characterId) || {};
            console.log("게임 서버에서 가져온 데이터:", characterInfo);

            if (existingCharacter) {
                console.log("캐릭터가 이미 존재합니다. 업데이트를 진행합니다.");
                await updateCharacterStore(characterInfo);
                console.log("캐릭터 정보가 업데이트되었습니다.");
            } else {
                console.log("캐릭터가 존재하지 않습니다. 새로 추가합니다.");
                await addCharacterStore(characterInfo);
                console.log("새 캐릭터가 추가되었습니다.");
            }

            setIsSearchModalOpen(false)
            setSearchTerm("")
        } catch (error) {
            console.error("Error fetching character details:", error)
            toast("정보를 가져오는 중 오류가 발생했습니다. 다시 시도해 주세요")
        }
    }

    const handleCharacterClick = (character: Character) => {
        setSelectedCharacter(character)
        setIsCharacterModalOpen(true)
    }

    const handleRefreshCharacter = useCallback(async () => {
        if (!selectedCharacter || isRefreshing) return

        const currentTime = Date.now()
        if (lastRefreshTime && currentTime - lastRefreshTime < 60000) {
            toast("1분 후에 다시 시도해 주세요.")
            return
        }

        setIsRefreshing(true)
        try {
            const refreshedCharacter = await refreshCharacterInfo(selectedCharacter.serverId, selectedCharacter.characterId)
            await updateCharacterStore(refreshedCharacter)
            setSelectedCharacter(refreshedCharacter)
            setLastRefreshTime(currentTime)
            toast("캐릭터 정보가 성공적으로 갱신되었습니다.")
        } catch (error) {
            console.error("Error refreshing character:", error)
            toast( "캐릭터 정보 갱신 중 오류가 발생했습니다. 다시 시도해 주세요.")
        } finally {
            setIsRefreshing(false)
        }
    }, [selectedCharacter, isRefreshing, lastRefreshTime, updateCharacterStore])

    return (
        <div className="space-y-6">
            <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                    placeholder="캐릭터 이름 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "검색 중..." : "검색"}
                </Button>
            </form>

            {/* 검색 결과 모달 */}
            <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
                <DialogOverlay className="fixed inset-0 bg-black/80" />
                    <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg z-50 max-w-md w-full max-h-[80vh] overflow-y-auto"
                    >
                        <DialogHeader>
                            <DialogTitle>검색 결과</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                            {searchResults.length === 0 ? (
                                <p className="text-center text-muted-foreground">검색 결과가 없습니다.</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {searchResults.map((result) => (
                                        <Button
                                            key={result.characterId}
                                            variant="outline"
                                            className="flex flex-col items-center p-4 h-auto"
                                            onClick={() => handleCharacterSelect(result.serverId, result.characterId, result.characterName)}
                                            disabled={isLoading}
                                        >
                                            <img
                                                src={`https://img-api.neople.co.kr/df/servers/${result.serverId}/characters/${result.characterId}?zoom=3`}
                                                alt={result.characterName}
                                                className="w-40 h-40 rounded-full object-cover mb-2"
                                            />
                                            <div className="flex flex-col items-center">
                                                <span className="font-medium text-base">{result.characterName}</span>
                                                <span className="text-sm text-muted-foreground">서버:{result.serverId} </span>
                                                <span className="text-sm text-muted-foreground">{result.jobGrowName} </span>
                                            </div>
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </DialogContent>
            </Dialog>


            {/* 모험단별 캐릭터 목록 */}
            <div className="space-y-6">
                {Object.entries(adventureGroups).map(([adventureName, chars]) => (
                    <Collapsible
                        key={adventureName}
                        open={!collapsedAdventures[adventureName]}
                        onOpenChange={() => toggleAdventureCollapse(adventureName)}
                        className="border rounded-lg p-4"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold">
                                {adventureName} ({chars.length})
                            </h3>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    {collapsedAdventures[adventureName] ? (
                                        <ChevronDown className="h-4 w-4" />
                                    ) : (
                                        <ChevronUp className="h-4 w-4" />
                                    )}
                                </Button>
                            </CollapsibleTrigger>
                        </div>

                        <CollapsibleContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
                                {chars.map((character) => (
                                    <Card
                                        key={character.characterId}
                                        onClick={() => handleCharacterClick(character)}
                                        className="cursor-pointer hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex flex-col items-center p-4">
                                            <img
                                                src={`https://img-api.neople.co.kr/df/servers/${character.serverId}/characters/${character.characterId}?zoom=1`}
                                                alt={character.characterName}
                                                className="w-32 h-32 rounded-full object-cover mb-2"
                                            />
                                            <h4 className="font-medium text-center">{character.characterName}</h4>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge variant="outline" className="text-xs">
                                                    Lv.{character.level}
                                                </Badge>
                                                <Badge variant="secondary" className="text-xs">
                                                    {character.jobGrowName}
                                                </Badge>
                                            </div>
                                            <p className="text-green-600 text-sm mt-2">{character.adventureName}</p>
                                            <div className="flex items-center mt-1">
                                                <img src="/fame.png" alt="명성" className="w-4 h-4 mr-1" />
                                                <span className="text-yellow-500 text-sm">{character.fame}</span>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </div>

            {/* 캐릭터 상세 모달 */}
            <Dialog open={isCharacterModalOpen} onOpenChange={setIsCharacterModalOpen}>
                <DialogOverlay className="fixed inset-0 bg-black/80" />
                <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg z-50">
                    <div className="flex justify-between items-center">
                        <DialogTitle>{selectedCharacter?.characterName}</DialogTitle>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleRefreshCharacter}
                            disabled={isRefreshing ? true : lastRefreshTime ? Date.now() - lastRefreshTime < 60000 : false}
                            className="mr-5"
                        >
                            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                        </Button>
                    </div>

                    {selectedCharacter && (
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-center mb-4">
                                <img
                                    src={`https://img-api.neople.co.kr/df/servers/${selectedCharacter.serverId}/characters/${selectedCharacter.characterId}?zoom=1`}
                                    alt={selectedCharacter.characterName}
                                    className="w-32 h-32 rounded-full object-cover"
                                />
                            </div>
                            <p>
                                <span className="font-medium">레벨:</span> {selectedCharacter.level}
                            </p>
                            <p>
                                <span className="font-medium">직업:</span> {selectedCharacter.jobGrowName}
                            </p>
                            <p>
                                <span className="font-medium">명성:</span> {selectedCharacter.fame}
                            </p>
                            <p>
                                <span className="font-medium">모험단:</span> {selectedCharacter.adventureName}
                            </p>
                            <p>
                                <span className="font-medium">서버:</span> {selectedCharacter.serverId}
                            </p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )

}


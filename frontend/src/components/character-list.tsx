"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle} from "@/components/ui/dialog"
import type { Character } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { getCharacterList, getCharacterInfo, getCharacterSpringApi, refreshCharacterInfo } from "@/lib/api"
import { useCharacterStore } from "@/lib/stores/characterStore"
import { toast } from "sonner";
import { RefreshCw } from "lucide-react"



export function CharacterList() {
    const { characters=[], addCharacterStore, updateCharacterStore, isLoading } = useCharacterStore()
    const [searchTerm, setSearchTerm] = useState("")
    const [searchResults, setSearchResults] = useState<Character[]>([])
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
    const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [lastRefreshTime, setLastRefreshTime] = useState<number | null>(null)

    useEffect(() => {
        console.log("isSearchModalOpen 상태 변경됨:", isSearchModalOpen);
    }, [isSearchModalOpen]);


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
                    <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg z-50"
                    >
                        <DialogHeader>
                            <DialogTitle>검색 결과</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4 space-y-2">
                            {searchResults.map((result) => (
                                <Button
                                    key={result.characterId}
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => handleCharacterSelect(result.serverId, result.characterId, result.characterName)}
                                    disabled={isLoading}
                                >
                                    {result.characterName} ({result.serverId})
                                </Button>
                            ))}
                        </div>
                    </DialogContent>
            </Dialog>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                {characters.map((character: Character) => (
                    <Card key={character.characterId} onClick={() => handleCharacterClick(character)} className="cursor-pointer">
                        <div className="flex flex-col items-center justify-center">
                            <img
                                src={`https://img-api.neople.co.kr/df/servers/${character.serverId}/characters/${character.characterId}?zoom=1`}
                                alt={character.characterName}
                                className="w-64 h-64 rounded-full object-cover mb-4"
                            />

                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg ">{character.characterName}</CardTitle>
                            </CardHeader>
                        </div>

                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">Lv.{character.level}</Badge>
                                    <Badge>{character.jobGrowName}</Badge>
                                </div>
                                <p className="text-sm">
                                    <span className="font-medium">명성:</span> {character.fame}
                                </p>
                                <p className="text-sm">
                                    <span className="font-medium">모험단:</span> {character.adventureName}
                                </p>
                                <p className="text-sm">
                                    <span className="font-medium">서버:</span> {character.serverId}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={isCharacterModalOpen} onOpenChange={setIsCharacterModalOpen}>
                <DialogOverlay className="fixed inset-0 bg-black/80" />
                    <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg z-50">
                        <DialogHeader>
                            <DialogTitle className="flex justify-between items-center">
                                {selectedCharacter?.characterName}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleRefreshCharacter}
                                    disabled={isRefreshing ? true : lastRefreshTime ? Date.now() - lastRefreshTime < 60000 : false}

                                >
                                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                                </Button>
                            </DialogTitle>
                        </DialogHeader>
                        {selectedCharacter && (
                            <div className="mt-4 space-y-2">
                                <p>레벨: {selectedCharacter.level}</p>
                                <p>직업: {selectedCharacter.jobGrowName}</p>
                                <p>명성: {selectedCharacter.fame}</p>
                                <p>모험단: {selectedCharacter.adventureName}</p>
                                <p>서버: {selectedCharacter.serverId}</p>
                            </div>
                        )}
                    </DialogContent>
            </Dialog>
        </div>
    )

}


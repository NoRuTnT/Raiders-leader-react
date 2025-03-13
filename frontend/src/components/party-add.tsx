"use client"

import React, {useEffect, useState} from "react"
import { useDrop } from "react-dnd"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CharacterCard } from "@/components/character-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { usePartyStore } from "@/lib/stores/partyStore"
import { useDungeonStore } from "@/lib/stores/dungeonStore"
import { useCharacterStore } from "@/lib/stores/characterStore"
import { toast } from "sonner"
import { Pencil, Trash2,ChevronDown, ChevronUp } from 'lucide-react'
import type { Character,Dungeon } from "@/lib/types"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"


export function PartyAdd() {
    const { addPartyStore } = usePartyStore()
    const { dungeons, addDungeonStore } = useDungeonStore()
    const { characters } = useCharacterStore()
    const [selectedDungeon, setSelectedDungeon] = useState<string | null>(null)
    const [partyMembers, setPartyMembers] = useState<(string | null)[]>([null, null, null, null])
    const [newDungeonName, setNewDungeonName] = useState("")
    const [isAddDungeonOpen, setIsAddDungeonOpen] = useState(false)
    const [isDungeonListOpen, setIsDungeonListOpen] = useState(false)
    const [editingDungeon, setEditingDungeon] = useState<Dungeon | null>(null)
    const [collapsedAdventures, setCollapsedAdventures] = useState<Record<string, boolean>>({})


    useEffect(() => {
        console.log('Rendered partyMembers:', partyMembers);
    }, [partyMembers]);

    const toggleAdventureCollapse = (adventureName: string) => {
        setCollapsedAdventures((prev) => ({
            ...prev,
            [adventureName]: !prev[adventureName],
        }))
    }

    const calculateAverageFame = () => {
        const validMembers = partyMembers
            .filter((memberId): memberId is string => memberId !== null)
            .map((memberId) => characters.find((c) => c.characterId === memberId))
            .filter((character): character is Character => character !== undefined)

        if (validMembers.length === 0) return 0
        const totalFame = validMembers.reduce((sum, member) => sum + member.fame, 0)
        return Math.round(totalFame / validMembers.length)
    }

    const handleSave = async () =>{

        if (!selectedDungeon) {
            alert("던전을 선택해주세요.")
            return
        }

        const validMemberIds = partyMembers.filter((memberId): memberId is string => memberId !== null)

        if (validMemberIds.length === 0) {
            alert("최소 한 명의 캐릭터를 추가해주세요.")
            return
        }

        try {
            await addPartyStore({
                dungeonId: Number(selectedDungeon),
                memberIds: validMemberIds,
                progress: "WAITING",
            })
            toast("파티가 추가되었습니다.")

            setSelectedDungeon(null)
            setPartyMembers([null, null, null, null])

        } catch (error) {
            toast("파티 추가 중 오류가 발생했습니다.")
        }
    }

    const handleAddDungeon = async () => {
        if (!newDungeonName.trim()) {
            toast("던전 이름을 입력해주세요.")
            return
        }

        try {
            await addDungeonStore({ dungeonName: newDungeonName })
            toast("던전이 추가되었습니다.")
            setNewDungeonName("")
            setIsAddDungeonOpen(false)
        } catch (error) {
            toast("던전 추가 중 오류가 발생했습니다.")
        }
    }

    const handleUpdateDungeon = async () => {
        if (!editingDungeon || !editingDungeon.dungeonName.trim()) {
            toast("던전 이름을 입력해주세요.")
            return
        }

        try {
            await useDungeonStore.getState().updateDungeonStore(editingDungeon)
            console.log("상태 업데이트 완료.");

            setEditingDungeon(null)
            toast("던전 이름이 수정되었습니다.")
            console.log("토스트 메시지 표시됨.");


        } catch (error) {
            toast("던전 수정 중 오류가 발생했습니다.")
        }
    }

    const handleDeleteDungeon = async (dungeonId: number) => {
        try {
            await useDungeonStore.getState().deleteDungeonStore(dungeonId)
            toast("던전이 삭제되었습니다.")
        } catch (error) {
            toast("던전 삭제 중 오류가 발생했습니다.")
        }
    }

    const addToParty = (character: Character, index: number) => {
        setPartyMembers((prevMembers) => {
            const updatedPartyMembers = [...prevMembers]
            const existingIndex = updatedPartyMembers.findIndex((memberId) => memberId === character.characterId)

            if (existingIndex !== -1) {
                if (existingIndex !== index) {
                    ;[updatedPartyMembers[existingIndex], updatedPartyMembers[index]] = [
                        updatedPartyMembers[index],
                        updatedPartyMembers[existingIndex],
                    ]
                }
            } else {
                if (updatedPartyMembers[index] === null) {
                    updatedPartyMembers[index] = character.characterId
                } else {
                    console.warn(`파티의 위치 ${index + 1}이 이미 차 있습니다.`)
                }
            }

            console.log("Updated partyMembers:", updatedPartyMembers)
            return updatedPartyMembers
        })
    }

    const removeFromParty = (index: number) => {
        const newPartyMembers = [...partyMembers]
        newPartyMembers[index] = null
        setPartyMembers(newPartyMembers)
    }
    console.log('Dungeons:', dungeons);



    return (
        <div className="flex gap-6">
            <div className="flex-1 space-y-6 sticky top-0 self-start"
                 style={{ height: "100vh" }}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-4">
                            <Select onValueChange={(value) => setSelectedDungeon(value)}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="던전 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dungeons && dungeons.length > 0 ? (
                                        dungeons.map((dungeon) => (
                                            <SelectItem key={dungeon.dungeonId} value={String(dungeon.dungeonId)}
                                            >
                                                {dungeon.dungeonName}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="" disabled>No dungeons available</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            <Button variant="outline" onClick={() => setIsAddDungeonOpen(true)}>던전 추가</Button>
                            <Button variant="outline" onClick={() => setIsDungeonListOpen(true)}>던전 관리</Button>
                        </div>
                        <Dialog open={isAddDungeonOpen} onOpenChange={setIsAddDungeonOpen}>
                            <DialogOverlay className="fixed inset-0 bg-black/80" />
                                <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg z-50">
                                    <DialogHeader>
                                        <DialogTitle>새 던전 추가</DialogTitle>
                                    </DialogHeader>
                                    <Input
                                        placeholder="던전 이름"
                                        value={newDungeonName}
                                        onChange={(e) => setNewDungeonName(e.target.value)}
                                    />
                                    <Button onClick={handleAddDungeon}>추가</Button>
                                </DialogContent>
                        </Dialog>
                        <Dialog open={isDungeonListOpen} onOpenChange={setIsDungeonListOpen}>
                            <DialogOverlay className="fixed inset-0 bg-black/80" />
                                <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg z-50">
                                    <DialogHeader>
                                        <DialogTitle>던전 관리</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        {dungeons.map((dungeon) => (
                                            <div key={dungeon.dungeonId} className="flex items-center justify-between">
                                                {editingDungeon && editingDungeon.dungeonId === dungeon.dungeonId ? (
                                                    <Input
                                                        value={editingDungeon.dungeonName}
                                                        onChange={(e) => setEditingDungeon({ ...editingDungeon, dungeonName: e.target.value })}
                                                    />
                                                ) : (
                                                    <span>{dungeon.dungeonName}</span>
                                                )}
                                                <div>
                                                    {editingDungeon && editingDungeon.dungeonId === dungeon.dungeonId ? (
                                                        <Button onClick={handleUpdateDungeon}>저장</Button>
                                                    ) : (
                                                        <Button variant="ghost" onClick={() => setEditingDungeon(dungeon)}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    <Button variant="ghost" onClick={() => handleDeleteDungeon(dungeon.dungeonId)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </DialogContent>
                        </Dialog>
                    </div>
                    <Button onClick={handleSave}>저장</Button>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">파티 구성</h3>
                        <Badge variant="outline" className="text-sm">
                            평균 명성: {calculateAverageFame()}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {partyMembers.map((memberId, index) => (
                            <PartySlot
                                key={index}
                                memberId={memberId}
                                characters={characters}
                                onDrop={(character) => addToParty(character, index)}
                                onRemove={() => removeFromParty(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-1/2">
                <h3 className="text-lg font-medium mb-4">캐릭터 목록</h3>
                <div className="overflow-y-auto pr-2"
                     style={{ maxHeight: "calc(100vh - 2rem)"}}
                             >
                    {Object.entries(groupCharactersByAdventureName(characters)).map(([adventureName, chars]) => (
                        <Collapsible
                            key={adventureName}
                            open={!collapsedAdventures[adventureName]}
                            onOpenChange={() => toggleAdventureCollapse(adventureName)}
                            className="border rounded-lg p-4 mb-4"
                        >
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium">
                                    {adventureName} ({chars.length})
                                </h4>
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
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    {chars.map((character) => (
                                        <CharacterCard key={character.characterId} character={character} />
                                    ))}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </div>
            </div>
        </div>
    )
}

interface PartySlotProps {
    memberId: string | null
    characters: Character[]
    onDrop: (character: Character) => void
    onRemove: () => void
}

function PartySlot({ memberId, characters, onDrop, onRemove }: PartySlotProps) {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "character",
        drop: (item: Character) => {
            onDrop(item)
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
        [drop]
    );

    const member = memberId ? characters.find((c) => c.characterId === memberId) : null

    return (
        <div
            ref={setRef}
            className={`border-2 rounded-lg p-2 h-40 flex items-center justify-center ${
                isOver ? "border-primary border-dashed bg-primary/10" : "border-muted"
            }`}
        >
            {member ? (
                <div className="w-full">
                    <div className="flex items-center gap-2">
                        <img
                            src={`https://img-api.neople.co.kr/df/servers/${member.serverId}/characters/${member.characterId}?zoom=3`}
                            alt={member.characterName}
                            className="w-24 h-24 rounded-full object-cover"
                        />
                        <div>
                            {/*<h3 className="text-lg font-semibold">{member.adventureName}</h3>*/}
                            <h4 className="font-medium">{member.characterName}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                    Lv.{member.level}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                    {member.jobGrowName}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">명성: {member.fame}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={onRemove} className="h-8 w-8 p-0">
                            ×
                        </Button>
                    </div>
                </div>
            ) : (
                <p className="text-muted-foreground text-sm">캐릭터를 드래그하세요</p>
            )}
        </div>
    )
}

function groupCharactersByAdventureName(characters: Character[]) {
    return characters.reduce(
        (acc, character) => {
            if (!acc[character.adventureName]) {
                acc[character.adventureName] = []
            }
            acc[character.adventureName].push(character)
            return acc
        },
        {} as Record<string, Character[]>,
    )
}


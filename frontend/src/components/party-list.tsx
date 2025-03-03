"use client"

import {useState, useMemo, useEffect} from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { X } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useCharacterStore } from "@/lib/stores/characterStore"
import { usePartyStore } from "@/lib/stores/partyStore"
import { useDungeonStore } from "@/lib/stores/dungeonStore"
import { toast } from "sonner"
import type {Party} from "@/lib/types"



export function PartyList() {
    const { characters } = useCharacterStore()
    const { parties= [], getParty } = usePartyStore()
    const { dungeons } = useDungeonStore()
    const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null)
    const [showOnlyWaiting, setShowOnlyWaiting] = useState(false)

    useEffect(() => {
        // fetchPartyStore();
    }, []);




    const handleDeleteParty = async (partyId: number) => {
        console.log(deleteConfirmation);
        console.log('Deleting party with confirmation:', partyId);


        try {
            usePartyStore.getState().deletePartyStore(partyId)
            console.log("3. 상태 업데이트 완료.");
            toast( "파티가 삭제되었습니다." )
        } catch (error) {
            toast("파티 삭제 중 오류가 발생했습니다.")
        }
        setDeleteConfirmation(null)
    }

    const handleUpdateProgress = async (party: Party, progress: "WAITING" | "DONE") => {
        try {
            const updatedParty = { ...party, progress };

            usePartyStore.getState().updatePartyStore(updatedParty)
            console.log("3. 상태 업데이트 완료.");
            toast( "파티 수정완료." )
        } catch (error) {
            toast("파티 상태 업데이트 중 오류가 발생했습니다.")
        }
    }

    const filteredParties = useMemo(() => {
        if (!Array.isArray(parties)) {
            return [];
        }
        return showOnlyWaiting ? parties.filter((party) => party.progress === "WAITING") : parties
    }, [parties, showOnlyWaiting])


    const groupedParties = filteredParties.reduce(
        (acc, party) => {
            if (!acc[party.dungeonId]) {
                acc[party.dungeonId] = []
            }
            acc[party.dungeonId].push(party)
            return acc
        },
        {} as Record<string, Party[]>,
    )

    function calculateAverageFame(memberIds: string[]): number {
        const validFameValues = memberIds
            .map((id) => characters.find((char) => char.characterId === id)?.fame) // 캐릭터의 명성을 찾음
            .filter((fame) => fame !== undefined) as number[]; // 유효한 명성 값만 유지

        const totalFame = validFameValues.reduce((sum, fame) => sum + fame, 0); // 합산
        const averageFame = validFameValues.length > 0 ? totalFame / validFameValues.length : 0; // 평균 계산

        return averageFame;

    }



    if (dungeons.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-2">파티 리스트</h2>
                <p className="text-muted-foreground">아직 등록된 파티가 없습니다. 파티를 추가해보세요.</p>
            </div>
        )
    }
    console.log('groupedParties:', groupedParties);
    console.log('characters:', characters);


    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">파티 리스트</h2>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setShowOnlyWaiting((prev) => !prev)} // 상태 토글
                        className={`px-4 py-2 rounded-md transition ${
                            showOnlyWaiting ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
                        }`}
                    >
                        {showOnlyWaiting ? '전체 파티 보기' : '대기 중인 파티만 보기'}
                    </button>

                </div>
            </div>
            {dungeons.map((dungeon) => (
                <div key={dungeon.dungeonName} className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">{dungeon.dungeonName}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {groupedParties[dungeon.dungeonId]?.map((party,index) => {
                            const partyWithCharacters = getParty(party.partyId)
                            return (
                                <Card key={party.partyId} className={party.progress === "DONE" ? "bg-green-50" : ""}>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <CardTitle>{index+1}</CardTitle>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline">평균 명성: {calculateAverageFame(party.memberIds)}</Badge>
                                                <Checkbox

                                                    checked={party.progress === "DONE"}
                                                    onCheckedChange={() =>

                                                        handleUpdateProgress(party, party.progress === "DONE" ? "WAITING" : "DONE")
                                                    }
                                                    className="h-5 w-5 border border-gray-300 rounded-sm bg-white checked:bg-blue-500 checked:border-transparent"

                                                >
                                                    <svg
                                                        className="h-4 w-4 text-white"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>

                                                </Checkbox>
                                                <Button variant="ghost" size="icon" onClick={() => setDeleteConfirmation(party.partyId)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-2">
                                            {partyWithCharacters.members.map((member) => (
                                                <div key={member.characterId} className="flex items-center gap-2 p-2 border rounded-md">
                                                    <div className="min-w-0">
                                                        <p className="font-medium truncate">{member.characterName}</p>
                                                        <p className="text-xs text-muted-foreground">명성: {member.fame}</p>
                                                        <p className="text-xs text-muted-foreground">{member.adventureName}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            ))}

            <AlertDialog open={!!deleteConfirmation} onOpenChange={() => setDeleteConfirmation(null)}>
                <AlertDialogContent>
                    <div className="fixed inset-0 bg-black/50" />
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-lg font-bold">정말 삭제하시겠습니까?</AlertDialogTitle>
                            <AlertDialogDescription className="text-sm text-gray-500">
                                파티와 관련된 모든 정보가 영구적으로 삭제됩니다.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex justify-end space-x-2 mt-4">
                            <AlertDialogCancel className="px-4 py-2 text-sm bg-gray-100 rounded-lg">취소</AlertDialogCancel>
                            <AlertDialogAction className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg"
                            onClick={() => handleDeleteParty(deleteConfirmation!)}>삭제</AlertDialogAction>
                        </AlertDialogFooter>
                    </div>
                </AlertDialogContent>

            </AlertDialog>
        </div>
    )
}


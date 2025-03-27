"use client"

import {useState, useMemo, useEffect} from "react"
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
import { useAppStore } from "@/lib/stores/appStore"
import { toast } from "sonner"
import type {Party} from "@/lib/types"
import { PartyCard } from "@/components/party-card"



export function PartyList() {
    const { characters } = useCharacterStore()
    const { parties= [], getParty } = usePartyStore()
    const { dungeons } = useDungeonStore()
    const { setEditingParty } = useAppStore()
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

    const handleEditParty = (party: Party) => {
        setEditingParty(party)
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
            .map((id) => characters.find((char) => char.characterId === id)?.fame)
            .filter((fame) => fame !== undefined) as number[];

        const totalFame = validFameValues.reduce((sum, fame) => sum + fame, 0);
        const averageFame = validFameValues.length > 0 ? totalFame / validFameValues.length : 0;

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


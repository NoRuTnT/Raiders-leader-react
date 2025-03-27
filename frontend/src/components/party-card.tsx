"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Pencil } from "lucide-react"
import type { Party, Character } from "@/lib/types"

interface PartyCardProps {
    party: Party
    partyNumber: number
    members: Character[]
    averageFame: number
    onDelete: (partyId: number) => void
    onUpdateProgress: (party: Party, progress: "WAITING" | "DONE") => void
    onEdit: (party: Party) => void
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

    const isBuffClass = (jobGrowName: string) => {
        return ["眞 크루세이더", "眞 뮤즈", "眞 인챈트리스"].includes(jobGrowName)
    }

    return (
        <Card className={party.progress === "DONE" ? "bg-green-50" : ""}>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle>{partyNumber}</CardTitle>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline">평균 명성: {averageFame}</Badge>
                        <Checkbox
                            checked={party.progress === "DONE"}
                            onCheckedChange={() => onUpdateProgress(party, party.progress === "DONE" ? "WAITING" : "DONE")}
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
                        <Button variant="ghost" size="icon" onClick={() => onEdit(party)}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(party.partyId)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-2">
                    {members.map((member) => (
                        <div key={member.characterId} className="flex items-center gap-2 p-2 border rounded-md">
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1">
                                    <p className="font-medium text-sm truncate">{member.characterName}</p>
                                    {isBuffClass(member.jobGrowName) && (
                                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                                            버퍼
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center mt-1">
                                    <img src="/fame.png" alt="명성" className="w-4 h-4 mr-1" />
                                    <span className="text-amber-700 text-xs font-medium">{member.fame}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{member.adventureName}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}


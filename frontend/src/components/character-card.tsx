"use client"

import { useDrag } from "react-dnd"
import { Card, CardContent } from "@/components/ui/card"
import type { Character } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import React from "react";

interface CharacterCardProps {
    character: Character
}

export function CharacterCard({ character }: CharacterCardProps) {

    const isBuffClass = (jobGrowName: string) => {
        return ["眞 크루세이더", "眞 뮤즈", "眞 인챈트리스"].includes(jobGrowName)
    }

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "character",
        item: character,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }))

    const setRef = React.useCallback(
        (node: HTMLDivElement | null) => {
            if (node) {
                drag(node);
            }
        },
        [drag]
    );


    return (
        <Card ref={setRef} className={`cursor-grab ${isDragging ? "opacity-50" : ""}`}>
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                    <img
                        src={`https://img-api.neople.co.kr/df/servers/${character.serverId}/characters/${character.characterId}?zoom=3`}
                        alt={character.characterName}
                        className="w-24 h-24 rounded-full object-cover"
                    />
                    <div>
                        <div className="flex items-center gap-1">
                            <p className="font-medium">{character.characterName}</p>
                            {isBuffClass(character.jobGrowName) && (
                                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                                    버퍼
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                                Lv.{character.level}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                                {character.jobGrowName}
                            </Badge>
                        </div>
                        <div className="flex items-center mt-1">
                            <img src="/fame.png" alt="명성" className="w-4 h-4 mr-1" />
                            <span className="text-yellow-500 text-sm">{character.fame}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}


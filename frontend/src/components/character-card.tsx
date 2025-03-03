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
                drag(node); // drag 함수를 DOM 요소에 연결
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
                        <h4 className="font-medium">{character.characterName}</h4>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                                Lv.{character.level}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                                {character.jobGrowName}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">명성: {character.fame}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}


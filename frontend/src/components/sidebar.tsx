"use client"

import { Home, Users, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/stores/appStore"
import type React from "react";

interface SidebarProps {
    activeTab: string
    onTabChange: (tab: string) => void
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
    const setEditingParty = useAppStore((state) => state.setEditingParty)

    const handleTabChange = (tab: string) => {
        // 편집 모드 초기화
        if (tab === "party-add" && activeTab !== "party-add") {
            setEditingParty(null)
        } else if (tab !== "party-add") {
            setEditingParty(null)
        }
        onTabChange(tab)
    }

    return (
        <div className="w-20 bg-muted border-r flex flex-col items-center py-6 gap-6">
            <img
                src="/give.jpg"
                alt="giveme"
                className="w-20 h-20 object-cover"
            />

            <Button
                variant={activeTab === "parties" ? "default" : "ghost"}
                size="icon"
                className={`rounded-full w-10 h-10 ${
                    activeTab === "parties" ? "bg-primary text-primary-foreground shadow-md" : ""
                }`}
                onClick={() => handleTabChange("parties")}
            >
                <Home className="h-6 w-6" />
                <span className="sr-only">파티 리스트</span>
            </Button>
            <Button
                variant={activeTab === "characters" ? "default" : "ghost"}
                size="icon"
                className={`rounded-full w-10 h-10 ${
                    activeTab === "characters" ? "bg-primary text-primary-foreground shadow-md" : ""
                }`}
                onClick={() => handleTabChange("characters")}
            >
                <Users className="h-6 w-6" />
                <span className="sr-only">캐릭터</span>
            </Button>
            <Button
                variant={activeTab === "party-add" ? "default" : "ghost"}
                size="icon"
                className={`rounded-full w-10 h-10 ${
                    activeTab === "party-add" ? "bg-primary text-primary-foreground shadow-md" : ""
                }`}
                onClick={() => handleTabChange("party-add")}
            >
                <PlusCircle className="h-6 w-6" />
                <span className="sr-only">파티 추가</span>
            </Button>
        </div>
    )
}


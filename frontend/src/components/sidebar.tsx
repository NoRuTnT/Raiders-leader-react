import { Home, Users, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type React from "react";

interface SidebarProps {
    activeTab: string
    onTabChange: (tab: string) => void
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
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
                onClick={() => onTabChange("parties")}
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
                onClick={() => onTabChange("characters")}
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
                onClick={() => onTabChange("party-add")}
            >
                <PlusCircle className="h-6 w-6" />
                <span className="sr-only">파티 추가</span>
            </Button>
        </div>
    )
}


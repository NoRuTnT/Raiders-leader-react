import { create } from "zustand"
import type { Party } from "../types"

interface AppStore {
    activeTab: string
    setActiveTab: (tab: string) => void
    editingParty: Party | null
    setEditingParty: (party: Party | null) => void
}

export const useAppStore = create<AppStore>((set) => ({
    activeTab: "parties",
    setActiveTab: (tab) => set({ activeTab: tab }),
    editingParty: null,
    setEditingParty: (party) => {
        set({
            editingParty: party,
            activeTab: party ? "party-add" : "parties",
        })
    },
}))


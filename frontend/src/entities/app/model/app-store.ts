import { create } from "zustand";
import type { Party } from "@/shared/types/domain";

export type PrimaryTab = "main" | "larabot" | "party-management";
export type PartyManagementTab = "overview" | "schedule" | "editor";

interface AppStore {
  activePrimaryTab: PrimaryTab;
  setActivePrimaryTab: (tab: PrimaryTab) => void;
  activePartyManagementTab: PartyManagementTab;
  setActivePartyManagementTab: (tab: PartyManagementTab) => void;
  editingParty: Party | null;
  setEditingParty: (party: Party | null) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  activePrimaryTab: "main",
  setActivePrimaryTab: (tab) => set({ activePrimaryTab: tab }),
  activePartyManagementTab: "overview",
  setActivePartyManagementTab: (tab) => set({ activePartyManagementTab: tab }),
  editingParty: null,
  setEditingParty: (party) => {
    set({
      editingParty: party,
      activePrimaryTab: "party-management",
      activePartyManagementTab: party ? "editor" : "schedule",
    });
  },
}));

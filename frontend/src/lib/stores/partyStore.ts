import { create } from "zustand"
import type { Party } from "../types"
import { getParties, addParty, updateParty, deleteParty } from "../api"
import { useCharacterStore } from "./characterStore"
import type { Character } from "../types"

interface PartyStore {
    parties: Party[]
    isLoading: boolean
    error: string | null
    editingParty: Party | null
    fetchPartyStore: () => Promise<void>
    addPartyStore: (party: Omit<Party, "partyId">) => Promise<void>
    updatePartyStore: (party: Party) => Promise<void>
    deletePartyStore: (partyId: number) => Promise<void>
    getParty: (partyId: number) => Party & { members: Character[] }
    resetStore: () => void
    setPartyStore: (parties: Party[]) => void
}


export const usePartyStore = create<PartyStore>((set, get) => ({
    parties: [],
    isLoading: false,
    error: null,
    editingParty: null,

    resetStore: () => {
        set({ parties: [], isLoading: false, error: null })
    },


    fetchPartyStore: async () => {
        const { parties: prevParties } = get();
        set({ isLoading: true, error: null })

        try {
            const parties= await getParties()
            console.log("Fetched parties:", parties)

            if (JSON.stringify(prevParties) !== JSON.stringify(parties)) {
                set({ parties }); // 데이터가 달라졌을 때만 상태 업데이트
            }

        } catch (error) {
            console.error("Error fetching parties:", error)
            set({ error: "Failed to fetch parties" })
        } finally {
            set({ isLoading: false })
        }
    },
// Optimistic Update
    addPartyStore: async (party) => {
        set({ isLoading: true, error: null })
        const tempId = Date.now()
        const tempParty = { ...party, partyId: tempId }

        try {
            set((state) => ({ parties: [...state.parties, tempParty] }))

            const newParty = await addParty(party)
            set((state) => ({
                parties: state.parties.map((p) => (p.partyId === tempId ? newParty : p)),
            }))
        } catch (error) {
            set((state) => ({
                parties: state.parties.filter((p) => p.partyId !== tempId),
            }))
            set({ error: "Failed to add party" })
        } finally {
            set({ isLoading: false })
        }
    },
// Optimistic Update
    updatePartyStore: async (party) => {
        set({ isLoading: true, error: null })
        try {

            set((state) => ({
                parties: state.parties.map((p) => (p.partyId === party.partyId ? party : p)),
                editingParty: null,
            }))


            const updatedParty = await updateParty(party)

            set((state) => ({
                parties: state.parties.map((p) => (p.partyId === updatedParty.partyId ? updatedParty : p)),
            }))
        } catch (error) {
            set((state) => ({
                parties: state.parties.map((p) => (p.partyId === party.partyId ? { ...p, ...party } : p)),
            }))
        } finally {
            set({ isLoading: false })
        }
    },

    deletePartyStore: async (partyId) => {
        set({ isLoading: true, error: null })
        try {
            await deleteParty(partyId)
            set((state) => ({
                parties: state.parties.filter((p) => p.partyId !== partyId),
            }))
        } catch (error) {
            set({ error: "Failed to delete party" })
        } finally {
            set({ isLoading: false })
        }
    },

    getParty: (partyId) => {
        const parties = get().parties || []
        const party = parties.find((p) => p.partyId === partyId)

        if (!party) {
            console.warn(`Party with id ${partyId} not found`)
            return {
                partyId,
                dungeonId: 0,
                memberIds: [],
                averageFame: 0,
                progress: "WAITING",
                members: [],
            }

        }

        const characterStore = useCharacterStore.getState()
        const characters = characterStore.characters || []


        const members: Character[] = (party.memberIds || [])
            .map((id) => characters.find((c) => c.characterId === id))
            .filter((member): member is Character => !!member)

        return { ...party, members }
    },
    setPartyStore: (parties: Party[]) => set({ parties }),
}))


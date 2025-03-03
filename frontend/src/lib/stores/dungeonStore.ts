import { create } from "zustand"
import type { Dungeon } from "../types"
import { getDungeons, addDungeon,updateDungeon,deleteDungeon } from "../api"

interface DungeonStore {
    dungeons: Dungeon[]
    isLoading: boolean
    error: string | null
    fetchDungeonStore: () => Promise<void>
    addDungeonStore: (dungeon: Omit<Dungeon, "dungeonId">) => Promise<void>
    updateDungeonStore: (dungeon: Dungeon) => Promise<void>
    deleteDungeonStore: (dungeonId: number) => Promise<void>
    resetStore: () => void
    setDungeonStore: (dungeons: Dungeon[]) => void

}


export const useDungeonStore = create<DungeonStore>((set) => ({


    dungeons: [],
    isLoading: false,
    error: null,

    resetStore: () => {
        set({ dungeons: [], isLoading: false, error: null })
    },

    fetchDungeonStore: async () => {
        set({ isLoading: true, error: null })
        try {
            const dungeons = await getDungeons()
            set({ dungeons })
        } catch (error) {
            set({ error: "Failed to fetch dungeons" })
        } finally {
            set({ isLoading: false })
        }
    },

    addDungeonStore: async (dungeon) => {
        set({ isLoading: true, error: null })
        try {
            const newDungeon = await addDungeon(dungeon)
            set((state) => ({ dungeons: [...state.dungeons, newDungeon] }))
        } catch (error) {
            set({ error: "Failed to add dungeon" })
        } finally {
            set({ isLoading: false })
        }
    },
    // Optimistic Update
    updateDungeonStore: async (dungeon) => {
        set({ isLoading: true, error: null })
        try {
            set((state) => ({
                dungeons: state.dungeons.map((d) => (d.dungeonId === dungeon.dungeonId ? dungeon : d)),
            }))

            const updatedDungeon = await updateDungeon(dungeon)

            set((state) => ({
                dungeons: state.dungeons.map((d) => (d.dungeonId === updatedDungeon.dungeonId ? updatedDungeon : d)),
            }))
        } catch (error) {
            set((state) => ({
                dungeons: state.dungeons.map((d) => (d.dungeonId === dungeon.dungeonId ? { ...d, ...dungeon } : d)),
            }))
            set({ error: "Failed to update dungeon" })
        } finally {
            set({ isLoading: false })
        }
    },

    deleteDungeonStore: async (dungeonId) => {
        set({ isLoading: true, error: null })
        try {
            await deleteDungeon(dungeonId)
            set((state) => ({
                dungeons: state.dungeons.filter((d) => d.dungeonId !== dungeonId),
            }))
        } catch (error) {
            set({ error: "Failed to delete dungeon" })
        } finally {
            set({ isLoading: false })
        }
    },
    setDungeonStore: (dungeons: Dungeon[]) => set({ dungeons }),
}))


import { create } from "zustand"
import { useAppStore } from "@/entities/app/model/app-store"
import { fetchCharacters, addCharacter, updateCharacter } from "@/shared/api"
import type { Character } from "@/shared/types/domain"

interface CharacterStore {
    characters: Character[]
    isLoading: boolean
    error: string | null
    fetchCharacterStore: () => Promise<void>
    addCharacterStore: (character: Character) => Promise<void>
    updateCharacterStore: (character: Character) => Promise<void>
    resetStore: () => void
    setCharacterStore: (characters: Character[]) => void
}



export const useCharacterStore = create<CharacterStore>((set, get) => ({

    characters: [],
    isLoading: false,
    error: null,


    resetStore: () => {
        set({ characters: [], isLoading: false, error: null })
    },


    fetchCharacterStore: async () => {
        const { characters: prevCharacters } = get();

        set({ isLoading: true, error: null })
        try {
            const characters = await fetchCharacters()
            if (JSON.stringify(prevCharacters) !== JSON.stringify(characters)) {
                set({ characters }); // 데이터가 달라졌을 때만 상태 업데이트
            }

        } catch (error) {
            set({ error: "Failed to fetch characters" })
        } finally {
            set({ isLoading: false })
        }
    },

    addCharacterStore: async (character) => {
        set({ isLoading: true, error: null })
        try {
            if (useAppStore.getState().isUsingMockData) {
                set((state) => ({
                    characters: state.characters.some((item) => item.characterId === character.characterId)
                        ? state.characters
                        : [...state.characters, character],
                }))
                return
            }
            const newCharacter = await addCharacter(character)
            set((state) => ({ characters: [...state.characters, newCharacter] }))
        } catch (error) {
            set({ error: "Failed to add character" })
        } finally {
            set({ isLoading: false })
        }
    },

    updateCharacterStore: async (character) => {
        set({ isLoading: true, error: null })
        try {
            if (useAppStore.getState().isUsingMockData) {
                set((state) => ({
                    characters: state.characters.map((c) =>
                        c.characterId === character.characterId ? character : c,
                    ),
                }))
                return
            }
            const updatedCharacter = await updateCharacter(character)
            set((state) => ({
                characters: state.characters.map((c) =>
                    c.characterId === updatedCharacter.characterId ? updatedCharacter : c,
                ),
            }))
        } catch (error) {
            set({ error: "Failed to update character" })
        } finally {
            set({ isLoading: false })
        }
    },
    setCharacterStore: (characters: Character[]) => set({ characters }),
}))


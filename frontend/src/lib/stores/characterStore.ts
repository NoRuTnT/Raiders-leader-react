import { create } from "zustand"
import type { Character } from "../types"
import { fetchCharacters, addCharacter, updateCharacter } from "../api"

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


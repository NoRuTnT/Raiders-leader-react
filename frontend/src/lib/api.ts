import type {Character, Party, Dungeon, PartyRequestDTO} from "./types"

// const API_BASE_URL = "http://localhost:8080/api"
const API_BASE_URL = "https://partycontrol.duckdns.org/api"

// Character API
export async function fetchCharacters(): Promise<Character[]> {
    const response = await fetch(`${API_BASE_URL}/character`)
    if (!response.ok) {
        throw new Error("Failed to fetch characters")
    }
    const data = await response.json()

    return data.result || []

}


export async function getCharacterList(name: string): Promise<Character[]> {
    const response = await fetch(
        `${API_BASE_URL}/neople/character?characterName=${name}`

    )
    if (!response.ok) {
        throw new Error("Failed to fetch character data")
    }
    const data = await response.json()

    if (data.rows && data.rows.length > 0) {
        return data.rows
    }
    return []
}

export async function getCharacterInfo(serverId: string, characterId: string): Promise<Character> {
    const response = await fetch(
        `${API_BASE_URL}/neople/character-info?serverId=${serverId}&characterId=${characterId}`
    )
    if (!response.ok) {
        throw new Error("Failed to fetch character details")
    }
    const data = await response.json()

    return {
        characterId: data.characterId,
        serverId: data.serverId,
        characterName: data.characterName,
        level: data.level,
        jobId: data.jobId,
        jobGrowId: data.jobGrowId,
        jobName: data.jobName,
        jobGrowName: data.jobGrowName,
        fame: data.fame,
        adventureName: data.adventureName,
        guildId: data.guildId,
        guildName: data.guildName,
    }
}

export async function refreshCharacterInfo(serverId: string, characterId: string): Promise<Character> {
    const response = await fetch(
        `${API_BASE_URL}/neople/character-info?serverId=${serverId}&characterId=${characterId}&refresh=true`,
    )
    if (!response.ok) {
        throw new Error("Failed to refresh character details")
    }
    const data = await response.json()

    return {
        characterId: data.characterId,
        serverId: data.serverId,
        characterName: data.characterName,
        level: data.level,
        jobId: data.jobId,
        jobGrowId: data.jobGrowId,
        jobName: data.jobName,
        jobGrowName: data.jobGrowName,
        fame: data.fame,
        adventureName: data.adventureName,
        guildId: data.guildId,
        guildName: data.guildName,
    }
}


export const getCharacterSpringApi= async (characterName: string) => {
    console.log("캐릭터이름:", characterName)
    const response = await fetch(`${API_BASE_URL}/character/detail?characterName=${characterName}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    })

    if (response.status === 400) {
        console.log("캐릭터가 존재하지 않습니다.")
        return null
    }


    if (!response.ok) {
        const errorResponse = await response.text()
        console.error("Error response from server:", errorResponse)
        throw new Error(`Failed to fetch character: ${response.statusText}`)

    }

    const data = await response.json()
    return data.result
}


export async function addCharacter(character: Character): Promise<Character> {
    const response = await fetch(`${API_BASE_URL}/character`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(character),
    })

    if (!response.ok) {
        const errorResponse = await response.text()
        console.error("Error response from server:", errorResponse)
        throw new Error(`Failed to add character: ${response.statusText}`)
    }

    const data = await response.json()
    return data.result

}


export async function updateCharacter(character: Character): Promise<Character> {
    const response = await fetch(`${API_BASE_URL}/character/${character.characterId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(character),
    })

    if (!response.ok) {
        const errorResponse = await response.text()
        console.error("Error response from server:", errorResponse)
        throw new Error(`Failed to update character: ${response.statusText}`)
    }

    const data = await response.json()
    return data.result
}



// Party util
function convertPartyToRequestDTO(party: Omit<Party, "partyId">): PartyRequestDTO {
    const [memberId1, memberId2, memberId3, memberId4] = party.memberIds
    return {
        dungeon: { dungeonId: party.dungeonId },
        memberId1: memberId1 || null,
        memberId2: memberId2 || null,
        memberId3: memberId3 || null,
        memberId4: memberId4 || null,
        progress: party.progress,
    }
}

function convertResponseToParty(apiData: any): Party {
    const memberIds = [apiData.memberId1, apiData.memberId2, apiData.memberId3, apiData.memberId4]
        .filter((id) => id !== null) as string[]

    return {
        partyId: apiData.partyId,
        dungeonId: apiData.dungeon.dungeonId,
        memberIds: memberIds,
        progress: apiData.progress
    }
}


// Party API
export async function getParties(): Promise<Party[]> {
    const response = await fetch(`${API_BASE_URL}/party`)
    if (!response.ok) {
        throw new Error("Failed to fetch parties")
    }

    const data = await response.json()
    const result: Party[] = data.result.map(convertResponseToParty)

    return result || []

}

export async function addParty(party: Omit<Party, "partyId">): Promise<Party> {
    const partyDTO = convertPartyToRequestDTO(party)

    const response = await fetch(`${API_BASE_URL}/party`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partyDTO),
    })
    if (!response.ok) {
        throw new Error("Failed to add party")
    }
    const data = await response.json()
    return data.result
}

export async function updateParty(party: Party): Promise<Party> {
    const partyDTO = convertPartyToRequestDTO(party)

    const response = await fetch(`${API_BASE_URL}/party/${party.partyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partyDTO),
    })
    if (!response.ok) {
        throw new Error("Failed to update party")
    }
    const data = await response.json()
    return data.result
}

export async function deleteParty(partyId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/party/${partyId}`, {
        method: "DELETE",
    })
    if (!response.ok) {
        throw new Error("Failed to delete party")
    }
}


// Dungeon API
export async function getDungeons(): Promise<Dungeon[]> {
    const response = await fetch(`${API_BASE_URL}/dungeon`)
    if (!response.ok) {
        throw new Error("Failed to fetch dungeons")
    }

    const data = await response.json()
    return data.result || []
}

export async function addDungeon(dungeon: Omit<Dungeon, "dungeonId">): Promise<Dungeon> {
    const response = await fetch(`${API_BASE_URL}/dungeon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({dungeonName: dungeon.dungeonName}),
    })
    if (!response.ok) {
        throw new Error("Failed to add dungeon")
    }
    const data = await response.json()
    return data.result
}

export async function updateDungeon(dungeon: Dungeon): Promise<Dungeon> {
    const response = await fetch(`${API_BASE_URL}/dungeon/${dungeon.dungeonId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dungeonName: dungeon.dungeonName }),
    })
    if (!response.ok) {
        throw new Error("Failed to update dungeon")
    }
    const data = await response.json()
    return data.result
}

export async function deleteDungeon(dungeonId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/dungeon/${dungeonId}`, {
        method: "DELETE",
    })
    if (!response.ok) {
        throw new Error("Failed to delete dungeon")
    }
}

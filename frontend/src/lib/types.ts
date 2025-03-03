export interface Character {
    characterId: string
    serverId: string
    characterName: string
    level: number
    jobId: string
    jobGrowId: string
    jobName: string
    jobGrowName: string
    fame: number
    adventureName: string
    guildId: string
    guildName: string
}

export interface Dungeon {
    dungeonId: number
    dungeonName: string
}

export interface Party {
    partyId: number
    dungeonId: number
    memberIds: string[]
    progress: "WAITING" | "DONE"
}

export interface PartyRequestDTO {
    dungeon: { dungeonId: number }
    memberId1: string | null
    memberId2: string | null
    memberId3: string | null
    memberId4: string | null
    progress: "WAITING" | "DONE"
}



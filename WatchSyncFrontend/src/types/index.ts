export interface Show {
    showId: number,
    watchPartyId: number,
    addedByUserId: number,
    title: string,
    totalEpisodes: number,
    currentEpisode: number,
    coverUrl: string | null,
    createdAt: string
}

export interface User {
    userId: number,
    name: string,
    avatarUrl: string | null,
    createdAt: string
}

export interface WatchEntry {
    watchEntryId: number,
    watchPartyId: number,
    userId: number,
    showId: number,
    partyTurnCountAfter: number,
    watchedAt: string
}

export interface WatchParty {
    watchPartyId: number,
    name: string,
    turnLimit: number,
    currentTurnOrder: number,
    currentTurnCount: number,
    createdAt: string
}

export interface WatchPartyMember {
    watchPartyMemberId: number,
    watchPartyId: number,
    userId: number,
    turnOrder: number,
    joinedAt: string
}
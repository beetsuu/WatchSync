export interface Show {
    showId: number,
    addedByUserId: number,
    title: string,
    totalEpisodes: number,
    currentEpisode: number,
    coverUrl: string | null,
    createdAt: string
}

export interface CreateShowDto {
    addedByUserId: number;
    title: string;
    totalEpisodes: number;
    currentEpisode: number;
    coverUrl: string | null;
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

export interface CreateWatchPartyDto {
    name: string;
    turnLimit: number;
}

export interface CreateWatchPartyMemberDto {
    watchPartyId: number;
    userId: number;
    turnOrder: number;
}

export interface CreateWatchPartyDto {
    name: string;
    turnLimit: number;
}
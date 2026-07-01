export interface Show {
    showId: number;
    watchPartyId: number;
    addedByUserId: string;
    addedByUserName: string;
    title: string;
    totalEpisodes: number;
    currentEpisode: number;
    coverUrl: string | null;
    createdAt: string;
}

export interface CreateShowDto {
    watchPartyId: number;
    title: string;
    totalEpisodes: number;
    currentEpisode: number;
    coverUrl: string | null;
}

export interface User {
    id: string;
    email: string;
    displayName: string;
    avatarUrl: string | null;
}

export interface WatchEntry {
    watchEntryId: number;
    watchPartyId: number;
    userId: string;
    showId: number;
    partyTurnCountAfter: number;
    watchedAt: string;
}

export interface WatchParty {
    watchPartyId: number;
    name: string;
    turnLimit: number;
    currentTurnOrder: number;
    currentTurnCount: number;
    createdAt: string;
}

export interface WatchPartyMember {
    watchPartyMemberId: number;
    watchPartyId: number;
    userId: string;
    turnOrder: number;
    joinedAt: string;
}

export interface CreateWatchPartyDto {
    name: string;
    turnLimit: number;
}

export interface CreateWatchPartyMemberDto {
    watchPartyId: number;
    userId: string;
    turnOrder: number;
}

export interface LoginResponse {
    token: string;
    user: User;
}
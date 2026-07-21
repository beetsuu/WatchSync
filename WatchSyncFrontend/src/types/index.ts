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
    addedByAvatarUrl: string;
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
    avatarUrl: string;
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
    inviteCode: string;
    isPersonal: boolean;
    turnLimit: number;
    currentTurnOrder: number;
    currentTurnCount: number;
    createdAt: string;
    ownerId: string;
    isOwner: boolean;
}

export interface WatchPartyMember {
    watchPartyMemberId: number;
    watchPartyId: number;
    userId: string;
    displayName: string;
    avatarUrl: string;
    turnOrder: number;
    joinedAt: string;
    isOwner: boolean;
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

export interface UpdateWatchPartyMembersDto {
    userIds: string[];
}

export interface ShowSearchResult {
    externalId: number;
    title: string;
    coverUrl: string | null;
}


export interface ShowDetails {
    title: string;
    coverUrl: string | null;
    totalEpisodes: number;
}
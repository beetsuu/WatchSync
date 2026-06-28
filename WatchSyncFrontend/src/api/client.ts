import type { Show, User, WatchParty, WatchEntry, WatchPartyMember, CreateShowDto, CreateWatchPartyDto, CreateWatchPartyMemberDto } from "../types/index";

const BASE_URL = 'https://localhost:7202/api';

export async function getShows(): Promise<Show[]> {
    return get<Show[]>('/shows')
}
export async function getUsers(): Promise<User[]> {
    return get<User[]>('/users')
}
export async function getWatchParties(): Promise<WatchParty[]> {
    return get<WatchParty[]>('/watchParties')
}
export async function getWatchEntries(): Promise<WatchEntry[]> {
    return get<WatchEntry[]>('/watchEntries')
}
export async function getWatchPartyMembers(): Promise<WatchPartyMember[]> {
    return get<WatchPartyMember[]>('/watchPartyMembers')
}

export async function createShow(show: CreateShowDto): Promise<Show> {
    const response = await fetch(BASE_URL + '/shows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(show)
    });
    return await response.json();
}

export async function createWatchParty(dto: CreateWatchPartyDto): Promise<WatchParty> {
    const response = await fetch(BASE_URL + '/watchparties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
    });
    return await response.json();
}
export async function createWatchPartyMember(dto: CreateWatchPartyMemberDto): Promise<WatchPartyMember> {
    const response = await fetch(BASE_URL + '/watchpartymembers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
    });
    return await response.json();
}

export async function updateShow(show: Show) {
    await fetch(BASE_URL + '/shows/' + show.showId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: show.title,
            totalEpisodes: show.totalEpisodes,
            currentEpisode: show.currentEpisode,
            coverUrl: show.coverUrl
        })
    }
    );
}

export async function deleteShow(showId: number) {
    await fetch(BASE_URL + '/shows/' + showId, {
        method: 'DELETE'
    });
}

export async function updateWatchParty(watchParty: WatchParty) {
    await fetch(BASE_URL + '/watchParties/' + watchParty.watchPartyId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: watchParty.name,
            currentTurnCount: watchParty.currentTurnCount,
            currentTurnOrder: watchParty.currentTurnOrder,
            turnLimit: watchParty.turnLimit

        })
    }
    );
}

async function get<T>(route: string): Promise<T> {
    const response = await fetch(BASE_URL + route);
    return await response.json();
}

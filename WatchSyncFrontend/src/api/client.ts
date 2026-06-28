import type { Show, User, WatchParty, WatchEntry, WatchPartyMember } from "../types/index";

const BASE_URL = 'http://localhost:7202/api';

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




async function get<T>(route: string): Promise<T> {
    const response = await fetch(BASE_URL + route);
    return await response.json();
}
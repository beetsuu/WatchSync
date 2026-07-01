import type { Show, WatchParty, WatchEntry, WatchPartyMember, CreateShowDto, CreateWatchPartyDto, CreateWatchPartyMemberDto, LoginResponse } from "../types/index";

const BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7202/api';

function getToken(): string | null {
    return sessionStorage.getItem('token');
}

function authHeaders(): Record<string, string> {
    const token = getToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

// Auth
export async function loginUser(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(BASE_URL + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(error.message || 'Login failed');
    }
    return await response.json();
}

export async function registerUser(email: string, password: string, displayName: string): Promise<void> {
    const response = await fetch(BASE_URL + '/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName })
    });
    if (!response.ok) {
        const errors = await response.json().catch(() => [{ description: 'Registration failed' }]);
        const message = Array.isArray(errors) ? errors.map((e: any) => e.description).join(', ') : 'Registration failed';
        throw new Error(message);
    }
}

// Data
export async function getShows(): Promise<Show[]> {
    return get<Show[]>('/shows');
}

export async function getWatchParties(): Promise<WatchParty[]> {
    return get<WatchParty[]>('/watchParties');
}

export async function getWatchEntries(): Promise<WatchEntry[]> {
    return get<WatchEntry[]>('/watchEntries');
}

export async function getWatchPartyMembers(): Promise<WatchPartyMember[]> {
    return get<WatchPartyMember[]>('/watchPartyMembers');
}

export async function createShow(show: CreateShowDto): Promise<Show> {
    const response = await fetch(BASE_URL + '/shows', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(show)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.title || 'Failed to create show');
    }
    return await response.json();
}

export async function createWatchParty(dto: CreateWatchPartyDto): Promise<WatchParty> {
    const response = await fetch(BASE_URL + '/watchparties', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(dto)
    });
    return await response.json();
}

export async function createWatchPartyMember(dto: CreateWatchPartyMemberDto): Promise<WatchPartyMember> {
    const response = await fetch(BASE_URL + '/watchpartymembers', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(dto)
    });
    return await response.json();
}

export async function updateShow(show: Show) {
    await fetch(BASE_URL + '/shows/' + show.showId, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
            title: show.title,
            totalEpisodes: show.totalEpisodes,
            currentEpisode: show.currentEpisode,
            coverUrl: show.coverUrl
        })
    });
}

export async function deleteShow(showId: number) {
    await fetch(BASE_URL + '/shows/' + showId, {
        method: 'DELETE',
        headers: authHeaders()
    });
}

export async function updateWatchParty(watchParty: WatchParty) {
    await fetch(BASE_URL + '/watchParties/' + watchParty.watchPartyId, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
            name: watchParty.name,
            currentTurnCount: watchParty.currentTurnCount,
            currentTurnOrder: watchParty.currentTurnOrder,
            turnLimit: watchParty.turnLimit
        })
    });
}

export async function joinWatchParty(inviteCode: string): Promise<WatchParty> {
    const response = await fetch(BASE_URL + '/watchparties/join', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ inviteCode })
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Join failed' }));
        throw new Error(error.message || 'Failed to join watch party');
    }
    return await response.json();
}


async function get<T>(route: string): Promise<T> {
    const response = await fetch(BASE_URL + route, {
        headers: authHeaders()
    });
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
}
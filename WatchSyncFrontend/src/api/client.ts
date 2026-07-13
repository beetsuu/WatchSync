import type { Show, WatchParty, WatchEntry, WatchPartyMember, CreateShowDto, CreateWatchPartyDto, CreateWatchPartyMemberDto, LoginResponse, ShowSearchResult, ShowDetails } from "../types/index";

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
export async function loginUser(username: string, password: string): Promise<LoginResponse> {
    const response = await fetch(BASE_URL + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
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
        const error = await response.json().catch(() => ({ message: 'Registration failed' }));
        throw new Error(error.message || 'Registration failed');
    }
}

export async function forgotPassword(email: string): Promise<void> {
    const response = await fetch(BASE_URL + '/auth/forgot-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Something went wrong' }));
        throw new Error(error.message || 'Failed to send reset email');
    }
}

export async function resetPassword(email: string, token: string, newPassword: string): Promise<void> {

    const response = await fetch(BASE_URL + "/auth/reset-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            token,
            newPassword
        })
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message ?? "Password reset failed");
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

export async function getAllWatchPartyMembers(): Promise<WatchPartyMember[]> {
    return get<WatchPartyMember[]>('/watchPartyMembers');
}

export async function getWatchPartyMembers(watchPartyId: number): Promise<WatchPartyMember[]> {
    return get<WatchPartyMember[]>(`/watchPartyMembers/party/${watchPartyId}`);
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

    const data = await response.json();

    console.log("Created WatchParty:", data);

    return data;
}

export async function createWatchPartyMember(dto: CreateWatchPartyMemberDto): Promise<WatchPartyMember> {
    const response = await fetch(BASE_URL + '/watchpartymembers', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(dto)
    });
    return await response.json();
}

export async function leaveWatchParty(id: number) {
    const response = await fetch(
        BASE_URL + `/watchPartyMembers/party/${id}/leave`,
        {
            method: 'DELETE',
            headers: authHeaders()
        }
    );

    if (!response.ok) {
        throw new Error("Failed to leave watch party");
    }
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
    const response = await fetch(
        BASE_URL + '/watchParties/' + watchParty.watchPartyId,
        {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify({
                name: watchParty.name,
                currentTurnCount: watchParty.currentTurnCount,
                currentTurnOrder: watchParty.currentTurnOrder,
                turnLimit: watchParty.turnLimit
            })
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message ?? "Failed to update watch party");
    }

    return await response.json();
}

export async function deleteWatchParty(id: number) {
    await fetch(BASE_URL + '/watchParties/' + id, {
        method: 'DELETE',
        headers: authHeaders()
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

export async function updateProfile(displayName: string, email: string, avatarUrl: string) {
    const response = await fetch(
        BASE_URL + "/auth/profile",
        {
            method: "PUT",
            headers: authHeaders(),
            body: JSON.stringify({
                displayName,
                email,
                avatarUrl
            })
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message ?? "Failed to update profile");
    }

    return await response.json();
}

export async function uploadAvatar(file: File) {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
        BASE_URL + "/auth/avatar",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${getToken()}`
            },
            body: formData
        }
    );

    if (!response.ok) {
        throw new Error("Avatar upload failed");
    }

    return await response.json();
}

export async function updateWatchPartyMembers(
    watchPartyId: number,
    userIds: string[]
): Promise<void> {

    const response = await fetch(
        BASE_URL + `/watchPartyMembers/party/${watchPartyId}`,
        {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify(userIds)
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message ?? "Failed to update members");
    }
}


export async function searchShows(query: string) {
    return get<ShowSearchResult[]>(
        `/shows/search?query=${encodeURIComponent(query)}`
    );
}


export async function getShowDetails(id: number) {
    return get<ShowDetails>(
        `/shows/details/${id}`
    );
}


export function getAvatarUrl(url?: string) {
    if (!url) return "/default-avatar.png";

    if (url.startsWith("http")) {
        return url;
    }

    return BASE_URL.replace("/api", "") + url;
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
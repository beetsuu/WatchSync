import { useState, useEffect } from 'react';
import { getUsers } from '../api/client';
import type { User } from '../types';

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        getUsers().then(data => {
            setCurrentUser(data[0]);
            setUsers(data.sort((a, b) => a.userId - b.userId));
        });
    }, []);

    return { users, currentUser };
}
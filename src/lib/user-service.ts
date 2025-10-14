
"use client";

export type Role = 'admin' | 'worker' | 'user';

export interface AppUser {
    uid: string;
    email: string;
    role: Role;
    createdAt: string;
    disabled?: boolean;
}

export async function getAllUsers(): Promise<AppUser[]> {
    const response = await fetch('/api/users');
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    return data.users;
}

export async function setUserDisabledStatus(uid: string, disabled: boolean): Promise<{success: boolean, message: string}> {
    const response = await fetch(`/api/users/${uid}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ disabled }),
    });

    const data = await response.json();

    if (!response.ok) {
        return { success: false, message: data.message || 'An unknown error occurred.' };
    }
    return { success: true, message: data.message };
}

export async function clearAllUserData(): Promise<{success: boolean, message: string}> {
    const response = await fetch(`/api/users/clear`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        return { success: false, message: data.message || 'An unknown error occurred.' };
    }
    return { success: true, message: data.message };
}


// These functions call an API route and are safe for client-side usage
export async function getTotalUsers(): Promise<number> {
    const response = await fetch('/api/stats/total-users');
    if (!response.ok) return 0;
    const data = await response.json();
    return data.count;
}

export async function getActiveWorkers(): Promise<number> {
    const response = await fetch('/api/stats/active-workers');
     if (!response.ok) return 0;
    const data = await response.json();
    return data.count;
}

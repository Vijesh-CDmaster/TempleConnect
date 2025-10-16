"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useAuth } from "@/context/auth-context";

export function UserDashboard() {
    const { logout } = useAuth();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Welcome, User</CardTitle>
                <CardDescription>This is your dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>Here you can find your virtual queue tickets and other information.</p>
                <div className="flex space-x-4">
                    <Button asChild>
                        <Link href="/queue">Join Virtual Queue</Link>
                    </Button>
                    <Button variant="secondary" onClick={logout}>Sign Out</Button>
                </div>
            </CardContent>
        </Card>
    );
}

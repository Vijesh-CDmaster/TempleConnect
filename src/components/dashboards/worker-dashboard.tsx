"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCheck, CalendarDays, ClipboardList, LogIn, LogOut } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';

type TaskStatus = "Pending" | "Completed";

interface Task {
    id: number;
    description: string;
    status: TaskStatus;
}

const initialTasks: Task[] = [
    { id: 1, description: "Assist with crowd control at Gate 3", status: "Pending" },
    { id: 2, description: "Prepare for evening Aarti ceremony", status: "Pending" },
    { id: 3, description: "Morning cleaning duty at main sanctum", status: "Completed" },
]

export function WorkerDashboard() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [isClockedIn, setIsClockedIn] = useState(false);
    const { toast } = useToast();
    const { logout } = useAuth();

    const handleClockInToggle = () => {
        setIsClockedIn(!isClockedIn);
        toast({
            title: isClockedIn ? "Clocked Out" : "Clocked In",
            description: `Your shift status has been updated.`,
        });
    }

    const handleTaskToggle = (taskId: number) => {
        setTasks(currentTasks => 
            currentTasks.map(task => {
                if (task.id === taskId) {
                    const newStatus = task.status === "Pending" ? "Completed" : "Pending";
                    toast({
                        title: `Task ${newStatus}`,
                        description: `\"${task.description}\" marked as ${newStatus.toLowerCase()}.`
                    });
                    return {...task, status: newStatus};
                }
                return task;
            })
        );
    }
    
    const sortedTasks = [...tasks].sort((a,b) => (a.status === 'Pending' ? -1 : 1) - (b.status === 'Pending' ? -1 : 1))

    return (
        <div className="space-y-8">
            {/* Attendance */}
            <Card>
                <CardHeader>
                    <CardTitle>Attendance</CardTitle>
                    <CardDescription>{isClockedIn ? "You are currently on shift." : "Clock in to start your shift."}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button 
                        className={cn("w-full", isClockedIn && "bg-yellow-500 hover:bg-yellow-600")}
                        onClick={handleClockInToggle}
                    >
                        {isClockedIn ? <LogOut className="mr-2"/> : <LogIn className="mr-2"/>}
                        {isClockedIn ? "Clock Out" : "Clock In"}
                    </Button>
                    <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={logout}
                    >
                        Sign Out
                    </Button>
                </CardContent>
            </Card>

            {/* Assigned Tasks */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ClipboardList /> Assigned Tasks</CardTitle>
                    <CardDescription>Your responsibilities for today's shift.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {sortedTasks.map(task => (
                            <li key={task.id} className="flex justify-between items-center p-3 bg-secondary/50 rounded-md">
                                <p className={cn(task.status === "Completed" && "line-through text-muted-foreground")}>{task.description}</p>
                                <Button 
                                    size="sm" 
                                    variant={task.status === 'Pending' ? 'outline' : 'default'}
                                    onClick={() => handleTaskToggle(task.id)}
                                >
                                    <CheckCheck className="mr-2" />
                                    {task.status === 'Pending' ? 'Mark as Done' : 'Mark as Pending'}
                                </Button>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            {/* Work Schedule */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CalendarDays /> Work Schedule</CardTitle>
                    <CardDescription>Your upcoming shifts for the week.</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-muted-foreground">Full schedule coming soon.</p>
                </CardContent>
            </Card>
        </div>
    )
}

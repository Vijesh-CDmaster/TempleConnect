
"use client";

import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserCheck, UserCog, UserCircle, AlertTriangle, Eye } from "lucide-react";

export function RoleSwitcher() {
  const { role, setImpersonatedRole, isImpersonating } = useAuth();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck /> Role Switcher
          </CardTitle>
          <CardDescription>
            Impersonate other roles to view the application from their perspective.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={() => setImpersonatedRole('admin')}
            variant={role === 'admin' ? 'default' : 'outline'}
            className="flex-1"
            disabled={!isImpersonating && role === 'admin'}
          >
            <UserCog className="mr-2 h-4 w-4" /> Admin
          </Button>
          <Button
            onClick={() => setImpersonatedRole('worker')}
            variant={role === 'worker' ? 'default' : 'outline'}
             className="flex-1"
          >
            <UserCircle className="mr-2 h-4 w-4" /> Worker
          </Button>
          <Button
            onClick={() => setImpersonatedRole('user')}
            variant={role === 'user' ? 'default' : 'outline'}
             className="flex-1"
          >
            <UserCircle className="mr-2 h-4 w-4" /> User
          </Button>
        </CardContent>
      </Card>
      {isImpersonating && (
         <div className="fixed bottom-4 right-4 z-50">
            <div className="flex items-center gap-3 rounded-lg bg-yellow-400 p-3 text-yellow-900 shadow-lg">
                <Eye className="h-6 w-6" />
                <div className="font-medium">
                    <p>Viewing as <span className="font-bold capitalize">{role}</span></p>
                    <button onClick={() => setImpersonatedRole(null)} className="text-sm underline hover:text-yellow-800">Return to Admin View</button>
                </div>
            </div>
        </div>
      )}
    </>
  );
}

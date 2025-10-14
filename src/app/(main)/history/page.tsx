
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { SavedToken } from "@/components/booking-form";
import { temples } from "@/lib/temple-data";
import { format } from "date-fns";
import { History, Calendar, Clock, User, Hash } from "lucide-react";
import { isTokenExpired } from "@/lib/token-utils";

export default function HistoryPage() {
  const [expiredTokens, setExpiredTokens] = useState<SavedToken[]>([]);

  useEffect(() => {
    const allTokens = JSON.parse(localStorage.getItem("darshanTokens") || "[]");
    const expired = allTokens
      .filter((token: SavedToken) => isTokenExpired(token))
      .sort((a: SavedToken, b: SavedToken) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setExpiredTokens(expired);
  }, []);

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline tracking-tight">
          Token History
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          View your past and expired darshan tokens.
        </p>
      </div>

      {expiredTokens.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {expiredTokens.map((token) => {
            const temple = temples.find((t) => t.id === token.temple);
            return (
              <Card key={token.id} className="flex flex-col bg-muted/50 border-dashed">
                <CardHeader>
                  <CardTitle className="font-headline text-xl flex items-center gap-2 text-muted-foreground">
                    <History className="h-6 w-6" />
                    {temple?.name}
                  </CardTitle>
                  <CardDescription>
                    Token ID: <span className="font-mono text-xs">{token.id.substring(0, 8)}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4 text-muted-foreground">
                   <div className="space-y-2 text-sm">
                     <p className="flex items-center gap-2"><User className="h-4 w-4"/> <strong>Name:</strong> {token.name}</p>
                    <p className="flex items-center gap-2"><Calendar className="h-4 w-4"/> <strong>Date:</strong> {format(new Date(token.date), "PPP")}</p>
                    <p className="flex items-center gap-2"><Clock className="h-4 w-4"/> <strong>Time Slot:</strong> {token.timeSlot}</p>
                    <p className="flex items-center gap-2"><Hash className="h-4 w-4"/> <strong>Booked on:</strong> {format(new Date(token.createdAt), "PPP p")}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <History className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-semibold">No History Found</h2>
          <p className="text-muted-foreground mt-2">You don't have any expired tokens yet.</p>
        </div>
      )}
    </div>
  );
}

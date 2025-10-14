
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { SavedToken } from "@/components/booking-form";
import { temples } from "@/lib/temple-data";
import { format } from "date-fns";
import { Ticket, Calendar, Clock, User, Hash } from "lucide-react";
import QRCode from "react-qr-code";
import { isTokenExpired } from "@/lib/token-utils";

export default function MyTokensPage() {
  const [activeTokens, setActiveTokens] = useState<SavedToken[]>([]);

  useEffect(() => {
    const allTokens = JSON.parse(localStorage.getItem("darshanTokens") || "[]");
    const active = allTokens
      .filter((token: SavedToken) => !isTokenExpired(token))
      .sort((a: SavedToken, b: SavedToken) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setActiveTokens(active);
  }, []);

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline tracking-tight">
          My Darshan Tokens
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          View your upcoming and active virtual queue tokens here.
        </p>
      </div>

      {activeTokens.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeTokens.map((token) => {
            const temple = temples.find((t) => t.id === token.temple);
            const qrCodeValue = JSON.stringify({
                tokenId: token.id,
                temple: temple?.name,
                name: token.name,
                date: token.date,
                timeSlot: token.timeSlot,
            });
            return (
              <Card key={token.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="font-headline text-xl flex items-center gap-2">
                    <Ticket className="h-6 w-6 text-primary" />
                    {temple?.name}
                  </CardTitle>
                  <CardDescription>
                    Token ID: <span className="font-mono text-xs">{token.id.substring(0, 8)}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <div className="flex justify-center p-4 bg-secondary/30 rounded-md">
                     <div className="p-2 bg-white rounded-md">
                        <QRCode value={qrCodeValue} size={96} />
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                     <p className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground"/> <strong>Name:</strong> {token.name}</p>
                    <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground"/> <strong>Date:</strong> {format(new Date(token.date), "PPP")}</p>
                    <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground"/> <strong>Time Slot:</strong> {token.timeSlot}</p>
                    <p className="flex items-center gap-2"><Hash className="h-4 w-4 text-muted-foreground"/> <strong>Booked on:</strong> {format(new Date(token.createdAt), "PPP p")}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <Ticket className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-semibold">No Active Tokens Found</h2>
          <p className="text-muted-foreground mt-2">You haven't booked any darshan tokens yet, or your previous tokens have expired.</p>
        </div>
      )}
    </div>
  );
}

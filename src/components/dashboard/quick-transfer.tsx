"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";

const contacts = [
  { name: "Sarah W.", initial: "SW" },
  { name: "Mike R.", initial: "MR" },
  { name: "Emma L.", initial: "EL" },
];

export function QuickTransfer() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Transfer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          {contacts.map((contact) => (
            <button
              key={contact.name}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {contact.initial}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{contact.name}</span>
            </button>
          ))}
          <button className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted transition-colors">
            <div className="h-10 w-10 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
              <span className="text-lg text-muted-foreground">+</span>
            </div>
            <span className="text-xs text-muted-foreground">Add</span>
          </button>
        </div>
        <div className="flex gap-2">
          <Input placeholder="Enter amount" type="number" className="flex-1" />
          <Button size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeDate } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

const MOCK_CHATS = [
  { id: "1", buyer: "Maria Santos", lastMessage: "Is the tomatoes still available po?", unread: 2, time: new Date(Date.now() - 300000).toISOString() },
  { id: "2", buyer: "Chef Rico", lastMessage: "Can I order 20kg for next week?", unread: 0, time: new Date(Date.now() - 7200000).toISOString() },
  { id: "3", buyer: "Juan Dela Cruz", lastMessage: "Thank you! Got the order.", unread: 0, time: new Date(Date.now() - 86400000).toISOString() },
];

export default function FarmerMessagesPage() {
  return (
    <div className="container px-4 py-4 space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Messages</h2>

      <div className="space-y-2">
        {MOCK_CHATS.map((chat) => (
          <Card key={chat.id} className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary">
              {chat.buyer.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">{chat.buyer}</p>
                <span className="text-[10px] text-gray-400">{formatRelativeDate(chat.time)}</span>
              </div>
              <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
            </div>
            {chat.unread > 0 && (
              <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                {chat.unread}
              </Badge>
            )}
          </Card>
        ))}
        {MOCK_CHATS.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-400">
            <MessageSquare className="mx-auto mb-2 h-8 w-8" />
            No messages yet
          </div>
        )}
      </div>
    </div>
  );
}

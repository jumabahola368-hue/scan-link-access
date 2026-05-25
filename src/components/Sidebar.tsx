import React, { useState } from 'react';
import { Search, MoreVertical, Plus, MessageSquare, Smartphone, Share2, Check } from 'lucide-react';
import { User } from '../types/chat';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

interface SidebarProps {
  contacts: User[];
  activeUserId: string | null;
  onSelectUser: (user: User) => void;
  onShowQR: () => void;
  currentUser: User;
}

export function Sidebar({ contacts, activeUserId, onSelectUser, onShowQR, currentUser }: SidebarProps) {
  const [isCopying, setIsCopying] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopying(true);
      toast.success("App link copied to clipboard!", {
        description: "You can now share Jay's Chat with others.",
      });
      setTimeout(() => setIsCopying(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="flex flex-col h-full bg-card border-r border-border w-full">
      <div className="p-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-primary/10">
            <AvatarImage src={currentUser.avatar} />
            <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
          </Avatar>
          <div className="hidden lg:block">
            <h2 className="font-semibold text-sm truncate w-24">{currentUser.name}</h2>
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8"><Plus className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
        </div>
      </div>
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-9 bg-muted/50 border-none h-9 rounded-xl" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {contacts.map((user) => (
          <button
            key={user.id}
            onClick={() => onSelectUser(user)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-2xl transition-all",
              activeUserId === user.id ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-muted"
            )}
          >
            <Avatar className="h-12 w-12 border-2 border-transparent">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left hidden md:block">
              <p className="font-semibold text-sm">{user.name}</p>
              <p className={cn("text-xs truncate opacity-70", activeUserId === user.id ? "text-primary-foreground" : "text-muted-foreground")}>
                {user.status === 'online' ? 'Active now' : user.lastSeen}
              </p>
            </div>
          </button>
        ))}
      </div>
      <div className="p-4 border-t border-border mt-auto space-y-2">
        <div className="flex gap-2">
          <Button onClick={onShowQR} variant="outline" className="flex-1 gap-2 rounded-xl h-10">
            <Smartphone className="h-4 w-4" />
            <span>Mobile</span>
          </Button>
          <Button 
            onClick={handleCopyLink} 
            variant="outline" 
            className="flex-1 gap-2 rounded-xl h-10 border-primary/20 hover:border-primary/50 text-primary"
          >
            {isCopying ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            <span>{isCopying ? "Copied" : "Share"}</span>
          </Button>
        </div>
        <div className="flex items-center gap-2 justify-center opacity-40 text-[10px] font-bold tracking-widest uppercase">
          <MessageSquare className="w-3 h-3" />
          <span>Jay's Chat v1.0</span>
        </div>
      </div>
    </div>
  );
}
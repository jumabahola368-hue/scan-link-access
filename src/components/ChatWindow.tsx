import React, { useState, useRef, useEffect } from 'react';
import { Phone, Video, MoreVertical, Send, Paperclip, Mic, Smile, X, Play } from 'lucide-react';
import { User } from '../types/chat';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useChat } from '../hooks/use-chat';
import { useMediaRecorder } from '../hooks/use-media-recorder';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatWindowProps {
  user: User;
  onCall: (type: 'voice' | 'video') => void;
}

export function ChatWindow({ user, onCall }: ChatWindowProps) {
  const [inputValue, setInputValue] = useState('');
  const { messages, sendMessage } = useChat(user.id);
  const { isRecording, audioUrl, duration, startRecording, stopRecording, clearRecording } = useMediaRecorder();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <header className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-sm font-semibold">{user.name}</h2>
            <p className="text-[10px] text-muted-foreground">{user.status}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => onCall('voice')}><Phone className="h-4 w-4 text-primary" /></Button>
          <Button variant="ghost" size="icon" onClick={() => onCall('video')}><Video className="h-4 w-4 text-primary" /></Button>
          <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
        </div>
      </header>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex flex-col max-w-[80%]", msg.senderId === 'me' ? "ml-auto items-end" : "mr-auto items-start")}>
            <div className={cn("px-4 py-2 rounded-2xl text-sm shadow-sm", msg.senderId === 'me' ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-card border border-border rounded-tl-none")}>
              {msg.type === 'voice' ? <div className="flex items-center gap-2 py-1"><Play className="h-4 w-4" /><span>Voice {msg.duration}s</span></div> : <p>{msg.content}</p>}
            </div>
            <span className="text-[10px] text-muted-foreground mt-1">{format(msg.timestamp, 'HH:mm')}</span>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-border bg-card/30">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon"><Paperclip className="h-5 w-5" /></Button>
          <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Type message..." className="bg-muted/50 border-none rounded-2xl" />
          <Button onClick={isRecording ? stopRecording : startRecording} variant="ghost" size="icon" className={cn(isRecording && "text-destructive animate-pulse")}>
            <Mic className="h-5 w-5" />
          </Button>
          <Button onClick={handleSend} disabled={!inputValue.trim()} size="icon" className="rounded-full h-10 w-10"><Send className="h-5 w-5" /></Button>
        </div>
      </div>
    </div>
  );
}
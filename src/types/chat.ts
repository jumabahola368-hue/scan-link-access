export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
  bio?: string;
}

export type MessageType = 'text' | 'voice' | 'image' | 'call-missed' | 'call-ended';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: MessageType;
  timestamp: number;
  duration?: number;
  metadata?: any;
}

export type CallType = 'voice' | 'video' | null;

export interface ActiveCall {
  type: CallType;
  partner: User;
  status: 'dialing' | 'connected' | 'ended';
  startTime?: number;
}
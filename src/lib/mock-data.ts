import { User, Message } from '../types/chat';

export const currentUser: User = {
  id: 'me',
  name: 'Jay (You)',
  avatar: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/3a06a9b5-7b36-4459-997d-65a8b80c2052/user-avatar-1-ed9da223-1779692766678.webp',
  status: 'online',
  bio: 'Software Architect & Chat Lover',
};

export const contacts: User[] = [
  {
    id: 'user-1',
    name: 'Sarah Chen',
    avatar: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/3a06a9b5-7b36-4459-997d-65a8b80c2052/user-avatar-2-dabf8218-1779692766800.webp',
    status: 'online',
    lastSeen: 'Active now',
    bio: 'UI/UX Designer @ TechFlow',
  },
  {
    id: 'user-2',
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    status: 'away',
    lastSeen: '10m ago',
  },
  {
    id: 'user-3',
    name: 'Jordan Smith',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
    status: 'offline',
    lastSeen: '2h ago',
  },
];

export const initialMessages: Message[] = [
  {
    id: '1',
    senderId: 'user-1',
    receiverId: 'me',
    content: "Hey Jay! Welcome to your new chat app. Ready to test voice and video?",
    type: 'text',
    timestamp: Date.now() - 3600000,
  },
];
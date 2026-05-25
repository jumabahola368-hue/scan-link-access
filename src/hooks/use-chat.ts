import { useState, useEffect, useCallback } from 'react';
import { Message } from '../types/chat';
import { initialMessages } from '../lib/mock-data';

export function useChat(activeUserId: string | null) {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('jays_chat_messages');
    return saved ? JSON.parse(saved) : initialMessages;
  });

  useEffect(() => {
    localStorage.setItem('jays_chat_messages', JSON.stringify(messages));
  }, [messages]);

  const activeMessages = messages.filter(
    (m) =>
      (m.senderId === 'me' && m.receiverId === activeUserId) ||
      (m.senderId === activeUserId && m.receiverId === 'me')
  );

  const sendMessage = useCallback((content: string, type: Message['type'] = 'text', duration?: number) => {
    if (!activeUserId) return;

    const newMessage: Message = {
      id: Math.random().toString(36).substring(7),
      senderId: 'me',
      receiverId: activeUserId,
      content,
      type,
      timestamp: Date.now(),
      duration,
    };

    setMessages((prev) => [...prev, newMessage]);

    if (type === 'text') {
      setTimeout(() => {
        const reply: Message = {
          id: Math.random().toString(36).substring(7),
          senderId: activeUserId,
          receiverId: 'me',
          content: `Echo: ${content}`,
          type: 'text',
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, reply]);
      }, 1000);
    }
  }, [activeUserId]);

  return {
    messages: activeMessages,
    sendMessage,
  };
}
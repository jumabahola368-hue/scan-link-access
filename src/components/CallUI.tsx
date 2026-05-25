import React, { useEffect, useRef, useState } from 'react';
import { Phone, Video, Mic, MicOff, VideoOff, PhoneOff, Maximize2 } from 'lucide-react';
import { User, ActiveCall } from '../types/chat';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

interface CallUIProps {
  call: ActiveCall;
  onEndCall: () => void;
}

export function CallUI({ call, onEndCall }: CallUIProps) {
  const [timer, setTimer] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setTimer(p => p + 1), 1000);
    
    let mediaStream: MediaStream | null = null;

    const setupMedia = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Media devices not supported');
        }

        const constraints = {
          audio: true,
          video: call.type === 'video'
        };

        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current && call.type === 'video') {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err: any) {
        console.error('Call media access error:', err);
        const deviceType = call.type === 'video' ? 'camera/microphone' : 'microphone';
        const errorMessage = (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError')
          ? `Requested ${deviceType} not found.`
          : `Could not access ${deviceType}. Please check permissions.`;
        
        toast.error(errorMessage);
        onEndCall();
      }
    };

    setupMedia();

    return () => {
      clearInterval(interval);
      if (mediaStream) {
        mediaStream.getTracks().forEach(t => t.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [call.type, onEndCall]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center">
      <div className="text-center space-y-6">
        <Avatar className="h-32 w-32 mx-auto ring-4 ring-primary/20">
          <AvatarImage src={call.partner.avatar} />
          <AvatarFallback>{call.partner.name[0]}</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold">{call.partner.name}</h2>
        <p className="text-muted-foreground uppercase tracking-widest text-xs">{call.type} Call - {Math.floor(timer/60)}:{(timer%60).toString().padStart(2, '0')}</p>
        {call.type === 'video' && <video ref={videoRef} autoPlay playsInline className="w-64 h-48 rounded-2xl object-cover bg-black mx-auto shadow-2xl" />}
        <div className="flex gap-4 justify-center pt-8">
          <Button variant="secondary" size="icon" className="h-14 w-14 rounded-full"><Mic className="h-6 w-6" /></Button>
          <Button onClick={onEndCall} variant="destructive" size="icon" className="h-16 w-16 rounded-full shadow-lg"><PhoneOff className="h-8 w-8" /></Button>
        </div>
      </div>
    </motion.div>
  );
}
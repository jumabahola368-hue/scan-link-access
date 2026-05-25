import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';

export function useMediaRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const startRecording = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Media devices not supported in this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      setDuration(0);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      timerRef.current = window.setInterval(() => setDuration(prev => prev + 1), 1000);
    } catch (err: any) {
      console.error('Mic access error:', err);
      const errorMessage = err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError' 
        ? 'Microphone not found. Please connect a mic and try again.'
        : 'Could not access microphone. Please check permissions.';
      
      toast.error(errorMessage);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isRecording]);

  const clearRecording = useCallback(() => {
    setAudioUrl(null);
    setDuration(0);
  }, []);

  return { isRecording, audioUrl, duration, startRecording, stopRecording, clearRecording };
}
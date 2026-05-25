import React from 'react';
import { X, Smartphone, Globe, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';

export function QRCodeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const appUrl = window.location.href;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(appUrl)}`;

  const copy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-sm bg-card border border-border rounded-[2.5rem] p-8 shadow-2xl text-center">
            <h3 className="text-xl font-bold mb-2">Use Jay's Chat on Mobile</h3>
            <p className="text-muted-foreground text-sm mb-6">Scan this QR code with your phone camera</p>
            <div className="bg-white p-4 rounded-3xl inline-block mb-6"><img src={qrCodeUrl} alt="QR" className="w-48 h-48" /></div>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-2xl mb-6">
              <Globe className="h-4 w-4 text-muted-foreground" /><span className="text-xs truncate flex-1">{appUrl}</span>
              <Button onClick={copy} size="icon" variant="ghost" className="h-8 w-8">{copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}</Button>
            </div>
            <Button onClick={onClose} className="w-full rounded-2xl py-6">Dismiss</Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
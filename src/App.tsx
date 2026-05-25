import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { CallUI } from './components/CallUI';
import { QRCodeModal } from './components/QRCodeModal';
import { User, ActiveCall } from './types/chat';
import { contacts, currentUser } from './lib/mock-data';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { 
  MessageSquare, Settings, Users, 
  Phone, Video, LayoutGrid, Bell, Smartphone
} from 'lucide-react';
import { Button } from './components/ui/button';
import { cn } from './lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

const LOGO_URL = "https://storage.googleapis.com/dala-prod-public-storage/generated-images/3a06a9b5-7b36-4459-997d-65a8b80c2052/app-logo-0ef4f39f-1779692766082.webp";

function App() {
  const [activeUser, setActiveUser] = useState<User | null>(contacts[0]);
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // Chrome Extension Dimension Management
  useEffect(() => {
    // Add specific styles if running in an extension popup
    const chrome = (window as any).chrome;
    if (chrome && chrome.runtime && chrome.runtime.id) {
      document.body.style.minWidth = '400px';
      document.body.style.minHeight = '600px';
    }
  }, []);

  const startCall = (type: 'voice' | 'video') => {
    if (!activeUser) return;
    
    setActiveCall({
      type,
      partner: activeUser,
      status: 'dialing',
    });

    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} call started`, {
      description: `Calling ${activeUser.name}...`,
      icon: type === 'video' ? <Video className="h-4 w-4" /> : <Phone className="h-4 w-4" />,
    });

    // Simulate connection after 2 seconds
    setTimeout(() => {
      setActiveCall(prev => prev ? { ...prev, status: 'connected' } : null);
    }, 2000);
  };

  const endCall = () => {
    if (activeCall) {
      toast.info('Call ended', {
        description: `The conversation with ${activeCall.partner.name} has ended.`,
      });
      setActiveCall(null);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30">
      {/* App Sidebar (Small icon bar) */}
      <nav className="hidden md:flex flex-col items-center py-6 w-24 border-r border-border bg-card/50 backdrop-blur-xl">
        <div className="mb-10 px-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 rounded-2xl overflow-hidden shadow-xl shadow-primary/20 cursor-pointer border border-primary/20"
          >
            <img src={LOGO_URL} alt="Jay's Chat" className="w-full h-full object-cover" />
          </motion.div>
        </div>
        
        <div className="flex-1 flex flex-col gap-5">
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-primary shadow-lg shadow-primary/30 text-primary-foreground hover:bg-primary/90">
            <MessageSquare className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all">
            <Users className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all">
            <Phone className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all">
            <Video className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all">
            <LayoutGrid className="h-6 w-6" />
          </Button>
        </div>

        <div className="mt-auto flex flex-col gap-4">
          <Button 
            onClick={() => setIsQRModalOpen(true)}
            variant="ghost" 
            size="icon" 
            className="h-12 w-12 rounded-2xl text-primary bg-primary/10 hover:bg-primary/20"
          >
            <Smartphone className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-muted-foreground hover:bg-muted relative">
            <Bell className="h-6 w-6" />
            <span className="absolute top-3 right-3 w-2 h-2 bg-destructive rounded-full" />
          </Button>
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-muted-foreground hover:bg-muted">
            <Settings className="h-6 w-6" />
          </Button>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex flex-1 relative h-full overflow-hidden">
        {/* Contacts Sidebar */}
        <div className={cn(
          "h-full transition-all duration-300 md:relative absolute z-40 inset-y-0 left-0",
          isMobileMenuOpen ? "translate-x-0 w-[85%] sm:w-80" : "md:translate-x-0 -translate-x-full md:w-80 lg:w-96"
        )}>
          <Sidebar 
            contacts={contacts} 
            activeUserId={activeUser?.id || null} 
            onSelectUser={(user) => {
              setActiveUser(user);
              setIsMobileMenuOpen(false);
            }}
            onShowQR={() => setIsQRModalOpen(true)}
            currentUser={currentUser}
          />
        </div>

        {/* Backdrop for mobile */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Chat Area */}
        <main className="flex-1 h-full overflow-hidden relative bg-muted/5">
          {activeUser ? (
            <ChatWindow 
              user={activeUser} 
              onCall={startCall}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-32 h-32 bg-card rounded-[3rem] shadow-2xl flex items-center justify-center mb-8 border border-border"
              >
                <img src={LOGO_URL} alt="Jay's Chat" className="w-20 h-20 opacity-40 grayscale" />
              </motion.div>
              <h1 className="text-3xl font-bold mb-3 tracking-tight">Welcome to Jay's Chat</h1>
              <p className="text-muted-foreground max-w-md text-lg leading-relaxed">
                Connect with friends via text, voice, or video. Select a conversation to start chatting in real-time.
              </p>
              <div className="mt-10 flex gap-4">
                <Button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden">
                  Browse Contacts
                </Button>
                <Button variant="outline" onClick={() => setIsQRModalOpen(true)}>
                  Scan QR Code
                </Button>
              </div>
            </div>
          )}
        </main>

        {/* Mobile Menu Toggle (FAB) */}
        {!isMobileMenuOpen && (
          <div className="md:hidden fixed bottom-6 right-6 z-50">
            <Button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="w-16 h-16 rounded-full shadow-2xl shadow-primary/40 bg-primary text-primary-foreground hover:scale-110 transition-transform"
            >
              <MessageSquare className="h-8 w-8" />
            </Button>
          </div>
        )}
      </div>

      {/* Call UI Modal */}
      <AnimatePresence>
        {activeCall && (
          <CallUI call={activeCall} onEndCall={endCall} />
        )}
      </AnimatePresence>

      {/* QR Code Modal */}
      <QRCodeModal 
        isOpen={isQRModalOpen} 
        onClose={() => setIsQRModalOpen(false)} 
      />

      <Toaster position="top-right" expand={true} richColors closeButton />
    </div>
  );
}

export default App;
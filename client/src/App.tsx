import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Smartphone, 
  QrCode, 
  Send, 
  Settings, 
  LogOut, 
  Check, 
  Loader2, 
  X, 
  Menu, 
  Sparkles,
  Bot,
  User,
  Trash2,
  RefreshCw,
  Zap,
  Shield,
  Globe
} from 'lucide-react';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
};

type Session = {
  id: string;
  phoneNumber: string;
  isConnected: boolean;
  qrCode: string | null;
  connectionDate: number;
  lastActive: number;
};

type AppSettings = {
  aiModel: 'gpt-4' | 'gpt-3.5' | 'claude';
  temperature: number;
  systemPrompt: string;
  autoReply: boolean;
};

type AppData = {
  sessions: Session[];
  messages: Message[];
  settings: AppSettings;
  currentSessionId: string | null;
};

const defaultSettings: AppSettings = {
  aiModel: 'gpt-4',
  temperature: 0.7,
  systemPrompt: 'You are a helpful AI assistant integrated with WhatsApp. Be concise and friendly.',
  autoReply: true
};

const defaultData: AppData = {
  sessions: [],
  messages: [],
  settings: defaultSettings,
  currentSessionId: null
};

export default function App() {
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem('whatsapp-ai-assistant-data');
    return saved ? JSON.parse(saved) : defaultData;
  });

  const [activeView, setActiveView] = useState<'landing' | 'pairing' | 'chat' | 'settings'>('landing');
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPairing, setIsPairing] = useState(false);
  const [pairingProgress, setPairingProgress] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const currentSession = data.sessions.find(s => s.id === data.currentSessionId);

  useEffect(() => {
    localStorage.setItem('whatsapp-ai-assistant-data', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (activeView === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data.messages, activeView]);

  useEffect(() => {
    if (currentSession?.isConnected && activeView === 'landing') {
      setActiveView('chat');
    }
  }, []);

  const generateQRCode = () => {
    const qrData = `whatsapp://qr/${Math.random().toString(36).substring(7)}`;
    return qrData;
  };

  const startPairing = () => {
    setIsPairing(true);
    setPairingProgress(0);
    
    const qrCode = generateQRCode();
    const newSession: Session = {
      id: Date.now().toString(),
      phoneNumber: '',
      isConnected: false,
      qrCode: qrCode,
      connectionDate: Date.now(),
      lastActive: Date.now()
    };

    setData(prev => ({
      ...prev,
      sessions: [...prev.sessions, newSession],
      currentSessionId: newSession.id
    }));

    setActiveView('pairing');

    const progressInterval = setInterval(() => {
      setPairingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    setTimeout(() => {
      clearInterval(progressInterval);
      setPairingProgress(100);
      
      setTimeout(() => {
        const phoneNumber = `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`;
        setData(prev => ({
          ...prev,
          sessions: prev.sessions.map(s => 
            s.id === newSession.id 
              ? { ...s, isConnected: true, phoneNumber }
              : s
          )
        }));
        setIsPairing(false);
        setActiveView('chat');
        
        addMessage('Welcome! I\'m your AI assistant. Ask me anything!', 'ai');
      }, 500);
    }, 5000);
  };

  const addMessage = (text: string, sender: 'user' | 'ai') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: Date.now()
    };

    setData(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));

    if (currentSession) {
      setData(prev => ({
        ...prev,
        sessions: prev.sessions.map(s =>
          s.id === currentSession.id
            ? { ...s, lastActive: Date.now() }
            : s
        )
      }));
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentSession?.isConnected) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    addMessage(userMessage, 'user');
    setIsTyping(true);

    setTimeout(() => {
      const responses = [
        'I understand your question. Let me help you with that.',
        'That\'s an interesting point! Here\'s what I think...',
        'Based on what you\'ve told me, I would suggest...',
        'Great question! The answer involves several factors...',
        'I can definitely help with that. Let me explain...'
      ];
      
      const aiResponse = responses[Math.floor(Math.random() * responses.length)];
      addMessage(aiResponse, 'ai');
      setIsTyping(false);
    }, 1500);
  };

  const disconnectSession = () => {
    if (!currentSession) return;
    
    const confirmDisconnect = window.confirm('Are you sure you want to disconnect your WhatsApp?');
    if (!confirmDisconnect) return;

    setData(prev => ({
      ...prev,
      sessions: prev.sessions.filter(s => s.id !== currentSession.id),
      messages: [],
      currentSessionId: null
    }));
    setActiveView('landing');
  };

  const clearConversation = () => {
    const confirmClear = window.confirm('Clear all messages?');
    if (!confirmClear) return;

    setData(prev => ({
      ...prev,
      messages: []
    }));
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates }
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, staggerChildren: 0.1 }
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const renderLanding = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <motion.div 
          variants={itemVariants}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl"
            >
              <Bot className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </motion.div>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            WhatsApp AI Assistant
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Connect your WhatsApp and chat with a powerful AI assistant through your own phone number
          </p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 px-4"
        >
          {[
            { icon: QrCode, title: 'Easy Setup', desc: 'Scan QR code to connect in seconds' },
            { icon: Zap, title: 'Instant Replies', desc: 'Get AI-powered responses immediately' },
            { icon: Shield, title: 'Private & Secure', desc: 'Your data stays on your device' }
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700"
            >
              <feature.icon className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="text-center px-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startPairing}
            className="inline-flex items-center px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-base sm:text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-indigo-500/50 transition-all"
          >
            <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
            Connect WhatsApp Now
          </motion.button>
          <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Free to use • No credit card required • Data stored locally
          </p>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderPairing = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 flex items-center justify-center p-4"
    >
      <motion.div 
        variants={itemVariants}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-8"
      >
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
            {isPairing ? (
              <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-spin" />
            ) : (
              <Check className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isPairing ? 'Connecting...' : 'Connected!'}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {isPairing ? 'Scan the QR code with WhatsApp' : 'Your WhatsApp is ready'}
          </p>
        </div>

        <motion.div
          animate={{ scale: isPairing ? [1, 1.02, 1] : 1 }}
          transition={{ duration: 2, repeat: isPairing ? Infinity : 0 }}
          className="bg-white dark:bg-gray-700 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 border-4 border-dashed border-indigo-300 dark:border-indigo-600"
        >
          <div className="aspect-square bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-xl flex items-center justify-center">
            <QrCode className="w-24 h-24 sm:w-32 sm:h-32 text-indigo-600 dark:text-indigo-400" />
          </div>
        </motion.div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-gray-600 dark:text-gray-400">Connection Progress</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {pairingProgress}%
            </span>
          </div>
          <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pairingProgress}%` }}
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
            />
          </div>
        </div>

        {!isPairing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 sm:mt-8"
          >
            <button
              onClick={() => setActiveView('chat')}
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all text-sm sm:text-base"
            >
              Start Chatting
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );

  const renderChat = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900"
    >
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 sm:py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="sm:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
              AI Assistant
            </h2>
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {currentSession?.isConnected && (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="hidden sm:inline">{currentSession?.phoneNumber}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveView('settings')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={clearConversation}
            className="hidden sm:block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <Trash2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>
        </div>
      </header>

      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 bg-white dark:bg-gray-800 z-50 p-6 sm:hidden"
          >
            <button
              onClick={() => setShowMobileMenu(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
            <nav className="space-y-4 mt-16">
              <button
                onClick={() => {
                  setActiveView('chat');
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center space-x-3 p-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
              >
                <MessageSquare className="w-6 h-6" />
                <span className="font-semibold">Chat</span>
              </button>
              <button
                onClick={() => {
                  setActiveView('settings');
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center space-x-3 p-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
              >
                <Settings className="w-6 h-6" />
                <span className="font-semibold">Settings</span>
              </button>
              <button
                onClick={clearConversation}
                className="w-full flex items-center space-x-3 p-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-red-600"
              >
                <Trash2 className="w-6 h-6" />
                <span className="font-semibold">Clear Chat</span>
              </button>
              <button
                onClick={disconnectSession}
                className="w-full flex items-center space-x-3 p-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-red-600"
              >
                <LogOut className="w-6 h-6" />
                <span className="font-semibold">Disconnect</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {data.messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full text-center px-4"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mb-4 sm:mb-6">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Start a Conversation
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md">
                Send a message to begin chatting with your AI assistant
              </p>
            </motion.div>
          ) : (
            data.messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-sm'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm shadow-md'
                  }`}
                >
                  <div className="flex items-start space-x-2 mb-1">
                    {message.sender === 'ai' && (
                      <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
                    )}
                    {message.sender === 'user' && (
                      <User className="w-4 h-4 mt-1 flex-shrink-0" />
                    )}
                    <p className="text-sm sm:text-base break-words">{message.text}</p>
                  </div>
                  <span className={`text-xs ${
                    message.sender === 'user' 
                      ? 'text-indigo-100' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 shadow-md">
              <div className="flex space-x-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex space-x-2 sm:space-x-3"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
            disabled={!currentSession?.isConnected || isTyping}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!inputMessage.trim() || !currentSession?.isConnected || isTyping}
            className="px-4 sm:px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-shadow"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </form>
      </div>
    </motion.div>
  );

  const renderSettings = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20"
    >
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveView('chat')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </motion.button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Settings
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Smartphone className="w-5 h-5 mr-2" />
            Connection Status
          </h2>
          {currentSession ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Connected
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {currentSession.phoneNumber}
                </span>
              </div>
              <button
                onClick={disconnectSession}
                className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <LogOut className="w-5 h-5" />
                <span>Disconnect WhatsApp</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No active connection
              </p>
              <button
                onClick={startPairing}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold"
              >
                Connect Now
              </button>
            </div>
          )}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2" />
            AI Configuration
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                AI Model
              </label>
              <select
                value={data.settings.aiModel}
                onChange={(e) => updateSettings({ aiModel: e.target.value as AppSettings['aiModel'] })}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="gpt-4">GPT-4 (Most Capable)</option>
                <option value="gpt-3.5">GPT-3.5 (Faster)</option>
                <option value="claude">Claude (Balanced)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Temperature: {data.settings.temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={data.settings.temperature}
                onChange={(e) => updateSettings({ temperature: parseFloat(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Precise</span>
                <span>Creative</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                System Prompt
              </label>
              <textarea
                value={data.settings.systemPrompt}
                onChange={(e) => updateSettings({ systemPrompt: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Auto Reply</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically respond to messages
                </p>
              </div>
              <button
                onClick={() => updateSettings({ autoReply: !data.settings.autoReply })}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  data.settings.autoReply ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <motion.div
                  animate={{ x: data.settings.autoReply ? 24 : 2 }}
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                />
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            About
          </h2>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <p>Version 1.0.0</p>
            <p>All data is stored locally on your device</p>
            <p>No data is sent to external servers</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <div className="dark">
      <AnimatePresence mode="wait">
        {activeView === 'landing' && renderLanding()}
        {activeView === 'pairing' && renderPairing()}
        {activeView === 'chat' && renderChat()}
        {activeView === 'settings' && renderSettings()}
      </AnimatePresence>
    </div>
  );
}

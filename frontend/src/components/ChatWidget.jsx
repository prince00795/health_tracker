import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../api/client';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

export default function ChatWidget({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "SYSTEM ONLINE. WHAT IS YOUR QUERY?", sender: "ai" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, sender: "user" }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await sendChatMessage(user._id, userMessage);
      setMessages(prev => [...prev, { text: res.data.reply, sender: "ai" }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "COMMUNICATION ERROR. TRY AGAIN.", sender: "ai" }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-none flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all active:scale-95 group border border-red-500"
        >
          <MessageSquare size={28} className="group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[350px] sm:w-[400px] h-[500px] bg-neutral-950 border-2 border-neutral-800 shadow-2xl flex flex-col animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-neutral-900 border-b-2 border-neutral-800 p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-red-600 p-2 text-white">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-black text-white uppercase tracking-widest text-sm">AI Coach</h3>
                <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-neutral-950">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 text-sm font-bold uppercase tracking-wider ${
                  msg.sender === 'user' 
                  ? 'bg-neutral-800 text-white border border-neutral-700' 
                  : 'bg-red-600/10 text-red-500 border border-red-600/30'
                }`}>
                  <div className="flex items-center gap-2 mb-1 opacity-70">
                    {msg.sender === 'user' ? <User size={12} /> : <Bot size={12} />}
                    <span className="text-[10px]">{msg.sender}</span>
                  </div>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-neutral-900 p-3 text-neutral-500 text-xs font-black uppercase tracking-widest border border-neutral-800 flex items-center gap-2">
                  <Bot size={12} className="animate-bounce" /> PROCESSING...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 bg-neutral-900 border-t-2 border-neutral-800 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ASK COACH..."
              className="flex-1 bg-neutral-950 border border-neutral-800 text-white px-4 py-3 outline-none focus:border-red-600 transition-colors font-bold uppercase text-xs"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-red-600 hover:bg-red-700 disabled:bg-neutral-800 disabled:text-neutral-500 text-white px-4 flex items-center justify-center transition-colors border border-transparent disabled:border-neutral-700"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
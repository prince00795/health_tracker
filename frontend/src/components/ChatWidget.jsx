import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../api/client';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

export default function ChatWidget({ user, isDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hi! I am your AI Coach. What do you need help with?", sender: "ai" }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, sender: "user" }]);
    setInput(''); setIsLoading(true);
    try {
      const res = await sendChatMessage(user._id, userMessage);
      setMessages(prev => [...prev, { text: res.data.reply, sender: "ai" }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Error connecting to AI.", sender: "ai" }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {!isOpen && (
        <>
          <span className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-neutral-400 shadow-lg hidden sm:block animate-pulse">Ask AI Coach &rarr;</span>
          <button onClick={() => setIsOpen(true)} className="w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-105 border-2 border-red-500">
            <MessageSquare size={28} />
          </button>
        </>
      )}

      {isOpen && (
        <div className="w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-neutral-950 border-2 border-slate-200 dark:border-neutral-800 shadow-2xl flex flex-col">
          <div className="bg-slate-100 dark:bg-neutral-900 border-b border-slate-200 dark:border-neutral-800 p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-red-600 p-2 text-white rounded"><Bot size={20} /></div>
              <div><h3 className="font-black text-slate-900 dark:text-white uppercase text-sm">AI Coach</h3></div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-red-500"><X size={24} /></button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 dark:bg-neutral-950">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 text-sm font-bold ${msg.sender === 'user' ? 'bg-slate-800 dark:bg-neutral-800 text-white' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-4 bg-white dark:bg-neutral-900 border-t border-slate-200 dark:border-neutral-800 flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 bg-slate-50 dark:bg-neutral-950 border border-slate-300 dark:border-neutral-800 text-slate-900 dark:text-white px-4 py-3 outline-none focus:border-red-600 text-sm" disabled={isLoading}/>
            <button type="submit" disabled={isLoading || !input.trim()} className="bg-red-600 text-white px-4 flex items-center justify-center disabled:opacity-50"><Send size={18} /></button>
          </form>
        </div>
      )}
    </div>
  );
}
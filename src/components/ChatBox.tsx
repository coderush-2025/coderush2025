"use client";
import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

interface Message {
  role: "user" | "bot";
  content: string;
  buttons?: { text: string; value: string }[];
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: "👋 Hi! I'll register your team for CodeRush 2025. What's your team name?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const [sessionId] = useState(() => {
    // Check if we're in the browser environment
    if (typeof window === "undefined") {
      return uuidv4(); // Generate a temporary ID for server-side rendering
    }
    
    const existing = localStorage.getItem("regSessionId");
    if (existing) return existing;
    const id = uuidv4();
    localStorage.setItem("regSessionId", id);
    return id;
  });

  const handleButtonClick = async (value: string) => {
    const userMsg: Message = { role: "user", content: value };
    setMessages((prev) => [...prev, userMsg]);
    await sendMessageToAPI(value);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    await sendMessageToAPI(input);
    setInput("");
  };

  const sendMessageToAPI = async (message: string) => {
    const userMsg: Message = { role: "user", content: message };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId, message }),
      });

      // Check if the response is ok
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      // Check if response has content before parsing JSON
      const text = await res.text();
      if (!text) {
        throw new Error("Empty response from server");
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.error("Response text:", text);
        throw new Error("Invalid JSON response from server");
      }

      if (data.reply) {
        const botMessage: Message = { 
          role: "bot", 
          content: data.reply,
          buttons: data.buttons || undefined
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        setMessages((prev) => [...prev, { role: "bot", content: "Sorry, I didn't receive a proper response. Please try again." }]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { 
          role: "bot", 
          content: `Error: ${error instanceof Error ? error.message : "Something went wrong. Please try again."}` 
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-8 bg-white/10 backdrop-blur-xl border border-[#37c2cc]/30 rounded-2xl shadow-2xl relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#37c2cc]/10 via-transparent to-[#0e243f]/20 pointer-events-none" />
      
      {/* Header */}
      <div className="relative z-10 mb-6 text-center">
        <h3 
          className="text-xl font-semibold text-white mb-2"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #37c2cc 50%, #ffffff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          Team Registration Assistant
        </h3>
        <div className="h-px bg-gradient-to-r from-transparent via-[#37c2cc]/50 to-transparent" />
      </div>

      {/* Messages Container */}
      <div className="relative z-10 h-80 overflow-y-auto mb-6 bg-black/20 backdrop-blur-sm rounded-2xl border border-[#37c2cc]/20 p-4 space-y-3 scrollbar-thin scrollbar-thumb-[#37c2cc]/50 scrollbar-track-transparent">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className={`flex ${m.role === "user" ? "flex-row-reverse" : "flex-row"} items-start gap-2 max-w-[85%]`}>
              {/* Avatar */}
              {m.role === "bot" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#37c2cc] to-[#2ba8b3] flex items-center justify-center shadow-lg ring-2 ring-[#37c2cc]/30">
                  <span className="text-base">🤖</span>
                </div>
              )}
              {m.role === "user" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#0e243f] to-[#204168] flex items-center justify-center shadow-lg ring-2 ring-white/20">
                  <span className="text-base">👤</span>
                </div>
              )}
              
              {/* Message Bubble */}
              <div
                className={`relative group ${
                  m.role === "user"
                    ? "bg-gradient-to-br from-[#37c2cc] via-[#37c2cc] to-[#2ba8b3] text-white rounded-2xl rounded-tr-md"
                    : "bg-gradient-to-br from-[#e0f7fa] via-[#b2ebf2] to-[#80deea] text-[#0e243f] rounded-2xl rounded-tl-md border border-[#37c2cc]/20"
                }`}
                style={{
                  boxShadow: m.role === "user" 
                    ? "0 8px 24px rgba(55, 194, 204, 0.35), 0 4px 12px rgba(55, 194, 204, 0.2)" 
                    : "0 8px 24px rgba(55, 194, 204, 0.2), 0 4px 12px rgba(55, 194, 204, 0.1)",
                }}
              >
                <div className="px-4 py-3">
                  <div 
                    className={`text-[15px] leading-relaxed whitespace-pre-wrap ${
                      m.role === "user" ? "font-medium" : ""
                    }`}
                    style={{
                      fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
                    }}
                  >
                    {m.content}
                  </div>
                  
                  {/* Render buttons if they exist */}
                  {m.buttons && m.buttons.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-gray-200/50">
                      {m.buttons.map((button, btnIndex) => (
                        <button
                          key={btnIndex}
                          onClick={() => handleButtonClick(button.value)}
                          className="group/btn relative bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] hover:from-[#2ba8b3] hover:to-[#37c2cc] text-white font-semibold px-4 py-2 rounded-full text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                          style={{
                            fontFamily: "system-ui, -apple-system, sans-serif",
                            boxShadow: "0 2px 8px rgba(55, 194, 204, 0.3)",
                          }}
                        >
                          <span className="relative z-10 flex items-center gap-1">
                            {button.text}
                            <svg className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Enhanced gradient overlay for depth */}
                <div className={`absolute inset-0 rounded-2xl ${
                  m.role === "user" ? "rounded-tr-md" : "rounded-tl-md"
                } bg-gradient-to-br ${
                  m.role === "user" 
                    ? "from-white/20 via-transparent to-black/5" 
                    : "from-white/10 via-transparent to-transparent"
                } pointer-events-none`} />
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex items-start gap-2 max-w-[85%]">
              {/* Bot Avatar */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#37c2cc] to-[#2ba8b3] flex items-center justify-center shadow-lg ring-2 ring-[#37c2cc]/30">
                <span className="text-base">🤖</span>
              </div>
              
              {/* Typing Bubble */}
              <div 
                className="bg-gradient-to-br from-[#e0f7fa] via-[#b2ebf2] to-[#80deea] rounded-2xl rounded-tl-md px-5 py-3 relative border border-[#37c2cc]/20"
                style={{
                  boxShadow: "0 8px 24px rgba(55, 194, 204, 0.2), 0 4px 12px rgba(55, 194, 204, 0.1)",
                }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-[#0e243f] rounded-full animate-bounce shadow-sm" style={{animationDelay: "0ms"}}></div>
                  <div className="w-2.5 h-2.5 bg-[#0e243f] rounded-full animate-bounce shadow-sm" style={{animationDelay: "150ms"}}></div>
                  <div className="w-2.5 h-2.5 bg-[#0e243f] rounded-full animate-bounce shadow-sm" style={{animationDelay: "300ms"}}></div>
                </div>
                
                {/* Enhanced gradient overlay */}
                <div className="absolute inset-0 rounded-2xl rounded-tl-md bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        )}
        
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div className="relative z-10 flex gap-3">
        <div className="flex-1 relative">
          <input
            className="w-full bg-white/90 backdrop-blur-sm border-2 border-[#37c2cc]/30 rounded-xl p-4 text-[#0e243f] placeholder-[#0e243f]/60 focus:outline-none focus:ring-2 focus:ring-[#37c2cc] focus:border-[#37c2cc] transition-all duration-300 shadow-lg"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#37c2cc]/10 to-[#2ba8b3]/10 pointer-events-none" />
        </div>
        <button
          onClick={sendMessage}
          className="bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] hover:from-[#2ba8b3] hover:to-[#37c2cc] text-[#0e243f] font-bold px-6 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 relative overflow-hidden group"
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          <span className="relative z-10 group-hover:text-white transition-colors duration-300">
            Send
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0e243f] to-[#204168] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>
    </div>
  );
}
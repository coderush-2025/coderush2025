"use client";
import { useState } from "react";
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
      content: "👋 Hi — I'll register your team for CodeRush 2025. What's your team name?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

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
      <div className="relative z-10 h-80 overflow-y-auto mb-6 bg-black/30 backdrop-blur-sm rounded-xl border border-[#37c2cc]/20 p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#37c2cc]/40 scrollbar-track-transparent">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div
              className={`max-w-xs xl:max-w-sm p-4 rounded-xl shadow-lg relative ${
                m.role === "user"
                  ? "bg-gradient-to-br from-[#37c2cc] to-[#2ba8b3] text-[#0e243f] font-medium border border-[#37c2cc]/50"
                  : "bg-white/95 backdrop-blur-sm text-[#0e243f] border border-white/30"
              }`}
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                lineHeight: "1.5",
              }}
            >
              {m.role === "bot" && (
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#37c2cc] rounded-full flex items-center justify-center text-[#0e243f] text-xs font-bold">
                  🤖
                </div>
              )}
              <div>{m.content}</div>
              
              {/* Render buttons if they exist */}
              {m.buttons && m.buttons.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {m.buttons.map((button, btnIndex) => (
                    <button
                      key={btnIndex}
                      onClick={() => handleButtonClick(button.value)}
                      className="bg-[#37c2cc] hover:bg-[#2ba8b3] text-[#0e243f] font-medium px-3 py-1 rounded-lg text-sm transition-all duration-200 hover:scale-105 shadow-md"
                      style={{
                        fontFamily: "system-ui, -apple-system, sans-serif",
                      }}
                    >
                      {button.text}
                    </button>
                  ))}
                </div>
              )}
              
              <div className={`absolute bottom-0 ${m.role === "user" ? "right-0" : "left-0"} w-0 h-0 ${
                m.role === "user" 
                  ? "border-l-8 border-l-[#37c2cc] border-t-8 border-t-transparent transform translate-x-2" 
                  : "border-r-8 border-r-white/95 border-t-8 border-t-transparent transform -translate-x-2"
              }`} />
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="max-w-xs xl:max-w-sm p-4 rounded-xl shadow-lg relative bg-white/95 backdrop-blur-sm text-[#0e243f] border border-white/30">
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#37c2cc] rounded-full flex items-center justify-center text-[#0e243f] text-xs font-bold">
                🤖
              </div>
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-[#37c2cc] rounded-full animate-bounce" style={{animationDelay: "0ms"}}></div>
                  <div className="w-2 h-2 bg-[#37c2cc] rounded-full animate-bounce" style={{animationDelay: "150ms"}}></div>
                  <div className="w-2 h-2 bg-[#37c2cc] rounded-full animate-bounce" style={{animationDelay: "300ms"}}></div>
                </div>
                <span className="text-sm text-[#0e243f]/70 ml-2">Typing...</span>
              </div>
              <div className="absolute bottom-0 left-0 w-0 h-0 border-r-8 border-r-white/95 border-t-8 border-t-transparent transform -translate-x-2" />
            </div>
          </div>
        )}
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
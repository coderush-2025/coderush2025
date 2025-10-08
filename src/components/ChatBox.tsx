"use client";
import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

interface Message {
  role: "user" | "bot";
  content: string;
  buttons?: { text: string; value: string }[];
  showEditForm?: boolean;
  registrationData?: {
    teamName: string;
    hackerrankUsername: string;
    teamBatch: string;
    members: {
      fullName: string;
      indexNumber: string;
      email: string;
    }[];
  };
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const [sessionId, setSessionId] = useState(() => {
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

  const resetSession = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("regSessionId");
      const newId = uuidv4();
      localStorage.setItem("regSessionId", newId);
      setSessionId(newId);
      setMessages([{
        role: "bot",
        content: "👋 Hi! I'll register your team for CodeRush 2025. What's your team name?"
      }]);
      setInput("");
    }
  };

  const handleButtonClick = async (value: string) => {
    // Check if this is the edit form trigger
    if (value === "OPEN_EDIT_FORM") {
      // Find the last message with registration data
      const lastMessageWithData = [...messages].reverse().find(m => m.registrationData);
      if (lastMessageWithData && lastMessageWithData.registrationData) {
        setEditData(lastMessageWithData.registrationData);
        setShowEditModal(true);
      }
      return;
    }

    // Don't add message here - sendMessageToAPI will do it
    await sendMessageToAPI(value);
  };

  const handleMessageEdit = async (messageIndex: number, newContent: string) => {
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          message: "EDIT_MESSAGE",
          messageIndex,
          newContent
        }),
      });

      const data = await res.json();

      if (data.updatedMessages) {
        // Replace all messages with updated ones from server
        setMessages(data.updatedMessages);
      } else if (data.reply) {
        // Fallback: just add bot reply
        setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
      }
    } catch (error) {
      console.error("Error editing message:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Error updating message. Please try again." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editData) return;

    setShowEditModal(false);
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          message: "SAVE_EDITED_DATA",
          editedData: editData
        }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
      }
    } catch (error) {
      console.error("Error saving edited data:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Error saving changes. Please try again." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    // If editing an existing message
    if (editingMessageIndex !== null) {
      // Update the message at the index
      const updatedMessages = [...messages];
      updatedMessages[editingMessageIndex] = {
        ...updatedMessages[editingMessageIndex],
        content: input
      };
      setMessages(updatedMessages);
      setEditingMessageIndex(null);
      setInput("");

      // Notify backend about the edit and get updated responses
      await handleMessageEdit(editingMessageIndex, input);
      return;
    }

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
          buttons: data.buttons || undefined,
          showEditForm: data.showEditForm || false,
          registrationData: data.registrationData || undefined
        };
        setMessages((prev) => [...prev, botMessage]);

        // If server wants to show edit form, open modal
        if (data.showEditForm && data.registrationData) {
          console.log("🔧 Opening edit modal with data:", data.registrationData);
          setEditData(data.registrationData);
          setShowEditModal(true);
        }
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
    <>
    <div className="w-full max-w-lg mx-auto p-8 bg-white/10 backdrop-blur-xl border border-[#37c2cc]/30 rounded-2xl shadow-2xl relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#37c2cc]/10 via-transparent to-[#0e243f]/20 pointer-events-none" />
      
      {/* Header */}
      <div className="relative z-10 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3
            className="text-xl font-semibold text-white flex-1 text-center"
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
          <button
            onClick={resetSession}
            className="text-xs text-white/60 hover:text-white/90 px-2 py-1 rounded hover:bg-white/10 transition-all"
            title="Start new registration"
          >
            🔄 Reset
          </button>
        </div>
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
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className={`text-[15px] leading-relaxed whitespace-pre-wrap flex-1 ${
                        m.role === "user" ? "font-medium" : ""
                      }`}
                      style={{
                        fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
                      }}
                    >
                      {m.content}
                    </div>

                    {/* Edit button for user messages */}
                    {m.role === "user" && (
                      <button
                        onClick={() => {
                          setInput(m.content);
                          setEditingMessageIndex(i);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 active:scale-95"
                        title="Edit this message"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}
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

      {/* Edit Modal - Outside chat container */}
      {showEditModal && editData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
          <div className="bg-gradient-to-br from-[#0e243f] to-[#204168] p-6 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-[#37c2cc]/30 relative">
            <h2 className="text-2xl font-bold text-white mb-4 text-center bg-gradient-to-r from-[#37c2cc] to-white bg-clip-text text-transparent">
              Edit Registration Details
            </h2>

            {/* Team Name */}
            <div className="mb-4">
              <label className="block text-white/80 mb-2 text-sm font-semibold">Team Name</label>
              <input
                type="text"
                value={editData.teamName}
                onChange={(e) => setEditData({ ...editData, teamName: e.target.value })}
                className="w-full bg-white/10 border border-[#37c2cc]/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#37c2cc]"
              />
            </div>

            {/* Hackerrank Username */}
            <div className="mb-4">
              <label className="block text-white/80 mb-2 text-sm font-semibold">Hackerrank Username</label>
              <input
                type="text"
                value={editData.hackerrankUsername}
                onChange={(e) => setEditData({ ...editData, hackerrankUsername: e.target.value })}
                className="w-full bg-white/10 border border-[#37c2cc]/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#37c2cc]"
              />
            </div>

            {/* Batch */}
            <div className="mb-4">
              <label className="block text-white/80 mb-2 text-sm font-semibold">Batch</label>
              <select
                value={editData.teamBatch}
                onChange={(e) => setEditData({ ...editData, teamBatch: e.target.value })}
                className="w-full bg-white/10 border border-[#37c2cc]/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#37c2cc]"
              >
                <option value="23" className="bg-[#0e243f]">Batch 23</option>
                <option value="24" className="bg-[#0e243f]">Batch 24</option>
              </select>
            </div>

            {/* Members */}
            <div className="mb-6">
              <h3 className="text-white/90 mb-3 text-lg font-semibold">Team Members</h3>
              {editData.members.map((member: any, index: number) => (
                <div key={index} className="mb-4 p-4 bg-white/5 rounded-lg border border-[#37c2cc]/20">
                  <h4 className="text-[#37c2cc] mb-2 font-semibold">
                    {index === 0 ? 'Team Leader' : `Member ${index + 1}`}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-white/60 mb-1 text-xs">Full Name</label>
                      <input
                        type="text"
                        value={member.fullName}
                        onChange={(e) => {
                          const newMembers = [...editData.members];
                          newMembers[index].fullName = e.target.value;
                          setEditData({ ...editData, members: newMembers });
                        }}
                        className="w-full bg-white/10 border border-[#37c2cc]/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#37c2cc]"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 mb-1 text-xs">Index Number</label>
                      <input
                        type="text"
                        value={member.indexNumber}
                        onChange={(e) => {
                          const newMembers = [...editData.members];
                          newMembers[index].indexNumber = e.target.value.toUpperCase();
                          setEditData({ ...editData, members: newMembers });
                        }}
                        className="w-full bg-white/10 border border-[#37c2cc]/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#37c2cc]"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 mb-1 text-xs">Email</label>
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) => {
                          const newMembers = [...editData.members];
                          newMembers[index].email = e.target.value;
                          setEditData({ ...editData, members: newMembers });
                        }}
                        className="w-full bg-white/10 border border-[#37c2cc]/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#37c2cc]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-6 py-3 bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] hover:from-[#2ba8b3] hover:to-[#37c2cc] text-white rounded-lg transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                Save & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
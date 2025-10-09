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

interface Toast {
  id: number;
  message: string;
  type: 'error' | 'warning' | 'success';
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
  const [editData, setEditData] = useState<{
    teamName: string;
    hackerrankUsername: string;
    teamBatch: string;
    members: Array<{ fullName: string; indexNumber: string; email: string }>;
  } | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // Scroll only within the messages container, not the whole page
      const container = messagesEndRef.current.parentElement;
      if (container) {
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const showToast = (message: string, type: 'error' | 'warning' | 'success' = 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

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
      // Save current scroll position
      const currentScrollY = window.scrollY;

      localStorage.removeItem("regSessionId");
      const newId = uuidv4();
      localStorage.setItem("regSessionId", newId);
      setSessionId(newId);
      setMessages([{
        role: "bot",
        content: "👋 Hi! I'll register your team for CodeRush 2025. What's your team name?"
      }]);
      setInput("");

      // Restore scroll position after a brief delay
      setTimeout(() => {
        window.scrollTo(0, currentScrollY);
      }, 0);
    }
  };

  const handleButtonClick = async (value: string) => {
    // Check if this is the reset trigger
    if (value === "RESET") {
      resetSession();
      return;
    }

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


  const handleSaveEdit = async () => {
    if (!editData) return;

    // Prevent double submission
    if (isSubmitting) {
      showToast('Submission in progress, please wait...', 'warning');
      return;
    }

    // Validate team name and HackerRank username match
    if (!editData.hackerrankUsername.endsWith('_CR')) {
      showToast('HackerRank username must end with _CR (uppercase)', 'error');
      return;
    }

    const extractedTeamName = editData.hackerrankUsername.slice(0, -3);
    if (extractedTeamName.toLowerCase() !== editData.teamName.toLowerCase()) {
      showToast(`Team name and HackerRank username mismatch! Expected: "${editData.teamName}_CR"`, 'error');
      return;
    }

    // Validate batch
    if (!editData.teamBatch || !['23', '24'].includes(editData.teamBatch)) {
      showToast('Invalid batch. Please select Batch 23 or Batch 24', 'error');
      return;
    }

    // Validate all index numbers match the batch
    const invalidMembers = editData.members.filter((member) => {
      const indexNumber = member.indexNumber?.trim();
      if (!indexNumber || indexNumber.length < 2) {
        return true; // Invalid - too short
      }
      const indexBatch = indexNumber.substring(0, 2);
      return indexBatch !== editData.teamBatch;
    });

    if (invalidMembers.length > 0) {
      const membersList = invalidMembers.map((m) => {
        const memberIndex = editData.members.indexOf(m) + 1;
        const memberLabel = memberIndex === 1 ? 'Team Leader' : `Member ${memberIndex}`;
        return `${memberLabel}: ${m.indexNumber}`;
      }).join(', ');

      showToast(`Index numbers must start with ${editData.teamBatch}. Check: ${membersList}`, 'error');
      return;
    }

    // Validate index number format (6 digits + letter)
    const indexRegex = /^[0-9]{6}[A-Z]$/;
    const invalidFormats = editData.members.filter((member) => {
      const indexNumber = member.indexNumber?.trim().toUpperCase();
      return !indexRegex.test(indexNumber);
    });

    if (invalidFormats.length > 0) {
      const membersList = invalidFormats.map((m) => {
        const memberIndex = editData.members.indexOf(m) + 1;
        const memberLabel = memberIndex === 1 ? 'Team Leader' : `Member ${memberIndex}`;
        return `${memberLabel}`;
      }).join(', ');

      showToast(`Invalid index format (must be 6 digits + letter). Check: ${membersList}`, 'error');
      return;
    }

    // Validate emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = editData.members.filter((member) => {
      return !emailRegex.test(member.email?.trim());
    });

    if (invalidEmails.length > 0) {
      const membersList = invalidEmails.map((m) => {
        const memberIndex = editData.members.indexOf(m) + 1;
        const memberLabel = memberIndex === 1 ? 'Team Leader' : `Member ${memberIndex}`;
        return memberLabel;
      }).join(', ');

      showToast(`Invalid email addresses. Check: ${membersList}`, 'error');
      return;
    }

    setShowEditModal(false);
    setIsTyping(true);
    setIsSubmitting(true);

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
        const botMessage: Message = {
          role: "bot",
          content: data.reply,
          buttons: data.buttons || undefined
        };
        setMessages((prev) => [...prev, botMessage]);

        // Check if the reply is an error or success
        if (data.reply.includes('❌') || data.reply.toLowerCase().includes('error') || data.reply.toLowerCase().includes('invalid')) {
          // Remove emoji from message since toast already has an icon
          const cleanMessage = data.reply.split('\n')[0].replace(/❌/g, '').trim();
          showToast(cleanMessage, 'error');
        } else if (data.reply.includes('🎉') || data.reply.toLowerCase().includes('successful')) {
          showToast('Registration submitted successfully!', 'success');
        }
      }
    } catch (error) {
      console.error("Error saving edited data:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Error saving changes. Please try again." }
      ]);
      showToast('Submission failed. Please try again.', 'error');
    } finally {
      setIsTyping(false);
      setIsSubmitting(false);
    }
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
    <div className="w-full h-full p-3 sm:p-4 md:p-5 lg:p-6 bg-white/10 backdrop-blur-xl border border-[#37c2cc]/30 rounded-xl md:rounded-2xl shadow-2xl relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#37c2cc]/10 via-transparent to-[#0e243f]/20 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 mb-3 md:mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3
            className="text-base sm:text-lg md:text-xl font-semibold text-white flex-1 text-center"
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
            className="text-[10px] sm:text-xs text-white/60 hover:text-white/90 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded hover:bg-white/10 transition-all flex-shrink-0"
            title="Start new registration"
          >
            🔄 <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-[#37c2cc]/50 to-transparent" />
      </div>

      {/* Messages Container */}
      <div className="relative z-10 h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] overflow-y-auto mb-3 md:mb-4 bg-black/20 backdrop-blur-sm rounded-xl md:rounded-2xl border border-[#37c2cc]/20 p-2.5 sm:p-3 md:p-4 space-y-2 sm:space-y-2.5 md:space-y-3 scrollbar-thin scrollbar-thumb-[#37c2cc]/50 scrollbar-track-transparent">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className={`flex ${m.role === "user" ? "flex-row-reverse" : "flex-row"} items-start gap-1.5 sm:gap-2 max-w-[90%] sm:max-w-[85%]`}>
              {/* Avatar */}
              {m.role === "bot" && (
                <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-[#37c2cc] to-[#2ba8b3] flex items-center justify-center shadow-lg ring-2 ring-[#37c2cc]/30">
                  <span className="text-sm sm:text-base md:text-lg">🤖</span>
                </div>
              )}
              {m.role === "user" && (
                <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-[#0e243f] to-[#204168] flex items-center justify-center shadow-lg ring-2 ring-white/20">
                  <span className="text-sm sm:text-base md:text-lg">👤</span>
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
                <div className="px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3">
                  <div
                    className={`text-xs sm:text-sm md:text-[15px] leading-relaxed ${
                      m.role === "user" ? "font-medium whitespace-pre-wrap" : ""
                    }`}
                    style={{
                      fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
                    }}
                    dangerouslySetInnerHTML={
                      m.role === "bot"
                        ? {
                            __html: m.content
                              .replace(/"([^"]+)"/g, '<strong>$1</strong>')
                              .replace(/\n/g, '<br/>'),
                          }
                        : undefined
                    }
                  >
                    {m.role === "user" ? m.content : null}
                  </div>
                  
                  {/* Render buttons if they exist */}
                  {m.buttons && m.buttons.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-2.5 md:mt-3 pt-1.5 sm:pt-2 border-t border-gray-200/50">
                      {m.buttons.map((button, btnIndex) => (
                        <button
                          key={btnIndex}
                          onClick={() => handleButtonClick(button.value)}
                          className="group/btn relative bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] hover:from-[#2ba8b3] hover:to-[#37c2cc] text-white font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
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
      <div className="relative z-10 flex gap-2 sm:gap-2.5 md:gap-3">
        <div className="flex-1 relative">
          <input
            className="w-full bg-white/90 backdrop-blur-sm border-2 border-[#37c2cc]/30 rounded-lg md:rounded-xl p-2 sm:p-2.5 md:p-3 text-sm sm:text-base text-[#0e243f] placeholder-[#0e243f]/60 focus:outline-none focus:ring-2 focus:ring-[#37c2cc] focus:border-[#37c2cc] transition-all duration-300 shadow-lg"
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
          className="bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] hover:from-[#2ba8b3] hover:to-[#37c2cc] text-[#0e243f] font-bold px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base rounded-lg md:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 relative overflow-hidden group"
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
                onChange={(e) => {
                  const newBatch = e.target.value;

                  // Check if any index numbers don't match the new batch
                  const mismatchedMembers = editData.members.filter((member) => {
                    const indexNumber = member.indexNumber?.trim();
                    if (!indexNumber || indexNumber.length < 2) return false;
                    const indexBatch = indexNumber.substring(0, 2);
                    return indexBatch !== newBatch;
                  });

                  if (mismatchedMembers.length > 0) {
                    const membersList = mismatchedMembers.map((m) => {
                      const memberIndex = editData.members.indexOf(m) + 1;
                      const memberLabel = memberIndex === 1 ? 'Team Leader' : `Member ${memberIndex}`;
                      return memberLabel;
                    }).join(', ');

                    showToast(`Batch changed to ${newBatch}. Update index numbers for: ${membersList}`, 'warning');
                  }

                  setEditData({ ...editData, teamBatch: newBatch });
                }}
                className="w-full bg-white/10 border border-[#37c2cc]/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#37c2cc]"
              >
                <option value="23" className="bg-[#0e243f]">Batch 23</option>
                <option value="24" className="bg-[#0e243f]">Batch 24</option>
              </select>
            </div>

            {/* Members */}
            <div className="mb-6">
              <h3 className="text-white/90 mb-3 text-lg font-semibold">Team Members</h3>
              {editData.members.map((member, index) => (
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
                          let newIndexNumber = e.target.value.toUpperCase();

                          // Auto-correct batch prefix if user is typing and has at least 2 digits
                          if (newIndexNumber.length >= 2 && /^\d{2}/.test(newIndexNumber)) {
                            const currentBatchPrefix = newIndexNumber.substring(0, 2);

                            // If the first 2 digits don't match the team batch, replace them
                            if (currentBatchPrefix !== editData.teamBatch) {
                              newIndexNumber = editData.teamBatch + newIndexNumber.substring(2);
                            }
                          }

                          const newMembers = [...editData.members];
                          newMembers[index].indexNumber = newIndexNumber;
                          setEditData({ ...editData, members: newMembers });
                        }}
                        className="w-full bg-white/10 border border-[#37c2cc]/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#37c2cc]"
                        placeholder={`${editData.teamBatch}XXXXY (e.g., ${editData.teamBatch}4001T)`}
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
                disabled={isSubmitting}
                className={`px-6 py-3 bg-gradient-to-r from-[#37c2cc] to-[#2ba8b3] hover:from-[#2ba8b3] hover:to-[#37c2cc] text-white rounded-lg transition-all font-semibold shadow-lg hover:shadow-xl ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Save & Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-[10000] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`min-w-[300px] max-w-md px-6 py-4 rounded-lg shadow-2xl backdrop-blur-xl border-2 transform transition-all duration-300 animate-slide-in ${
              toast.type === 'error'
                ? 'bg-red-500/90 border-red-400 text-white'
                : toast.type === 'warning'
                ? 'bg-yellow-500/90 border-yellow-400 text-gray-900'
                : 'bg-green-500/90 border-green-400 text-white'
            }`}
            style={{
              animation: 'slideIn 0.3s ease-out',
            }}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 text-2xl">
                {toast.type === 'error' && '❌'}
                {toast.type === 'warning' && '⚠️'}
                {toast.type === 'success' && '✅'}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm leading-relaxed">{toast.message}</p>
              </div>
              <button
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="flex-shrink-0 text-xl hover:opacity-70 transition-opacity"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
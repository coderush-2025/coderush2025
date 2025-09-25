"use client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface Message {
  role: "user" | "bot";
  content: string;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: "👋 Hi — I'll register your team for CodeRush 2025. What's your team name?"
    }
  ]);
  const [input, setInput] = useState("");

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

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId, message: input }),
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
        setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
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
      setInput("");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 border rounded">
      <div className="h-96 overflow-y-auto mb-2 border p-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.role === "user" ? "text-right" : "text-left"}
          >
            <span
              className={
                m.role === "user"
                  ? "bg-blue-200 p-2 rounded"
                  : "bg-gray-200 p-2 rounded"
              }
            >
              {m.content}
            </span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          className="flex-1 border rounded p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
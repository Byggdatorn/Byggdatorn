"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Oj! Något gick fel när jag försökte svara 😅" },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Fel: Kunde inte nå servern." },
      ]);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f6f8",
        fontFamily: "Inter, sans-serif",
        color: "#111827",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          width: "900px",
          height: "700px",
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "24px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            fontSize: "1.6rem",
            fontWeight: "700",
            borderBottom: "1px solid #e5e7eb",
            background: "#fafafa",
          }}
        >
          💬 AI Datorbyggare
        </div>

        {/* Meddelanden */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            background: "#f9fafb",
          }}
        >
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                background:
                  m.role === "user" ? "#3b82f6" : "#e5e7eb",
                color: m.role === "user" ? "white" : "#111827",
                padding: "12px 16px",
                borderRadius: "18px",
                maxWidth: "75%",
                whiteSpace: "pre-wrap",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              }}
            >
              {m.content}
            </motion.div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div
          style={{
            display: "flex",
            borderTop: "1px solid #e5e7eb",
            padding: "12px 20px",
            background: "#ffffff",
          }}
        >
          <input
            type="text"
            placeholder="Skriv ditt meddelande..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            style={{
              flex: 1,
              background: "#f3f4f6",
              border: "1px solid #d1d5db",
              borderRadius: "12px",
              outline: "none",
              padding: "10px 14px",
              color: "#111827",
              fontSize: "1rem",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              marginLeft: "12px",
              background: "#3b82f6",
              border: "none",
              borderRadius: "12px",
              padding: "10px 18px",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#2563eb")}
            onMouseOut={(e) => (e.target.style.background = "#3b82f6")}
          >
            Skicka
          </button>
        </div>
      </motion.div>
    </div>
  );
}

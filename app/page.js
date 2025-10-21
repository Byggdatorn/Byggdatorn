"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const [showOptions, setShowOptions] = useState(true);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // Visa välkomstmeddelande första gången
    if (messages.length === 0) {
      setTimeout(() => {
        setMessages([
          {
            role: "assistant",
            content:
              "Hej! 👋 Mitt namn är **Erik**, din personliga AI-datorbyggare. Vad kan jag hjälpa dig med idag?",
          },
        ]);
      }, 600);
    }
  }, [messages]);

  const handleOptionSelect = (option) => {
    const userMessage = { role: "user", content: option };
    setMessages((prev) => [...prev, userMessage]);
    setShowOptions(false);

    let assistantResponse = "";
    if (option === "🧩 Bygga egen dator") {
      assistantResponse =
        "Perfekt! 💪 Då ska vi se till att bygga rätt dator för dig. Börja gärna med att berätta vad du ska använda datorn till — till exempel spel, arbete, redigering eller något annat.";
    } else if (option === "⚙️ Uppgradera befintlig dator") {
      assistantResponse =
        "Låter bra! 🔧 Då behöver jag veta lite mer om din nuvarande dator. Kan du skriva vad du har för processor, grafikkort och RAM-minne just nu?";
    } else {
      assistantResponse =
        "Självklart! 💬 Berätta gärna lite mer om din fråga så hjälper jag dig på bästa sätt.";
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: assistantResponse }]);
    }, 800);
  };

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
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Oj! Något gick fel när jag försökte svara 😅",
          },
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
        position: "relative",
        fontFamily: "Inter, sans-serif",
        color: "#1f2937",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* 🌆 Bakgrundsbild */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.75)",
          zIndex: 0,
        }}
      />

      {/* 🔲 Overlay för toning */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom right, rgba(245, 238, 230, 0.25), rgba(255,255,255,0.15))",
          backdropFilter: "blur(3px)",
          zIndex: 1,
        }}
      />

      {/* 🧩 Innehåll */}
      <div
        style={{
          display: "flex",
          width: "100%",
          maxWidth: "1400px",
          height: "90vh",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* SIDOMENY */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            width: "250px",
            background: "rgba(255, 250, 240, 0.8)",
            borderRight: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
            padding: "30px 20px",
            borderRadius: "20px 0 0 20px",
            boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
          }}
        >
          <h1
            style={{
              fontSize: "1.6rem",
              fontWeight: "700",
              marginBottom: "30px",
              color: "#bfa87a",
              textAlign: "center",
            }}
          >
            🧠 Byggdatorn
          </h1>

          <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[ 
              { id: "chat", label: "💬 Chat" },
              { id: "components", label: "🧩 Komponenter" },
              { id: "tips", label: "📘 Tips & Guider" },
              { id: "settings", label: "⚙️ Inställningar" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? "#d6c4a8" : "transparent",
                  color: activeTab === tab.id ? "#1f2937" : "#374151",
                  fontWeight: "600",
                  border: "none",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "0.2s",
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </motion.div>

        {/* HUVUDINNEHÅLL */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px",
          }}
        >
          {activeTab === "chat" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                width: "900px",
                height: "700px",
                background: "rgba(255, 255, 255, 0.9)",
                border: "1px solid #d6ccc2",
                borderRadius: "24px",
                boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                backdropFilter: "blur(6px)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  fontSize: "1.7rem",
                  fontWeight: "700",
                  borderBottom: "1px solid #e5e7eb",
                  background: "#e9dccb",
                  color: "#1f2937",
                }}
              >
                💻 AI Datorbyggare
              </div>

              {/* Meddelanden */}
              <div
                style={{
                  flex: 1,
                  padding: "20px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  background: "rgba(248, 247, 244, 0.9)",
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
                      background: m.role === "user" ? "#d4b996" : "#e5e7eb",
                      color: "#1f2937",
                      padding: "12px 16px",
                      borderRadius:
                        m.role === "user"
                          ? "18px 18px 4px 18px"
                          : "18px 18px 18px 4px",
                      maxWidth: "75%",
                      whiteSpace: "pre-wrap",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                  >
                    {m.content}
                  </motion.div>
                ))}

                {/* Alternativknappar */}
                {showOptions && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                      marginTop: "10px",
                    }}
                  >
                    {[
                      "🧩 Bygga egen dator",
                      "⚙️ Uppgradera befintlig dator",
                      "💬 Övriga datorfrågor",
                    ].map((option) => (
                      <button
                        key={option}
                        onClick={() => handleOptionSelect(option)}
                        style={{
                          background: "#d4b996",
                          border: "none",
                          borderRadius: "12px",
                          padding: "10px 16px",
                          fontWeight: "600",
                          cursor: "pointer",
                          color: "#1f2937",
                          transition: "0.2s",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.background = "#b89b7a")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.background = "#d4b996")
                        }
                      >
                        {option}
                      </button>
                    ))}
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Inputfält */}
              <div
                style={{
                  display: "flex",
                  borderTop: "1px solid #e5e7eb",
                  padding: "14px 20px",
                  background: "#ffffff",
                }}
              >
                <input
                  type="text"
                  placeholder="Skriv din fråga om datorbygge..."
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
                    background: "#d4b996",
                    border: "none",
                    borderRadius: "12px",
                    padding: "10px 20px",
                    color: "#1f2937",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => (e.target.style.background = "#b89b7a")}
                  onMouseOut={(e) => (e.target.style.background = "#d4b996")}
                >
                  Skicka
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}


import React, { useState, useEffect } from "react";
import Logo from "./components/Logo/Logo";
import PromptInput from "./components/PrompInput/PromptInput";
import "./App.css";

interface Message {
  role: "user" | "assistant";
  content: string;
  duration?: string;
  tokensPerSecond?: string;
}

interface OllamaResponse {
  response: string;
  total_duration: number;
  eval_count: number;
  eval_duration: number;
}

function App() {
  // Load previous conversations from localStorage
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const savedMessages = localStorage.getItem("khepia-chat-history");

      return savedMessages
        ? (JSON.parse(savedMessages) as Message[])
        : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Automatically save messages whenever they change
  useEffect(() => {
    localStorage.setItem(
      "khepia-chat-history",
      JSON.stringify(messages)
    );
  }, [messages]);

  // Clear conversation history
  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("khepia-chat-history");
    setError("");
  };

  // Send prompt to Ollama
  const handleSendPrompt = async (prompt: string) => {
    setError("");

    setMessages((previous) => [
      ...previous,
      { role: "user", content: prompt },
    ]);

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:11434/api/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "smollm2:360m",

            prompt: `User's name is Khethiwe.

User's question: ${prompt}

Answer the user's question while following your system instructions.`,

            system: `
You are KHEPIA AI, a friendly and intelligent AI assistant.

Your user's name is Khethiwe.

If the user asks "Who am I?", "What is my name?", or similar questions,
answer: "Your name is Khethiwe!"

Always remember that you are KHEPIA AI and the user's name is Khethiwe.

Be friendly, helpful and clear in your responses.
`,
            stream: false,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Could not connect to Ollama.");
      }

      const data: OllamaResponse = await response.json();

      const duration = (
        data.total_duration / 1_000_000_000
      ).toFixed(2);

      const tokensPerSecond =
        data.eval_duration > 0
          ? (
            data.eval_count /
            (data.eval_duration / 1_000_000_000)
          ).toFixed(2)
          : "0";

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: data.response,
          duration,
          tokensPerSecond,
        },
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">


      <header className="app-header">
        <Logo />

        <button
          className="clear-chat-btn"
          onClick={clearChat}
          disabled={loading}
        >
          Clear Chat
        </button>
      </header>


      <main className="chat-area">

        {messages.length === 0 && (
          <div className="welcome-message">
            <h1>Welcome to KHEPIA AI</h1>
            <p>What would you like to ask me today?</p>
          </div>
        )}

        <div className="messages">

          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.role}`}
            >
              <strong>
                {message.role === "user"
                  ? "You"
                  : "KHEPIA AI"}
              </strong>

              <p>{message.content}</p>

              {message.role === "assistant" && (
                <small>
                  Duration: {message.duration}s | Speed:{" "}
                  {message.tokensPerSecond} tokens/sec
                </small>
              )}
            </div>
          ))}

          {loading && (
            <div className="loading-message">
              <span className="spinner"></span>
              KHEPIA AI is thinking...
            </div>
          )}

        </div>

        {error && (
          <p className="error-message">{error}</p>
        )}

      </main>


      <footer className="input-area">
        <PromptInput
          onSend={handleSendPrompt}
          loading={loading}
        />
      </footer>

    </div>
  );
}

export default App;

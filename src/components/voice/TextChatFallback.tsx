"use client";

import { useState } from "react";

export default function TextChatFallback() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const send = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setMessages((m) => [...m, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const msg = body?.error || `${res.status} ${res.statusText}`;
        setError(msg);
        // fallback canned reply
        setMessages((m) => [...m, { role: "assistant", content: "Sorry — chat fallback is unavailable right now. Please try voice or ensure the server-side OPENAI_API_KEY is configured." }]);
      } else {
        const data = await res.json();
        const reply = data?.reply || "(no reply)";
        setMessages((m) => [...m, { role: "assistant", content: reply }]);
      }
    } catch (e) {
      setError(String(e));
      setMessages((m) => [...m, { role: "assistant", content: "The chat service is unreachable. Please ensure the server is running and OPENAI_API_KEY is configured." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-card/90 backdrop-blur-sm border border-border rounded-xl p-4 mb-8">
      <div className="space-y-3 mb-3">
        {messages.map((msg, idx) => (
          <div key={idx} className="">
            <div className="font-semibold text-xs text-muted-foreground mb-1">{msg.role === "assistant" ? "DentWise AI" : "You"}</div>
            <p className="text-foreground">{msg.content}</p>
          </div>
        ))}
      </div>

      {error && <div className="text-destructive text-sm mb-2">{error}</div>}

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-md border border-border p-2 bg-transparent"
          placeholder="Type your question for the assistant..."
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
        />
        <button
          className="px-4 py-2 bg-primary text-white rounded-md"
          onClick={send}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      <div className="text-xs text-muted-foreground mt-2">
        Note: text chat uses a server-side OpenAI key. If not configured, a helpful error or canned reply is shown.
      </div>
    </div>
  );
}

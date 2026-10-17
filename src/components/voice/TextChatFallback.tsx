"use client";

import type { FormEvent } from "react";
import { useState } from "react";

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

function getDemoReply(message: string) {
  const normalizedMessage = message.toLowerCase();

  if (/appointment|book|schedule|dentist/.test(normalizedMessage)) {
    return "Demo reply: use Book appointment to browse dentists and available times. This sample chat does not create bookings.";
  }

  if (/pain|hurt|ache|swelling|bleed|emergency/.test(normalizedMessage)) {
    return "Demo reply: this sample cannot assess symptoms or provide a diagnosis. Please contact a licensed dentist. For severe swelling, uncontrolled bleeding, or trouble breathing, seek urgent medical care.";
  }

  return "Demo reply: thanks for trying Hulux AI. This is a local sample chat; no AI service is connected. Use the appointment page to book a visit.";
}

export default function TextChatFallback() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const send = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userMessage = input.trim();
    if (!userMessage) return;

    setMessages((previous) => [
      ...previous,
      {
        id: previous.length,
        role: "user",
        content: userMessage,
      },
      {
        id: previous.length + 1,
        role: "assistant",
        content: getDemoReply(userMessage),
      },
    ]);
    setInput("");
  };

  return (
    <div className="mb-8 w-full rounded-xl border border-border bg-card/90 p-4 backdrop-blur-sm">
      <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
        Demo mode: sample replies only. No AI service is connected, and this is
        not medical advice.
      </p>

      <div
        aria-live="polite"
        className="mb-4 max-h-64 space-y-3 overflow-y-auto"
      >
        {messages.map((message) => (
          <div key={message.id}>
            <div className="mb-1 text-xs font-semibold text-muted-foreground">
              {message.role === "assistant" ? "Hulux AI demo" : "You"}
            </div>
            <p className="text-foreground">{message.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={send} className="flex gap-2">
        <input
          aria-label="Message for Hulux AI demo"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="min-w-0 flex-1 rounded-md border border-border bg-transparent p-2"
          placeholder="Try a sample question..."
        />
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}

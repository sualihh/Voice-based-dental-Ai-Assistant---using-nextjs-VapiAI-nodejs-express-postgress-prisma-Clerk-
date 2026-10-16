"use client";

import { vapi } from "@/lib/vapi";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Card } from "../ui/card";
import TextChatFallback from "./TextChatFallback";

type TranscriptMessage = {
  id: number;
  content: string;
  role: "assistant" | "user";
};

type VapiTranscriptEvent = {
  type: "transcript";
  transcriptType: "final";
  transcript: string;
  role: "assistant" | "user";
};

function isVapiTranscriptEvent(value: unknown): value is VapiTranscriptEvent {
  if (typeof value !== "object" || value === null) return false;

  const message = value as Record<string, unknown>;
  return (
    message.type === "transcript" &&
    message.transcriptType === "final" &&
    typeof message.transcript === "string" &&
    (message.role === "assistant" || message.role === "user")
  );
}

function getVoiceErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return "The voice assistant encountered an error. Please try again.";
}

function VapiWidget() {
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [callEnded, setCallEnded] = useState(false);
  const [callError, setCallError] = useState("");

  const { user, isLoaded } = useUser();

  const messageContainerRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);
  const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
  const [showTextChat, setShowTextChat] = useState(false);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  });

  useEffect(() => {
    const client = vapi;
    if (!client) return;

    const handleCallStart = () => {
      setConnecting(false);
      setCallActive(true);
      setCallEnded(false);
      setCallError("");
    };

    const handleCallEnd = () => {
      setCallActive(false);
      setConnecting(false);
      setIsSpeaking(false);
      setCallEnded(true);
    };

    const handleSpeechStart = () => {
      setIsSpeaking(true);
    };

    const handleSpeechEnd = () => {
      setIsSpeaking(false);
    };

    const handleMessage = (message: unknown) => {
      if (isVapiTranscriptEvent(message)) {
        setMessages((previous) => [
          ...previous,
          {
            id: messageIdRef.current++,
            content: message.transcript,
            role: message.role,
          },
        ]);
      }
    };

    const handleError = (error: unknown) => {
      setConnecting(false);
      setCallActive(false);
      setIsSpeaking(false);
      setCallError(getVoiceErrorMessage(error));
    };

    client
      .on("call-start", handleCallStart)
      .on("call-end", handleCallEnd)
      .on("speech-start", handleSpeechStart)
      .on("speech-end", handleSpeechEnd)
      .on("message", handleMessage)
      .on("error", handleError);

    return () => {
      client
        .off("call-start", handleCallStart)
        .off("call-end", handleCallEnd)
        .off("speech-start", handleSpeechStart)
        .off("speech-end", handleSpeechEnd)
        .off("message", handleMessage)
        .off("error", handleError);
    };
  }, []);

  const toggleCall = async () => {
    const client = vapi;
    if (!client || !assistantId) {
        setCallError(
          "Voice assistant is not configured. Add the Vapi public API key and assistant ID to the app environment."
        );
        return;
    }

    if (callActive) {
        client.stop();
        return;
    }

    try {
        setConnecting(true);
        setCallError("");
        setMessages([]);
        setCallEnded(false);
        await client.start(assistantId);
    } catch (error) {
        setConnecting(false);
        setCallError(
          error instanceof Error
            ? error.message
            : "Unable to start the voice assistant. Check microphone permissions and try again."
        );
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 flex flex-col overflow-hidden pb-20">
      {/* TITLE */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-mono">
          <span>Talk to Your </span>
          <span className="text-primary uppercase">AI Dental Assistant</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Have a voice conversation with our AI assistant for dental advice and
          guidance
        </p>
      </div>

      {/* VIDEO CALL AREA */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* AI ASSISTANT CARD */}

        <Card className="bg-card/90 backdrop-blur-sm border border-border overflow-hidden relative">
          <div className="aspect-video flex flex-col items-center justify-center p-6 relative">
            {/* AI VOICE ANIMATION */}
            <div
              className={`absolute inset-0 ${
                isSpeaking ? "opacity-30" : "opacity-0"
              } transition-opacity duration-300`}
            >
              {/* voice wave animation when speaking */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-center items-center h-20">
                {[20, 35, 50, 35, 20].map((height, i) => (
                  <div
                    key={height}
                    className={`mx-1 h-16 w-1 bg-primary rounded-full ${
                      isSpeaking ? "animate-sound-wave" : ""
                    }`}
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      height: isSpeaking ? `${height}%` : "5%",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* AI LOGO */}
            <div className="relative size-32 mb-4">
              <div
                className={`absolute inset-0 bg-primary opacity-10 rounded-full blur-lg ${
                  isSpeaking ? "animate-pulse" : ""
                }`}
              />

              <div className="relative w-full h-full rounded-full bg-card flex items-center justify-center border border-border overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-primary/10 to-primary/5"></div>
                <Image
                  src="/logo.png"
                  alt="AI Dental Assistant"
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain"
                />
              </div>
            </div>

            <h2 className="text-xl font-bold text-foreground">DentWise AI</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Dental Assistant
            </p>

            {/* SPEAKING INDICATOR */}
            <div
              className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border ${
                isSpeaking ? "border-primary" : ""
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isSpeaking ? "bg-primary animate-pulse" : "bg-muted"
                }`}
              />

              <span className="text-xs text-muted-foreground">
                {isSpeaking
                  ? "Speaking..."
                  : callActive
                    ? "Listening..."
                    : callEnded
                      ? "Call ended"
                      : "Waiting..."}
              </span>
            </div>
          </div>
        </Card>

        {/* USER CARD */}
        <Card
          className={`bg-card/90 backdrop-blur-sm border overflow-hidden relative`}
        >
          <div className="aspect-video flex flex-col items-center justify-center p-6 relative">
            {/* User Image */}
            <div className="relative size-32 mb-4">
              <Image
                src={user?.imageUrl || "/logo.png"}
                alt="User"
                width={128}
                height={128}
                className="size-full object-cover rounded-full"
              />
            </div>

            <h2 className="text-xl font-bold text-foreground">You</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {user ? `${user.firstName} ${user.lastName || ""}`.trim() : "Guest"}
            </p>

            {/* User Ready Text */}
            <div
              className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border`}
            >
              <div className={`w-2 h-2 rounded-full bg-muted`} />
              <span className="text-xs text-muted-foreground">Ready</span>
            </div>
          </div>
        </Card>
      </div>

      {/* MESSAGE CONTAINER */}
      {messages.length > 0 && (
        <div
          ref={messageContainerRef}
          className="w-full bg-card/90 backdrop-blur-sm border border-border rounded-xl p-4 mb-8 h-64 overflow-y-auto transition-all duration-300 scroll-smooth"
        >
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="message-item animate-in fade-in duration-300"
              >
                <div className="font-semibold text-xs text-muted-foreground mb-1">
                  {msg.role === "assistant" ? "DentWise AI" : "You"}:
                </div>
                <p className="text-foreground">{msg.content}</p>
              </div>
            ))}

            {callEnded && (
              <div className="message-item animate-in fade-in duration-300">
                <div className="font-semibold text-xs text-primary mb-1">
                  System:
                </div>
                <p className="text-foreground">
                  Call ended. Thank you for using Dent AI!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {callError && (
        <p role="alert" className="mb-4 text-center text-sm text-destructive">
          {callError}
        </p>
      )}

      {/* CALL CONTROLS */}
      <div className="w-full flex justify-center gap-4">
        <Button
          className={`w-44 text-xl rounded-3xl ${
            callActive
              ? "bg-destructive hover:bg-destructive/90"
              : "bg-primary hover:bg-primary/90"
          } text-white relative`}
          onClick={toggleCall}
          disabled={connecting || !isLoaded || !assistantId}
        >
          {connecting && (
            <span className="absolute inset-0 rounded-full animate-ping bg-primary/50 opacity-75"></span>
          )}

          <span>
            {callActive
              ? "End Call"
              : connecting
                ? "Connecting..."
                : callEnded
                  ? "Start Another Call"
                  : "Start Call"}
          </span>
        </Button>

        {/* Text chat toggle (fallback) */}
        <Button
          variant="secondary"
          className={`w-44 text-sm rounded-3xl`}
          onClick={() => setShowTextChat((s) => !s)}
        >
          {showTextChat ? "Hide Text Chat" : "Open Text Chat"}
        </Button>
      </div>

      {/* Text chat fallback UI */}
      {showTextChat && (
        <div className="mt-6">
          <TextChatFallback />
        </div>
      )}
    </div>
  );
}

export default VapiWidget;

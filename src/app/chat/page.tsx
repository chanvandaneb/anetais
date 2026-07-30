"use client";

import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  ChevronDown,
  Plus,
  MessageSquare,
  Bot,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Link2,
  Sigma,
  Code,
  SquareCode,
  Sparkles,
  Eraser,
  Globe,
  Paperclip,
  SlidersHorizontal,
  CircleSlash,
  Mic,
  Info,
  Filter,
  ChevronRight,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockChats, assistants, faqs, faqAnswers, type ChatItem } from "@/lib/mock-data";
import { ModelPicker } from "@/components/chat/ModelPicker";
import { GenerationParams } from "@/components/chat/GenerationParams";
import { useToast } from "@/components/ui/Toast";
import { useUsage } from "@/components/ui/UsageContext";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
  reaction?: "up" | "down";
};

const toolbarIcons = [
  Bold, Italic, Underline, Strikethrough,
  List, ListOrdered, ListChecks, Quote,
  Link2, Sigma, Code, SquareCode,
];

const MOCK_REPLIES = [
  "Absolutely! Here's a detailed mock response for the UI. In a live deployment, this would stream token-by-token from the selected language model via the provider's streaming API. The assistant would analyze your message, reason about context from prior turns, and generate a coherent reply — all arriving in real time so you see each word as it's produced.",
  "Great question! This is a simulated streaming reply so you can see how the conversation thread renders with longer content that wraps across multiple lines. The typing animation gives it a realistic feel as if the model is actually generating output.",
  "Noted — here's my take. This placeholder response lets you preview layout, bubble sizing, and the typing indicator before connecting a real model. The streaming effect uses a character-by-character interval, mimicking actual token throughput from models like Claude, GPT-4, or Gemini.",
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }
  return (
    <button
      onClick={copy}
      className="flex h-6 w-6 items-center justify-center rounded-md opacity-0 transition-all group-hover:opacity-100 hover:bg-[var(--bg-hover)]"
      title="Copy"
      style={{ color: "var(--text-tertiary)" }}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

export default function ChatPage() {
  const [chats, setChats] = useState<ChatItem[]>(mockChats);
  const [activeChatId, setActiveChatId] = useState(mockChats[0].id);
  const [modelName, setModelName] = useState("gemini-flash-latest");
  const [modelPickerOpen, setModelPickerOpen] = useState(false);
  const [paramsOpen, setParamsOpen] = useState(false);
  const [threads, setThreads] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const streamIntervals = useRef<Record<string, ReturnType<typeof setInterval>>>({});
  const { showToast } = useToast();
  const { addUsage } = useUsage();

  const messages = threads[activeChatId] ?? [];
  const isStreaming = messages.some(m => m.streaming);

  const filteredChats = useMemo(
    () => chats.filter((c) => c.title.toLowerCase().includes(query.toLowerCase())),
    [chats, query]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, messages[messages.length - 1]?.content]);

  function setReaction(chatId: string, msgId: string, reaction: "up" | "down") {
    setThreads(prev => ({
      ...prev,
      [chatId]: (prev[chatId] ?? []).map(m => m.id === msgId ? { ...m, reaction } : m),
    }));
  }

  function startStream(chatId: string, fullContent: string) {
    const streamId = "a-" + Date.now();
    setThreads(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] ?? []), { id: streamId, role: "assistant", content: "", streaming: true }],
    }));

    let idx = 0;
    const interval = setInterval(() => {
      idx += Math.ceil(Math.random() * 4 + 2);
      if (idx >= fullContent.length) {
        idx = fullContent.length;
        clearInterval(interval);
        delete streamIntervals.current[streamId];
        const tokens = Math.round(fullContent.length / 4);
        addUsage("Chat Completion", modelName, tokens, Math.max(1, Math.round(tokens / 50)));
        setThreads(prev => ({
          ...prev,
          [chatId]: (prev[chatId] ?? []).map(m =>
            m.id === streamId ? { ...m, content: fullContent, streaming: false } : m
          ),
        }));
        return;
      }
      setThreads(prev => ({
        ...prev,
        [chatId]: (prev[chatId] ?? []).map(m =>
          m.id === streamId ? { ...m, content: fullContent.slice(0, idx) } : m
        ),
      }));
    }, 18);
    streamIntervals.current[streamId] = interval;
  }

  function replyTo(chatId: string) {
    const reply = MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];
    setTimeout(() => startStream(chatId, reply), 400 + Math.random() * 300);
  }

  function handleNewChat() {
    const id = "c-" + Date.now();
    const chat: ChatItem = { id, title: "New Chat", model: modelName, timestamp: "now" };
    setChats((prev) => [chat, ...prev]);
    setActiveChatId(id);
    setThreads((prev) => ({ ...prev, [id]: [] }));
  }

  function handleAssistantClick(assistantId: string) {
    const assistant = assistants.find((a) => a.id === assistantId);
    if (!assistant) return;
    const id = "c-" + Date.now();
    const chat: ChatItem = { id, title: assistant.name, model: modelName, timestamp: "now" };
    setChats((prev) => [chat, ...prev]);
    setActiveChatId(id);
    setThreads((prev) => ({
      ...prev,
      [id]: [{ id: "a-" + Date.now(), role: "assistant", content: assistant.greeting }],
    }));
    showToast(`Started chat with ${assistant.name}`);
  }

  function handleFaqClick(question: string) {
    const userMsg: Message = { id: "u-" + Date.now(), role: "user", content: question };
    setThreads(prev => ({ ...prev, [activeChatId]: [...(prev[activeChatId] ?? []), userMsg] }));
    replyTo(activeChatId);
  }

  const handleSend = useCallback(() => {
    if (!input.trim() || isStreaming) return;
    const text = input.trim();
    setInput("");
    const userMsg: Message = { id: "u-" + Date.now(), role: "user", content: text };
    setThreads(prev => ({ ...prev, [activeChatId]: [...(prev[activeChatId] ?? []), userMsg] }));
    if (chats.find(c => c.id === activeChatId)?.title === "New Chat") {
      setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, title: text.slice(0, 40) } : c));
    }
    replyTo(activeChatId);
  }, [input, activeChatId, isStreaming, chats]);

  function handleRegenerate() {
    const msgs = threads[activeChatId] ?? [];
    const lastAssistant = [...msgs].reverse().find(m => m.role === "assistant" && !m.streaming);
    if (!lastAssistant) return;
    setThreads(prev => ({
      ...prev,
      [activeChatId]: (prev[activeChatId] ?? []).filter(m => m.id !== lastAssistant.id),
    }));
    setTimeout(() => replyTo(activeChatId), 150);
  }

  const tokenEstimate = Math.ceil(input.length / 4);
  const lastIsAssistant = messages.length > 0 && messages[messages.length - 1].role === "assistant" && !messages[messages.length - 1].streaming;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      {/* LEFT PANE */}
      {leftCollapsed ? (
        <div className="flex w-[52px] flex-shrink-0 flex-col items-center border-r py-4" style={{ borderColor: "var(--border)", background: "var(--bg-subtle)" }}>
          <button
            type="button"
            onClick={() => setLeftCollapsed(false)}
            className="rounded-lg p-1.5 transition-colors hover:bg-[var(--bg-hover)]"
            style={{ color: "var(--text-tertiary)" }}
            title="Expand sidebar"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex w-[300px] flex-shrink-0 flex-col border-r" style={{ borderColor: "var(--border)", background: "var(--bg-subtle)" }}>
          <div className="flex items-center justify-between px-4 py-4">
            <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-lg font-bold tracking-tight text-transparent">
              AnetAIS
            </span>
            <button
              type="button"
              onClick={() => setLeftCollapsed(true)}
              className="rounded-lg p-1.5 transition-colors hover:bg-[var(--bg-hover)]"
              style={{ color: "var(--text-tertiary)" }}
              title="Collapse sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>

          <div className="px-3">
            <div className="flex items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}>
              <Search className="h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search chats…"
                className="flex-1 bg-transparent text-sm placeholder:text-[var(--text-tertiary)] focus:outline-none"
                style={{ color: "var(--text-secondary)" }}
              />
              <kbd className="rounded border px-1 py-0.5 text-[10px]" style={{ borderColor: "var(--border)", color: "var(--text-tertiary)" }}>⌘K</kbd>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between px-4">
            <button className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>
              <ChevronDown className="h-3.5 w-3.5" />
              Chat list
            </button>
            <button
              type="button"
              onClick={handleNewChat}
              className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs transition-colors hover:bg-[var(--bg-hover)]"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              <Plus className="h-3 w-3" />
              New
            </button>
          </div>

          <div className="mt-2 flex-1 space-y-0.5 overflow-y-auto px-2 pb-4">
            {filteredChats.length === 0 ? (
              <div className="px-3 py-6 text-center text-xs" style={{ color: "var(--text-tertiary)" }}>
                No chats match &ldquo;{query}&rdquo;
              </div>
            ) : (
              filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-[var(--bg-hover)]",
                    chat.id === activeChatId && "bg-[var(--bg-active)]"
                  )}
                >
                  <MessageSquare className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "var(--text-tertiary)" }} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium" style={{ color: chat.id === activeChatId ? "var(--text-primary)" : "var(--text-secondary)" }}>{chat.title}</div>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="truncate text-[10px]" style={{ color: "var(--text-tertiary)" }}>{chat.model}</span>
                    </div>
                  </div>
                  <span className="flex-shrink-0 text-[10px]" style={{ color: "var(--text-tertiary)" }}>{chat.timestamp}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* RIGHT PANE */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 border-b px-6 py-3" style={{ borderColor: "var(--border)" }}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setModelPickerOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-sm text-indigo-400 hover:bg-indigo-500/20 transition-colors"
            >
              <Zap className="h-3.5 w-3.5" />
              {modelName}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {modelPickerOpen && (
              <ModelPicker
                onClose={() => setModelPickerOpen(false)}
                onSelect={(name) => {
                  setModelName(name);
                  showToast(`Switched to ${name}`, "info");
                }}
              />
            )}
          </div>
          <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            {chats.find(c => c.id === activeChatId)?.title ?? "Chit chat"}
          </span>
          <div className="ml-auto flex items-center gap-1">
            {lastIsAssistant && (
              <button
                type="button"
                onClick={handleRegenerate}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors hover:bg-[var(--bg-hover)]"
                style={{ color: "var(--text-tertiary)" }}
                title="Regenerate last response"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Regenerate
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {messages.length === 0 ? (
            <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-600 shadow-lg shadow-indigo-500/25">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <h1 className="mt-4 text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
                👋 {greeting()}
              </h1>
              <p className="mt-2 max-w-sm text-sm" style={{ color: "var(--text-secondary)" }}>
                I'm AnetAI — your intelligent assistant. What can I help you with today?
              </p>

              <div className="mt-8 w-full">
                <div className="mb-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>
                  Start with an assistant
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {assistants.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => handleAssistantClick(a.id)}
                      className="group rounded-xl border p-4 text-left transition-all hover:border-indigo-500/40 hover:shadow-md hover:shadow-indigo-500/10 hover:bg-[var(--bg-hover)]"
                      style={{ borderColor: "var(--border)", background: "var(--bg-subtle)" }}
                    >
                      <div className="text-2xl">{a.emoji}</div>
                      <div className="mt-2 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{a.name}</div>
                      <div className="mt-1 text-xs" style={{ color: "var(--text-tertiary)" }}>{a.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 w-full">
                <div className="mb-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>
                  Quick questions
                </div>
                <div className="flex flex-wrap gap-2">
                  {faqs.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleFaqClick(q)}
                      className="rounded-full border px-4 py-2 text-xs transition-colors hover:border-indigo-500/40 hover:bg-[var(--bg-hover)]"
                      style={{ borderColor: "var(--border)", background: "var(--bg-subtle)", color: "var(--text-secondary)" }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto flex max-w-2xl flex-col gap-5">
              {messages.map((m, i) => (
                <div key={m.id} className={cn("group flex items-start gap-3", m.role === "user" && "flex-row-reverse")}>
                  <div
                    className={cn(
                      "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                      m.role === "user"
                        ? "bg-gradient-to-br from-indigo-400 to-indigo-600 text-white"
                        : "border bg-[var(--bg-muted)]"
                    )}
                    style={m.role === "assistant" ? { borderColor: "var(--border)" } : {}}
                  >
                    {m.role === "user" ? "CO" : <Bot className="h-4 w-4 text-indigo-500" />}
                  </div>

                  <div className="flex flex-col gap-1">
                    <div
                      className={cn(
                        "max-w-md rounded-xl px-4 py-2.5 text-sm leading-relaxed",
                        m.role === "user"
                          ? "bg-indigo-500/15 text-[var(--text-primary)]"
                          : "border bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
                      )}
                      style={m.role === "assistant" ? { borderColor: "var(--border)" } : {}}
                    >
                      {m.content}
                      {m.streaming && (
                        <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-indigo-400" />
                      )}
                    </div>

                    {/* Actions */}
                    {!m.streaming && (
                      <div className={cn("flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100", m.role === "user" && "flex-row-reverse")}>
                        <CopyButton text={m.content} />
                        {m.role === "assistant" && (
                          <>
                            <button
                              onClick={() => setReaction(activeChatId, m.id, "up")}
                              className={cn("flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-[var(--bg-hover)]", m.reaction === "up" && "text-green-500")}
                              style={{ color: m.reaction === "up" ? undefined : "var(--text-tertiary)" }}
                            >
                              <ThumbsUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setReaction(activeChatId, m.id, "down")}
                              className={cn("flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-[var(--bg-hover)]", m.reaction === "down" && "text-red-400")}
                              style={{ color: m.reaction === "down" ? undefined : "var(--text-tertiary)" }}
                            >
                              <ThumbsDown className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="border-t px-6 py-4" style={{ borderColor: "var(--border)" }}>
          <div className="relative mx-auto max-w-3xl rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--bg-subtle)" }}>
            <div className="flex items-center gap-0.5 border-b px-3 py-2" style={{ borderColor: "var(--border)" }}>
              {toolbarIcons.map((Icon, i) => (
                <button
                  key={i}
                  type="button"
                  className="rounded-md p-1.5 transition-colors hover:bg-[var(--bg-hover)]"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
              }}
              placeholder="Message AnetAI… (Enter to send, Shift+Enter for new line)"
              rows={3}
              className="w-full resize-none bg-transparent px-4 py-3 text-sm placeholder:text-[var(--text-tertiary)] focus:outline-none"
              style={{ color: "var(--text-primary)" }}
            />

            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-0.5">
                <button className="rounded-md p-1.5 text-indigo-500 hover:bg-[var(--bg-hover)]">
                  <Sparkles className="h-4 w-4" />
                </button>
                {[Eraser, Globe, Paperclip].map((Icon, i) => (
                  <button key={i} className="rounded-md p-1.5 transition-colors hover:bg-[var(--bg-hover)]" style={{ color: "var(--text-tertiary)" }}>
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setParamsOpen((v) => !v)}
                    className={cn("rounded-md p-1.5 transition-colors hover:bg-[var(--bg-hover)]", paramsOpen && "bg-[var(--bg-active)]")}
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </button>
                  {paramsOpen && <GenerationParams onClose={() => setParamsOpen(false)} />}
                </div>
                {[CircleSlash, Mic, Info].map((Icon, i) => (
                  <button key={i} className="rounded-md p-1.5 transition-colors hover:bg-[var(--bg-hover)]" style={{ color: "var(--text-tertiary)" }}>
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                {input.length > 0 && (
                  <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                    ~{tokenEstimate} tokens
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!input.trim() || isStreaming}
                  className="rounded-lg bg-indigo-500 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isStreaming ? "Streaming…" : "Send"}
                </button>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-2 flex max-w-3xl items-center justify-center gap-1.5 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
            <Filter className="h-3 w-3" />
            <span>© 2026 AnetAIS — Powered by multi-provider AI</span>
            <ChevronRight className="h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  );
}

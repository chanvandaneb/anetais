"use client";

import { useMemo, useState } from "react";
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
};

const toolbarIcons = [
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
];

const MOCK_REPLIES = [
  "Got it — here's a mock response. In a live deployment this would stream a real completion from the selected model.",
  "Sure thing. (This is a simulated reply for the UI mockup — no real model call is made.)",
  "Interesting question! Here's a placeholder answer so you can see how the thread looks with a longer response wrapping across a couple of lines.",
];

export default function ChatPage() {
  const [chats, setChats] = useState<ChatItem[]>(mockChats);
  const [activeChatId, setActiveChatId] = useState(mockChats[0].id);
  const [modelName, setModelName] = useState("gemini-flash-latest");
  const [modelPickerOpen, setModelPickerOpen] = useState(false);
  const [paramsOpen, setParamsOpen] = useState(false);
  const [threads, setThreads] = useState<Record<string, Message[]>>({});
  const [typingChatId, setTypingChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const { showToast } = useToast();
  const { addUsage } = useUsage();

  const activeChat = chats.find((c) => c.id === activeChatId);
  const messages = threads[activeChatId] ?? [];
  const isTyping = typingChatId === activeChatId;

  const filteredChats = useMemo(
    () => chats.filter((c) => c.title.toLowerCase().includes(query.toLowerCase())),
    [chats, query]
  );

  function appendToThread(chatId: string, msgs: Message[]) {
    setThreads((prev) => ({ ...prev, [chatId]: [...(prev[chatId] ?? []), ...msgs] }));
  }

  function replyTo(chatId: string, content: string) {
    setTypingChatId(chatId);
    const delay = 700 + Math.random() * 900;
    setTimeout(() => {
      appendToThread(chatId, [
        {
          id: "a-" + Date.now(),
          role: "assistant",
          content,
        },
      ]);
      setTypingChatId((curr) => (curr === chatId ? null : curr));
      const totalTokens = Math.round((content.length / 4) * (1.4 + Math.random() * 0.4));
      addUsage("Chat Completion", modelName, totalTokens, Math.max(1, Math.round(totalTokens / 50)));
    }, delay);
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
    appendToThread(activeChatId, [{ id: "u-" + Date.now(), role: "user", content: question }]);
    replyTo(activeChatId, faqAnswers[question]);
  }

  function handleSend() {
    if (!input.trim()) return;
    const text = input;
    setInput("");
    appendToThread(activeChatId, [{ id: "u-" + Date.now(), role: "user", content: text }]);
    if (activeChat?.title === "New Chat") {
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId ? { ...c, title: text.slice(0, 40) } : c
        )
      );
    }
    replyTo(activeChatId, MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)]);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* LEFT PANE */}
      {leftCollapsed ? (
        <div className="flex w-[52px] flex-shrink-0 flex-col items-center border-r border-white/10 bg-white/[0.02] py-4">
          <button
            type="button"
            onClick={() => setLeftCollapsed(false)}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/10 hover:text-white"
            title="Expand sidebar"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        </div>
      ) : (
      <div className="flex w-[340px] flex-shrink-0 flex-col border-r border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between px-4 py-4">
          <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-lg font-bold tracking-tight text-transparent">
            AnetAIS
          </span>
          <button
            type="button"
            onClick={() => setLeftCollapsed(true)}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/10 hover:text-white"
            title="Collapse sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        <div className="px-4">
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <Search className="h-4 w-4 text-zinc-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chat"
              className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none"
            />
            <span className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-zinc-500">
              Ctrl K
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between px-4">
          <button className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-zinc-500 hover:text-zinc-300">
            <ChevronDown className="h-3.5 w-3.5" />
            Project
          </button>
          <button className="flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-xs text-zinc-300 hover:bg-white/10">
            <Plus className="h-3 w-3" />
            New Project
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between px-4">
          <button className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-zinc-500 hover:text-zinc-300">
            <ChevronDown className="h-3.5 w-3.5" />
            Chat list
          </button>
          <button
            type="button"
            onClick={handleNewChat}
            className="flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-xs text-zinc-300 hover:bg-white/10"
          >
            <Plus className="h-3 w-3" />
            New Chat
          </button>
        </div>

        <div className="mt-2 flex-1 space-y-1 overflow-y-auto px-2 pb-4">
          {filteredChats.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-zinc-600">No chats match &ldquo;{query}&rdquo;</div>
          ) : (
            filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-white/10",
                  chat.id === activeChatId && "bg-white/10"
                )}
              >
                <MessageSquare className="h-4 w-4 flex-shrink-0 text-zinc-500" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-zinc-200">{chat.title}</div>
                  <span className="mt-0.5 inline-block rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-500">
                    {chat.model}
                  </span>
                </div>
                <span className="flex-shrink-0 text-[10px] text-zinc-600">{chat.timestamp}</span>
              </button>
            ))
          )}
        </div>
      </div>
      )}

      {/* RIGHT PANE */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-3.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-600">
            <Bot className="h-4 w-4 text-black" />
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setModelPickerOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-sm text-blue-300 hover:bg-blue-500/20"
            >
              {modelName}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {modelPickerOpen && (
              <ModelPicker
                onClose={() => setModelPickerOpen(false)}
                onSelect={(name) => {
                  setModelName(name);
                  showToast(`Switched model to ${name}`, "info");
                }}
              />
            )}
          </div>
          <span className="text-sm text-zinc-500">{activeChat?.title ?? "Chit chat"}</span>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {messages.length === 0 ? (
            <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center text-center">
              <h1 className="text-2xl font-semibold text-white">👋 Good Evening</h1>
              <p className="mt-2 max-w-md text-sm text-zinc-400">
                I am your personal intelligent assistant AnetAI. How can I assist you today?
              </p>

              <div className="mt-8 w-full">
                <div className="mb-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                  New Assistant Recommendations
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {assistants.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => handleAssistantClick(a.id)}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left transition-colors hover:bg-white/[0.07]"
                    >
                      <div className="text-2xl">{a.emoji}</div>
                      <div className="mt-2 text-sm font-medium text-white">{a.name}</div>
                      <div className="mt-1 text-xs text-zinc-500">{a.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 w-full">
                <div className="mb-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Frequently Asked Questions
                </div>
                <div className="flex flex-wrap gap-2">
                  {faqs.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleFaqClick(q)}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-zinc-300 transition-colors hover:bg-white/10"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto flex max-w-2xl flex-col gap-5">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex items-start gap-3",
                    m.role === "user" && "flex-row-reverse"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
                      m.role === "user"
                        ? "bg-gradient-to-br from-yellow-400 to-amber-600 text-black"
                        : "bg-white/10 text-yellow-500"
                    )}
                  >
                    {m.role === "user" ? (
                      <span className="text-xs font-semibold">CO</span>
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-md rounded-xl px-4 py-2.5 text-sm leading-relaxed",
                      m.role === "user"
                        ? "bg-yellow-500/15 text-zinc-100"
                        : "border border-white/10 bg-white/[0.03] text-zinc-200"
                    )}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-yellow-500">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="border-t border-white/10 px-6 py-4">
          <div className="relative mx-auto max-w-3xl rounded-xl border border-white/10 bg-white/[0.03]">
            <div className="flex items-center gap-0.5 border-b border-white/10 px-3 py-2">
              {toolbarIcons.map((Icon, i) => (
                <button
                  key={i}
                  type="button"
                  className="rounded-md p-1.5 text-zinc-500 hover:bg-white/10 hover:text-zinc-200"
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your message, press Ctrl Enter to wrap"
              rows={3}
              className="w-full resize-none bg-transparent px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />

            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-0.5">
                <button className="rounded-md p-1.5 text-yellow-500 hover:bg-white/10">
                  <Sparkles className="h-4 w-4" />
                </button>
                <button className="rounded-md p-1.5 text-zinc-500 hover:bg-white/10 hover:text-zinc-200">
                  <Eraser className="h-4 w-4" />
                </button>
                <button className="rounded-md p-1.5 text-zinc-500 hover:bg-white/10 hover:text-zinc-200">
                  <Globe className="h-4 w-4" />
                </button>
                <button className="rounded-md p-1.5 text-zinc-500 hover:bg-white/10 hover:text-zinc-200">
                  <Paperclip className="h-4 w-4" />
                </button>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setParamsOpen((v) => !v)}
                    className={cn(
                      "rounded-md p-1.5 text-zinc-500 hover:bg-white/10 hover:text-zinc-200",
                      paramsOpen && "bg-white/10 text-zinc-200"
                    )}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </button>
                  {paramsOpen && <GenerationParams onClose={() => setParamsOpen(false)} />}
                </div>
                <button className="rounded-md p-1.5 text-zinc-500 hover:bg-white/10 hover:text-zinc-200">
                  <CircleSlash className="h-4 w-4" />
                </button>
                <button className="rounded-md p-1.5 text-zinc-500 hover:bg-white/10 hover:text-zinc-200">
                  <Mic className="h-4 w-4" />
                </button>
                <button className="rounded-md p-1.5 text-zinc-500 hover:bg-white/10 hover:text-zinc-200">
                  <Info className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={handleSend}
                className="rounded-lg bg-yellow-500 px-4 py-1.5 text-sm font-medium text-black transition-colors hover:bg-yellow-400"
              >
                Send
              </button>
            </div>
          </div>

          <div className="mx-auto mt-2 flex max-w-3xl items-center justify-center gap-1.5 text-[11px] text-zinc-600">
            <Filter className="h-3 w-3" />
            <span>© 2026 tài trợ bởi Demnaylive</span>
            <ChevronRight className="h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { useBackend } from "../hooks/use-backend";
import { FloatingElement, StaggeredList } from "./animations";

const SUGGESTED_QUESTIONS = [
  "Is this amount realistic?",
  "Can I sue in small claims?",
  "What happens if they ignore this?",
  "How do I send this legally?",
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface QAChatProps {
  caseContext?: string;
}

export function QAChat({ caseContext }: QAChatProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { actor } = useBackend();

  const sendMessage = async (question: string) => {
    if (!question.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: question };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      let answer =
        "I'm unable to answer questions at the moment. Please try again.";
      if (actor) {
        const result = await (
          actor as unknown as {
            answerQuestion: (q: string, ctx: string) => Promise<string>;
          }
        ).answerQuestion(question, caseContext ?? "");
        answer = result;
      } else {
        // Fallback demo answer
        answer =
          "This is a placeholder response. Connect the backend to get AI-powered legal guidance tailored to your case.";
      }
      const assistantMsg: Message = { role: "assistant", content: answer };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* FAB with floating animation */}
      {!open && (
        <FloatingElement amplitude={6} duration={3}>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-smooth hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Open case Q&A assistant"
            data-ocid="qa_chat.open_modal_button"
          >
            <MessageCircle className="w-6 h-6" aria-hidden="true" />
          </button>
        </FloatingElement>
      )}

      {/* Chat panel with AnimatePresence */}
      <AnimatePresence>
        {open && (
          <motion.dialog
            open
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 rounded-xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden p-0 m-0"
            style={{ maxHeight: "520px" }}
            aria-label="Case Q&A assistant"
            data-ocid="qa_chat.dialog"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm font-semibold">Case Assistant</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="hover:opacity-70 transition-fast"
                data-ocid="qa_chat.close_button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-4 py-3">
              {messages.length === 0 ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground mb-3">
                    Ask anything about your case. Try a suggested question:
                  </p>
                  <StaggeredList staggerDelay={0.07} className="space-y-2">
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => sendMessage(q)}
                        className="w-full text-left text-xs px-3 py-2 rounded-lg border border-border bg-muted/40 hover:bg-muted hover:border-accent/50 transition-fast text-foreground"
                        data-ocid={`qa_chat.suggested.${q.slice(0, 10).replace(/\s/g, "_").toLowerCase()}`}
                      >
                        {q}
                      </button>
                    ))}
                  </StaggeredList>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {messages.map((msg, idx) => (
                      <motion.div
                        key={`${msg.role}-${idx}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground rounded-tr-none"
                              : "bg-muted text-foreground rounded-tl-none"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                      data-ocid="qa_chat.loading_state"
                    >
                      <div className="bg-muted rounded-xl rounded-tl-none px-3 py-2">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 0.1}s` }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="p-3 border-t border-border flex gap-2"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about your case…"
                className="text-xs h-9"
                disabled={isLoading}
                data-ocid="qa_chat.input"
              />
              <Button
                type="submit"
                size="icon"
                className="h-9 w-9 shrink-0 bg-primary hover:bg-primary/90"
                disabled={!input.trim() || isLoading}
                aria-label="Send question"
                data-ocid="qa_chat.submit_button"
              >
                <Send className="w-3.5 h-3.5" aria-hidden="true" />
              </Button>
            </form>
          </motion.dialog>
        )}
      </AnimatePresence>
    </>
  );
}

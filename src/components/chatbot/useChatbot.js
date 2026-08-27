import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "../../context/AuthContext";

import { askGemini, MAX_INPUT_LENGTH } from "../../services/chatbot/gemini";

import {
  buildSystemInstruction,
  resolveAudience,
  SUGGESTED_QUESTIONS,
  WELCOME_MESSAGES,
} from "../../services/chatbot/knowledge";

let messageId = 0;

function createMessage(role, text) {
  messageId += 1;

  return { id: messageId, role, text };
}

/*
 * حالة المحادثة. الجمهور (زائر / تاجر / مورد) يُشتق من دور المستخدم،
 * وتُبنى تعليمات النظام مرة واحدة لكل جمهور.
 */
export function useChatbot() {
  const { role } = useAuth();

  const audience = resolveAudience(role);

  const systemInstruction = useMemo(
    () => buildSystemInstruction(audience),
    [audience],
  );

  const [messages, setMessages] = useState(() => [
    createMessage("bot", WELCOME_MESSAGES[audience]),
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const abortRef = useRef(null);

  // تغيّر الدور (دخول أو خروج) يعني محادثة جديدة بسياق مختلف.
  useEffect(() => {
    setMessages([createMessage("bot", WELCOME_MESSAGES[audience])]);
    setError("");
  }, [audience]);

  // إلغاء أي طلب معلّق عند إزالة المكوّن.
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const sendMessage = useCallback(
    async (rawText) => {
      const text = String(rawText ?? "")
        .trim()
        .slice(0, MAX_INPUT_LENGTH);

      // منع الإرسال المتوازي — يحمي الحصة ويبقي الترتيب صحيحاً.
      if (!text || isLoading) return;

      setError("");

      const nextMessages = [...messages, createMessage("user", text)];

      setMessages(nextMessages);
      setIsLoading(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const reply = await askGemini({
          systemInstruction,
          messages: nextMessages,
          signal: controller.signal,
        });

        setMessages((current) => [...current, createMessage("bot", reply)]);
      } catch (requestError) {
        if (requestError?.name === "AbortError") return;

        setError(requestError.message);
      } finally {
        if (abortRef.current === controller) {
          abortRef.current = null;
        }

        setIsLoading(false);
      }
    },
    [isLoading, messages, systemInstruction],
  );

  const resetChat = useCallback(() => {
    abortRef.current?.abort();

    setMessages([createMessage("bot", WELCOME_MESSAGES[audience])]);
    setError("");
    setIsLoading(false);
  }, [audience]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    resetChat,
    suggestions: SUGGESTED_QUESTIONS[audience],
  };
}

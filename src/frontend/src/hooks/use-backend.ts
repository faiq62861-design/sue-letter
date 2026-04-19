/**
 * use-backend.ts
 * React Query hooks for backend actor methods.
 * NOTE: backend.d.ts is a stub until `pnpm bindgen` runs after backend is deployed.
 * These hooks are wired and ready — they will be populated once types are generated.
 */

import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createActor } from "../backend";
import type {
  BlogArticle,
  BlogCategory,
  GeneratedLetter,
  UserProfile,
} from "../types";

// ─── Local download activity store ───────────────────────────────────────────
// Tracks per-letter download count and timestamp in localStorage so the
// dashboard can display accurate activity without a backend recordDownload call.

const DOWNLOAD_STORE_KEY = "demand_letter_downloads";

interface DownloadRecord {
  count: number;
  lastAt: number; // ms epoch
}

function readDownloadStore(): Record<string, DownloadRecord> {
  try {
    const raw = localStorage.getItem(DOWNLOAD_STORE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, DownloadRecord>) : {};
  } catch {
    return {};
  }
}

function writeDownloadStore(store: Record<string, DownloadRecord>): void {
  try {
    localStorage.setItem(DOWNLOAD_STORE_KEY, JSON.stringify(store));
  } catch {
    /* storage full — silently skip */
  }
}

export function recordDownloadLocally(letterId: string): void {
  const store = readDownloadStore();
  const existing = store[letterId] ?? { count: 0, lastAt: 0 };
  store[letterId] = {
    count: existing.count + 1,
    lastAt: Date.now(),
  };
  writeDownloadStore(store);
}

export function getDownloadActivity(letterId: string): DownloadRecord | null {
  const store = readDownloadStore();
  return store[letterId] ?? null;
}

/**
 * useBackend — returns the raw actor for imperative calls (mutations etc.)
 */
export function useBackend() {
  const { actor, isFetching } = useActor(createActor);
  return { actor, isFetching };
}

/**
 * useCurrentUser — fetches and caches the current user's profile from the backend.
 */
export function useCurrentUser() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<UserProfile | null>({
    queryKey: ["currentUser"],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!actor) return null;
      const raw = await actor.getUserProfile();
      if (!raw) return null;
      // Map backend bigint fields to number for the frontend UserProfile type
      return {
        userId: raw.userId,
        email: raw.email ?? undefined,
        plan: raw.plan as UserProfile["plan"],
        lettersThisMonth: Number(raw.lettersThisMonth),
        totalLetters: Number(raw.totalLetters),
        currentMonthYear: raw.currentMonthYear,
        stripeCustomerId: raw.stripeCustomerId ?? undefined,
        stripeSubscriptionId: raw.stripeSubscriptionId ?? undefined,
        createdAt: raw.createdAt,
      };
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * useCanGenerate — checks whether the current user can generate a new letter.
 */
export function useCanGenerate() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<boolean>({
    queryKey: ["canGenerate"],
    queryFn: async (): Promise<boolean> => {
      if (!actor) return false;
      const result = await actor.canGenerateLetter();
      return result.canGenerate;
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 30,
  });
}

/**
 * useLetterHistory — fetches the authenticated user's past letters from the backend.
 */
export function useLetterHistory() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<GeneratedLetter[]>({
    queryKey: ["letterHistory"],
    queryFn: async (): Promise<GeneratedLetter[]> => {
      if (!actor) return [];
      const raw = await actor.getUserLetters();
      const downloadStore = readDownloadStore();
      // Map backend GeneratedLetter shape to frontend GeneratedLetter type.
      // Prefer backend downloadCount/lastDownloadAt (authoritative), fall back
      // to localStorage for any locally-tracked downloads not yet synced.
      return raw.map((letter) => {
        const dl = downloadStore[letter.id];
        const backendCount = Number(letter.downloadCount ?? 0);
        const localCount = dl?.count ?? 0;
        const downloadCount = Math.max(backendCount, localCount);
        // lastDownloadAt: prefer whichever is more recent
        const backendLastAt =
          letter.lastDownloadAt != null
            ? Number(letter.lastDownloadAt) / 1_000_000
            : null;
        const localLastAt = dl?.lastAt ?? null;
        const lastDownloadAt =
          backendLastAt && localLastAt
            ? Math.max(backendLastAt, localLastAt)
            : (backendLastAt ?? localLastAt);
        return {
          id: letter.id,
          userId: letter.userId,
          letterContent: letter.letterContent,
          createdAt: letter.createdAt,
          isFollowUp: letter.isFollowUp,
          originalLetterId: letter.originalLetterId ?? undefined,
          status: letter.status as GeneratedLetter["status"],
          downloadCount,
          lastDownloadAt,
          formData: {
            // Flatten the nested backend LetterFormData to frontend flat shape
            letterType: letter.formData
              .letterType as GeneratedLetter["formData"]["letterType"],
            tone: letter.formData.tone as GeneratedLetter["formData"]["tone"],
            jurisdiction: letter.formData.jurisdiction,
            language: "English",
            country: "",
            senderName: letter.formData.senderName,
            senderAddress: letter.formData.senderAddress.street,
            senderCity: letter.formData.senderAddress.city,
            senderState: letter.formData.senderAddress.state,
            senderZip: letter.formData.senderAddress.zip,
            senderEmail: letter.formData.senderEmail,
            senderPhone: letter.formData.senderPhone,
            recipientName: letter.formData.recipientName,
            recipientTitle: letter.formData.recipientRole,
            recipientCompany: "",
            recipientEmail: "",
            recipientAddress: letter.formData.recipientAddress.street,
            recipientCity: letter.formData.recipientAddress.city,
            recipientState: letter.formData.recipientAddress.state,
            recipientZip: letter.formData.recipientAddress.zip,
            incidentDate: letter.formData.incidentDate,
            disputeDescription: letter.formData.disputeDescription,
            priorContactAttempts: letter.formData.priorContact.attempted
              ? letter.formData.priorContact.method
              : "",
            amountDemanded: letter.formData.amountDemanded
              ? String(Number(letter.formData.amountDemanded) / 100)
              : "",
            currency: letter.formData.currency,
            responseDeadlineDays: Number(letter.formData.deadlineDays),
            evidenceItems: letter.formData.evidenceItems,
            additionalEvidence: "",
            evidenceImages: letter.formData.evidenceImages,
            contractDate: "",
            contractReference: "",
            invoiceNumbers: "",
            leaseStartDate: "",
            leaseEndDate: "",
            propertyAddress: "",
            purchaseDate: "",
            orderNumber: "",
            employmentStartDate: "",
            employmentEndDate: "",
            policyNumber: "",
            claimNumber: "",
          },
        };
      });
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60,
  });
}

/**
 * useRecordDownload — records a download event on the backend and locally,
 * then invalidates letter history so the dashboard reflects the updated count.
 */
export function useRecordDownload() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (letterId: string) => {
      // Always record locally for instant UI feedback
      recordDownloadLocally(letterId);
      // Also persist to backend when actor is available
      if (actor) {
        try {
          await actor.recordDownload(letterId);
        } catch {
          // Non-fatal: local record is already updated
        }
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["letterHistory"] });
    },
  });
}

/**
 * useGmailToken — checks whether a Gmail token is stored for the user.
 */
export function useGmailToken() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<boolean>({
    queryKey: ["gmailToken"],
    queryFn: async (): Promise<boolean> => {
      if (!actor) return false;
      const token = await actor.getGmailToken();
      return token !== null;
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * useStoreGmailToken — stores Gmail OAuth tokens via backend.
 */
export function useStoreGmailToken() {
  const { actor } = useActor(createActor);

  return useMutation({
    mutationFn: async ({
      accessToken,
      refreshToken,
      expiresAt,
    }: {
      accessToken: string;
      refreshToken: string;
      expiresAt: bigint;
    }) => {
      if (!actor) throw new Error("Backend not connected");
      const result = await actor.storeGmailToken(
        accessToken,
        refreshToken,
        expiresAt,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result;
    },
  });
}

/**
 * useSendViaGmail — sends a letter via backend Gmail integration.
 */
export function useSendViaGmail() {
  const { actor } = useActor(createActor);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const send = async (
    recipientEmail: string,
    letterContent: string,
    subject: string,
  ) => {
    if (!actor) {
      setError("Backend not connected");
      return false;
    }
    setIsSending(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await actor.sendLetterViaGmail(
        recipientEmail,
        letterContent,
        subject,
      );
      if (result.__kind__ === "err") {
        setError(result.err);
        return false;
      }
      setSuccess(true);
      return true;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to send email";
      setError(msg);
      return false;
    } finally {
      setIsSending(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
  };

  return { send, isSending, error, success, reset };
}

// ─── Blog Hooks ───────────────────────────────────────────────────────────────

function mapRawArticle(raw: {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt: bigint;
  wordCount: bigint | number;
  coverImageUrl?: string | null;
}): BlogArticle {
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt,
    content: raw.content,
    category: raw.category as BlogCategory,
    author: raw.author,
    publishedAt: raw.publishedAt,
    wordCount: Number(raw.wordCount),
    coverImageUrl: raw.coverImageUrl ?? undefined,
  };
}

/**
 * useListArticles — fetches published blog articles, optionally filtered by category.
 */
export function useListArticles(category?: BlogCategory) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<BlogArticle[]>({
    queryKey: ["articles", category ?? "all"],
    queryFn: async (): Promise<BlogArticle[]> => {
      if (!actor) return [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const actorAny = actor as any;
      if (typeof actorAny.listArticles !== "function") return [];
      const raw = await actorAny.listArticles(category ? [category] : []);
      return (raw as Parameters<typeof mapRawArticle>[0][]).map(mapRawArticle);
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * useGetArticle — fetches a single blog article by slug.
 */
export function useGetArticle(slug: string) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<BlogArticle | null>({
    queryKey: ["article", slug],
    queryFn: async (): Promise<BlogArticle | null> => {
      if (!actor || !slug) return null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const actorAny = actor as any;
      if (typeof actorAny.getArticleBySlug !== "function") return null;
      const result = await actorAny.getArticleBySlug(slug);
      // Motoko optional: [] = None, [value] = Some
      if (!result || (Array.isArray(result) && result.length === 0))
        return null;
      const raw = Array.isArray(result) ? result[0] : result;
      return mapRawArticle(raw as Parameters<typeof mapRawArticle>[0]);
    },
    enabled: !!actor && !isFetching && !!slug,
    staleTime: 1000 * 60 * 5,
  });
}

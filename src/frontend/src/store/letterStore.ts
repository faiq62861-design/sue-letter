import { create } from "zustand";
import type {
  GeneratedLetter,
  LetterFormData,
  StrengthAnalysis,
} from "../types";
import { DEFAULT_FORM_DATA } from "../types";

interface LetterState {
  currentFormData: LetterFormData;
  generatedLetter: GeneratedLetter | null;
  letterContent: string;
  isGenerating: boolean;
  letterHistory: GeneratedLetter[];
  strengthAnalysis: StrengthAnalysis | null;
  savedLetterId: string | null;
  setFormData: (data: Partial<LetterFormData>) => void;
  resetFormData: () => void;
  setGeneratedLetter: (letter: GeneratedLetter | null) => void;
  setLetterContent: (content: string) => void;
  appendLetterContent: (chunk: string) => void;
  setIsGenerating: (v: boolean) => void;
  setLetterHistory: (history: GeneratedLetter[]) => void;
  setStrengthAnalysis: (analysis: StrengthAnalysis | null) => void;
  setSavedLetterId: (id: string | null) => void;
  addEvidenceImage: (url: string) => void;
  removeEvidenceImage: (url: string) => void;
}

export const useLetterStore = create<LetterState>((set) => ({
  currentFormData: { ...DEFAULT_FORM_DATA },
  generatedLetter: null,
  letterContent: "",
  isGenerating: false,
  letterHistory: [],
  strengthAnalysis: null,
  savedLetterId: null,
  setFormData: (data) =>
    set((state) => ({
      currentFormData: { ...state.currentFormData, ...data },
    })),
  resetFormData: () =>
    set({
      currentFormData: { ...DEFAULT_FORM_DATA },
      generatedLetter: null,
      letterContent: "",
      savedLetterId: null,
    }),
  setGeneratedLetter: (letter) => set({ generatedLetter: letter }),
  setLetterContent: (content) => set({ letterContent: content }),
  appendLetterContent: (chunk) =>
    set((state) => ({ letterContent: state.letterContent + chunk })),
  setIsGenerating: (v) => set({ isGenerating: v }),
  setLetterHistory: (history) => set({ letterHistory: history }),
  setStrengthAnalysis: (analysis) => set({ strengthAnalysis: analysis }),
  setSavedLetterId: (id) => set({ savedLetterId: id }),
  addEvidenceImage: (url) =>
    set((state) => ({
      currentFormData: {
        ...state.currentFormData,
        evidenceImages: [...state.currentFormData.evidenceImages, url],
      },
    })),
  removeEvidenceImage: (url) =>
    set((state) => ({
      currentFormData: {
        ...state.currentFormData,
        evidenceImages: state.currentFormData.evidenceImages.filter(
          (u) => u !== url,
        ),
      },
    })),
}));

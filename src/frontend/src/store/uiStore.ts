import { create } from "zustand";

interface UIState {
  upgradeModalOpen: boolean;
  signInOpen: boolean;
  currentStep: number;
  mobileMenuOpen: boolean;
  setUpgradeModalOpen: (v: boolean) => void;
  setSignInOpen: (v: boolean) => void;
  setCurrentStep: (step: number) => void;
  setMobileMenuOpen: (v: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  upgradeModalOpen: false,
  signInOpen: false,
  currentStep: 1,
  mobileMenuOpen: false,
  setUpgradeModalOpen: (v) => set({ upgradeModalOpen: v }),
  setSignInOpen: (v) => set({ signInOpen: v }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),
}));

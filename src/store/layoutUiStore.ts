import { create } from 'zustand';

interface LayoutUiState {
  isRightPanelCollapsed: boolean;
  isPlayingModeIdle: boolean;
  setRightPanelCollapsed: (collapsed: boolean) => void;
  toggleRightPanelCollapsed: () => void;
  setPlayingModeIdle: (idle: boolean) => void;
}

export const useLayoutUiStore = create<LayoutUiState>((set) => ({
  isRightPanelCollapsed: false,
  isPlayingModeIdle: false,
  setRightPanelCollapsed: (collapsed) => set({ isRightPanelCollapsed: collapsed }),
  toggleRightPanelCollapsed: () =>
    set((state) => ({ isRightPanelCollapsed: !state.isRightPanelCollapsed })),
  setPlayingModeIdle: (idle) => set({ isPlayingModeIdle: idle }),
}));

import { create } from 'zustand';
import { readStoredBoolean } from '@/helpers/helper';
import { STORAGE_KEYS } from '@/utils/utils';

type LayoutUiState = {
  isRightPanelCollapsed: boolean;
  isPlayingModeIdle: boolean;
  setRightPanelCollapsed: (isCollapsed: boolean) => void;
  toggleRightPanelCollapsed: () => void;
  setPlayingModeIdle: (isIdle: boolean) => void;
};

const persistRightPanelCollapsed = (isCollapsed: boolean) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.rightCollapsed, String(isCollapsed));
};

export const useLayoutUiStore = create<LayoutUiState>((set, get) => ({
  isRightPanelCollapsed: readStoredBoolean(STORAGE_KEYS.rightCollapsed, false),
  isPlayingModeIdle: false,
  setRightPanelCollapsed: (isCollapsed) => {
    persistRightPanelCollapsed(isCollapsed);
    set({ isRightPanelCollapsed: isCollapsed });
  },
  toggleRightPanelCollapsed: () => {
    const nextState = !get().isRightPanelCollapsed;
    persistRightPanelCollapsed(nextState);
    set({ isRightPanelCollapsed: nextState });
  },
  setPlayingModeIdle: (isIdle) => set({ isPlayingModeIdle: isIdle }),
}));

import { useEffect } from "react";

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
}

export function useKeyboardShortcut(shortcut: KeyboardShortcut) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const { key, ctrl, alt, shift, meta } = shortcut;

      const ctrlMatch = ctrl ? (e.ctrlKey || e.metaKey) : !e.ctrlKey && !e.metaKey;
      const altMatch = alt ? e.altKey : !e.altKey;
      const shiftMatch = shift ? e.shiftKey : !e.shiftKey;
      const metaMatch = meta !== undefined ? e.metaKey === meta : true;

      if (
        e.key.toLowerCase() === key.toLowerCase() &&
        ctrlMatch &&
        altMatch &&
        shiftMatch &&
        metaMatch
      ) {
        e.preventDefault();
        shortcut.action();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shortcut]);
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const { key, ctrl, alt, shift, meta } = shortcut;

        const ctrlMatch = ctrl ? (e.ctrlKey || e.metaKey) : !e.ctrlKey && !e.metaKey;
        const altMatch = alt ? e.altKey : !e.altKey;
        const shiftMatch = shift ? e.shiftKey : !e.shiftKey;
        const metaMatch = meta !== undefined ? e.metaKey === meta : true;

        if (
          e.key.toLowerCase() === key.toLowerCase() &&
          ctrlMatch &&
          altMatch &&
          shiftMatch &&
          metaMatch
        ) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shortcuts]);
}

// Helper para formatar o atalho para display
export function formatShortcut(shortcut: Omit<KeyboardShortcut, "action">): string {
  const parts: string[] = [];

  if (shortcut.ctrl || shortcut.meta) parts.push("Ctrl");
  if (shortcut.alt) parts.push("Alt");
  if (shortcut.shift) parts.push("Shift");
  parts.push(shortcut.key.toUpperCase());

  return parts.join("+");
}

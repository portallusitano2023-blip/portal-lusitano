import { useEffect, useRef, type RefObject } from "react";

/**
 * Traps keyboard focus within a container element when active.
 * Handles Tab, Shift+Tab, and Escape key.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  isActive: boolean,
  onEscape?: () => void
) {
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Save the previously focused element
    previousFocus.current = document.activeElement as HTMLElement;

    const container = containerRef.current;

    // Focus the first focusable element
    const focusFirst = () => {
      const focusable = getFocusableElements(container);
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        container.focus();
      }
    };

    // Small delay to ensure DOM is ready
    const timer = requestAnimationFrame(focusFirst);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onEscape) {
        e.preventDefault();
        onEscape();
        return;
      }

      if (e.key !== "Tab") return;

      const focusable = getFocusableElements(container);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(timer);
      document.removeEventListener("keydown", handleKeyDown);
      // Restore focus when modal closes
      if (previousFocus.current && previousFocus.current.focus) {
        previousFocus.current.focus();
      }
    };
  }, [isActive, containerRef, onEscape]);
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "textarea:not([disabled])",
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
  );
}

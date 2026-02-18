import { useState, useEffect } from "react";

const TRIAL_STORAGE_KEY = "tools_trial_24h";

interface TrialState {
  active: boolean;
  startedAt: string | null;
  expiresAt: string | null;
  hoursLeft: number;
}

/**
 * Hook to manage 24h free trial for tools
 * Stores trial activation in localStorage
 */
// Calculate trial state from localStorage
function getTrialState(): TrialState {
  if (typeof window === "undefined") {
    return { active: false, startedAt: null, expiresAt: null, hoursLeft: 0 };
  }

  const stored = localStorage.getItem(TRIAL_STORAGE_KEY);
  if (!stored) {
    return { active: false, startedAt: null, expiresAt: null, hoursLeft: 0 };
  }

  try {
    const { startedAt } = JSON.parse(stored);
    const start = new Date(startedAt);
    const expires = new Date(start.getTime() + 24 * 60 * 60 * 1000); // +24h
    const now = new Date();

    if (now < expires) {
      // Trial still active
      const msLeft = expires.getTime() - now.getTime();
      const hoursLeft = Math.ceil(msLeft / (1000 * 60 * 60));

      return {
        active: true,
        startedAt: start.toISOString(),
        expiresAt: expires.toISOString(),
        hoursLeft,
      };
    } else {
      // Trial expired
      return {
        active: false,
        startedAt: start.toISOString(),
        expiresAt: expires.toISOString(),
        hoursLeft: 0,
      };
    }
  } catch {
    // Invalid storage data
    localStorage.removeItem(TRIAL_STORAGE_KEY);
    return { active: false, startedAt: null, expiresAt: null, hoursLeft: 0 };
  }
}

export function useTrial24h() {
  const [trial, setTrial] = useState<TrialState>(getTrialState);

  // Re-check trial status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setTrial(getTrialState());
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const activateTrial = () => {
    const now = new Date();
    const data = { startedAt: now.toISOString() };

    localStorage.setItem(TRIAL_STORAGE_KEY, JSON.stringify(data));

    const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    setTrial({
      active: true,
      startedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      hoursLeft: 24,
    });
  };

  return {
    ...trial,
    activateTrial,
  };
}

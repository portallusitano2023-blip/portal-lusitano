"use client";

import { useState, useEffect, type RefObject } from "react";

// Shared observer pool — one observer per unique rootMargin value
// Elements are observed/unobserved on the shared instance instead of creating
// a new IntersectionObserver per element.
type ObserverCallback = (entry: IntersectionObserverEntry) => void;

const observers = new Map<string, IntersectionObserver>();
const callbacks = new Map<Element, ObserverCallback>();

function getSharedObserver(rootMargin: string): IntersectionObserver {
  let observer = observers.get(rootMargin);
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const cb = callbacks.get(entry.target);
          if (cb) cb(entry);
        }
      },
      { rootMargin }
    );
    observers.set(rootMargin, observer);
  }
  return observer;
}

function observe(el: Element, margin: string, cb: ObserverCallback) {
  callbacks.set(el, cb);
  getSharedObserver(margin).observe(el);
}

function unobserve(el: Element, margin: string) {
  callbacks.delete(el);
  const observer = observers.get(margin);
  if (observer) observer.unobserve(el);
}

export function useInViewOnce(ref: RefObject<HTMLElement | null>, margin = "-50px") {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    // Safety timeout: if IntersectionObserver never fires (browser quirk,
    // layout shift, element already visible), force content visible after 4s.
    const timer = setTimeout(() => {
      setInView(true);
      if (el) unobserve(el, margin);
    }, 4000);

    observe(el, margin, (entry) => {
      if (entry.isIntersecting) {
        clearTimeout(timer);
        setInView(true);
        unobserve(el, margin);
      }
    });

    return () => {
      clearTimeout(timer);
      unobserve(el, margin);
    };
  }, [ref, margin, inView]);

  return inView;
}

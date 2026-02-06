"use client";

import { useEffect, useState, useRef } from "react";
import { FiBell } from "react-icons/fi";
import Link from "next/link";

interface NotificationBadgeProps {
  refreshInterval?: number; // em milissegundos, default 30000 (30s)
}

export default function NotificationBadge({ refreshInterval = 30000 }: NotificationBadgeProps) {
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousCount = useRef(0);

  useEffect(() => {
    // Criar elemento de áudio para notificação
    audioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSaHzPLTgjMGHm7A7+OZTA8PVqnk77BeDwtJouHyvmwgBSaHzPLVgC8GHm/A7+OZTA8OVqrk77BeDwtIouDyv2wgBSWGy/LWhC8GHnDB7+OZTA8OVqrk77BfDgtIot/yvmwgBSaGy/LWgy8GHnDB7+OYSA8OVqrk77BfDgtIouDyvmwgBSaGy/LWgy8GHnDB7+OYSA8OVqrk77BfDgtIouDyvmwgBSaGy/LWgy8GHnDB7+OYSA8OVqrk77BfDgtIouDyvmwgBSaGy/LWgy8GHnDB7+OYSA8OVqrk77BfDgtIouDyvmwgBSaGy/LWgy8GHnDB7+OYSA8OVqrk77BfDgtIouDyvmwgBSaGy/LWgy8GHnDB7+OYSA8OVqrk77BfDgtIouDyvmwgBSaGy/LWgy8GHnDB7+OYSA8OVqrk77BfDgtIouDyvmwgBSaGy/LWgy8GHnDB7+OYSA8OVqrk77BfDgtIouDyvmwgBSaGy/LWgy8GHnDB7+OYSA8OVqrk77BfDgtIouDyvmwgBSaGy/LWgy8GHnDB7+OYSA8OVqrk77BfDgtIouDyvmwgBSaGy/LWgy8GHnDB7+OYSA8OVqrk77BfDgtIouDyvmwgBSaGy/LWgy8GHnDB7+OYSA8OVqrk77BfDgtIouDyvmwgBSaGy/LWgy8GHnDB7+OYSA8OVqrk77BfDgtIouDyvmwgBSaGy/LWgy8GHnDB7+OYSA8OVqrk77BfDgtIouDyvmwgBSaGy/LWgy8GHnDB7+OYSA8OVqrk77BfDgtIouDyvmwgBSaGy/LWgy8GHnDB7+OYSA8OVqrk77BfDgtIouDyvmwgBSaGy/LWgy8GHnDB7+OYSA8OVqrk77BfDgtIouDyvmwgBSaGy/LWgy8GHnDB7+OYSA8OVqrk77BfDg==");

    // Carregar contagem inicial
    checkNewMessages();

    // Configurar polling
    const interval = setInterval(checkNewMessages, refreshInterval);

    return () => {
      clearInterval(interval);
    };
  }, [refreshInterval]);

  const checkNewMessages = async () => {
    try {
      const res = await fetch("/api/admin/messages/stats");
      if (!res.ok) return;

      const data = await res.json();
      const count = data.stats?.byStatus?.novo || 0;

      // Se a contagem aumentou, tocar som e animar
      if (count > previousCount.current) {
        playNotificationSound();
        triggerAnimation();
      }

      previousCount.current = count;
      setNewMessagesCount(count);
    } catch (error) {
      console.error("Error checking messages:", error);
    }
  };

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch((e) => console.log("Audio play failed:", e));
    }
  };

  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <Link
      href="/admin/mensagens"
      className={`relative p-2 rounded-lg transition-all ${
        isAnimating
          ? "bg-[#C5A059] scale-110"
          : "bg-white/5 hover:bg-white/10"
      }`}
    >
      <FiBell
        size={20}
        className={`${
          newMessagesCount > 0 ? "text-[#C5A059]" : "text-gray-400"
        } ${isAnimating ? "animate-bounce" : ""}`}
      />

      {newMessagesCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
          {newMessagesCount > 9 ? "9+" : newMessagesCount}
        </span>
      )}
    </Link>
  );
}

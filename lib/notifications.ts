// Sistema de Push Notifications para o Admin

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    // Browser does not support notifications
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

export const showNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === "granted") {
    const notification = new Notification(title, {
      icon: "/logo.png",
      badge: "/logo.png",
      ...options,
    });

    // Auto-fechar após 10 segundos
    setTimeout(() => notification.close(), 10000);

    return notification;
  }
  return null;
};

export const notifyNewMessage = (data: { name: string; type: string; id: string }) => {
  const typeLabels: Record<string, string> = {
    vender_cavalo: "Vender Cavalo",
    publicidade: "Publicidade",
    instagram: "Instagram",
  };

  showNotification("📬 Nova Mensagem no Portal Lusitano", {
    body: `${data.name} - ${typeLabels[data.type] || data.type}`,
    tag: `message-${data.id}`,
    requireInteraction: false,
    data: { url: `/admin/mensagens` },
  });
};

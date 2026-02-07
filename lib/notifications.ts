// Sistema de Push Notifications para o Admin

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    console.warn("Este browser não suporta notificações");
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

export const showNotification = (
  title: string,
  options?: NotificationOptions
) => {
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

export const notifyNewMessage = (data: {
  name: string;
  type: string;
  id: string;
}) => {
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

export const notifyNewPayment = (data: {
  email: string;
  amount: number;
  type: string;
}) => {
  const amountEuros = (data.amount / 100).toFixed(2);

  showNotification("💰 Novo Pagamento Recebido!", {
    body: `€${amountEuros} - ${data.email}`,
    tag: `payment-${Date.now()}`,
    requireInteraction: true,
    data: { url: `/admin/financeiro` },
  });
};

export const notifyNewLead = (data: {
  name: string;
  stage: string;
}) => {
  showNotification("🎯 Novo Lead no CRM!", {
    body: `${data.name} - ${data.stage}`,
    tag: `lead-${Date.now()}`,
    requireInteraction: false,
    data: { url: `/admin/crm` },
  });
};

export const notifyTaskDue = (data: {
  title: string;
  dueDate: string;
}) => {
  showNotification("⏰ Tarefa Pendente!", {
    body: `${data.title} - Vence: ${data.dueDate}`,
    tag: `task-${Date.now()}`,
    requireInteraction: true,
    data: { url: `/admin/calendario` },
  });
};

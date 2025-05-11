const publicVapidKey =
  "BIRuPPSH5JFfJox50Xc520YzCdKro2Ne9mfEWbEIUdvvbVnXsVf_SFMEVyy1gipwbvuZuejNomU_i1ptHPGIqIo";

export const isPushNotificationSupported = () => {
  return "serviceWorker" in navigator && "PushManager" in window;
};

export const registerServiceWorker = async () => {
  try {
    const registration = await navigator.serviceWorker.register(
      "/service-worker.js"
    );
    console.log("Service Worker registered with scope:", registration.scope);
    return registration;
  } catch (error) {
    console.error("Service Worker registration failed:", error);
    throw error;
  }
};

export const subscribeToPushNotifications = async (token) => {
  try {
    if (!isPushNotificationSupported()) {
      throw new Error("Push notifications are not supported in this browser");
    }

    const registration = await registerServiceWorker();

    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });
    }

    await sendSubscriptionToServer(subscription, token);

    return subscription;
  } catch (error) {
    console.error("Error subscribing to push notifications:", error);
    throw error;
  }
};

export const unsubscribeFromPushNotifications = async (token) => {
  try {
    if (!isPushNotificationSupported()) {
      throw new Error("Push notifications are not supported in this browser");
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await sendUnsubscribeToServer(subscription, token);

      await subscription.unsubscribe();
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error unsubscribing from push notifications:", error);
    throw error;
  }
};

export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    throw new Error("This browser does not support notifications");
  }

  const permission = await Notification.requestPermission();
  return permission;
};

const sendSubscriptionToServer = async (subscription, token) => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/subscriptions/subscribe",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subscription }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to subscribe");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving subscription to server:", error);
    throw error;
  }
};

const sendUnsubscribeToServer = async (subscription, token) => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/subscriptions/unsubscribe",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to unsubscribe");
    }

    return await response.json();
  } catch (error) {
    console.error("Error unsubscribing from server:", error);
    throw error;
  }
};

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

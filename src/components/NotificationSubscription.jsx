import React, { useState, useEffect } from 'react';
import {
    isPushNotificationSupported,
    requestNotificationPermission,
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications
} from '../utils/notificationService';

const NotificationSubscription = ({ token }) => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [permissionStatus, setPermissionStatus] = useState('default');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkSubscriptionStatus = async () => {
            try {
                const supported = isPushNotificationSupported();
                setIsSupported(supported);

                if (!supported) {
                    setLoading(false);
                    return;
                }

                setPermissionStatus(Notification.permission);

                const registration = await navigator.serviceWorker.ready;
                const subscription = await registration.pushManager.getSubscription();
                setIsSubscribed(!!subscription);

            } catch (err) {
                console.error('Error checking subscription status:', err);
                setError('Failed to check notification status');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            checkSubscriptionStatus();
        }
    }, [token]);

    const handleSubscribe = async () => {
        try {
            setLoading(true);
            setError(null);

            if (permissionStatus !== 'granted') {
                const permission = await requestNotificationPermission();
                setPermissionStatus(permission);

                if (permission !== 'granted') {
                    throw new Error('Notification permission denied');
                }
            }

            await subscribeToPushNotifications(token);
            setIsSubscribed(true);

        } catch (err) {
            console.error('Error subscribing to notifications:', err);
            setError(err.message || 'Failed to subscribe to notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleUnsubscribe = async () => {
        try {
            setLoading(true);
            setError(null);

            const unsubscribed = await unsubscribeFromPushNotifications(token);
            if (unsubscribed) {
                setIsSubscribed(false);
            }

        } catch (err) {
            console.error('Error unsubscribing from notifications:', err);
            setError(err.message || 'Failed to unsubscribe from notifications');
        } finally {
            setLoading(false);
        }
    };

    if (!isSupported) {
        return <p>Push notifications are not supported in this browser</p>;
    }

    return (
        <div style={styles.notificationWrapper}>
            <h3 style={styles.notificationTitle}>Push Notifications</h3>

            {error && <p style={styles.error}>{error}</p>}

            {permissionStatus === "denied" ? (
                <p style={styles.notificationMessage}>
                    Notification permission has been blocked. Please update your browser settings to enable notifications.
                </p>
            ) : (
                <div>
                    <p style={styles.notificationMessage}>
                        {isSubscribed
                            ? "You are currently receiving push notifications for new hostels."
                            : "Subscribe to receive push notifications for new hostels."}
                    </p>

                    <button
                        onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
                        disabled={loading}
                        style={{
                            ...styles.button,
                            ...(loading ? styles.buttonDisabled : {}),
                        }}
                    >
                        {loading ? "Processing..." : isSubscribed ? "Unsubscribe" : "Subscribe"}
                    </button>
                </div>
            )}
        </div>

    );
};

export default NotificationSubscription;


const styles = {
    notificationWrapper: {
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        margin: "20px 0",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
    },
    notificationTitle: {
        fontSize: "20px",
        marginBottom: "15px",
        color: "#333",
        fontWeight: "600",
    },
    notificationMessage: {
        fontSize: "16px",
        marginBottom: "15px",
        color: "#555",
    },
    error: {
        color: "#e74c3c",
        fontSize: "14px",
        marginBottom: "10px",
    },
    button: {
        padding: "10px 16px",
        fontSize: "15px",
        borderRadius: "4px",
        border: "none",
        cursor: "pointer",
        backgroundColor: "#3498db",
        color: "#fff",
        transition: "background-color 0.3s",
    },
    buttonDisabled: {
        backgroundColor: "#95a5a6",
        cursor: "not-allowed",
    },
};

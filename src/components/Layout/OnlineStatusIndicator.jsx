import React from "react";
import { useHostel } from "../../context/HostelContext";

const OnlineStatusIndicator = () => {
    const { isOnline, syncStatus, forceSyncData } = useHostel();

    const handleSync = (e) => {
        e.preventDefault();
        forceSyncData();
    };

    return (
        <div style={styles.container}>
            <div style={isOnline ? styles.onlineIndicator : styles.offlineIndicator}>
                <span style={styles.dot}></span>
                <span style={styles.statusText}>
                    {isOnline ? "Online" : "Offline"}
                </span>
            </div>

            {!isOnline && (
                <div style={styles.offlineMessage}>
                    Changes will sync when online
                </div>
            )}

            {isOnline && syncStatus === 'syncing' && (
                <div style={styles.syncingMessage}>
                    Syncing...
                </div>
            )}

            {isOnline && syncStatus !== 'syncing' && (
                <button
                    onClick={handleSync}
                    style={styles.syncButton}
                    title="Sync your offline changes"
                >
                    Sync
                </button>
            )}
        </div>
    );
};

export default OnlineStatusIndicator;

const styles = {
    container: {
        display: "flex",
        alignItems: "center",
        marginRight: "20px",
    },
    onlineIndicator: {
        display: "flex",
        alignItems: "center",
        padding: "6px 10px",
        borderRadius: "20px",
        backgroundColor: "rgba(46, 204, 113, 0.2)",
        border: "1px solid #2ecc71",
    },
    offlineIndicator: {
        display: "flex",
        alignItems: "center",
        padding: "6px 10px",
        borderRadius: "20px",
        backgroundColor: "rgba(231, 76, 60, 0.2)",
        border: "1px solid #e74c3c",
    },
    dot: {
        height: "8px",
        width: "8px",
        borderRadius: "50%",
        marginRight: "6px",
        backgroundColor: (props) => (props.isOnline ? "#2ecc71" : "#e74c3c"),
        boxShadow: (props) =>
            props.isOnline
                ? "0 0 0 2px rgba(46, 204, 113, 0.3)"
                : "0 0 0 2px rgba(231, 76, 60, 0.3)",
    },
    statusText: {
        fontSize: "12px",
        fontWeight: "600",
        color: "#fff",
    },
    offlineMessage: {
        fontSize: "10px",
        color: "#fff",
        marginLeft: "8px",
        maxWidth: "100px",
        lineHeight: "1.2",
    },
    syncingMessage: {
        fontSize: "12px",
        color: "#fff",
        marginLeft: "8px",
    },
    syncButton: {
        backgroundColor: "#2980b9",
        color: "white",
        border: "none",
        borderRadius: "4px",
        padding: "4px 8px",
        fontSize: "12px",
        marginLeft: "8px",
        cursor: "pointer",
        transition: "background-color 0.3s",
    },
    syncButtonHover: {
        backgroundColor: "#3498db",
    },
    syncButtonActive: {
        backgroundColor: "#2980b9",
    },
    syncButtonDisabled: {
        backgroundColor: "#95a5a6",
        cursor: "not-allowed",
    },
};
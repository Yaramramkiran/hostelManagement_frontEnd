import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useHostel } from '../../context/HostelContext';
import { useAuth } from '../../context/AuthContext';

const HostelDetail = () => {
    const { id } = useParams();
    const { getHostel, hostel, loading, error, deleteHostel } = useHostel();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [creatorInfo, setCreatorInfo] = useState(null);

    useEffect(() => {
        getHostel(id);
    }, [id]);

    useEffect(() => {
        if (hostel && hostel.creator) {
            setCreatorInfo(hostel.creator);
        }
    }, [hostel]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this hostel?')) {
            const success = await deleteHostel(id);
            if (success) {
                navigate('/hostels');
            }
        }
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <h2>Loading...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <div style={styles.errorAlert}>{error}</div>
                <Link to="/hostels" style={styles.backButton}>
                    Back to Hostels
                </Link>
            </div>
        );
    }

    if (!hostel) {
        return (
            <div style={styles.notFoundContainer}>
                <h2>Hostel Not Found</h2>
                <p>The hostel you're looking for doesn't exist or has been removed.</p>
                <Link to="/hostels" style={styles.backButton}>
                    Back to Hostels
                </Link>
            </div>
        );
    }

    const isAdmin = user && user.role === 'admin';

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.headerContent}>
                    <h1 style={styles.title}>{hostel.name}</h1>
                    <div style={styles.meta}>
                        <div style={styles.locationBadge}>
                            <span style={styles.locationIcon}>📍</span> {hostel.location}
                        </div>
                    </div>
                </div>

                <div style={styles.actions}>
                    <Link to="/hostels" style={styles.backButton}>
                        Back to Hostels
                    </Link>

                    {isAdmin && (
                        <>
                            <Link to={`/hostels/edit/${id}`} style={styles.editButton}>
                                Edit Hostel
                            </Link>
                            <button onClick={handleDelete} style={styles.deleteButton}>
                                Delete Hostel
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div style={styles.content}>
                <div style={styles.mainInfo}>
                    <div style={styles.infoCard}>
                        <h2 style={styles.sectionTitle}>Hostel Information</h2>

                        <div style={styles.infoGrid}>
                            <div style={styles.infoItem}>
                                <div style={styles.infoLabel}>Capacity</div>
                                <div style={styles.infoValue}>
                                    <span style={styles.capacityIcon}>🛏️</span> {hostel.capacity} beds
                                </div>
                            </div>

                            <div style={styles.infoItem}>
                                <div style={styles.infoLabel}>ID</div>
                                <div style={styles.infoValue}>#{hostel.id}</div>
                            </div>

                            <div style={styles.infoItem}>
                                <div style={styles.infoLabel}>Created At</div>
                                <div style={styles.infoValue}>
                                    {new Date(hostel.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>

                            <div style={styles.infoItem}>
                                <div style={styles.infoLabel}>Last Updated</div>
                                <div style={styles.infoValue}>
                                    {new Date(hostel.updatedAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={styles.occupancyCard}>
                        <h2 style={styles.sectionTitle}>Capacity Visualization</h2>
                        <div style={styles.capacityBar}>
                            <div style={styles.capacityFill}>
                                <span style={styles.capacityNumber}>
                                    {hostel.capacity}
                                </span>
                            </div>
                        </div>
                        <div style={styles.capacityLegend}>
                            <div style={styles.legendItem}>
                                <div style={{ ...styles.legendColor, backgroundColor: '#3498db' }}></div>
                                <div style={styles.legendText}>Total Capacity</div>
                            </div>
                        </div>
                    </div>

                    <div style={styles.featuresCard}>
                        <h2 style={styles.sectionTitle}>Location Information</h2>
                        <div style={styles.mapPlaceholder}>
                            <div style={styles.mapContent}>
                                <div style={styles.mapIcon}>📍</div>
                                <div style={styles.mapText}>{hostel.location}</div>
                                <button style={styles.mapButton}>View on Maps</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={styles.sidebar}>
                    <div style={styles.creatorCard}>
                        <h3 style={styles.creatorTitle}>Added By</h3>
                        {creatorInfo ? (
                            <div style={styles.creatorInfo}>
                                <div style={styles.creatorAvatar}>
                                    {creatorInfo.name.charAt(0).toUpperCase()}
                                </div>
                                <div style={styles.creatorDetails}>
                                    <div style={styles.creatorName}>{creatorInfo.name}</div>
                                    <div style={styles.creatorRole}>
                                        {creatorInfo.role === 'admin' ? 'Administrator' : 'Regular User'}
                                    </div>
                                    <div style={styles.creatorEmail}>{creatorInfo.email}</div>
                                </div>
                            </div>
                        ) : (
                            <div style={styles.creatorLoading}>Loading creator info...</div>
                        )}
                    </div>

                    <div style={styles.actionsCard}>
                        <h3 style={styles.actionsTitle}>Quick Actions</h3>
                        <div style={styles.actionsList}>
                            <Link to="/hostels" style={styles.actionLink}>
                                View All Hostels
                            </Link>
                            {/* <Link to="/hostels/add" style={styles.actionLink}>
                                Add New Hostel
                            </Link> */}
                            {isAdmin && (
                                <Link to={`/hostels/edit/${id}`} style={styles.actionLink}>
                                    Edit This Hostel
                                </Link>
                            )}
                            {isAdmin && (
                                <button onClick={handleDelete} style={styles.actionButton}>
                                    Delete This Hostel
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        // maxWidth: '1200px',
        margin: '0 auto'
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        fontSize: '20px',
        fontWeight: 'bold'
    },
    errorContainer: {
        padding: '40px 20px',
        textAlign: 'center'
    },
    notFoundContainer: {
        padding: '40px 20px',
        textAlign: 'center',
        color: '#555'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '20px'
    },
    headerContent: {
        flex: '1'
    },
    title: {
        fontSize: '32px',
        color: '#333',
        marginBottom: '10px',
        fontWeight: '700'
    },
    meta: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px'
    },
    locationBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: '#f1f8fe',
        color: '#3498db',
        padding: '8px 15px',
        borderRadius: '30px',
        fontSize: '15px',
        fontWeight: '500'
    },
    locationIcon: {
        marginRight: '5px',
        fontSize: '16px'
    },
    actions: {
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap'
    },
    backButton: {
        backgroundColor: '#f1f1f1',
        color: '#333',
        borderRadius: '4px',
        padding: '10px 16px',
        fontSize: '14px',
        textDecoration: 'none',
        fontWeight: '500',
        border: 'none',
        cursor: 'pointer',
        display: 'inline-block'
    },
    editButton: {
        backgroundColor: '#f39c12',
        color: 'white',
        borderRadius: '4px',
        padding: '10px 16px',
        fontSize: '14px',
        textDecoration: 'none',
        fontWeight: '500',
        border: 'none',
        cursor: 'pointer',
        display: 'inline-block'
    },
    deleteButton: {
        backgroundColor: '#e74c3c',
        color: 'white',
        borderRadius: '4px',
        padding: '10px 16px',
        fontSize: '14px',
        textDecoration: 'none',
        fontWeight: '500',
        border: 'none',
        cursor: 'pointer'
    },
    content: {
        display: 'flex',
        gap: '30px',
        flexWrap: 'wrap'
    },
    mainInfo: {
        flex: '1',
        minWidth: '300px'
    },
    sidebar: {
        width: '300px'
    },
    infoCard: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '25px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '25px'
    },
    sectionTitle: {
        fontSize: '18px',
        color: '#333',
        marginBottom: '20px',
        paddingBottom: '10px',
        borderBottom: '1px solid #eee'
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '25px'
    },
    infoItem: {
        marginBottom: '5px'
    },
    infoLabel: {
        fontSize: '14px',
        color: '#888',
        marginBottom: '5px'
    },
    infoValue: {
        fontSize: '18px',
        color: '#333',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
    },
    capacityIcon: {
        fontSize: '18px'
    },
    occupancyCard: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '25px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '25px'
    },
    capacityBar: {
        height: '40px',
        backgroundColor: '#f1f1f1',
        borderRadius: '20px',
        overflow: 'hidden',
        marginBottom: '15px'
    },
    capacityFill: {
        height: '100%',
        width: '100%',
        backgroundColor: '#3498db',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    capacityNumber: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: '16px'
    },
    capacityLegend: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px'
    },
    legendItem: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px'
    },
    legendColor: {
        width: '15px',
        height: '15px',
        borderRadius: '3px',
        marginRight: '8px'
    },
    legendText: {
        color: '#666'
    },
    featuresCard: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '25px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '25px'
    },
    mapPlaceholder: {
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        height: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px dashed #ddd'
    },
    mapContent: {
        textAlign: 'center'
    },
    mapIcon: {
        fontSize: '32px',
        marginBottom: '10px'
    },
    mapText: {
        fontSize: '16px',
        color: '#555',
        marginBottom: '15px'
    },
    mapButton: {
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    creatorCard: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '25px'
    },
    creatorTitle: {
        fontSize: '16px',
        color: '#333',
        marginBottom: '15px',
        fontWeight: '600'
    },
    creatorInfo: {
        display: 'flex',
        alignItems: 'center'
    },
    creatorAvatar: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: '#3498db',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        fontWeight: 'bold',
        marginRight: '15px'
    },
    creatorDetails: {
        flex: '1'
    },
    creatorName: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '2px'
    },
    creatorRole: {
        fontSize: '13px',
        color: '#3498db',
        marginBottom: '5px',
        fontWeight: '500'
    },
    creatorEmail: {
        fontSize: '14px',
        color: '#888'
    },
    creatorLoading: {
        color: '#888',
        fontSize: '14px',
        fontStyle: 'italic'
    },
    actionsCard: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    actionsTitle: {
        fontSize: '16px',
        color: '#333',
        marginBottom: '15px',
        fontWeight: '600'
    },
    actionsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    actionLink: {
        display: 'block',
        padding: '12px',
        backgroundColor: '#f8f9fa',
        color: '#333',
        borderRadius: '4px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'background-color 0.3s'
    },
    actionButton: {
        display: 'block',
        width: '100%',
        padding: '12px',
        backgroundColor: '#f8f9fa',
        color: '#e74c3c',
        borderRadius: '4px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '500',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background-color 0.3s'
    },
    errorAlert: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '12px',
        borderRadius: '4px',
        marginBottom: '20px',
        textAlign: 'center'
    }
};

export default HostelDetail;
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { toast } from 'react-toastify';
import Header from './components/Layout/Header';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import HostelsList from './components/Hostels/HostelsList';
import AddEditHostelForm from './components/Hostels/AddEditHostelForm';
import UsersList from './components/Users/UsersList';
import PrivateRoute from './components/Layout/PrivateRoute';
import HostelDetail from './components/Hostels/HostelDetail';


function App() {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    const handleOffline = () => {
      toast.warning("You are offline!", { toastId: "offline" });
    };

    const handleOnline = () => {
      toast.success("Back online! Syncing your data...", { toastId: "online" });
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    if (!navigator.onLine) {
      toast.warning("You are currently offline!", { toastId: "init-offline" });
    }

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <Router>
      <div style={styles.app}>
        <Header />
        <main style={styles.main}>
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/hostels"
              element={
                <PrivateRoute>
                  <HostelsList />
                </PrivateRoute>
              }
            />
            <Route
              path="/hostels/:id"
              element={
                <PrivateRoute>
                  <HostelDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/hostels/add"
              element={
                <PrivateRoute>
                  <AddEditHostelForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/hostels/edit/:id"
              element={
                <PrivateRoute>
                  <AddEditHostelForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute adminOnly={true}>
                  <UsersList />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const styles = {
  app: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f5f5',
    width: '100%',
    boxSizing: 'border-box',
  },
  main: {
    flex: 1,
    padding: '20px',
    marginTop: '47px',
    // maxWidth: '1200px',
    // margin: '0 auto',
    // width: '100%'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '20px',
    fontWeight: 'bold'
  }
};

export default App;

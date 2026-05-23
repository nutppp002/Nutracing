import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layout
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Jobs } from './pages/Jobs';
import { Inventory } from './pages/Inventory';
import { Customers } from './pages/Customers';
import { Billing } from './pages/Billing';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) return <Navigate to="/login" replace />;
  
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />; // Redirect to dashboard if not allowed
  }
  
  return children;
};

const AppContent = () => {
  const { currentUser } = useAuth();
  const [settings] = useLocalStorage('motofix_settings', { themeColor: '#6366f1' });

  useEffect(() => {
    if (settings?.themeColor) {
      document.documentElement.style.setProperty('--primary', settings.themeColor);
      document.documentElement.style.setProperty('--primary-hover', `color-mix(in srgb, ${settings.themeColor}, black 15%)`);
    }
  }, [settings?.themeColor]);

  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Navigate to="/" replace />} />
          
          {/* Accessible by everyone */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
          
          {/* Accessible by admin only */}
          <Route path="/billing" element={<ProtectedRoute allowedRoles={['admin']}><Billing /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute allowedRoles={['admin']}><Settings /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import AddMedicinePage from './pages/AddMedicinePage';
import POSPage from './pages/POSPage';
import ExpiryAlertPage from './pages/ExpiryAlertPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SalesHistoryPage from './pages/SalesHistoryPage';
import ReceiptPage from './pages/ReceiptPage';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
      <Route path="/inventory/add" element={<ProtectedRoute><AddMedicinePage /></ProtectedRoute>} />
      <Route path="/inventory/edit/:id" element={<ProtectedRoute><AddMedicinePage /></ProtectedRoute>} />
      <Route path="/pos" element={<ProtectedRoute><POSPage /></ProtectedRoute>} />
      <Route path="/expiry" element={<ProtectedRoute><ExpiryAlertPage /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
      <Route path="/sales" element={<ProtectedRoute><SalesHistoryPage /></ProtectedRoute>} />
      <Route path="/receipt/:id" element={<ProtectedRoute><ReceiptPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1c2333',
              color: '#e6edf3',
              border: '1px solid #30363d',
              borderRadius: '10px',
              fontSize: '13.5px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            },
            success: { iconTheme: { primary: '#2ea043', secondary: '#fff' } },
            error: { iconTheme: { primary: '#f85149', secondary: '#fff' } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ShanGame from './pages/ShanGame';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import Transactions from './pages/Transactions';
import Banks from './pages/Banks';
import Contact from './pages/Contact';
import Promotions from './pages/Promotions';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import ShanGameLog from './pages/ShanGameLog';
import ShanLaunchGame from './pages/ShanLaunchGame';
import Announcements from './pages/Announcements';
import Wallet from './pages/Wallet';
import LoadingScreen from './components/LoadingScreen';

// 2D Lottery Pages
import TwoDPage from './pages/two_d/TwoDPage';
import TwoDBetPage from './pages/two_d/TwoDBetPage';
import TwoDConfirmPage from './pages/two_d/TwoDConfirmPage';
import TwoDDailyWinner from './pages/two_d/TwoDDailyWinner';
import MorningBetSlipDisplay from './pages/two_d/MorningBetSlipDisplay';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />

      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/shan-game" 
        element={
          <ProtectedRoute>
            <Layout>
              <ShanGame />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/deposit" 
        element={
          <ProtectedRoute>
            <Layout>
              <Deposit />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/withdraw" 
        element={
          <ProtectedRoute>
            <Layout>
              <Withdraw />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/transactions" 
        element={
          <ProtectedRoute>
            <Layout>
              <Transactions />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/banks" 
        element={
          <ProtectedRoute>
            <Layout>
              <Banks />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/contact" 
        element={
          <ProtectedRoute>
            <Layout>
              <Contact />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/promotions" 
        element={
          <ProtectedRoute>
            <Layout>
              <Promotions />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/change-password" 
        element={
          <ProtectedRoute>
            <Layout>
              <ChangePassword />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/shan-game-log" 
        element={
          <ProtectedRoute>
            <Layout>
              <ShanGameLog />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/shan-launch-game" 
        element={
          <ProtectedRoute>
            <Layout>
              <ShanLaunchGame />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/announcements" 
        element={
          <ProtectedRoute>
            <Layout>
              <Announcements />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/wallet" 
        element={
          <ProtectedRoute>
            <Layout>
              <Wallet />
            </Layout>
          </ProtectedRoute>
        } 
      />

      {/* 2D Lottery Routes */}
      <Route 
        path="/2d" 
        element={
          <ProtectedRoute>
            <Layout>
              <TwoDPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/2d/bet" 
        element={
          <ProtectedRoute>
            <Layout>
              <TwoDBetPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/2d/confirm" 
        element={
          <ProtectedRoute>
            <Layout>
              <TwoDConfirmPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/2d/daily-winner" 
        element={
          <ProtectedRoute>
            <Layout>
              <TwoDDailyWinner />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/morning-bet-slip" 
        element={
          <ProtectedRoute>
            <Layout>
              <MorningBetSlipDisplay />
            </Layout>
          </ProtectedRoute>
        } 
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <AppRoutes />
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import { RefreshProvider } from './context/RefreshContext';
import ErrorBoundary from './components/ErrorBoundary';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SkillAssessment from './pages/SkillAssessment';
import CareerRoadmap from './pages/CareerRoadmap';
import JobRecommendations from './pages/JobRecommendations';
import LearningPath from './pages/LearningPath';
import AIChat from './pages/AIChat';
import Progress from './pages/Progress';
import Applications from './pages/Applications';

// Protected Route wrapper
function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loader w-12 h-12"></div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
}

// Public Route wrapper (redirects to dashboard if already logged in)
function PublicRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loader w-12 h-12"></div>
            </div>
        );
    }

    return !isAuthenticated ? children : <Navigate to="/dashboard" />;
}

export default function App() {
    return (
        <ErrorBoundary>
            <RefreshProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/assessment" element={<ProtectedRoute><SkillAssessment /></ProtectedRoute>} />
                    <Route path="/roadmap" element={<ProtectedRoute><CareerRoadmap /></ProtectedRoute>} />
                    <Route path="/jobs" element={<ProtectedRoute><JobRecommendations /></ProtectedRoute>} />
                    <Route path="/learning" element={<ProtectedRoute><LearningPath /></ProtectedRoute>} />
                    <Route path="/chat" element={<ProtectedRoute><AIChat /></ProtectedRoute>} />
                    <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
                    <Route path="/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                <Toaster position="top-right" />
            </RefreshProvider>
        </ErrorBoundary>
    );
}

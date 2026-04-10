import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OrgProvider } from './context/OrgContext';
import { ProjectProvider } from './context/ProjectContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import NetworkBanner from './components/common/NetworkBanner';
import ProtectedRoute from './components/common/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import Toast from './components/common/Toast';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Dashboard & Onboarding
import CreateOrg from './pages/onboarding/CreateOrg';
import AcceptInvite from './pages/onboarding/AcceptInvite';
import Dashboard from './pages/dashboard/Dashboard';

// Org Pages
import OrgSettings from './pages/org/OrgSettings';

// Project Pages
import ProjectList from './pages/projects/ProjectList';

// Issue Pages
import IssueList from './pages/issues/IssueList';
import IssueDetail from './pages/issues/IssueDetail';
import MyIssues from './pages/issues/MyIssues';

// Activity Pages
import MyActivity from './pages/activity/MyActivity';
import ProjectActivity from './pages/activity/ProjectActivity';

// Profile
import Profile from './pages/profile/Profile';

import NotFound from './components/common/NotFound';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <OrgProvider>
            <ProjectProvider>
              <NetworkBanner />
              <Toast />
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/invite/accept/:token" element={<AcceptInvite />} />

                {/* App Routes */}
                <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                  <Route path="/onboarding" element={<CreateOrg />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/org/settings" element={<OrgSettings />} />
                  <Route path="/projects" element={<ProjectList />} />
                  <Route path="/projects/:projectId/issues" element={<IssueList />} />
                  <Route path="/projects/:projectId/issues/:issueId" element={<IssueDetail />} />
                  <Route path="/projects/:projectId/activity" element={<ProjectActivity />} />
                  <Route path="/activity" element={<MyActivity />} />
                  <Route path="/my-issues" element={<MyIssues />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ProjectProvider>
          </OrgProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

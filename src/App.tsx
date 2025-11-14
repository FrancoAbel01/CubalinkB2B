// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import { CompanyDetail } from './pages/CompanyDetail';
import { Feed } from './pages/Feed';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Services } from './pages/Services';
import Admin from './pages/Admin';
import Home from './pages/Home';
import HashnodeList from './pages/HashnodeList';
import HashnodePost from './pages/HashnodePost';
import PricingPage from './pages/PricingPage';
import Forbidden from './pages/Forbidden';
import AboutUs from './pages/AboutUs';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/company/:id" element={<CompanyDetail />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/services" element={<Services />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/blog" element={<HashnodeList />} />
            <Route path="/blog/:slug" element={<HashnodePost />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<AboutUs />} />


            {/* Dashboard: solo accesible para usuarios con rol "empresa" */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['empresa']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin: solo accesible para usuarios con rol "admin" */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="/*" element={<Forbidden />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;

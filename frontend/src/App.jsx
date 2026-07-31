import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './pages/Layout/Layout';
import LoginPage from './pages/Auth/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import PatientsPage from './pages/Patients/PatientsPage';
import RegistrationsPage from './pages/Registrations/RegistrationsPage';
import QueuesPage from './pages/Queues/QueuesPage';
import ExaminationPage from './pages/MedicalRecords/ExaminationPage';
import HistoryPage from './pages/MedicalRecords/HistoryPage';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="patients" element={<ProtectedRoute roles={['administrator', 'petugas_pendaftaran']}><PatientsPage /></ProtectedRoute>} />
              <Route path="registrations" element={<ProtectedRoute roles={['administrator', 'petugas_pendaftaran']}><RegistrationsPage /></ProtectedRoute>} />
              <Route path="queues" element={<QueuesPage />} />
              <Route path="examination" element={<ProtectedRoute roles={['dokter']}><ExaminationPage /></ProtectedRoute>} />
              <Route path="history" element={<ProtectedRoute roles={['dokter', 'administrator']}><HistoryPage /></ProtectedRoute>} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

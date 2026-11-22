import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';

// Public pages
import { LandingPage } from '../pages/LandingPage';
import { AboutUs } from '../pages/AboutUs';
import { HowItWorks } from '../pages/HowItWorks';
import { PrivacyPolicy } from '../pages/PrivacyPolicy';
import { ContactUs } from '../pages/ContactUs';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';

// Patient pages
import { PatientDashboard } from '../pages/PatientDashboard';
import { AssessmentPage } from '../pages/AssessmentPage';
import { AssessmentResultPage } from '../pages/AssessmentResultPage';
import { MoodTrackerPage } from '../pages/MoodTrackerPage';
import { CbtCatalogPage } from '../pages/CbtCatalogPage';
import { CbtExercisePage } from '../pages/CbtExercisePage';
import { ChatbotPage } from '../pages/ChatbotPage';
import { DoctorDirectoryPage } from '../pages/DoctorDirectoryPage';
import { DoctorProfilePage } from '../pages/DoctorProfilePage';
import { AppointmentBookingPage } from '../pages/AppointmentBookingPage';
import { MyAppointmentsPage } from '../pages/MyAppointmentsPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { ProfileSettingsPage } from '../pages/ProfileSettingsPage';

// Doctor pages
import { DoctorDashboardPage } from '../pages/DoctorDashboardPage';
import { DoctorAppointmentsPage } from '../pages/DoctorAppointmentsPage';
import { ConsultationWorkspacePage } from '../pages/ConsultationWorkspacePage';

// Admin pages
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { AdminDoctorVerificationPage } from '../pages/AdminDoctorVerificationPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Patient Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_PATIENT']} />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<PatientDashboard />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/assessment/result/:id" element={<AssessmentResultPage />} />
          <Route path="/mood" element={<MoodTrackerPage />} />
          <Route path="/mood-tracker" element={<MoodTrackerPage />} />
          <Route path="/cbt" element={<CbtCatalogPage />} />
          <Route path="/cbt-exercises" element={<CbtCatalogPage />} />
          <Route path="/cbt/exercises/:id" element={<CbtExercisePage />} />
          <Route path="/cbt-exercises/:id" element={<CbtExercisePage />} />
          <Route path="/chat" element={<ChatbotPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/doctors" element={<DoctorDirectoryPage />} />
          <Route path="/doctors/:id" element={<DoctorProfilePage />} />
          <Route path="/appointments/book" element={<AppointmentBookingPage />} />
          <Route path="/appointments" element={<MyAppointmentsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfileSettingsPage />} />
        </Route>
      </Route>

      {/* Protected Doctor Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_DOCTOR']} />}>
        <Route element={<AppLayout />}>
          <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
          <Route path="/doctor/appointments" element={<DoctorAppointmentsPage />} />
          <Route path="/doctor/consultations/:appointmentId" element={<ConsultationWorkspacePage />} />
          <Route path="/doctor/notifications" element={<NotificationsPage />} />
          <Route path="/doctor/profile" element={<ProfileSettingsPage />} />
        </Route>
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
        <Route element={<AppLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/doctor-verification" element={<AdminDoctorVerificationPage />} />
          <Route path="/admin/notifications" element={<NotificationsPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

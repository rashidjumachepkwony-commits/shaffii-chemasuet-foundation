import { Routes, Route, Outlet, useLocation, useNavigate } from "react-router-dom";
import * as React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary, NotFound, Unauthorized } from "@/components/ui/ErrorBoundary";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { useAuth } from "@/contexts/AuthContext";
import { Permission } from "@/types";
import { useEffect } from "react";

const LazyHome = React.lazy(() => import("@/pages/public/Home"));
const LazyAbout = React.lazy(() => import("@/pages/public/About"));
const LazyEvents = React.lazy(() => import("@/pages/public/Events"));
const LazyEventDetail = React.lazy(() => import("@/pages/public/EventDetail"));
const LazyProjects = React.lazy(() => import("@/pages/public/Projects"));
const LazyProjectDetail = React.lazy(() => import("@/pages/public/ProjectDetail"));
const LazyNews = React.lazy(() => import("@/pages/public/News"));
const LazyNewsDetail = React.lazy(() => import("@/pages/public/NewsDetail"));
const LazyGallery = React.lazy(() => import("@/pages/public/Gallery"));
const LazyVolunteer = React.lazy(() => import("@/pages/public/Volunteer"));
const LazyDonate = React.lazy(() => import("@/pages/public/Donate"));
const LazyContact = React.lazy(() => import("@/pages/public/Contact"));
const LazyLogin = React.lazy(() => import("@/pages/auth/Login"));
const LazyRegister = React.lazy(() => import("@/pages/auth/Register"));
const LazyForgotPassword = React.lazy(() => import("@/pages/auth/ForgotPassword"));
const LazyResetPassword = React.lazy(() => import("@/pages/auth/ResetPassword"));
const LazyDashboardLayout = React.lazy(() => import("@/pages/dashboard/Layout"));
const LazyDashboard = React.lazy(() => import("@/pages/dashboard/Dashboard"));
const LazyDashboardEvents = React.lazy(() => import("@/pages/dashboard/Events"));
const LazyDashboardProfile = React.lazy(() => import("@/pages/dashboard/Profile"));
const LazyAdminLogin = React.lazy(() => import("@/pages/admin/Login"));
const LazyAdminLayout = React.lazy(() => import("@/pages/admin/Layout"));
const LazyAdminDashboard = React.lazy(() => import("@/pages/admin/Dashboard"));
const LazyAdminEvents = React.lazy(() => import("@/pages/admin/Events"));
const LazyAdminEventForm = React.lazy(() => import("@/pages/admin/EventForm"));
const LazyAdminEventRegistrations = React.lazy(() => import("@/pages/admin/EventRegistrations"));
const LazyAdminEventAttendance = React.lazy(() => import("@/pages/admin/EventAttendance"));
const LazyAdminUsers = React.lazy(() => import("@/pages/admin/Users"));
const LazyAdminProjects = React.lazy(() => import("@/pages/admin/Projects"));
const LazyAdminNews = React.lazy(() => import("@/pages/admin/News"));
const LazyAdminGallery = React.lazy(() => import("@/pages/admin/Gallery"));
const LazyAdminVolunteers = React.lazy(() => import("@/pages/admin/Volunteers"));
const LazyAdminDonations = React.lazy(() => import("@/pages/admin/Donations"));
const LazyAdminContact = React.lazy(() => import("@/pages/admin/Contact"));
const LazyAdminSettings = React.lazy(() => import("@/pages/admin/Settings"));
const LazyAdminAuditLogs = React.lazy(() => import("@/pages/admin/AuditLogs"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-200px)]">
        <React.Suspense fallback={<LoadingSpinner label="Loading..." />}>
          <Outlet />
        </React.Suspense>
      </main>
      <Footer />
    </>
  );
}

function AuthLayout() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <React.Suspense fallback={<LoadingSpinner label="Loading..." />}>
        <Outlet />
      </React.Suspense>
    </main>
  );
}

function RequireAuthOutlet({
  roles,
  permissions,
}: {
  roles?: string[];
  permissions?: Permission[];
}) {
  const { user, role: userRole, permissions: userPermissions, initialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!initialized) return;
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    if (roles && !roles.includes(userRole || "")) {
      navigate("/unauthorized", { replace: true });
      return;
    }
    if (permissions) {
      const hasAll = permissions.every((p) => userPermissions.includes(p));
      if (!hasAll) {
        navigate("/unauthorized", { replace: true });
      }
    }
  }, [user, userRole, userPermissions, initialized, navigate, roles, permissions]);

  if (!initialized) {
    return <LoadingSpinner label="Initializing..." />;
  }
  if (!user) {
    return null;
  }
  if (roles && !roles.includes(userRole || "")) {
    return null;
  }
  if (permissions) {
    const hasAll = permissions.every((p) => userPermissions.includes(p));
    if (!hasAll) {
      return null;
    }
  }

  return (
    <React.Suspense fallback={<LoadingSpinner label="Loading..." />}>
      <Outlet />
    </React.Suspense>
  );
}

export function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ErrorBoundary>
          <SettingsProvider>
            <ScrollToTop />
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LazyHome />} />
                <Route path="/about" element={<LazyAbout />} />
                <Route path="/events" element={<LazyEvents />} />
                <Route path="/events/:slug" element={<LazyEventDetail />} />
                <Route path="/projects" element={<LazyProjects />} />
                <Route path="/projects/:slug" element={<LazyProjectDetail />} />
                <Route path="/news" element={<LazyNews />} />
                <Route path="/news/:slug" element={<LazyNewsDetail />} />
                <Route path="/gallery" element={<LazyGallery />} />
                <Route path="/volunteer" element={<LazyVolunteer />} />
                <Route path="/donate" element={<LazyDonate />} />
                <Route path="/contact" element={<LazyContact />} />
              </Route>

              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LazyLogin />} />
                <Route path="/register" element={<LazyRegister />} />
                <Route path="/forgot-password" element={<LazyForgotPassword />} />
                <Route path="/reset-password" element={<LazyResetPassword />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
              </Route>

              <Route element={<RequireAuthOutlet />}>
                <Route element={<LazyDashboardLayout />}>
                  <Route path="/dashboard" element={<LazyDashboard />} />
                  <Route path="/dashboard/events" element={<LazyDashboardEvents />} />
                  <Route path="/dashboard/profile" element={<LazyDashboardProfile />} />
                </Route>
              </Route>

              <Route path="/admin/login" element={<LazyAdminLogin />} />
              <Route element={<RequireAuthOutlet roles={["SUPER_ADMIN", "ADMIN", "EVENT_MANAGER", "CONTENT_MANAGER"]} />}>
                <Route element={<LazyAdminLayout />}>
                  <Route path="/admin" element={<LazyAdminDashboard />} />
                  <Route path="/admin/events" element={<LazyAdminEvents />} />
                  <Route path="/admin/events/new" element={<LazyAdminEventForm />} />
                  <Route path="/admin/events/:id/edit" element={<LazyAdminEventForm />} />
                  <Route path="/admin/events/:id/registrations" element={<LazyAdminEventRegistrations />} />
                  <Route path="/admin/events/:id/attendance" element={<LazyAdminEventAttendance />} />
                  <Route path="/admin/users" element={<LazyAdminUsers />} />
                  <Route path="/admin/projects" element={<LazyAdminProjects />} />
                  <Route path="/admin/news" element={<LazyAdminNews />} />
                  <Route path="/admin/gallery" element={<LazyAdminGallery />} />
                  <Route path="/admin/volunteers" element={<LazyAdminVolunteers />} />
                  <Route path="/admin/donations" element={<LazyAdminDonations />} />
                  <Route path="/admin/contact" element={<LazyAdminContact />} />
                  <Route path="/admin/settings" element={<LazyAdminSettings />} />
                  <Route path="/admin/audit-logs" element={<LazyAdminAuditLogs />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </SettingsProvider>
        </ErrorBoundary>
      </ToastProvider>
    </AuthProvider>
  );
}

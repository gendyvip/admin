import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./AppLayout";
import AuthLayout from "./AuthLayout";
import ProtectedRoute from "../components/ProtectedRoute";

// Lazy load all page components
const Dashboard = React.lazy(() => import("../pages/Dashboard/Dashboard"));
const Users = React.lazy(() => import("../pages/Users/Users"));
const Ads = React.lazy(() => import("../pages/Ads/ads"));
const Login = React.lazy(() => import("../pages/Login/Login"));
const ContactUs = React.lazy(() => import("../pages/Contact-us/ContactUs"));
const Drugs = React.lazy(() => import("../pages/Drugs/Drugs"));
const Deals = React.lazy(() => import("../pages/Deals/Deals"));
const Pharmacies = React.lazy(() => import("../pages/Pharmacies/Pharmacies"));
const ListedPharmacies = React.lazy(() =>
  import("../pages/ListedPharmacies/ListedPharmacies")
);

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

export default function MainLayout() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Auth routes without sidebar */}
          <Route
            path="/login"
            element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            }
          />

          {/* App routes with sidebar */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Users />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ads-requests"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Ads />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ContactUs />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/drugs"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Drugs />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/deals"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Deals />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacies"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Pharmacies />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/listed-pharmacies"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ListedPharmacies />
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./AppLayout";
import AuthLayout from "./AuthLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import Ocr from "../pages/Ocr/Ocr";

// Lazy load all page components with better error handling
const Dashboard = React.lazy(() => import("../pages/Dashboard/Dashboard"));
const Users = React.lazy(() => import("../pages/Users/Users"));
const AdsRequest = React.lazy(() => import("../pages/Ads-Requests/AdsRequest"));
const AdsCreation = React.lazy(() =>
  import("../pages/Ads-Creation/AdsCreation")
);
const Login = React.lazy(() => import("../pages/Login/Login"));
const ContactUs = React.lazy(() => import("../pages/Contact-us/ContactUs"));
const Drugs = React.lazy(() => import("../pages/Drugs/Drugs"));
const Deals = React.lazy(() => import("../pages/Deals/Deals"));
const Pharmacies = React.lazy(() => import("../pages/Pharmacies/Pharmacies"));
const ListedPharmacies = React.lazy(() =>
  import("../pages/ListedPharmacies/ListedPharmacies")
);

// Enhanced Loading component with better visual feedback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Error Boundary Component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="text-center">
      <h2 className="text-xl font-semibold text-destructive mb-2">
        Something went wrong
      </h2>
      <p className="text-muted-foreground mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  </div>
);

export default function MainLayout() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Ensure the app is ready before rendering
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isAppReady) {
    return <PageLoader />;
  }

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
                  <AdsRequest />
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
          <Route
            path="/ads-creation"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AdsCreation />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ocr"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Ocr />
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

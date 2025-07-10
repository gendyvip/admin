import React from "react";
import Dashboard from "../pages/Dashboard/Dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Users from "../pages/Users/Users";
import AppLayout from "./AppLayout";
import AuthLayout from "./AuthLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import Ads from "../pages/Ads/ads";
import Login from "../pages/Login/Login";
import ContactUs from "../pages/Contact-us/ContactUs";
import Drugs from "../pages/Drugs/Drugs";

export default function MainLayout() {
  return (
    <BrowserRouter>
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
                <Drugs />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

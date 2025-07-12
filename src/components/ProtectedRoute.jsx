import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, initializeAuth } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize auth state from localStorage
    const initAuth = async () => {
      try {
        initializeAuth();
        // Add a small delay to ensure auth state is properly set
        await new Promise((resolve) => setTimeout(resolve, 50));
        setIsInitialized(true);
      } catch (error) {
        console.error("Auth initialization error:", error);
        setIsInitialized(true);
      }
    };

    initAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isInitialized) return;

    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Check if user is admin
    if (!isAdmin()) {
      navigate("/login");
      return;
    }
  }, [isAuthenticated, isAdmin, navigate, isInitialized]);

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  // Show loading or redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return children;
}

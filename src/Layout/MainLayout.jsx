import React from "react";
import Dashboard from "../pages/Dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Users from "../pages/Users";

export default function MainLayout() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
}

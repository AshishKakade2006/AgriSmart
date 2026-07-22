import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Crops from "./pages/Crops";
import AddCrop from "./pages/AddCrop";
import EditCrop from "./pages/EditCrop";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import DiseaseDetection from "./pages/DiseaseDetection";

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Crops from "./pages/Crops";
import AddCrop from "./pages/AddCrop";
import EditCrop from "./pages/EditCrop";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import DiseaseDetection from "./pages/DiseaseDetection";
import ProtectedRoute from "./components/ProtectedRoute";

function ScrollAndToastCleaner() {
  const location = useLocation();

  useEffect(() => {
    // clear any toasts when navigating to a new page to avoid stale toasts
    toast.dismiss();
    // scroll to top on navigation
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollAndToastCleaner />

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/crops"
          element={
            <ProtectedRoute>
              <Crops />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-crop"
          element={
            <ProtectedRoute>
              <AddCrop />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-crop/:id"
          element={
            <ProtectedRoute>
              <EditCrop />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/disease"
          element={
            <ProtectedRoute>
              <DiseaseDetection />
            </ProtectedRoute>
          }
        />

        {/* fallback: redirect to login for unknown routes */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

export default App;
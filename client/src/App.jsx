import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Crops from "./Pages/Crops";
import AddCrop from "./pages/AddCrop";
import EditCrop from "./pages/EditCrop";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import DiseaseDetection from "./pages/DiseaseDetection";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/crops" element={<Crops />} />
        <Route path="/add-crop" element={<AddCrop />} />
        <Route path="/edit-crop/:id" element={<EditCrop />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<Profile />} />
        <Route
    path="/disease"
    element={<DiseaseDetection />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
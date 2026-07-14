import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import Crops from "./Pages/Crops";
import AddCrop from "./Pages/AddCrop";
import EditCrop from "./Pages/EditCrop";
import Analytics from "./Pages/Analytics";
import Profile from "./Pages/Profile";
import DiseaseDetection from "./Pages/DiseaseDetection";

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
        <Route path="/disease" element={<DiseaseDetection />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
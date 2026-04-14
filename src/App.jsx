// src/App.jsx
// Top-level app shell. Owns the selected category state and
// wires the components together. Add new pages/routes here.

import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { categories, placesData } from "./data/places";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import PlaceGrid from "./components/PlaceGrid";
import ParanormalDashboard from "./components/ParanormalDashboard";
import SpiritPassport from "./components/SpiritPassport";
import ToolkitDashboard from "./components/Toolkit/ToolkitDashboard";
import EMFVisualizer from "./components/Toolkit/EMFVisualizer";
import EVPRecorder from "./components/Toolkit/EVPRecorder";
import GhostLight from "./components/Toolkit/GhostLight";
import ARView from "./components/ARView";
import GearShop from "./components/GearShop";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import MemberProfile from "./components/Profile/MemberProfile";
import { AuthProvider } from "./context/AuthProvider";

/* ── Category-based pages (Home / Music / Hiking / etc.) ── */
function CategoryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get("category");

  const handleSelect = (categoryId) => {
    if (categoryId === "paranormal") {
      navigate("/paranormal");
    } else {
      navigate(`/?category=${categoryId}`);
    }
  };

  const currentPlaces = selectedCategory ? placesData[selectedCategory] : null;

  return (
    <>
      <CategoryNav
        categories={categories}
        selected={selectedCategory}
        onSelect={handleSelect}
      />
      {currentPlaces ? (
        <PlaceGrid places={currentPlaces} />
      ) : (
        <ParanormalDashboard showNav={false} />
      )}
    </>
  );
}

/* ── Paranormal dedicated route ── */
function ParanormalPage() {
  const navigate = useNavigate();

  const handleSelect = (categoryId) => {
    if (categoryId === "paranormal") {
      navigate("/paranormal");
    } else {
      navigate(`/?category=${categoryId}`);
    }
  };

  return (
    <>
      <CategoryNav
        categories={categories}
        selected="paranormal"
        onSelect={handleSelect}
      />
      <ParanormalDashboard />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-deep-charcoal flex flex-col items-center pb-12 transition-colors duration-500 text-white">
        <Header />
        <Routes>
          <Route path="/" element={<CategoryPage />} />
          <Route path="/paranormal" element={<ParanormalPage />} />
          <Route path="/passport" element={<SpiritPassport />} />
          <Route path="/toolkit" element={<ToolkitDashboard />} />
          <Route path="/toolkit/emf" element={<EMFVisualizer />} />
          <Route path="/toolkit/evp" element={<EVPRecorder />} />
          <Route path="/toolkit/ghostlight" element={<GhostLight />} />
          <Route path="/ar-view" element={<ARView />} />
          <Route path="/gear-shop" element={<GearShop />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<MemberProfile />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
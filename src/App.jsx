// src/App.jsx
// Top-level app shell. Owns the selected category state and
// wires the components together. Add new pages/routes here.

import { useState } from "react";
import { categories, placesData } from "./data/places";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import PlaceGrid from "./components/PlaceGrid";

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const currentPlaces = selectedCategory ? placesData[selectedCategory] : null;

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center pb-12">
      <Header />

      <CategoryNav
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {selectedCategory && <PlaceGrid places={currentPlaces} />}
    </div>
  );
}

export default App;
// src/components/PlaceGrid.jsx
// Renders the responsive grid of PlaceCard components.
// Props:
//   places – array of place objects for the selected category

import PlaceCard from "./PlaceCard";

export default function PlaceGrid({ places }) {
    if (places.length === 0) {
        return (
            <p className="col-span-full text-center text-gray-500 text-lg mt-12">
                Coming soon! Check back later.
            </p>
        );
    }

    return (
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 w-11/12 max-w-6xl">
            {places.map((place) => (
                <PlaceCard key={place.id} place={place} />
            ))}
        </main>
    );
}

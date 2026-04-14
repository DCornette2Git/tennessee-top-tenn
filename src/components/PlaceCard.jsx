// src/components/PlaceCard.jsx
// Renders a single place card with image, name, city, description, and link.
// Props:
//   place – { id, name, city, description, link, image }
//   isParanormal – boolean, toggles paranormal-specific styling

import { Link } from "react-router-dom";

export default function PlaceCard({ place, isParanormal }) {
    const { name, city, description, link, image } = place;
    // Prepend BASE_URL so images resolve correctly on GitHub Pages
    const imagePath = image ? `${import.meta.env.BASE_URL}${image}` : null;

    return (
        <div
            className={`rounded-xl shadow-pop overflow-hidden hover:shadow-lg transition-shadow duration-200 ${
                isParanormal
                    ? "bg-gray-900 border border-spectral-green shadow-[0_0_15px_rgba(0,255,65,0.1)]"
                    : "bg-gray-800 border border-gray-700"
            }`}
        >
            {image && (
                <img
                    src={imagePath}
                    alt={name}
                    className="w-full h-48 object-cover"
                />
            )}
            <div className="p-4">
                <h2
                    className={`text-lg font-bold mb-1 ${
                        isParanormal ? "text-spectral-green" : "text-gray-100"
                    }`}
                >
                    {name}
                </h2>
                <p className="text-sm text-orange-500 font-medium mb-2">
                    {city}
                </p>
                <p
                    className={`text-sm mb-3 ${
                        isParanormal ? "text-gray-300" : "text-gray-400"
                    }`}
                >
                    {description}
                </p>

                <div className="flex gap-2 mt-4">
                    <a
                        href={image ? `${link}?ref=tennessee_top_tenn_affiliate` : "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`font-semibold text-xs py-2 px-3 rounded transition-colors ${
                            isParanormal 
                                ? "bg-warning-orange text-black hover:bg-orange-600" 
                                : "bg-blue-600 text-white hover:bg-blue-500"
                        }`}
                    >
                        {isParanormal ? "Book Investigation" : "Get Tickets"}
                    </a>
                    
                    {isParanormal && (
                        <Link
                            to="/ar-view"
                            className="bg-spectral-green text-black font-semibold text-xs py-2 px-3 rounded hover:bg-green-600 transition-colors"
                        >
                            Scan AR Anomaly
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

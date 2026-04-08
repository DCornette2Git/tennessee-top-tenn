// src/components/PlaceCard.jsx
// Renders a single place card with image, name, city, description, and link.
// Props:
//   place – { id, name, city, description, link, image }

export default function PlaceCard({ place }) {
    const { name, city, description, link, image } = place;

    return (
        <div className="bg-white rounded-xl shadow-pop overflow-hidden hover:shadow-lg transition-shadow duration-200">
            {image && (
                <img
                    src={image}
                    alt={name}
                    className="w-full h-48 object-cover"
                />
            )}
            <div className="p-4">
                <h2 className="text-lg font-bold text-gray-800 mb-1">{name}</h2>
                <p className="text-sm text-orange-500 font-medium mb-2">{city}</p>
                <p className="text-gray-600 text-sm mb-3">{description}</p>
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 font-semibold text-sm hover:text-orange-800 transition-colors"
                >
                    Visit →
                </a>
            </div>
        </div>
    );
}

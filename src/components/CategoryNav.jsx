// src/components/CategoryNav.jsx
// Renders the row of category filter buttons.
// Props:
//   categories      – array of { id, name } objects
//   selected        – id of the currently selected category (or null)
//   onSelect(id)    – callback fired when a button is clicked

export default function CategoryNav({ categories, selected, onSelect }) {
    return (
        <nav className="flex flex-wrap justify-center mt-12 gap-4 px-4">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onSelect(cat.id)}
                    className={`px-6 py-3 rounded-lg border border-transparent font-semibold text-base transition-all duration-200 cursor-pointer shadow-pop hover:scale-110
            ${selected === cat.id
                            ? "bg-yellow-400 text-black border-2 border-black font-bold shadow-lg scale-105"
                            : "bg-white text-gray-700 hover:bg-lime-400 hover:text-black hover:border-black hover:shadow"
                        }
            ${cat.id === 'paranormal' ? 'paranormal-hover' : ''}`}
                >
                    {cat.name}
                </button>
            ))}
        </nav>
    );
}

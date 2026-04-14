import { Link } from "react-router-dom";

const PRODUCTS = [
    {
        id: 1,
        name: "K2 Professional EMF Meter",
        brand: "K-II Enterprises",
        description: "The legendary device for accurately hunting anomalous electromagnetic spikes.",
        price: "$59.90",
        rating: "★★★★★",
        link: "https://amazon.com"
    },
    {
        id: 2,
        name: "EVP Digital Voice Recorder",
        brand: "Sony",
        description: "High-fidelity audio recording capability optimized for capturing Class A electronic voice phenomena.",
        price: "$45.00",
        rating: "★★★★☆",
        link: "https://amazon.com"
    },
    {
        id: 3,
        name: "Full Spectrum Infrared Camera",
        brand: "Phasmatic",
        description: "Records in zero-light environments capturing wavelengths invisible to the human eye.",
        price: "$199.99",
        rating: "★★★★★",
        link: "https://amazon.com"
    },
    {
        id: 4,
        name: "P-SB7 Spirit Box",
        brand: "DAS",
        description: "Rapidly sweeps radio frequencies generating white noise to enable real-time spiritual communication.",
        price: "$89.90",
        rating: "★★★★★",
        link: "https://amazon.com"
    },
    {
        id: 5,
        name: "Laser Grid Pen",
        brand: "GhostTech",
        description: "Emits a high-intensity green dot matrix mapping out the environment to catch shadow anomalies.",
        price: "$15.99",
        rating: "★★★☆☆",
        link: "https://amazon.com"
    },
    {
        id: 6,
        name: "REM Pod (Proximity Sensor)",
        brand: "ParaKit",
        description: "Triggers intense spectral alarms when energetic disturbances enter its radiating field.",
        price: "$149.00",
        rating: "★★★★☆",
        link: "https://amazon.com"
    }
];

export default function GearShop() {
    return (
        <div className="w-full max-w-6xl mt-8 px-4 font-mono">
            
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-200 mb-2 uppercase tracking-widest" style={{ fontFamily: "'Creepster', cursive" }}>Hunter's Gear Shop</h2>
                <p className="text-gray-400 text-sm">Recommended equipment for your investigations. <span className="text-gray-500 italic">(As an affiliate, we earn from qualifying purchases.)</span></p>
            </div>
            
            <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {PRODUCTS.map((product) => (
                    <div key={product.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:shadow-[0_0_15px_rgba(0,255,65,0.1)] hover:border-spectral-green transition-all duration-300 flex flex-col">
                        
                        {/* Placeholder tactical image style */}
                        <div className="h-40 bg-gray-900 border-b border-gray-700 flex items-center justify-center p-4 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC41Ii8+PC9zdmc+')] mix-blend-overlay"></div>
                            <span className="text-6xl grayscale opacity-50">🛠️</span>
                            <div className="absolute top-2 right-2 bg-black/60 text-[10px] text-gray-400 px-2 py-0.5 rounded border border-gray-600">IN STOCK</div>
                        </div>

                        <div className="p-5 flex flex-col flex-grow">
                            <p className="text-[10px] text-spectral-green font-bold tracking-widest mb-1">{product.brand.toUpperCase()}</p>
                            <h3 className="text-lg font-bold text-gray-100 mb-2 leading-tight">{product.name}</h3>
                            <p className="text-xs text-gray-400 mb-4 flex-grow">{product.description}</p>
                            
                            <div className="flex justify-between items-end mt-2">
                                <div>
                                    <p className="text-xs text-yellow-500">{product.rating}</p>
                                    <p className="text-lg font-bold text-gray-200">{product.price}</p>
                                </div>
                                <a 
                                    href={`${product.link}?ref=tenn_top_tenn_affiliate_id`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="bg-gray-900 border border-spectral-green text-spectral-green font-bold text-xs py-2 px-4 rounded hover:bg-spectral-green hover:text-black transition-colors"
                                >
                                    View Hardware
                                </a>
                            </div>
                        </div>

                    </div>
                ))}
            </main>
            
            <div className="text-center mt-10">
                <Link to="/paranormal" className="inline-block text-warning-orange hover:text-white transition-colors underline uppercase tracking-widest text-sm">← Abort & Return to Dashboard</Link>
            </div>
        </div>
    );
}

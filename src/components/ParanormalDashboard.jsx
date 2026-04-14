import { Link } from "react-router-dom";
import { placesData } from "../data/places";
import PlaceCard from "./PlaceCard";

export default function ParanormalDashboard() {
    const paranormalPlaces = placesData["paranormal"];

    return (
        <div className="w-full max-w-6xl mt-8 px-4">
            <div className="flex flex-col md:flex-row justify-between items-center bg-gray-900 border border-spectral-green p-6 rounded-xl shadow-lg mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-spectral-green mb-2 text-center" style={{ fontFamily: "'Creepster', cursive" }}>Paranormal Investigation Hub</h2>
                    <p className="text-gray-300 text-sm">Select a tool or browse the 10 haunted hotspots in Tennessee.</p>
                </div>
                <div className="flex gap-4 mt-4 md:mt-0 flex-wrap">
                    <Link to="/passport" className="bg-deep-charcoal border border-warning-orange text-warning-orange px-4 py-2 rounded font-bold hover:bg-warning-orange hover:text-black transition-colors">
                        Spirit Passport
                    </Link>
                    <Link to="/toolkit" className="bg-deep-charcoal border border-spectral-green text-spectral-green px-4 py-2 rounded font-bold hover:bg-spectral-green hover:text-black transition-colors">
                        Toolkit
                    </Link>
                    <Link to="/gear-shop" className="bg-deep-charcoal border border-gray-400 text-gray-400 px-4 py-2 rounded font-bold hover:bg-gray-400 hover:text-black transition-colors">
                        Gear Shop
                    </Link>
                </div>
            </div>

            <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paranormalPlaces.map((place) => (
                    <PlaceCard key={place.id} place={place} isParanormal={true} />
                ))}
            </main>
        </div>
    );
}

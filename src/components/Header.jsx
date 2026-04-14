import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Header() {
    const { isLoggedIn, currentUser } = useAuth();

    return (
        <header className="mt-8 md:mt-16 text-center px-4 w-full max-w-6xl relative">
            <div className="absolute top-0 right-4 flex gap-4">
                {isLoggedIn ? (
                    <Link to="/profile" className="flex items-center gap-2 bg-gray-900 border border-spectral-green px-3 py-1 rounded-full hover:bg-spectral-green hover:text-black transition-all text-xs font-bold font-mono">
                        <span className="w-2 h-2 bg-spectral-green rounded-full animate-pulse"></span>
                        {currentUser.username.toUpperCase()}
                    </Link>
                ) : (
                    <div className="flex gap-2">
                        <Link to="/login" className="bg-gray-800 border border-gray-600 text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-700 transition-colors uppercase font-bold font-mono">
                            Login
                        </Link>
                        <Link to="/register" className="bg-spectral-green text-black px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors uppercase font-bold font-mono shadow-[0_0_10px_rgba(0,255,65,0.3)]">
                            Join
                        </Link>
                    </div>
                )}
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-orange-600 leading-tight mt-8">
                Tennessee's Top Tenn to See
            </h1>
            <p className="text-orange-500 text-lg md:text-2xl mt-4 max-w-2xl mx-auto text-shadow-pop">
                Discover the best Paranormal, Music, Movies, Hiking, and Historical spots in TN.
            </p>
        </header>
    );
}

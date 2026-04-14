import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function MemberProfile() {
    const { currentUser, logout, session } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    if (!currentUser) {
        return (
            <div className="mt-20 text-center">
                <p className="text-gray-400 mb-4">Unauthorized Access Attempt or Syncing Profile...</p>
                <Link to="/login" className="text-spectral-green underline">Return to Login</Link>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mt-12 px-4 font-mono">
            <div className="bg-gray-900 border border-spectral-green rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,255,65,0.1)]">
                
                {/* ID Header Section */}
                <div className="bg-black/50 p-8 border-b border-spectral-green/30 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-gray-800 border-2 border-spectral-green flex items-center justify-center text-4xl shadow-[0_0_15px_rgba(0,255,65,0.2)]">
                            🕵️
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-1 uppercase tracking-tight">{currentUser.username}</h2>
                            <p className="text-spectral-green text-xs font-bold tracking-widest">{currentUser.tier.toUpperCase()}</p>
                            <p className="text-gray-500 text-[10px] mt-2 uppercase">ID: {currentUser.id}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="bg-red-900/20 border border-red-500/50 text-red-500 text-xs px-4 py-2 rounded hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest"
                    >
                        Deauthorize Session
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    <div className="space-y-6">
                        <section>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">Status Reports</h3>
                            <div className="bg-black/40 p-4 border border-gray-800 rounded">
                                <p className="text-sm text-gray-300 italic mb-2">"Active investigator session confirmed. No environmental spikes detected in current zone."</p>
                                <div className="flex gap-2">
                                    <span className="w-2 h-2 bg-spectral-green rounded-full animate-pulse"></span>
                                    <span className="text-[10px] text-spectral-green uppercase">System Nominal</span>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">Contact Ledger</h3>
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-500 uppercase">E-MAIL</p>
                                <p className="text-sm text-white">{session?.user?.email}</p>
                            </div>
                        </section>
                    </div>

                    <div className="space-y-6">
                        <section>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">Unlocked Badges</h3>
                            <div className="flex flex-wrap gap-3">
                                <div className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-xl grayscale opacity-30" title="Founder Badge">🏆</div>
                                <div className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-xl grayscale opacity-30" title="Night Owl">🦉</div>
                                <div className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-xl grayscale opacity-30" title="First Encounter">✨</div>
                                <p className="text-[10px] text-gray-600 mt-2 block w-full">Complete Spirit Passport stamps to unlock specialized commendations.</p>
                            </div>
                        </section>
                        
                        <div className="p-6 bg-spectral-green/5 border border-spectral-green/20 rounded-xl">
                            <h4 className="text-spectral-green text-sm font-bold mb-2 uppercase">Pro Tip: Sync Passport</h4>
                            <p className="text-gray-400 text-xs leading-relaxed">Ensure you are logged in while visiting locations to automatically register your findings to this researcher ID.</p>
                            <Link to="/passport" className="mt-4 inline-block text-[10px] text-spectral-green border border-spectral-green px-3 py-1 rounded hover:bg-spectral-green hover:text-black transition-all">Go to Passport →</Link>
                        </div>
                    </div>

                </div>

            </div>

            <div className="text-center mt-12">
                <Link to="/paranormal" className="text-gray-500 hover:text-white text-[10px] uppercase tracking-tighter">← Back to Dashboard</Link>
            </div>
        </div>
    );
}

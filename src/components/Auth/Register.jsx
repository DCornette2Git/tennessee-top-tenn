import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await register(username, email, password);
            navigate("/login?registered=true");
        } catch (err) {
            setError(err.message || "An error occurred during secure initialization.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mt-12 px-4 font-mono">
            <div className="bg-gray-900 border border-spectral-green rounded-xl p-8 shadow-[0_0_20px_rgba(0,255,65,0.15)]">
                <h2 className="text-3xl font-bold text-spectral-green mb-2 text-center" style={{ fontFamily: "'Creepster', cursive" }}>
                    New Investigator
                </h2>
                <p className="text-gray-400 text-sm mb-8 text-center uppercase tracking-widest">Connect to Cloud Identity</p>
                
                {error && (
                    <div className="bg-red-900/40 border border-red-500 text-red-100 p-3 rounded mb-6 text-xs text-center">
                        ERROR: {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 text-[10px] uppercase mb-1 font-bold">Investigator Name</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-black border border-gray-700 text-white p-3 rounded focus:border-spectral-green outline-none transition-colors"
                            placeholder="e.g. GhostHunter101"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-400 text-[10px] uppercase mb-1 font-bold">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-black border border-gray-700 text-white p-3 rounded focus:border-spectral-green outline-none transition-colors"
                            placeholder="researcher@tenn-top-tenn.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-400 text-[10px] uppercase mb-1 font-bold">Secure Password</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-black border border-gray-700 text-white p-3 rounded focus:border-spectral-green outline-none transition-colors"
                            placeholder="Minimum 8 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={8}
                        />
                        <p className="text-[10px] text-gray-500 mt-1 italic">Identity processed via encrypted Supabase security protocols.</p>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 rounded font-bold uppercase tracking-widest transition-all ${
                            isLoading 
                                ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
                                : "bg-spectral-green text-black hover:bg-green-600 shadow-[0_0_15px_rgba(0,255,65,0.4)]"
                        }`}
                    >
                        {isLoading ? "Synchronizing..." : "Initialize Profile"}
                    </button>
                </form>
                
                <div className="mt-8 text-center text-xs">
                    <span className="text-gray-500">Already a member?</span>{" "}
                    <Link to="/login" className="text-spectral-green hover:underline">Sign In Here</Link>
                </div>
            </div>
            
            <div className="text-center mt-8">
                <Link to="/paranormal" className="text-gray-500 hover:text-white text-[10px] uppercase tracking-tighter">← Return to Dashboard</Link>
            </div>
        </div>
    );
}

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Check for "registered=true" query param
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get("registered") === "true") {
            setSuccessMsg("Registration Successful. Please log in with your new credentials.");
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");
        setIsLoading(true);

        try {
            await login(email, password);
            navigate("/profile");
        } catch (err) {
            setError(err.message || "Invalid credentials for this researcher ID.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mt-12 px-4 font-mono">
            <div className="bg-gray-900 border border-spectral-green rounded-xl p-8 shadow-[0_0_20px_rgba(0,255,65,0.15)]">
                <h2 className="text-3xl font-bold text-spectral-green mb-2 text-center" style={{ fontFamily: "'Creepster', cursive" }}>
                    Identify Member
                </h2>
                <p className="text-gray-400 text-sm mb-8 text-center uppercase tracking-widest">Secure Access Point</p>
                
                {successMsg && (
                    <div className="bg-green-900/40 border border-green-500 text-green-100 p-3 rounded mb-6 text-xs text-center font-bold">
                        {successMsg}
                    </div>
                )}
                
                {error && (
                    <div className="bg-red-900/40 border border-red-500 text-red-100 p-3 rounded mb-6 text-xs text-center">
                        ERROR: {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 text-[10px] uppercase mb-1 font-bold">Member Email</label>
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
                        <label className="block text-gray-400 text-[10px] uppercase mb-1 font-bold">Password Key</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-black border border-gray-700 text-white p-3 rounded focus:border-spectral-green outline-none transition-colors"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
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
                        {isLoading ? "Authenticating..." : "Authorize Access"}
                    </button>
                </form>
                
                <div className="mt-8 text-center text-xs">
                    <span className="text-gray-500">Not a registered investigator?</span>{" "}
                    <Link to="/register" className="text-spectral-green hover:underline">Join the Hunt</Link>
                </div>
            </div>
            
            <div className="text-center mt-8">
                <Link to="/" className="text-gray-500 hover:text-white text-[10px] uppercase tracking-tighter">← Return to Dashboard</Link>
            </div>
        </div>
    );
}

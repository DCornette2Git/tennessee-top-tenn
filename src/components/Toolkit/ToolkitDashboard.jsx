import { Link } from "react-router-dom";

export default function ToolkitDashboard() {
    return (
        <div className="w-full max-w-4xl mt-8 px-4 text-center">
            <h2 className="text-3xl font-bold text-spectral-green mb-4" style={{ fontFamily: "'Creepster', cursive" }}>Investigation Toolkit</h2>
            <p className="text-gray-300 mb-8">Select a tool to analyze the environment.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/toolkit/emf" className="bg-gray-900 border border-spectral-green p-6 rounded-xl shadow-lg hover:bg-spectral-green hover:text-black transition-colors group">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-black text-spectral-green">EMF Visualizer</h3>
                    <p className="text-sm group-hover:text-black text-gray-400">Measure electromagnetic anomalies using your device's sensors.</p>
                </Link>
                <Link to="/toolkit/evp" className="bg-gray-900 border border-blue-400 p-6 rounded-xl shadow-lg hover:bg-blue-400 hover:text-black transition-colors group">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-black text-blue-400">EVP Recorder</h3>
                    <p className="text-sm group-hover:text-black text-gray-400">Capture anomalous audio with a real-time spectrogram.</p>
                </Link>
                <Link to="/toolkit/ghostlight" className="bg-gray-900 border border-red-500 p-6 rounded-xl shadow-lg hover:bg-red-500 hover:text-white transition-colors group">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-white text-red-500">Ghost Light</h3>
                    <p className="text-sm group-hover:text-white text-gray-400">Toggle a high-intensity red-light filter for night vision.</p>
                </Link>
            </div>
            
            <Link to="/paranormal" className="mt-8 inline-block text-warning-orange hover:text-white underline">← Back to Dashboard</Link>
        </div>
    );
}

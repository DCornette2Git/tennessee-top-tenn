import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function GhostLight() {
    const [isActive, setIsActive] = useState(false);
    const [status, setStatus] = useState("Ready");
    const [hasTorch, setHasTorch] = useState(false);
    const trackRef = useRef(null);

    // Initialize camera flash access
    const toggleLight = async () => {
        if (isActive) {
            // Turn off
            setIsActive(false);
            if (trackRef.current) {
                try {
                    await trackRef.current.applyConstraints({
                        advanced: [{ torch: false }]
                    });
                    trackRef.current.stop();
                    trackRef.current = null;
                } catch (e) {
                    console.error("Error disabling torch:", e);
                }
            }
            setStatus("Ready");
        } else {
            // Turn on
            setIsActive(true);
            try {
                // Request camera with environment facing mode
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" }
                });
                
                const track = stream.getVideoTracks()[0];
                const capabilities = track.getCapabilities();

                // Check if torch (flash) is supported
                if (!capabilities.torch) {
                    setStatus("Night Vision ON (Torch not supported on this device)");
                    setHasTorch(false);
                } else {
                    await track.applyConstraints({
                        advanced: [{ torch: true }]
                    });
                    trackRef.current = track;
                    setHasTorch(true);
                    setStatus("Night Vision & Torch ON");
                }
                
                // Immediately stop track if torch not supported so we don't hold camera
                if (!capabilities.torch) {
                    track.stop();
                }

            } catch (err) {
                console.error("Torch error:", err);
                setStatus(`Night Vision ON (Camera access denied/failed)`);
                setHasTorch(false);
            }
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (trackRef.current) {
                try {
                    trackRef.current.applyConstraints({
                        advanced: [{ torch: false }]
                    }).catch(e => console.error("Unmount torch error:", e));
                    trackRef.current.stop();
                } catch {
                    // Ignore errors during unmount cleanup
                }
            }
        };
    }, []);

    return (
        <>
            {/* Global Red Screen Filter */}
            {isActive && (
                <div className="fixed inset-0 bg-red-600/30 pointer-events-none mix-blend-multiply z-40 transition-opacity duration-300 pointer-events-none" />
            )}

            <div className="w-full max-w-lg mt-12 px-4 text-center relative z-50">
                <h2 className="text-3xl font-bold text-red-500 mb-4" style={{ fontFamily: "'Creepster', cursive" }}>Ghost Light</h2>
                
                <div className={`bg-gray-900 border ${isActive ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]' : 'border-gray-700'} rounded-xl p-8 transition-all duration-500`}>
                    <p className={`text-sm mb-8 ${isActive ? 'text-red-400 font-bold' : 'text-gray-400'}`}>
                        {status}
                    </p>
                    
                    <button 
                        onClick={toggleLight}
                        className={`
                            relative w-48 h-48 rounded-full font-bold text-2xl transition-all duration-300 mx-auto flex items-center justify-center flex-col gap-2 border-4
                            ${isActive 
                                ? 'bg-red-600 text-white border-red-400 shadow-[0_0_50px_rgba(239,68,68,0.8)] scale-105' 
                                : 'bg-gray-800 text-gray-400 border-gray-600 hover:bg-gray-700 focus:outline-none'
                            }
                        `}
                    >
                        <span className="text-4xl">{isActive ? '🔦' : '🌑'}</span>
                        <span className="uppercase tracking-widest">{isActive ? 'TURN OFF' : 'TURN ON'}</span>
                    </button>

                    {isActive && hasTorch && (
                        <p className="text-xs text-red-400 mt-6 max-w-xs mx-auto">
                            Hardware flashlight activated. Warning: Continuous use drains battery quickly.
                        </p>
                    )}
                </div>
                
                <Link to="/paranormal" className={`mt-8 inline-block underline transition-colors ${isActive ? 'text-red-400 hover:text-red-300' : 'text-warning-orange hover:text-white'}`}>
                    ← Back to Dashboard
                </Link>
            </div>
        </>
    );
}

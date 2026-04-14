import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { placesData } from "../data/places";

// Distance threshold for anomaly appearance (approx 50 feet / 15 meters)
const ANOMALY_RADIUS_M = 15;

// Haversine distance calc (meters)
function haversineDistance(lat1, lng1, lat2, lng2) {
    const R = 6371e3; // Earth radius in meters
    const toRad = deg => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function ARView() {
    const [cameraStream, setCameraStream] = useState(null);
    const [geoStatus, setGeoStatus] = useState("Acquiring GPS...");
    const [userPos, setUserPos] = useState(null);
    const [closestHotspot, setClosestHotspot] = useState(null);
    const [distance, setDistance] = useState(Infinity);
    const [devOverride, setDevOverride] = useState(false);
    
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    
    // Find closest location whenever position or devOverride changes
    useEffect(() => {
        const paranormalPlaces = placesData["paranormal"];
        
        let targetPlace = null;
        let minDistance = Infinity;

        // If devOverride is on and we want to lock to the first location
        if (devOverride) {
            targetPlace = paranormalPlaces[0];
            minDistance = 5; // force it to be < 15
        } else if (userPos) {
            // Find closest from actual position
            paranormalPlaces.forEach(place => {
                const dist = haversineDistance(userPos.lat, userPos.lng, place.lat, place.lng);
                if (dist < minDistance) {
                    minDistance = dist;
                    targetPlace = place;
                }
            });
        }
        
        setClosestHotspot(targetPlace);
        setDistance(minDistance);
    }, [userPos, devOverride]);

    // Handle initial Camera and GPS
    useEffect(() => {
        let watchId = null;

        const initCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: "environment" } 
                });
                setCameraStream(stream);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (e) {
                console.error("Camera error:", e);
                setGeoStatus("Camera Access Denied");
            }
        };

        const initGPS = () => {
            if (!navigator.geolocation) {
                setGeoStatus("GPS not supported");
                return;
            }
            watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                    if (!devOverride) setGeoStatus("SATELLITE LOCK ACQUIRED");
                },
                (err) => {
                    console.error(err);
                    setGeoStatus("LOCATION ERROR - AWAITING SIGNAL");
                },
                { enableHighAccuracy: true }
            );
        };

        initCamera();
        initGPS();

        return () => {
            if (watchId !== null) navigator.geolocation.clearWatch(watchId);
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Canvas rendering for the Capture & Share functionality
    const captureScene = useCallback(() => {
        if (!videoRef.current || !canvasRef.current || !closestHotspot) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Sync canvas resolution to natural video resolution
        canvas.width = video.videoWidth || window.innerWidth;
        canvas.height = video.videoHeight || window.innerHeight;

        // 1. Draw camera frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 2. Draw Anomaly (Simulating the CSS overlay)
        // Draw a glowing spectral green orb in center
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        
        const gradient = ctx.createRadialGradient(cx, cy, 10, cx, cy, canvas.width/3);
        gradient.addColorStop(0, 'rgba(0, 255, 65, 0.8)');
        gradient.addColorStop(0.2, 'rgba(0, 255, 65, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 255, 65, 0)');
        
        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add random static lines for ghost effect
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(0, 255, 65, 0.1)";
        for (let i = 0; i < 50; i++) {
            ctx.beginPath();
            ctx.moveTo(0, Math.random() * canvas.height);
            ctx.lineTo(canvas.width, Math.random() * canvas.height);
            ctx.stroke();
        }

        // 3. Draw Watermark
        ctx.globalCompositeOperation = "source-over"; // Reset composite
        const margin = 20;

        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.beginPath();
        ctx.roundRect(margin, canvas.height - 100 - margin, canvas.width - (margin*2), 100, 15);
        ctx.fill();

        ctx.fillStyle = "#FF5722"; // warning-orange
        ctx.font = "bold 24px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("TENNESSEE'S TOP TENN: AR INVESTIGATION", margin + 20, canvas.height - margin - 60);

        ctx.fillStyle = "#00FF41"; // spectral-green
        ctx.font = "20px monospace";
        ctx.fillText(`LOCATION: ${closestHotspot.name.toUpperCase()}`, margin + 20, canvas.height - margin - 30);
        ctx.fillStyle = "#A0AEC0"; // gray-400
        ctx.font = "16px monospace";
        ctx.fillText(`ANOMALY DETECTED AT COORD: ${closestHotspot.lat.toFixed(4)}, ${closestHotspot.lng.toFixed(4)}`, margin + 20, canvas.height - margin - 10);

        // Export and Trigger Download
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `Tennessee_Paranormal_AR_${Date.now()}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }, [closestHotspot]);

    const isAnomalyActive = distance <= ANOMALY_RADIUS_M;

    return (
        <div className="w-full h-screen fixed inset-0 z-50 bg-black flex flex-col items-center justify-center font-mono">
            {/* Live Camera Background */}
            <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ${isAnomalyActive ? 'opacity-80' : 'opacity-100'}`}
            />
            
            {/* AR Overlay (Renders when within 50 feet / 15 meters) */}
            {isAnomalyActive && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center mix-blend-screen overflow-hidden">
                    {/* Pulsing Orb/Mist Effect */}
                    <div className="w-96 h-96 bg-spectral-green/40 rounded-full blur-3xl animate-pulse" />
                    {/* Static Interference overlay */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] pointer-events-none mix-blend-overlay"></div>
                </div>
            )}

            {/* Hidden Canvas processing context */}
            <canvas ref={canvasRef} className="hidden" />
            
            {/* UI overlay */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between p-4 md:p-8 border-4 border-spectral-green/50 box-border pointer-events-none">
                
                {/* Header HUD */}
                <div className="flex justify-between items-start pointer-events-auto">
                    <Link to="/paranormal" className="bg-black/70 border border-gray-500 text-white p-2 rounded text-sm hover:bg-black uppercase tracking-wider backdrop-blur-sm">
                        Abort Scan
                    </Link>
                    
                    <div className="flex flex-col items-end gap-2">
                        <div className={`text-xs p-2 rounded backdrop-blur-sm shadow-md font-bold ${isAnomalyActive ? 'bg-spectral-green/20 text-spectral-green border border-spectral-green' : 'bg-black/70 text-warning-orange border border-warning-orange'}`}>
                            {isAnomalyActive ? '!!! ANOMALY DETECTED !!!' : 'NO ANOMALIES NEARBY'}
                        </div>
                        
                        {closestHotspot && (
                            <div className="text-right text-[10px] sm:text-xs text-gray-300 bg-black/50 p-2 rounded backdrop-blur-sm">
                                <span className="text-white font-bold">{closestHotspot.name}</span><br />
                                DIST: {distance === Infinity ? '??' : Math.round(distance)}m (REQ: {ANOMALY_RADIUS_M}m) <br />
                                LAT: {userPos?.lat?.toFixed(5) || '??'} <br />
                                LNG: {userPos?.lng?.toFixed(5) || '??'}
                            </div>
                        )}
                        {!closestHotspot && (
                            <div className="text-right text-[10px] text-gray-400 bg-black/50 p-2 rounded">
                                {geoStatus}
                            </div>
                        )}
                        
                        {/* Dev Override Toggle */}
                        <button 
                            onClick={() => setDevOverride(!devOverride)}
                            className="bg-gray-800 text-gray-400 text-[10px] p-1 rounded mt-2 border border-gray-600 opacity-50 hover:opacity-100 transition-opacity"
                        >
                            {devOverride ? "Exit Simulator" : "DEV: Simulate Location"}
                        </button>
                    </div>
                </div>
                
                {/* Capture & Share Footer */}
                <div className="self-center flex flex-col items-center pointer-events-auto mb-10">
                    <button 
                        onClick={captureScene}
                        disabled={!isAnomalyActive}
                        className={`w-20 h-20 bg-black/30 backdrop-blur-sm border-4 rounded-full flex items-center justify-center transition-all ${isAnomalyActive ? 'border-spectral-green hover:bg-spectral-green/20 shadow-[0_0_20px_rgba(0,255,65,0.6)] cursor-pointer' : 'border-gray-600 opacity-50 cursor-not-allowed'}`}
                    >
                        <div className={`w-16 h-16 rounded-full transition-all ${isAnomalyActive ? 'bg-spectral-green hover:bg-white hover:scale-95' : 'bg-gray-600'}`}></div>
                    </button>
                    <span className={`mt-3 font-bold tracking-widest drop-shadow-md text-sm ${isAnomalyActive ? 'text-white' : 'text-gray-500'}`}>
                        {isAnomalyActive ? 'CAPTURE & SHARE' : 'SCANNING...'}
                    </span>
                </div>
                
            </div>
        </div>
    );
}

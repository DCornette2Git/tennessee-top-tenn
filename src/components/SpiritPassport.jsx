// src/components/SpiritPassport.jsx
// Gamified "Spirit Passport" — GPS check-ins at the 10 paranormal locations.
// Stores check-in history in localStorage. Ranks up as users visit more sites.

import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { placesData } from "../data/places";
import { useAuth } from "../hooks/useAuth";

/* ── Ranking tiers ── */
const RANKS = [
    { min: 0, title: "Novice Hunter", icon: "👻", color: "text-gray-400" },
    { min: 2, title: "Spirit Seeker", icon: "🔮", color: "text-blue-400" },
    { min: 4, title: "Ghost Tracker", icon: "🕯️", color: "text-purple-400" },
    { min: 7, title: "Phantom Warden", icon: "⚡", color: "text-warning-orange" },
    { min: 10, title: "Appalachian Expert", icon: "👑", color: "text-spectral-green" },
];

/* ── Distance threshold for valid check-in (meters) ── */
const CHECK_IN_RADIUS_M = 500;

/* ── localStorage key ── */
const STORAGE_KEY = "spiritPassport_checkIns";

/* ── Haversine formula: distance between two lat/lng points in meters ── */
function haversineDistance(lat1, lng1, lat2, lng2) {
    const R = 6_371_000; // Earth radius in meters
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ── Get rank for a visit count ── */
function getRank(visitCount) {
    let rank = RANKS[0];
    for (const r of RANKS) {
        if (visitCount >= r.min) rank = r;
    }
    return rank;
}

/* ── Format a timestamp to readable date ── */
function formatDate(ts) {
    return new Date(ts).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function SpiritPassport() {
    const paranormalPlaces = placesData["paranormal"];
    const { currentUser, updateProfile, isLoggedIn } = useAuth();
    
    const userStorageKey = currentUser 
        ? `${STORAGE_KEY}_${currentUser.id}` 
        : STORAGE_KEY;

    // Combined initialization logic
    const getInitialCheckIns = useCallback(() => {
        try {
            if (isLoggedIn && currentUser?.check_ins) {
                return currentUser.check_ins;
            }
            const stored = localStorage.getItem(userStorageKey);
            return stored ? JSON.parse(stored) : {};
        } catch {
            return {};
        }
    }, [userStorageKey, isLoggedIn, currentUser]);

    // Check-in map: { [placeId]: { timestamp, lat, lng } }
    const [checkIns, setCheckIns] = useState(getInitialCheckIns);

    const [geoStatus, setGeoStatus] = useState("idle"); // idle | loading | success | error | denied
    const [geoError, setGeoError] = useState(null);
    const [userPos, setUserPos] = useState(null);
    const [checkInResult, setCheckInResult] = useState(null); // { placeId, success, message }

    // Persist to localStorage whenever checkIns change
    useEffect(() => {
        localStorage.setItem(userStorageKey, JSON.stringify(checkIns));
        
        // SYNC TO CLOUD: If logged in, push updates to Supabase
        if (isLoggedIn && currentUser) {
            const cloudCheckins = currentUser.check_ins || {};
            if (JSON.stringify(checkIns) !== JSON.stringify(cloudCheckins)) {
                updateProfile({ check_ins: checkIns }).catch(console.error);
            }
        }
    }, [checkIns, userStorageKey, isLoggedIn, currentUser, updateProfile]);

    // Refresh check-ins IF the source data (user/cloud) changes externally
    useEffect(() => {
        setCheckIns(getInitialCheckIns());
    }, [getInitialCheckIns]);

    const visitCount = Object.keys(checkIns).length;
    const rank = getRank(visitCount);
    const nextRank = RANKS.find((r) => r.min > visitCount);

    /* ── Request GPS position ── */
    const requestLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setGeoStatus("error");
            setGeoError("Geolocation is not supported by your browser.");
            return;
        }

        setGeoStatus("loading");
        setGeoError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserPos({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                });
                setGeoStatus("success");
            },
            (err) => {
                setGeoStatus(err.code === 1 ? "denied" : "error");
                setGeoError(
                    err.code === 1
                        ? "Location permission denied. Please enable location access in your browser settings."
                        : `Unable to get location: ${err.message}`
                );
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    }, []);

    /* ── Attempt check-in at a specific place ── */
    const attemptCheckIn = useCallback(
        (place) => {
            if (!userPos) {
                setCheckInResult({
                    placeId: place.id,
                    success: false,
                    message: "Enable GPS first to check in.",
                });
                return;
            }

            if (checkIns[place.id]) {
                setCheckInResult({
                    placeId: place.id,
                    success: false,
                    message: `Already checked in on ${formatDate(checkIns[place.id].timestamp)}.`,
                });
                return;
            }

            const dist = haversineDistance(userPos.lat, userPos.lng, place.lat, place.lng);

            if (dist <= CHECK_IN_RADIUS_M) {
                const newCheckIn = {
                    timestamp: Date.now(),
                    lat: userPos.lat,
                    lng: userPos.lng,
                    distance: Math.round(dist),
                };
                setCheckIns((prev) => ({ ...prev, [place.id]: newCheckIn }));
                setCheckInResult({
                    placeId: place.id,
                    success: true,
                    message: `Check-in successful! You were ${Math.round(dist)}m away.`,
                });
            } else {
                setCheckInResult({
                    placeId: place.id,
                    success: false,
                    message: `Too far away — you're ${(dist / 1000).toFixed(1)} km from ${place.name}. Get within ${CHECK_IN_RADIUS_M}m to check in.`,
                });
            }
        },
        [userPos, checkIns]
    );




    return (
        <div className="w-full max-w-5xl mt-8 px-4">
            {/* ── Header / Rank Banner ── */}
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-spectral-green mb-2" style={{ fontFamily: "'Creepster', cursive" }}>
                    Spirit Passport
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                    Visit haunted locations across Tennessee to rank up.
                </p>

                <div className="bg-gray-900 border border-spectral-green rounded-xl p-6 shadow-[0_0_20px_rgba(0,255,65,0.15)] inline-block mx-auto">
                    <div className="text-5xl mb-2">{rank.icon}</div>
                    <div className={`text-2xl font-bold ${rank.color} mb-1`}>
                        {rank.title}
                    </div>
                    <div className="text-gray-400 text-sm">
                        {visitCount} / 10 locations visited
                    </div>

                    {/* Progress bar */}
                    <div className="w-64 h-3 bg-gray-800 rounded-full mt-3 overflow-hidden mx-auto">
                        <div
                            className="h-full bg-spectral-green rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${(visitCount / 10) * 100}%` }}
                        />
                    </div>

                    {nextRank && (
                        <p className="text-gray-500 text-xs mt-2">
                            {nextRank.min - visitCount} more to reach{" "}
                            <span className={nextRank.color}>{nextRank.icon} {nextRank.title}</span>
                        </p>
                    )}
                    {!nextRank && visitCount === 10 && (
                        <p className="text-spectral-green text-xs mt-2 font-bold">
                            🎉 All locations visited! You are a true Appalachian Expert!
                        </p>
                    )}
                </div>
            </div>

            {/* ── GPS Controls ── */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-3 h-3 rounded-full ${
                                geoStatus === "success"
                                    ? "bg-spectral-green animate-pulse"
                                    : geoStatus === "loading"
                                    ? "bg-yellow-400 animate-pulse"
                                    : geoStatus === "denied"
                                    ? "bg-red-500"
                                    : "bg-gray-600"
                            }`}
                        />
                        <span className="text-sm text-gray-300">
                            {geoStatus === "idle" && "GPS not active — tap to enable"}
                            {geoStatus === "loading" && "Acquiring your position..."}
                            {geoStatus === "success" &&
                                `Position locked (±${Math.round(userPos?.accuracy || 0)}m)`}
                            {geoStatus === "denied" && "Location access denied"}
                            {geoStatus === "error" && (geoError || "GPS error")}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={requestLocation}
                            className="bg-spectral-green text-black font-bold text-sm py-2 px-4 rounded hover:bg-green-400 transition-colors"
                        >
                            {geoStatus === "success" ? "Refresh GPS" : "Enable GPS"}
                        </button>

                    </div>
                </div>
                {geoError && (
                    <p className="text-red-400 text-xs mt-2">{geoError}</p>
                )}
            </div>

            {/* ── Check-in result toast ── */}
            {checkInResult && (
                <div
                    className={`rounded-lg p-3 mb-6 text-sm font-medium text-center border ${
                        checkInResult.success
                            ? "bg-green-900/40 border-spectral-green text-spectral-green"
                            : "bg-red-900/30 border-red-500 text-red-400"
                    }`}
                >
                    {checkInResult.message}
                </div>
            )}

            {/* ── Location Cards Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paranormalPlaces.map((place) => {
                    const isCheckedIn = !!checkIns[place.id];
                    const checkInData = checkIns[place.id];
                    const imagePath = place.image
                        ? `${import.meta.env.BASE_URL}${place.image}`
                        : null;

                    return (
                        <div
                            key={place.id}
                            className={`flex rounded-xl overflow-hidden border transition-all duration-300 ${
                                isCheckedIn
                                    ? "bg-gray-900 border-spectral-green shadow-[0_0_12px_rgba(0,255,65,0.15)]"
                                    : "bg-gray-900 border-gray-700 opacity-80 hover:opacity-100"
                            }`}
                        >
                            {/* Thumbnail */}
                            {imagePath && (
                                <img
                                    src={imagePath}
                                    alt={place.name}
                                    className={`w-28 h-auto object-cover flex-shrink-0 ${
                                        isCheckedIn ? "" : "grayscale"
                                    }`}
                                />
                            )}

                            {/* Info */}
                            <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg">
                                            {isCheckedIn ? "✅" : "📍"}
                                        </span>
                                        <h3
                                            className={`text-sm font-bold truncate ${
                                                isCheckedIn
                                                    ? "text-spectral-green"
                                                    : "text-gray-200"
                                            }`}
                                        >
                                            {place.name}
                                        </h3>
                                    </div>
                                    <p className="text-xs text-orange-500 mb-1">
                                        {place.city}
                                    </p>
                                    {isCheckedIn && (
                                        <p className="text-xs text-gray-500">
                                            Visited {formatDate(checkInData.timestamp)}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-2 mt-2">
                                    {!isCheckedIn && (
                                        <button
                                            onClick={() => attemptCheckIn(place)}
                                            disabled={geoStatus !== "success"}
                                            className={`text-xs font-bold py-1.5 px-3 rounded transition-colors ${
                                                geoStatus === "success"
                                                    ? "bg-warning-orange text-black hover:bg-orange-600"
                                                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
                                            }`}
                                        >
                                            Check In
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Rank Legend ── */}
            <div className="mt-10 bg-gray-900 border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-200 mb-4 text-center" style={{ fontFamily: "'Creepster', cursive" }}>
                    Rank Progression
                </h3>
                <div className="flex flex-wrap justify-center gap-4">
                    {RANKS.map((r) => (
                        <div
                            key={r.title}
                            className={`text-center px-4 py-3 rounded-lg border transition-all ${
                                rank.title === r.title
                                    ? "border-spectral-green bg-gray-800 scale-105"
                                    : "border-gray-700 bg-gray-900 opacity-60"
                            }`}
                        >
                            <div className="text-2xl mb-1">{r.icon}</div>
                            <div className={`text-xs font-bold ${r.color}`}>
                                {r.title}
                            </div>
                            <div className="text-[10px] text-gray-500">{r.min}+ visits</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Back link ── */}
            <div className="text-center mt-8">
                <Link
                    to="/paranormal"
                    className="text-warning-orange hover:text-white underline text-sm"
                >
                    ← Back to Dashboard
                </Link>
            </div>
        </div>
    );
}

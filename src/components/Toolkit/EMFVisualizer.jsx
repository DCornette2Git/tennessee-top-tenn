import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function EMFVisualizer() {
    const [emfValue, setEmfValue] = useState(0);
    const [status, setStatus] = useState("Initializing...");
    const [isSimulating, setIsSimulating] = useState(false);
    const [hasSensorError, setHasSensorError] = useState(false);
    
    const sensorRef = useRef(null);
    const simIntervalRef = useRef(null);

    // Stop real sensor
    const stopSensor = () => {
        if (sensorRef.current) {
            sensorRef.current.stop();
            sensorRef.current = null;
        }
    };

    // Stop simulation
    const stopSimulation = () => {
        if (simIntervalRef.current) {
            clearInterval(simIntervalRef.current);
            simIntervalRef.current = null;
        }
    };

    // Toggle simulation mode
    const handleToggleSimulate = () => {
        if (isSimulating) {
            setIsSimulating(false);
            stopSimulation();
            setEmfValue(0);
            initMagnetometer();
        } else {
            setIsSimulating(true);
            stopSensor();
            setStatus("Running Simulation Mode");
            startSimulation();
        }
    };

    const startSimulation = () => {
        // Base environmental EMF
        let base = 2.5; 
        simIntervalRef.current = setInterval(() => {
            // Randomly simulate a spike or slight fluctuation
            const isSpike = Math.random() > 0.9;
            const fluctuation = (Math.random() - 0.5) * 1.5;
            let current = base + fluctuation;
            
            if (isSpike) {
                current += Math.random() * 10 + 5; // Jump between 5 and 15 mG
            }
            
            // Constrain between 0 and 20 for our meter
            setEmfValue(Math.max(0, Math.min(20, current)));
        }, 300); // 300ms update rate
    };

    const initMagnetometer = () => {
        if (isSimulating) return;

        if ('Magnetometer' in window) {
            try {
                // Feature check / creation
                const magSensor = new window.Magnetometer({ frequency: 10 });
                
                magSensor.addEventListener('reading', () => {
                    // Calculate vector magnitude in microteslas (μT)
                    // 1 μT = 10 mG (milligauss)
                    const x = magSensor.x;
                    const y = magSensor.y;
                    const z = magSensor.z;
                    const magnitude_uT = Math.sqrt(x*x + y*y + z*z);
                    const magnitude_mG = magnitude_uT * 10;
                    
                    setEmfValue(magnitude_mG);
                });

                magSensor.addEventListener('error', (event) => {
                    setHasSensorError(true);
                    setStatus(`Sensor Error: ${event.error.name}`);
                    stopSensor();
                });

                magSensor.start();
                sensorRef.current = magSensor;
                setStatus("Active (Hardware Sensor)");
            } catch (err) {
                setHasSensorError(true);
                setStatus(`Cannot initialize sensor: ${err.message}`);
                console.error("Magnetometer error:", err);
            }
        } else {
            setHasSensorError(true);
            setStatus("Magnetometer API not supported on this device/browser.");
        }
    };

    useEffect(() => {
        initMagnetometer();
        
        return () => {
            stopSensor();
            stopSimulation();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Calculate styling color and width based on EMF
    // Let's assume normal is < 5 mG, elevated is 5-10 mG, high is > 10 mG
    // To map 0 - 20 mG into 0 - 100% width
    const percentage = Math.min(100, (emfValue / 20) * 100);
    
    let colorClass = "bg-spectral-green"; // Normal
    let textColorClass = "text-spectral-green";
    
    if (emfValue >= 10) {
        colorClass = "bg-red-500 animate-pulse";
        textColorClass = "text-red-500 font-bold";
    } else if (emfValue >= 5) {
        colorClass = "bg-warning-orange";
        textColorClass = "text-warning-orange";
    }

    return (
        <div className="w-full max-w-lg mt-12 px-4 text-center">
            <h2 className="text-3xl font-bold text-spectral-green mb-4" style={{ fontFamily: "'Creepster', cursive" }}>EMF Visualizer</h2>
            
            <div className={`bg-gray-900 border ${hasSensorError && !isSimulating ? "border-gray-500" : "border-spectral-green"} rounded-xl p-8 shadow-[0_0_20px_rgba(0,255,65,0.15)] transition-all`}>
                
                <div className="flex justify-between items-center mb-6">
                    <p className={`text-xs ${hasSensorError && !isSimulating ? "text-red-400" : "text-spectral-green"}`}>
                        Status: {status}
                    </p>
                    <button 
                        onClick={handleToggleSimulate}
                        className={`text-xs py-1 px-3 rounded font-bold ${isSimulating ? 'bg-spectral-green text-black' : 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700'}`}
                    >
                        {isSimulating ? "Stop Sim" : "Simulate"}
                    </button>
                </div>
                
                <div className={`text-6xl font-mono mb-2 transition-colors duration-200 ${textColorClass}`}>
                    {emfValue.toFixed(1)} <span className="text-xl">mG</span>
                </div>
                
                <p className="text-xs text-gray-400 mb-6 uppercase tracking-wider">Electromagnetic Field</p>
                
                {/* Meter Bar */}
                <div className="w-full h-8 bg-gray-800 rounded-full overflow-hidden border border-gray-700 relative">
                    <div 
                        className={`h-full transition-all duration-300 ease-out ${colorClass}`} 
                        style={{ width: `${percentage}%` }}
                    />
                    
                    {/* Markers */}
                    <div className="absolute top-0 left-1/4 w-px h-full bg-black/50" />
                    <div className="absolute top-0 left-2/4 w-px h-full bg-black/50" />
                    <div className="absolute top-0 left-3/4 w-px h-full bg-black/50" />
                </div>
                
                <div className="flex justify-between mt-2 text-[10px] text-gray-500 font-mono">
                    <span>0</span>
                    <span>5</span>
                    <span>10</span>
                    <span>15</span>
                    <span>20+</span>
                </div>
                
            </div>
            
            <Link to="/toolkit" className="mt-8 inline-block text-warning-orange hover:text-white underline">← Back to Toolkit</Link>
        </div>
    );
}

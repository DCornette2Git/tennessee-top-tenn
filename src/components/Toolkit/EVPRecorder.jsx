import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function EVPRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const [permissionStatus, setPermissionStatus] = useState("Awaiting Microphone...");
    const [error, setError] = useState(null);

    const canvasRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const animationRef = useRef(null);
    const sourceRef = useRef(null);

    // Initialize microphone and audio analyzer
    const initMicrophone = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setPermissionStatus("Microphone Ready");
            setError(null);

            // Set up MediaRecorder
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url);
                audioChunksRef.current = [];
            };

            // Set up AudioContext for visualization
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            audioContextRef.current = audioCtx;
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            analyserRef.current = analyser;

            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);
            sourceRef.current = source;

            // Start idle visualization
            drawVisualizer();

        } catch (err) {
            setPermissionStatus("Microphone Denied / Error");
            setError(err.message);
            console.error("Audio error:", err);
        }
    };

    const startRecording = () => {
        if (!mediaRecorderRef.current) {
            initMicrophone().then(() => {
                if (mediaRecorderRef.current) {
                    performStart();
                }
            });
            return;
        }
        performStart();
    };

    const performStart = () => {
        setAudioUrl(null);
        audioChunksRef.current = [];
        mediaRecorderRef.current.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const drawVisualizer = () => {
        if (!canvasRef.current || !analyserRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = "rgb(15, 23, 42)"; // slate-900
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;

                // Color mapping: deeper blues to bright spectral green for high frequency peaks
                const r = barHeight + (25 * (i/bufferLength));
                const g = 100 + barHeight;
                const b = 250;

                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        };

        draw();
    };

    useEffect(() => {
        initMicrophone();
        
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                mediaRecorderRef.current.stop();
            }
            if (sourceRef.current) {
                sourceRef.current.disconnect();
            }
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close().catch(console.error);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="w-full max-w-lg mt-12 px-4 text-center">
            <h2 className="text-3xl font-bold text-blue-400 mb-4" style={{ fontFamily: "'Creepster', cursive" }}>EVPRecorder</h2>
            
            <div className="bg-gray-900 border border-blue-400 rounded-xl p-8 shadow-[0_0_20px_rgba(96,165,250,0.15)]">
                <p className={`text-xs mb-4 ${error ? 'text-red-400' : 'text-blue-300'}`}>
                    {error ? `Error: ${error}` : permissionStatus}
                </p>
                
                {/* Visualizer Canvas */}
                <div className="relative w-full h-32 bg-slate-900 rounded-lg mb-6 overflow-hidden border border-slate-700 shadow-inner">
                    <canvas 
                        ref={canvasRef} 
                        width={400} 
                        height={128} 
                        className="w-full h-full"
                    />
                    
                    {isRecording && (
                        <div className="absolute top-2 right-2 flex items-center gap-2 bg-black/50 px-2 py-1 rounded">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">Rec</span>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="flex flex-col gap-4">
                    {!isRecording ? (
                        <button 
                            onClick={startRecording}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full transition-colors flex items-center justify-center gap-2 mx-auto w-full sm:w-2/3"
                        >
                            <span className="text-xl">🎙️</span> Start Recording
                        </button>
                    ) : (
                        <button 
                            onClick={stopRecording}
                            className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-full transition-colors flex items-center justify-center gap-2 mx-auto w-full sm:w-2/3 animate-pulse"
                        >
                            <span className="text-xl">🛑</span> Stop Recording
                        </button>
                    )}
                </div>

                {/* Playback */}
                {audioUrl && !isRecording && (
                    <div className="mt-6 pt-6 border-t border-gray-800">
                        <p className="text-sm text-gray-400 mb-2">Review Capture:</p>
                        <audio src={audioUrl} controls className="w-full max-h-10" />
                        <a 
                            href={audioUrl} 
                            download="EVP_Capture.webm" 
                            className="text-xs text-blue-400 hover:text-blue-300 mt-3 inline-block underline"
                        >
                            Download Recording
                        </a>
                    </div>
                )}
            </div>
            
            <Link to="/toolkit" className="mt-8 inline-block text-warning-orange hover:text-white underline">← Back to Toolkit</Link>
        </div>
    );
}

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, RefreshCw, Ruler, CheckCircle2 } from 'lucide-react';

interface CameraSizeMeasureProps {
  onClose: () => void;
  onSizeDetected: (size: number) => void;
}

export default function CameraSizeMeasure({ onClose, onSizeDetected }: CameraSizeMeasureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [step, setStep] = useState<'intro' | 'scanning' | 'result'>('intro');
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedSize, setDetectedSize] = useState<number | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setStep('scanning');
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const captureAndAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate AI scan
    setTimeout(() => {
      const sizes = [38, 39, 40, 41, 42, 43, 44, 45];
      const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
      setDetectedSize(randomSize);
      setIsAnalyzing(false);
      setStep('result');
      stopCamera();
    }, 2500);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-lg bg-charcoal border border-white/10 p-10 overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
          <X size={24} />
        </button>

        {step === 'intro' && (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-8 text-gold">
              <Ruler size={36} />
            </div>
            <h2 className="text-3xl font-display italic mb-4">AI Sizing Atelier</h2>
            <p className="text-off-white/50 text-sm mb-10 leading-relaxed max-w-xs mx-auto">
              Our vision-based measurement tool uses your device's camera to calculate the perfect fit for the AfriSole last.
            </p>
            <div className="space-y-4 text-left max-w-xs mx-auto mb-12">
               <div className="flex gap-4 items-start">
                  <div className="w-5 h-5 rounded-full border border-gold/30 flex items-center justify-center text-[10px] text-gold shrink-0 mt-1">1</div>
                  <p className="text-[11px] uppercase tracking-widest text-off-white/40">Place your foot on a flat surface</p>
               </div>
               <div className="flex gap-4 items-start">
                  <div className="w-5 h-5 rounded-full border border-gold/30 flex items-center justify-center text-[10px] text-gold shrink-0 mt-1">2</div>
                  <p className="text-[11px] uppercase tracking-widest text-off-white/40">Keep parallel with the floor</p>
               </div>
            </div>
            <button 
              onClick={startCamera}
              className="w-full bg-white text-black py-4 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gold transition-all duration-500"
            >
              Initialize Camera
            </button>
          </div>
        )}

        {step === 'scanning' && (
          <div className="relative">
            <div className="aspect-[3/4] bg-black border border-white/5 overflow-hidden relative mb-8">
              {error ? (
                <div className="absolute inset-0 flex items-center justify-center p-10 text-center">
                  <p className="text-red-400 text-sm font-serif italic">{error}</p>
                </div>
              ) : (
                <>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <div className="w-[70%] h-[85%] border-2 border-gold/50 border-dashed rounded-3xl relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-b from-gold/50 to-transparent animate-scan"></div>
                     </div>
                  </div>
                </>
              )}
            </div>

            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.4em] text-gold/60 mb-8 font-bold">
                {isAnalyzing ? 'Processing Geometry...' : 'Align foot inside the frame'}
              </p>
              
              <button 
                onClick={captureAndAnalyze}
                disabled={isAnalyzing}
                className="w-20 h-20 rounded-full border-4 border-gold/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all mx-auto group"
              >
                <div className={`w-14 h-14 rounded-full bg-gold flex items-center justify-center ${isAnalyzing ? 'animate-pulse' : ''}`}>
                  <Camera size={24} className="text-charcoal" />
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 'result' && (
          <div className="text-center py-10">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500"
            >
              <CheckCircle2 size={48} />
            </motion.div>
            <h2 className="text-3xl font-display italic mb-2">Scan Complete</h2>
            <p className="text-[10px] uppercase tracking-[0.4em] text-off-white/40 mb-10">Calculated Blueprint Size</p>
            
            <div className="text-8xl font-display mb-12 text-white">EU {detectedSize}</div>
            
            <button 
              onClick={() => {
                if (detectedSize) onSizeDetected(detectedSize);
                onClose();
              }}
              className="w-full bg-white text-black py-4 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gold transition-all duration-500"
            >
              Apply Recommended Size
            </button>
            <button 
              onClick={() => {
                setDetectedSize(null);
                setStep('scanning');
                startCamera();
              }}
              className="mt-4 text-[9px] uppercase tracking-widest text-off-white/30 hover:text-gold font-bold flex items-center gap-2 mx-auto"
            >
              <RefreshCw size={12} /> Recalibrate
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

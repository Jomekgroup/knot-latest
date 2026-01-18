
import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { VerifiedIcon } from './icons/VerifiedIcon';
import { CloseIcon } from './icons/CloseIcon';
import { CameraShutterIcon } from './icons/CameraShutterIcon';

type IDType = 'Passport' | 'NationalID' | 'DriversLicence';
type VerificationStep = 
  | 'initial' 
  | 'selfie_camera' 
  | 'selfie_review' 
  | 'id_selection' 
  | 'id_scan' 
  | 'verifying' 
  | 'success';

interface VerificationScreenProps {
  onVerificationComplete: () => void;
  onBack: () => void;
}

const VerificationScreen: React.FC<VerificationScreenProps> = ({ onVerificationComplete, onBack }) => {
  const [step, setStep] = useState<VerificationStep>('initial');
  const [selectedIdType, setSelectedIdType] = useState<IDType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selfiePhoto, setSelfiePhoto] = useState<string | null>(null);
  const [idPhoto, setIdPhoto] = useState<string | null>(null);
  const [livenessStatus, setLivenessStatus] = useState<'align' | 'blink' | 'steady'>('align');
  const [isScanning, setIsScanning] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    if (step === 'selfie_camera' || step === 'id_scan') {
      const initCamera = async () => {
        try {
          const facingMode = step === 'selfie_camera' ? 'user' : 'environment';
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } } 
          });
          activeStream = stream;
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.error("Play failed", e));
          }
          
          if (step === 'selfie_camera') {
            setLivenessStatus('align');
            setTimeout(() => setLivenessStatus('blink'), 2000);
            setTimeout(() => setLivenessStatus('steady'), 4000);
          }
        } catch (err) {
          setError("Camera access denied. Verification requires live captures for security.");
          setStep('initial');
        }
      };
      initCamera();
    }
    return () => { 
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop()); 
      }
    };
  }, [step]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        if (step === 'selfie_camera') {
            context.translate(canvas.width, 0);
            context.scale(-1, 1);
        }
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const data = canvas.toDataURL('image/jpeg', 0.9);
        
        if (step === 'selfie_camera') {
            setSelfiePhoto(data);
            setStep('selfie_review');
        } else {
            setIdPhoto(data);
            handleVerify();
        }
      }
    }
  };

  const handleStartScan = () => {
    setIsScanning(true);
    setTimeout(() => {
        capturePhoto();
        setIsScanning(false);
    }, 3000);
  };

  const handleVerify = () => {
    setStep('verifying');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => onVerificationComplete(), 2500);
    }, 4500);
  };

  const renderContent = () => {
    switch(step) {
      case 'initial':
        return (
          <div className="text-center p-8 flex flex-col items-center justify-center h-full space-y-8 bg-white animate-fade-in">
            <div className="bg-brand-light p-8 rounded-[2.5rem] shadow-inner relative">
                <ShieldCheckIcon className="w-20 h-20 text-brand-primary" />
                <div className="absolute -top-2 -right-2 bg-brand-accent text-brand-dark font-black text-[10px] px-3 py-1 rounded-full shadow-lg animate-bounce">SECURE</div>
            </div>
            <div>
                <h1 className="text-2xl font-black text-brand-dark mb-2">Registry Verification</h1>
                <p className="text-gray-500 text-sm leading-relaxed px-4 mb-6">
                    Knot is a high-trust registry. Verified members are 4x more likely to find a compatible partner.
                </p>
                <div className="grid grid-cols-2 gap-4 w-full max-w-[320px] mx-auto">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-black text-sm mb-2">01</div>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-center leading-tight">Biometric<br/>Selfie</span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-black text-sm mb-2">02</div>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-center leading-tight">ID Document<br/>Upload</span>
                    </div>
                </div>
            </div>
            <div className="w-full pt-4 px-4">
                <button onClick={() => setStep('selfie_camera')} className="w-full bg-brand-primary text-white font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-all">
                   Begin Authentication
                </button>
                <button onClick={onBack} className="w-full text-gray-400 font-bold py-3 text-sm mt-2 uppercase tracking-widest">Maybe Later</button>
            </div>
          </div>
        );

      case 'selfie_camera':
        return (
          <div className="relative w-full h-full bg-black flex flex-col items-center justify-center overflow-hidden">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={`w-[75%] aspect-square border-4 ${livenessStatus === 'steady' ? 'border-green-500' : 'border-brand-accent/50'} rounded-full border-dashed shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] transition-all duration-500`}></div>
            </div>
            <div className="absolute top-12 left-0 right-0 text-center px-10">
                <div className="bg-black/50 backdrop-blur-md inline-block px-4 py-2 rounded-full border border-white/10">
                    <p className="text-white font-black uppercase tracking-[0.2em] text-[10px]">
                        {livenessStatus === 'align' && 'Position Face in Circle'}
                        {livenessStatus === 'blink' && 'Blink for Liveness'}
                        {livenessStatus === 'steady' && 'Hold Steady...'}
                    </p>
                </div>
            </div>
            {livenessStatus === 'steady' && (
                <div className="absolute bottom-12 z-10 w-full flex justify-center animate-fade-in">
                    <button onClick={capturePhoto} className="p-1 rounded-full bg-white shadow-2xl active:scale-90 transition-transform">
                        <CameraShutterIcon className="w-20 h-20 text-brand-primary" />
                    </button>
                </div>
            )}
          </div>
        );

      case 'selfie_review':
        return (
          <div className="text-center p-8 flex flex-col items-center justify-center h-full space-y-8 bg-white animate-fade-in">
            <h2 className="text-2xl font-black text-brand-dark">Review Biometrics</h2>
            <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-brand-primary shadow-2xl">
              <img src={selfiePhoto!} className="w-full h-full object-cover" alt="Selfie" />
            </div>
            <p className="text-gray-500 text-sm px-6 italic">Ensure your face is clear and matches your registry profile.</p>
            <div className="w-full space-y-3 px-4">
              <button onClick={() => setStep('id_selection')} className="w-full bg-brand-primary text-white font-black py-4 rounded-2xl shadow-lg">
                Proceed to ID Scan
              </button>
              <button onClick={() => setStep('selfie_camera')} className="w-full text-gray-400 font-bold py-2 text-xs uppercase tracking-widest">
                Retake Photo
              </button>
            </div>
          </div>
        );

      case 'id_selection':
        return (
          <div className="p-8 flex flex-col h-full bg-white animate-fade-in">
            <div className="mt-8 mb-10">
                <h2 className="text-2xl font-black text-brand-dark leading-tight">Identity Document</h2>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed font-medium">Select the government-issued ID you will scan to complete your verified profile.</p>
            </div>
            
            <div className="space-y-4 flex-1">
                {[
                    { id: 'Passport' as IDType, label: 'International Passport', sub: 'Bio-data page' },
                    { id: 'NationalID' as IDType, label: 'National Identity Card', sub: 'Smart ID or Plastic Card' },
                    { id: 'DriversLicence' as IDType, label: "Driver's Licence", sub: 'Full identity licence' }
                ].map((type) => (
                    <button 
                        key={type.id}
                        onClick={() => {
                            setSelectedIdType(type.id);
                            setStep('id_scan');
                        }}
                        className="w-full p-6 bg-gray-50 border border-gray-100 rounded-2xl text-left hover:border-brand-primary transition-all flex items-center justify-between group active:scale-[0.98]"
                    >
                        <div>
                            <p className="font-black text-brand-dark uppercase tracking-tight text-sm">{type.label}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{type.sub}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-brand-primary group-hover:border-brand-primary transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </button>
                ))}
            </div>
            <button onClick={() => setStep('initial')} className="text-gray-400 font-bold py-4 text-xs uppercase tracking-widest">Cancel</button>
          </div>
        );

      case 'id_scan':
        return (
          <div className="relative w-full h-full bg-black flex flex-col items-center justify-center overflow-hidden">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            
            {/* ID Capture Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[85%] aspect-[1.6/1] border-2 border-brand-accent/70 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] relative overflow-hidden">
                 {isScanning && (
                   <div className="absolute inset-x-0 top-0 h-1 bg-brand-accent shadow-[0_0_15px_rgba(244,211,94,0.8)] animate-laser-scan"></div>
                 )}
                 <div className="absolute top-[-45px] left-0 right-0 text-center">
                    <span className="bg-brand-accent text-brand-dark px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                        Position {selectedIdType}
                    </span>
                 </div>
              </div>
            </div>

            <div className="absolute bottom-12 z-10 w-full flex justify-center gap-6 px-10">
              <button 
                onClick={() => setStep('id_selection')} 
                className="p-4 rounded-full bg-white/20 backdrop-blur-lg text-white"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
              <button 
                onClick={handleStartScan} 
                disabled={isScanning}
                className={`p-1 rounded-full bg-white shadow-2xl transition-all ${isScanning ? 'opacity-50 scale-95' : 'active:scale-90'}`}
              >
                <CameraShutterIcon className="w-20 h-20 text-brand-primary" />
              </button>
            </div>
          </div>
        );

      case 'verifying':
        return (
          <div className="text-center p-8 flex flex-col items-center justify-center h-full bg-white animate-fade-in">
            <div className="relative w-32 h-32 mb-8">
                <div className="absolute inset-0 border-8 border-gray-100 rounded-full"></div>
                <div className="absolute inset-0 border-8 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <ShieldCheckIcon className="w-12 h-12 text-brand-primary" />
                </div>
            </div>
            <h1 className="text-2xl font-black text-brand-dark uppercase tracking-tight">Knot Secure Analysis</h1>
            <p className="text-gray-500 text-sm font-bold mt-3 px-10 animate-pulse text-center leading-relaxed">
                Matching biometrics with government record...
            </p>
            <div className="mt-12 space-y-2 w-full max-w-[200px] mx-auto opacity-40">
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-primary animate-progress-ind"></div>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Finalizing Registry</p>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center p-8 flex flex-col items-center justify-center h-full bg-brand-primary text-white animate-fade-in">
            <div className="bg-white p-6 rounded-full mb-8 shadow-2xl scale-110">
                <VerifiedIcon className="w-24 h-24 text-brand-primary" />
            </div>
            <h1 className="text-3xl font-black mb-2 uppercase tracking-tighter">Verified Status</h1>
            <p className="text-brand-light/80 text-sm px-8 font-bold leading-relaxed">
                Your identity has been authenticated. The Trusted Badge is now active on your registry profile.
            </p>
            <div className="absolute bottom-12 left-0 right-0 flex justify-center px-8">
                <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
                    <p className="text-[10px] font-black uppercase tracking-widest">Redirecting to Registry...</p>
                </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-screen bg-white flex flex-col overflow-hidden">
      <main className="flex-1 relative">
        {renderContent()}
        <canvas ref={canvasRef} className="hidden" />
      </main>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        
        @keyframes laserScan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-laser-scan { animation: laserScan 2s linear infinite; }

        @keyframes progressInd {
          0% { left: -100%; width: 100%; }
          100% { left: 100%; width: 100%; }
        }
        .animate-progress-ind { 
          position: relative;
          animation: progressInd 1.5s infinite linear; 
        }
      `}</style>
    </div>
  );
};

export default VerificationScreen;

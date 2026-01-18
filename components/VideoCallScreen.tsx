import React, { useState, useEffect, useRef } from 'react';
import { User, Match } from '../types';
import { MicOnIcon } from './icons/MicOnIcon';
import { MicOffIcon } from './icons/MicOffIcon';
import { CameraOnIcon } from './icons/CameraOnIcon';
import { CameraOffIcon } from './icons/CameraOffIcon';
import { EndCallIcon } from './icons/EndCallIcon';

interface VideoCallScreenProps {
  user: User;
  match: Match;
  onEndCall: () => void;
}

const VideoCallScreen: React.FC<VideoCallScreenProps> = ({ user, match, onEndCall }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [callStatus, setCallStatus] = useState(`Connecting to ${match.name}...`);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const startMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        localStreamRef.current = stream;
        setCallStatus('Connected');
      } catch (err) {
        console.error('Error accessing media devices.', err);
        setCallStatus('Failed to access camera/mic');
        // Fallback or show error message
      }
    };

    startMedia();

    // Cleanup function to stop media tracks when component unmounts
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  const toggleMute = () => {
      if(localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach(track => track.enabled = !track.enabled);
        setIsMuted(prev => !prev);
      }
  };

  const toggleCamera = () => {
      if(localStreamRef.current) {
        localStreamRef.current.getVideoTracks().forEach(track => track.enabled = !track.enabled);
        setIsCameraOff(prev => !prev);
      }
  };

  const handleEndCall = () => {
    if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    onEndCall();
  };

  return (
    <div className="relative w-full h-screen bg-brand-dark text-white flex flex-col">
      {/* Remote Video (Match's video) */}
      <div className="absolute inset-0 flex items-center justify-center">
         <img src={match.profileImageUrls[0]} alt={match.name} className="w-full h-full object-cover opacity-50 blur-sm" />
         <div className="absolute inset-0 bg-black bg-opacity-40"></div>
         <div className="text-center z-10">
            <img src={match.profileImageUrls[0]} alt={match.name} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mx-auto" />
            <p className="mt-4 text-2xl font-bold">{match.name}</p>
            <p className="text-gray-300 mt-1">{callStatus}</p>
         </div>
      </div>
      
      {/* Local Video (User's video) */}
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className={`absolute top-4 right-4 w-28 h-40 bg-black rounded-lg object-cover shadow-lg border-2 border-white transition-opacity duration-300 ${isCameraOff ? 'opacity-0' : 'opacity-100'}`}
      />
      {isCameraOff && (
          <div className="absolute top-4 right-4 w-28 h-40 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-gray-600">
              <CameraOffIcon className="w-8 h-8 text-gray-400" />
          </div>
      )}


      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        <div className="flex justify-center items-center gap-6 bg-black bg-opacity-30 backdrop-blur-md rounded-full max-w-xs mx-auto p-4">
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full transition-colors ${
              isMuted 
              ? 'bg-white bg-opacity-40' 
              : 'bg-white bg-opacity-20 hover:bg-opacity-30'
            }`}
            aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {isMuted ? <MicOffIcon className="w-6 h-6" /> : <MicOnIcon className="w-6 h-6" />}
          </button>
          <button
            onClick={toggleCamera}
            className={`p-3 rounded-full transition-colors ${
              isCameraOff
              ? 'bg-white bg-opacity-40'
              : 'bg-white bg-opacity-20 hover:bg-opacity-30'
            }`}
            aria-label={isCameraOff ? 'Turn camera on' : 'Turn camera off'}
          >
            {isCameraOff ? <CameraOffIcon className="w-6 h-6" /> : <CameraOnIcon className="w-6 h-6" />}
          </button>
          <button
            onClick={handleEndCall}
            className="p-4 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
            aria-label="End call"
          >
            <EndCallIcon className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallScreen;
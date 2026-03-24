import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const PLAYLIST = [
  {
    id: 1,
    title: 'Neon Drift (AI Gen)',
    artist: 'CyberMind',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '6:12'
  },
  {
    id: 2,
    title: 'Synthwave Protocol',
    artist: 'Neural Net',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '7:05'
  },
  {
    id: 3,
    title: 'Digital Horizon',
    artist: 'Ghost in the Shell',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '5:44'
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => {
        console.error("Audio play failed:", e);
        setIsPlaying(false);
      });
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-black border-4 border-[#ff00ff] p-6 w-full max-w-md shadow-[-8px_8px_0px_0px_#00ffff] relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-[#ff00ff] text-black font-pixel text-[10px] px-2 py-1">
        AUDIO.SYS
      </div>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />
      
      <div className="flex items-center gap-4 mb-6 mt-4">
        <div className="w-16 h-16 border-2 border-[#00ffff] bg-black flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 scanlines" />
          <Music className={`w-8 h-8 text-[#ff00ff] z-10 ${isPlaying ? 'animate-tear' : ''}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[#00ffff] font-pixel text-xs truncate mb-2 uppercase">
            &gt; {currentTrack.title}
          </h3>
          <p className="text-[#ff00ff] text-xl font-vt truncate uppercase">
            SRC: {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div 
          className="h-4 bg-black border-2 border-[#00ffff] cursor-pointer relative group"
          onClick={handleProgressClick}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-[#ff00ff] transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-lg font-vt text-[#00ffff]">
          <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}</span>
          <span>{currentTrack.duration}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between border-t-2 border-[#ff00ff] pt-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 text-[#00ffff] hover:bg-[#ff00ff] hover:text-black transition-none border border-transparent hover:border-black"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 accent-[#ff00ff] h-2 bg-black border border-[#00ffff] appearance-none cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrev}
            className="p-2 text-[#ff00ff] border-2 border-[#ff00ff] hover:bg-[#ff00ff] hover:text-black transition-none"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="px-4 py-2 border-2 border-[#00ffff] bg-black text-[#00ffff] font-pixel text-[10px] hover:bg-[#00ffff] hover:text-black transition-none uppercase"
          >
            {isPlaying ? 'HALT' : 'EXEC'}
          </button>
          
          <button 
            onClick={handleNext}
            className="p-2 text-[#ff00ff] border-2 border-[#ff00ff] hover:bg-[#ff00ff] hover:text-black transition-none"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

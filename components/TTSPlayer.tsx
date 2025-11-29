import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, Rewind, FastForward, X, Volume2 } from 'lucide-react';

interface TTSPlayerProps {
  text: string;
  onWordBoundary: (wordIndex: number) => void;
  onStop: () => void;
}

export const TTSPlayer: React.FC<TTSPlayerProps> = ({ text, onWordBoundary, onStop }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize Speech
  useEffect(() => {
    // Cleanup previous speech
    window.speechSynthesis.cancel();
    
    if (!text) return;

    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    
    // Attempt to pick a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes("Google US English")) || voices.find(v => v.lang === 'en-US');
    if (preferredVoice) u.voice = preferredVoice;

    // Boundary event is fired when a word is spoken
    u.onboundary = (event) => {
      if (event.name === 'word') {
        // Calculate approximate word index based on char index
        // This assumes text hasn't changed structure significantly
        // Note: charIndex is the index of the character in the full text string
        const charIdx = event.charIndex;
        const textUpToChar = text.substring(0, charIdx);
        // Counting spaces/words up to this point
        const wordIdx = textUpToChar.trim().split(/\s+/).length;
        // This is 1-based, making it 0-based for array access
        onWordBoundary(wordIdx > 0 ? wordIdx - 1 : 0);
      }
    };

    u.onend = () => {
      setIsPlaying(false);
      onWordBoundary(-1);
    };

    utteranceRef.current = u;

    // Auto-start
    window.speechSynthesis.speak(u);
    setIsPlaying(true);

    return () => {
      window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]); // Re-init if text changes completely

  // Watch Rate Changes
  useEffect(() => {
    if (window.speechSynthesis.speaking && utteranceRef.current) {
        // Web Speech API allows changing rate on the fly only by restarting usually,
        // but let's try to update future utterances or pause/resume method
        // Actually, to change rate reliably, we often have to cancel and restart from current position.
        // For simplicity in this demo, we just update state for next play.
        window.speechSynthesis.cancel();
        // Re-triggering the main effect is complex without tracking index.
        // We will just let the user know they need to replay for rate change or keep it simple.
    }
  }, [rate]);

  const togglePlay = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
    } else if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
        // Restart
        if(utteranceRef.current) {
             window.speechSynthesis.speak(utteranceRef.current);
             setIsPlaying(true);
        }
    }
  };

  const changeRate = (newRate: number) => {
    setRate(newRate);
    // Force restart to apply rate (Limitation of Web Speech API)
    if(utteranceRef.current) {
        window.speechSynthesis.cancel();
        utteranceRef.current.rate = newRate;
        window.speechSynthesis.speak(utteranceRef.current);
        setIsPlaying(true);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border border-gray-200 shadow-xl rounded-full px-6 py-3 flex items-center gap-6 z-[60]">
        
      <div className="flex items-center gap-2">
        <Volume2 size={20} className="text-blue-600"/>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Listener</span>
      </div>

      <div className="h-8 w-px bg-gray-200"></div>

      <div className="flex items-center gap-4">
        <button 
            onClick={() => changeRate(0.75)} 
            className={`text-xs font-bold px-2 py-1 rounded ${rate === 0.75 ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
        >
            0.75x
        </button>
        <button 
            onClick={() => changeRate(1)} 
            className={`text-xs font-bold px-2 py-1 rounded ${rate === 1 ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
        >
            1x
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-transform hover:scale-105 shadow-md shadow-blue-200"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause fill="white" /> : <Play fill="white" className="ml-1" />}
        </button>
      </div>

      <div className="h-8 w-px bg-gray-200"></div>
      
      <button onClick={onStop} className="text-gray-400 hover:text-red-500 transition-colors">
        <X size={20} />
      </button>
    </div>
  );
};

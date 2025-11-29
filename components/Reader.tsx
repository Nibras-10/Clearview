import React, { useState, useEffect, useRef } from 'react';
import { SettingsState } from '../types';
import { processBionicWord, splitTextIntoParagraphs } from '../utils/textUtils';

interface ReaderProps {
  text: string;
  settings: SettingsState;
  activeWordIndex: number; // For TTS highlighting
}

export const Reader: React.FC<ReaderProps> = ({ text, settings, activeWordIndex }) => {
  const [mouseY, setMouseY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle Line Ruler Logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (settings.isRulerActive) {
        setMouseY(e.clientY);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [settings.isRulerActive]);

  // Determine styles based on settings
  const containerStyle: React.CSSProperties = {
    fontSize: `${settings.fontSize}px`,
    lineHeight: settings.lineHeight,
    letterSpacing: `${settings.letterSpacing}em`,
  };

  const paragraphs = splitTextIntoParagraphs(text);
  
  // Calculate total word count to sync with TTS index across paragraphs
  // This is a naive implementation. For robust syncing, we'd need a map of word indices.
  let wordCounter = 0;

  return (
    <div 
      className={`relative min-h-screen transition-colors duration-300 ${settings.fontFamily} ${settings.theme}`}
    >
      {/* Line Ruler Overlay */}
      {settings.isRulerActive && (
        <>
           <div 
             className="fixed top-0 left-0 w-full bg-black/60 pointer-events-none z-50 transition-opacity duration-75"
             style={{ height: `${mouseY - 40}px` }}
           />
           <div 
             className="fixed bottom-0 left-0 w-full bg-black/60 pointer-events-none z-50 transition-opacity duration-75"
             style={{ top: `${mouseY + 40}px` }}
           />
           <div 
             className="fixed left-0 w-full h-[80px] pointer-events-none z-50 border-y border-yellow-400/30 bg-yellow-400/5 mix-blend-multiply"
             style={{ top: `${mouseY - 40}px` }}
           />
        </>
      )}

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto py-12 px-8 md:px-12" ref={containerRef} style={containerStyle}>
        {text.length === 0 ? (
           <div className="text-gray-400 italic text-center mt-20">
             Start typing in Writer mode or paste text here to begin reading...
           </div>
        ) : (
          paragraphs.map((para, pIdx) => (
            <p key={pIdx} className="mb-6 max-w-none text-justify">
              {para.split(/\s+/).map((word, wIdx) => {
                const currentGlobalIndex = wordCounter++;
                const isHighlighted = currentGlobalIndex === activeWordIndex;
                
                // Render Bionic
                if (settings.isBionic) {
                  const { bold, normal } = processBionicWord(word);
                  return (
                    <span 
                      key={`${pIdx}-${wIdx}`} 
                      className={`inline-block mr-[0.25em] ${isHighlighted ? 'bg-yellow-300 text-black rounded px-1 -mx-1 transition-colors duration-100' : ''}`}
                    >
                      <b className="font-bold opacity-100">{bold}</b>
                      <span className="opacity-80">{normal}</span>
                    </span>
                  );
                }

                // Render Normal
                return (
                  <span 
                    key={`${pIdx}-${wIdx}`}
                    className={`inline-block mr-[0.25em] ${isHighlighted ? 'bg-yellow-300 text-black rounded px-1 -mx-1 transition-colors duration-100' : ''}`}
                  >
                    {word}
                  </span>
                );
              })}
            </p>
          ))
        )}
      </div>
    </div>
  );
};

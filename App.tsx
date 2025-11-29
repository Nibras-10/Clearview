
import React, { useState, useRef, useEffect } from 'react';
import { SettingsPanel } from './components/SettingsPanel';
import { Reader } from './components/Reader';
import { Writer } from './components/Writer';
import { TTSPlayer } from './components/TTSPlayer';
import { WelcomePage } from './components/WelcomePage';
import { AppMode, SettingsState, FontFamily, ColorTheme } from './types';
import { BookOpen, PenTool, Headphones, Menu, Upload, Loader2, Trash2 } from 'lucide-react';
import { readPdfFile, readTextFile } from './utils/fileUtils';

const DEFAULT_READER_TEXT = `Welcome to ClearView Reader.

This is a workspace designed to make reading easier and writing less stressful. 

Try switching on "Bionic Reading" in the settings panel. It highlights the start of words to guide your eye through the text. You can also turn on the "Line Focus" ruler to help you keep your place.

Upload a PDF or TXT file to get started reading your own documents.`;

const DEFAULT_WRITER_TEXT = `Start typing here...

Use the "Simplify" button to have AI rewrite complex sentences for you, or "Fix Grammar" to clean up spelling without judgment.`;

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [mode, setMode] = useState<AppMode>(AppMode.READER);
  
  // Separate states for Reader and Writer
  const [readerText, setReaderText] = useState<string>(DEFAULT_READER_TEXT);
  const [writerText, setWriterText] = useState<string>(DEFAULT_WRITER_TEXT);
  
  const [isTTSActive, setIsTTSActive] = useState(false);
  const [ttsWordIndex, setTtsWordIndex] = useState(-1);
  const [showMobileSettings, setShowMobileSettings] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [settings, setSettings] = useState<SettingsState>({
    fontFamily: FontFamily.SANS,
    fontSize: 18,
    lineHeight: 1.8,
    letterSpacing: 0.05,
    theme: ColorTheme.DEFAULT,
    isBionic: false,
    isRulerActive: false,
  });

  // Handle keyboard start
  useEffect(() => {
    const handleKeyPress = () => {
      if (!hasStarted) setHasStarted(true);
    };
    if (!hasStarted) {
      window.addEventListener('keydown', handleKeyPress);
    }
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [hasStarted]);

  const updateSettings = (newSettings: Partial<SettingsState>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      let content = '';
      if (file.type === 'application/pdf') {
        content = await readPdfFile(file);
      } else if (file.type === 'text/plain') {
        content = await readTextFile(file);
      } else {
        alert("Please upload a .txt or .pdf file");
        setIsUploading(false);
        return;
      }

      if (content.trim()) {
        setReaderText(content); // Only update Reader text
        setMode(AppMode.READER); // Switch to reader mode to view the content
      } else {
        alert("Could not extract text from this file.");
      }
    } catch (error) {
      console.error(error);
      alert("Error reading file. Please try another.");
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear the text?")) {
        if (mode === AppMode.READER) setReaderText("");
        else setWriterText("");
    }
  };

  // Determine which text is currently active for TTS
  const activeText = mode === AppMode.READER ? readerText : writerText;

  if (!hasStarted) {
    return <WelcomePage onStart={() => setHasStarted(true)} />;
  }

  return (
    <div className={`flex h-screen w-full overflow-hidden ${settings.theme}`}>
      
      {/* Sidebar / Settings Panel */}
      <div className={`${showMobileSettings ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-40 h-full transition-transform duration-300 ease-in-out`}>
         <SettingsPanel settings={settings} updateSettings={updateSettings} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative w-full">
        
        {/* Top Navigation */}
        <header className="h-16 border-b border-black/5 bg-white/40 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-30">
            <div className="flex items-center gap-4">
                <button className="md:hidden p-2 -ml-2 text-gray-600" onClick={() => setShowMobileSettings(!showMobileSettings)}>
                    <Menu size={24} />
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">C</div>
                    <span className="font-bold text-gray-700 tracking-tight hidden sm:inline">ClearView</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
               <div className="flex bg-gray-100/80 p-1 rounded-lg">
                  <button
                      onClick={() => setMode(AppMode.READER)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${mode === AppMode.READER ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                      <BookOpen size={16} /> <span className="hidden sm:inline">Reader</span>
                  </button>
                  <button
                      onClick={() => setMode(AppMode.WRITER)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${mode === AppMode.WRITER ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                      <PenTool size={16} /> <span className="hidden sm:inline">Writer</span>
                  </button>
              </div>

              {/* Upload Button */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept=".txt,.pdf" 
                className="hidden" 
              />
              <button
                onClick={triggerUpload}
                disabled={isUploading}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-100"
                title="Upload PDF or TXT"
              >
                {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                <span className="hidden sm:inline">Upload</span>
              </button>
              
              <button 
                onClick={handleClear}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Clear Text"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <button 
                onClick={() => setIsTTSActive(!isTTSActive)}
                className={`p-2 rounded-full transition-colors ${isTTSActive ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                title="Toggle Text-to-Speech"
            >
                <Headphones size={20} />
            </button>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto relative scroll-smooth">
             {mode === AppMode.READER ? (
                 <Reader 
                    text={readerText} 
                    settings={settings} 
                    activeWordIndex={ttsWordIndex}
                 />
             ) : (
                 <Writer 
                    text={writerText} 
                    setText={setWriterText} 
                    settings={settings} 
                 />
             )}
        </main>

        {/* TTS Overlay */}
        {isTTSActive && (
            <TTSPlayer 
                text={activeText} 
                onWordBoundary={setTtsWordIndex} 
                onStop={() => {
                    setIsTTSActive(false);
                    setTtsWordIndex(-1);
                }} 
            />
        )}

      </div>
      
      {/* Mobile overlay for settings */}
      {showMobileSettings && (
          <div className="fixed inset-0 bg-black/20 z-30 md:hidden" onClick={() => setShowMobileSettings(false)}></div>
      )}
    </div>
  );
}

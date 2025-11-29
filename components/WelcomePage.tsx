import React from 'react';
import { BookOpen, Sparkles, MoveRight } from 'lucide-react';
import { ThreeBackground } from './ThreeBackground';

interface WelcomePageProps {
  onStart: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onStart }) => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-off-white flex flex-col items-center justify-center p-6">
      
      {/* 3D Background */}
      <ThreeBackground />

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl text-center space-y-8 bg-white/30 backdrop-blur-sm p-12 rounded-3xl border border-white/40 shadow-xl">
        
        {/* Logo Mark */}
        <div className="mx-auto w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-200 rotate-3 transition-transform hover:rotate-0 duration-500">
          <BookOpen className="text-white w-12 h-12" />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-800 tracking-tight">
            ClearView <span className="text-blue-600">Reader</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
            An accessible workspace designed for clarity. 
            Features <span className="font-semibold text-gray-800">Bionic Reading</span>, 
            <span className="font-semibold text-gray-800"> AI Assistance</span>, and 
            <span className="font-semibold text-gray-800"> Visual Aids</span> to make reading and writing effortless.
          </p>
        </div>

        {/* Feature Grid (Decorative) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 py-4">
          <div className="flex items-center justify-center gap-2 bg-white/50 px-3 py-2 rounded-full border border-white">
            <div className="w-2 h-2 rounded-full bg-blue-400" /> Dyslexia Friendly
          </div>
          <div className="flex items-center justify-center gap-2 bg-white/50 px-3 py-2 rounded-full border border-white">
            <div className="w-2 h-2 rounded-full bg-orange-300" /> Focus Line Ruler
          </div>
          <div className="flex items-center justify-center gap-2 bg-white/50 px-3 py-2 rounded-full border border-white">
            <div className="w-2 h-2 rounded-full bg-yellow-400" /> Text-to-Speech
          </div>
        </div>

        <button
          onClick={onStart}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-full text-lg font-medium transition-all hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-100 transform hover:-translate-y-1"
        >
          <span>Enter Workspace</span>
          <MoveRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          
          <div className="absolute right-3 top-3">
            <Sparkles className="w-4 h-4 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </button>

      </div>

      <div className="absolute bottom-6 text-xs text-gray-500 z-10 font-medium">
        
      </div>
    </div>
  );
};
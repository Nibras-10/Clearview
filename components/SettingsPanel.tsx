import React from 'react';
import { SettingsState, FontFamily, ColorTheme } from '../types';
import { Type, Ruler, Eye, Palette, MoveVertical, Type as TypeIcon } from 'lucide-react';

interface SettingsPanelProps {
  settings: SettingsState;
  updateSettings: (newSettings: Partial<SettingsState>) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, updateSettings }) => {
  
  return (
    <div className="p-6 bg-white/50 backdrop-blur-sm border-r border-gray-200 h-full overflow-y-auto w-80 flex-shrink-0 flex flex-col gap-8 shadow-sm">
      
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
          <Type size={16} /> Typography
        </h2>
        
        <div className="space-y-4">
          {/* Font Family */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => updateSettings({ fontFamily: FontFamily.SANS })}
              className={`p-2 text-sm border rounded hover:bg-gray-50 transition-colors font-sans ${settings.fontFamily === FontFamily.SANS ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200'}`}
            >
              Inter
            </button>
            <button
              onClick={() => updateSettings({ fontFamily: FontFamily.SERIF })}
              className={`p-2 text-sm border rounded hover:bg-gray-50 transition-colors font-serif ${settings.fontFamily === FontFamily.SERIF ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200'}`}
            >
              Serif
            </button>
            <button
              onClick={() => updateSettings({ fontFamily: FontFamily.DYSLEXIC })}
              className={`p-2 text-sm border rounded hover:bg-gray-50 transition-colors font-dyslexic ${settings.fontFamily === FontFamily.DYSLEXIC ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200'}`}
            >
              Dyslexic
            </button>
          </div>

          {/* Size Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Size</span>
              <span>{settings.fontSize}px</span>
            </div>
            <input
              type="range"
              min="14"
              max="32"
              value={settings.fontSize}
              onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Line Height Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1"><MoveVertical size={12}/> Line Height</span>
              <span>{settings.lineHeight.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="1.2"
              max="2.5"
              step="0.1"
              value={settings.lineHeight}
              onChange={(e) => updateSettings({ lineHeight: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          
           {/* Letter Spacing Slider */}
           <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1"><TypeIcon size={12}/> Spacing</span>
              <span>{settings.letterSpacing.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.2"
              step="0.01"
              value={settings.letterSpacing}
              onChange={(e) => updateSettings({ letterSpacing: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
          <Palette size={16} /> Theme & Tint
        </h2>
        <div className="grid grid-cols-5 gap-2">
          {[
            { t: ColorTheme.DEFAULT, label: 'Default', bg: '#fdfbf7' },
            { t: ColorTheme.CREAM, label: 'Cream', bg: '#FFFDD0' },
            { t: ColorTheme.BLUE, label: 'Blue', bg: '#E6F0FF' },
            { t: ColorTheme.PEACH, label: 'Peach', bg: '#FFF0E6' },
            { t: ColorTheme.DARK, label: 'Dark', bg: '#2d2d2d' },
          ].map((themeOpt) => (
            <button
              key={themeOpt.t}
              onClick={() => updateSettings({ theme: themeOpt.t })}
              title={themeOpt.label}
              className={`w-8 h-8 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${settings.theme === themeOpt.t ? 'ring-2 ring-offset-1 ring-blue-500' : ''}`}
              style={{ backgroundColor: themeOpt.bg }}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
          <Eye size={16} /> Assistive Tools
        </h2>
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Bionic Reading</span>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                checked={settings.isBionic}
                onChange={(e) => updateSettings({ isBionic: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <span className="flex items-center gap-2 text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
              <Ruler size={16}/> Line Focus
            </span>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                checked={settings.isRulerActive}
                onChange={(e) => updateSettings({ isRulerActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

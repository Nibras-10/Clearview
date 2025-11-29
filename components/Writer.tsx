import React, { useState } from 'react';
import { simplifyText, fixGrammar } from '../services/geminiService';
import { Wand2, CheckCheck, Loader2, AlertCircle } from 'lucide-react';
import { SettingsState } from '../types';

interface WriterProps {
  text: string;
  setText: (text: string) => void;
  settings: SettingsState;
}

export const Writer: React.FC<WriterProps> = ({ text, setText, settings }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSimplify = async () => {
    if (!text.trim()) return;
    setLoading('simplify');
    setError(null);
    try {
      const result = await simplifyText(text);
      setText(result);
    } catch (err) {
      setError("Failed to simplify text. Please check your API key.");
    } finally {
      setLoading(null);
    }
  };

  const handleFixGrammar = async () => {
    if (!text.trim()) return;
    setLoading('grammar');
    setError(null);
    try {
      const result = await fixGrammar(text);
      setText(result);
    } catch (err) {
      setError("Failed to fix grammar. Please check your API key.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className={`h-full flex flex-col p-6 ${settings.theme} transition-colors`}>
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col gap-4">
        
        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 items-center justify-between bg-white/50 p-2 rounded-xl backdrop-blur-sm border border-black/5">
          <h2 className="text-lg font-semibold pl-2 opacity-70">Writer Workspace</h2>
          <div className="flex gap-2">
            <button
              onClick={handleSimplify}
              disabled={!!loading || !text}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-800 rounded-lg hover:bg-indigo-200 disabled:opacity-50 transition-colors text-sm font-medium"
            >
              {loading === 'simplify' ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
              Simplify Text
            </button>
            <button
              onClick={handleFixGrammar}
              disabled={!!loading || !text}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 disabled:opacity-50 transition-colors text-sm font-medium"
            >
              {loading === 'grammar' ? <Loader2 className="animate-spin" size={16} /> : <CheckCheck size={16} />}
              Fix Grammar
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Editor Area */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className={`flex-1 w-full p-6 rounded-xl border border-transparent focus:border-blue-300 focus:ring-4 focus:ring-blue-100 outline-none resize-none shadow-sm text-lg leading-relaxed ${settings.fontFamily} bg-white/60`}
          style={{
             fontSize: `${settings.fontSize}px`,
             letterSpacing: `${settings.letterSpacing}em`,
             lineHeight: settings.lineHeight
          }}
        />
        
        <div className="text-xs text-center opacity-50 pb-2">
          {text.split(/\s+/).filter(w => w.length > 0).length} words
        </div>
      </div>
    </div>
  );
};

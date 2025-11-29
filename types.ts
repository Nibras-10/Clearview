export enum AppMode {
  READER = 'READER',
  WRITER = 'WRITER'
}

export enum FontFamily {
  SANS = 'font-sans',
  SERIF = 'font-serif',
  DYSLEXIC = 'font-dyslexic'
}

export enum ColorTheme {
  DEFAULT = 'bg-off-white text-gray-900',
  CREAM = 'bg-tint-cream text-gray-900',
  BLUE = 'bg-tint-blue text-slate-900',
  PEACH = 'bg-tint-peach text-gray-900',
  DARK = 'bg-tint-dark text-gray-100'
}

export interface SettingsState {
  fontFamily: FontFamily;
  fontSize: number; // in pixels
  lineHeight: number; // multiplier
  letterSpacing: number; // tracking class index or raw value
  theme: ColorTheme;
  isBionic: boolean;
  isRulerActive: boolean;
}

export interface BionicPart {
  bold: string;
  normal: string;
}

export interface TTSConfig {
  rate: number; // 0.5 to 2
  voice: SpeechSynthesisVoice | null;
  isPlaying: boolean;
}

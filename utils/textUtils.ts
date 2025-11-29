import { BionicPart } from '../types';

/**
 * Splits a word into a bold prefix and normal suffix for Bionic reading.
 * Logic: Bold the first half of the word (rounded up).
 */
export const processBionicWord = (word: string): BionicPart => {
  if (word.length === 0) return { bold: '', normal: '' };
  if (word.length === 1) return { bold: word, normal: '' };

  // Common skip words or very short words logic can be added here
  // For now, strict half-bolding logic
  let boldLength = 1;
  if (word.length > 3) {
    boldLength = Math.ceil(word.length * 0.4); // 40% bold usually looks better than 50%
  } else {
    boldLength = 1;
  }

  return {
    bold: word.substring(0, boldLength),
    normal: word.substring(boldLength),
  };
};

export const splitTextIntoParagraphs = (text: string): string[] => {
  return text.split(/\n\s*\n/);
};

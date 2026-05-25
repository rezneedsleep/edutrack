import { Filter } from 'bad-words';

// Initialize bad-words filter
const filter = new Filter();

// Custom Indonesian profanity list
const idBadWords = [
  'anjing', 'babi', 'monyet', 'kunyuk', 'bajingan', 'asu', 'bangsat', 
  'kampret', 'keparat', 'haram jadah', 'brengsek', 'tai', 'telek', 
  'goblok', 'tolol', 'bego', 'idiot', 'dungu', 'pekok', 'pantek',
  'perek', 'pelacur', 'lonte', 'jablay', 'bitch', 'whore',
  'kontol', 'memek', 'jembut', 'peler', 'ngentot', 'ngewe',
  'jancuk', 'jancok', 'cok', 'pukimak', 'kimak', 'maho', 'bencong',
  'kafir', 'sara', 'picek', 'budek', 'cacat', 'bgst', 'anjg', 'ajg'
];

// Add custom words to the filter
filter.addWords(...idBadWords);

/**
 * Censors profanity from a given text.
 * @param text The input text to censor
 * @returns The censored text, with bad words replaced by asterisks.
 */
export function censorText(text: string): string {
  if (!text) return text;
  try {
    return filter.clean(text);
  } catch (error) {
    // Fallback in case of errors
    let cleanText = text;
    idBadWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      cleanText = cleanText.replace(regex, '*'.repeat(word.length));
    });
    return cleanText;
  }
}

import * as Profanity from 'leo-profanity';

Profanity.loadDictionary('ru');

export const filterProfanity = (text) => {
  if (!text || typeof text !== 'string') return text;
  return Profanity.clean(text);
};

export const hasProfanity = (text) => {
  if (!text || typeof text !== 'string') return false;
  return Profanity.check(text);
};
import * as Profanity from 'leo-profanity';

Profanity.loadDictionary('en');
Profanity.loadDictionary('ru');

Profanity.add(['boobs', 'ass', 'fuck', 'shit', 'porn', 'sex']);

export const filterProfanity = (text) => {
  if (!text || typeof text !== 'string') return text;
  console.log('Filtering:', text, 'to:', Profanity.clean(text));
  return Profanity.clean(text);
};

export const hasProfanity = (text) => {
  if (!text || typeof text !== 'string') return false;
  return Profanity.check(text);
};
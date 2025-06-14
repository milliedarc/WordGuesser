import rawWords from './assets/allowed.txt?raw';

export const allowedGuesses = rawWords
    .split('\n')
    .map(w => w.trim())
    .filter(Boolean); // returns non-falsy values

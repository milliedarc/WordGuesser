import rawWords from './assets/answers.txt?raw';

export const solutionWords = rawWords
    .split('\n')
    .map(w => w.trim())
    .filter(Boolean); // returns non-falsy values

import sources from '../../public/meows/sources.json';

// A shared catalog keeps the browser's next voice and the audio API in sync.
export const voices = sources.map(({ id, title, file }) => ({ id, title, file }));

export function randomVoice(exclude?: string | null) {
  const choices = voices.filter(voice => voice.id !== exclude);
  return choices[Math.floor(Math.random() * choices.length)];
}

import { mkdir, copyFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const root = path.dirname(fileURLToPath(import.meta.url));
const originals = path.resolve(root, '../public');
const localPublic = path.join(root, 'public');
await mkdir(path.join(localPublic, 'cats'), {recursive: true});
await mkdir(path.join(localPublic, 'meows'), {recursive: true});
const names = ['miso','mochi','olive','nori','tofu','pip','bean','luna','sesame','maple','biscuit','suki'];
const media: Record<string, {src: string; ratio: number}> = {};
for (const name of names) {
  const file = `cats/${name}.jpg`;
  await copyFile(path.join(originals, file), path.join(localPublic, file));
  const info = JSON.parse(execFileSync('ffprobe', ['-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','json',path.join(originals,file)], {encoding:'utf8'}));
  media[name] = {src:file, ratio:info.streams[0].width/info.streams[0].height};
}
for (const name of ['soft-meow','young-cat','impatient-cat']) {
  await copyFile(path.join(originals, `meows/${name}.ogg`), path.join(localPublic, `meows/${name}.ogg`));
}
await writeFile(path.join(root, 'src/media.json'), JSON.stringify(media, null, 2)+'\n');
// Original quiet UI percussion and bass, without third-party music samples.
const sampleRate = 44100;
const pcm = new Float64Array(sampleRate * 24);
function tone(at:number, frequency:number, length:number, volume:number, slide=0) {
  const start = Math.round(at * sampleRate);
  for(let i=0;i<length*sampleRate && start+i<pcm.length;i++) {
    const t=i/sampleRate;
    const envelope=Math.min(1,t/.008)*Math.exp(-t*9/length);
    pcm[start+i]+=Math.sin(2*Math.PI*(frequency*t+slide*t*t/2))*envelope*volume;
  }
}
for(let beat=0;beat<48;beat++) {
  const at=beat*.5;
  tone(at,74,.15,.18,-280);
  if(beat%2===1) {tone(at+.25,1750,.045,.045,1500);tone(at+.25,2300,.03,.025);}
  if(beat%4===0) tone(at,[130.81,164.81,146.83,196][Math.floor(beat/4)%4],.4,.08);
}
for(const at of [0,3,4.66,6.33,8,9,12,17,18.33,19.66,21]) {tone(at,640,.065,.085,4000);tone(at+.055,960,.05,.04);}
const data=Buffer.alloc(pcm.length*2);
for(let i=0;i<pcm.length;i++) {
  const fade=Math.min(1,i/(sampleRate*.03),(pcm.length-i)/(sampleRate*.4));
  data.writeInt16LE(Math.round(Math.max(-1,Math.min(1,pcm[i]*fade))*32767),i*2);
}
const header=Buffer.alloc(44);
header.write('RIFF',0);header.writeUInt32LE(data.length+36,4);header.write('WAVEfmt ',8);header.writeUInt32LE(16,16);header.writeUInt16LE(1,20);header.writeUInt16LE(1,22);header.writeUInt32LE(sampleRate,24);header.writeUInt32LE(sampleRate*2,28);header.writeUInt16LE(2,32);header.writeUInt16LE(16,34);header.write('data',36);header.writeUInt32LE(data.length,40);
await writeFile(path.join(localPublic,'soundtrack.wav'),Buffer.concat([header,data]));
console.log('Prepared 12 cat photos, three real voices, and original sound design.');

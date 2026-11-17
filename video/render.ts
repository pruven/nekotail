import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {existsSync} from 'node:fs';
import {mkdir} from 'node:fs/promises';
import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill,renderMedia} from '@remotion/renderer';
import './prepare';
const root=path.dirname(fileURLToPath(import.meta.url));
const output=path.join(root,'out');
await mkdir(output,{recursive:true});
const installedChrome='/home/himmel/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome';
const browserExecutable=process.env.CHROME_PATH ?? (existsSync(installedChrome)?installedChrome:undefined);
console.log('Bundling the Remotion composition…');
const serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),publicDir:path.join(root,'public'),outDir:path.join(root,'.cache/bundle')});
const browser=await openBrowser('chrome',{browserExecutable,logLevel:'error'});
try {
 const composition=await selectComposition({serveUrl,id:'NekotailPromo',puppeteerInstance:browser});
 if (!process.argv.includes('--video-only')) {
 for(const frame of [45,180,315,405,555,675]) {
  await renderStill({serveUrl,composition,frame,output:path.join(output,`frame-${frame}.png`),imageFormat:'png',puppeteerInstance:browser,logLevel:'error'});
  console.log(`Storyboard frame ${frame} saved.`);
 }
 await renderStill({serveUrl,composition,frame:45,output:path.join(output,'poster.png'),imageFormat:'png',puppeteerInstance:browser,logLevel:'error'});
 }
 if(!process.argv.includes('--stills-only')) {
  console.log('Rendering 24-second 1080p MP4…');
  let reported=-1;
  await renderMedia({serveUrl,composition,codec:'h264',audioCodec:'aac',pixelFormat:'yuv420p',crf:18,x264Preset:'fast',concurrency:2,outputLocation:path.join(output,'nekotail-promo.mp4'),puppeteerInstance:browser,logLevel:'error',onProgress:({progress})=>{const step=Math.floor(progress*10);if(step!==reported){reported=step;console.log(`Render ${Math.min(100,step*10)}%`);}}});
  console.log(`Video ready: ${path.join(output,'nekotail-promo.mp4')}`);
 }
} finally { await browser.close({silent:true}); }

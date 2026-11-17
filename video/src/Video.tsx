import React from 'react';
import {AbsoluteFill, Html5Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {ArrowRight, Cat, CodeXml, Download, Ellipsis, Heart, Image, MousePointer2, Shuffle, Volume2} from 'lucide-react';
import media from './media.json';

const C={yellow:'#ffe65a',paper:'#fffdf5',pink:'#ff88ba',ink:'#172039',blue:'#2457ff'};
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const photo=(name:string)=>media[name as keyof typeof media];
const pop=(frame:number,delay=0)=>spring({frame:Math.max(0,frame-delay),fps:30,config:{damping:17,stiffness:190,mass:.8}});
const bg:React.CSSProperties={backgroundColor:C.yellow,backgroundImage:`radial-gradient(${C.ink}25 1.6px,transparent 1.6px)`,backgroundSize:'32px 32px',color:C.ink,fontFamily:'Arial, sans-serif'};

function Tile({children,color=C.paper,size=60,active=false}: {children:React.ReactNode;color?:string;size?:number;active?:boolean}) {
 return <div style={{width:size,height:size,background:active?C.blue:color,color:active?'white':C.ink,border:`3px solid ${C.ink}`,borderRadius:12,boxShadow:`5px 5px 0 ${C.ink}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{children}</div>;
}
function Button({secondary=false,pressed=false}: {secondary?:boolean;pressed?:boolean}) {
 return <div style={{height:74,padding:'0 30px',display:'flex',alignItems:'center',gap:20,border:`4px solid ${C.ink}`,borderRadius:13,background:secondary?C.pink:C.blue,color:secondary?C.ink:'white',fontSize:23,fontWeight:800,boxShadow:pressed?'none':`7px 7px 0 ${C.ink}`,transform:pressed?'translate(6px,6px)':undefined,whiteSpace:'nowrap'}}>{secondary?<Shuffle size={25}/>:null}{secondary?'SURPRISE ME':'SERVE ANOTHER CAT'}{secondary?null:<ArrowRight size={28}/>}</div>;
}
function Photo({name,width,height,style={}}:{name:string;width:number;height:number;style?:React.CSSProperties}) {
 return <div style={{width,height,background:C.paper,border:`4px solid ${C.ink}`,padding:8,borderRadius:18,boxShadow:`13px 13px 0 ${C.blue},17px 17px 0 ${C.ink}`,overflow:'hidden',...style}}><Img src={staticFile(photo(name).src)} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:7}}/></div>;
}
function Tag({children,color=C.pink,style={}}:{children:React.ReactNode;color?:string;style?:React.CSSProperties}) {
 return <div style={{background:color,border:`4px solid ${C.ink}`,borderRadius:12,boxShadow:`7px 7px 0 ${C.ink}`,padding:'18px 28px',fontWeight:900,fontSize:36,whiteSpace:'nowrap',...style}}>{children}</div>;
}
function Intro() {
 const f=useCurrentFrame();const p=pop(f);const text=pop(f,6);
 return <AbsoluteFill style={bg}>
   <div style={{position:'absolute',left:110,top:85,display:'flex',alignItems:'center',gap:18,fontSize:47,fontWeight:900,letterSpacing:-2}}><Tile color={C.pink} size={76}><Cat size={47}/></Tile>nekotail.</div>
   <div style={{position:'absolute',left:110,top:275,transform:`translateY(${(1-text)*45}px)`,opacity:text}}>
     <div style={{fontSize:31,fontWeight:700,letterSpacing:5,marginBottom:30}}>CAT-AS-A-SERVICE</div>
     <div style={{fontSize:170,fontWeight:900,lineHeight:.91,letterSpacing:-10}}>One more<br/><span style={{color:C.blue}}>cat.</span></div>
     <div style={{marginTop:55,display:'flex',gap:20}}><Button/></div>
   </div>
   <Photo name="mochi" width={760} height={880} style={{position:'absolute',right:115,top:85,transform:`translateX(${(1-p)*160}px) scale(${.88+p*.12})`,opacity:p}}/>
   <div style={{position:'absolute',right:65,top:120,transform:`scale(${pop(f,17)})`}}><Tag>100% cat energy.</Tag></div>
 </AbsoluteFill>;
}
function Cursor({frame,clickAt=45}:{frame:number;clickAt?:number}) {
 const move=interpolate(frame,[clickAt-26,clickAt-6],[0,1],clamp);
 const down=frame>=clickAt && frame<clickAt+6;
 return <div style={{position:'absolute',left:interpolate(move,[0,1],[1530,910]),top:interpolate(move,[0,1],[1120,970]),transform:`scale(${down?.86:1})`,filter:`drop-shadow(3px 4px 0 ${C.ink})`}}><MousePointer2 size={70} fill="white" stroke={C.ink} strokeWidth={2.5}/></div>;
}
function AppFrame({name,status,pressed=false,mode='pictures'}:{name:string;status?:[string,string];pressed?:boolean;mode?:'pictures'|'status'}) {
 const ratio=photo(name).ratio;const height=Math.min(748,1350/ratio);const width=height*ratio;
 return <AbsoluteFill style={bg}>
   <div style={{position:'absolute',left:40,top:25}}><Tile color={C.pink}><Cat size={35}/></Tile></div>
   <div style={{position:'absolute',right:46,top:25,display:'flex',gap:13}}>
     <Tile active={mode==='pictures'}><Image size={29}/></Tile><Tile><Volume2 size={29}/></Tile><Tile active={mode==='status'}><CodeXml size={29}/></Tile><div style={{width:14}}/><Tile><Ellipsis size={32}/></Tile>
   </div>
   <div style={{position:'absolute',width:width+24,height:height+24,left:(1920-width-24)/2,top:115}}>
     <Photo name={name} width={width+24} height={height+24}/>
     <div style={{position:'absolute',right:24,top:24,display:'flex',gap:12}}><Tile size={57}><Heart size={30}/></Tile><Tile size={57}><Download size={30}/></Tile></div>
     {status?<div style={{position:'absolute',left:30,bottom:30,padding:'16px 25px',background:C.paper,border:`4px solid ${C.ink}`,boxShadow:`6px 6px 0 ${C.ink}`,borderRadius:12}}><div style={{fontSize:90,lineHeight:1,fontWeight:900,letterSpacing:-6}}>{status[0]}</div><div style={{fontSize:20,fontWeight:800,marginTop:5}}>{status[1]}</div></div>:null}
   </div>
   <div style={{position:'absolute',bottom:40,left:0,width:'100%',display:'flex',justifyContent:'center',gap:22}}><Button pressed={pressed}/><Button secondary/></div>
 </AbsoluteFill>;
}
function Pictures() {
 const f=useCurrentFrame();const index=Math.min(3,Math.floor(f/50));const local=f%50;
 const names=['tofu','miso','pip','luna'];
 return <AbsoluteFill>
   <div style={{position:'absolute',inset:0,transform:`scale(${interpolate(pop(local),[0,1],[.96,1])})`}}><AppFrame name={names[index]} pressed={local>=44 && local<50}/></div>
   <div style={{position:'absolute',left:85,top:145,transform:`scale(${pop(f,10)})`}}><Tag color={C.pink}>150 CATS.</Tag></div>
   <Cursor frame={local}/>
 </AbsoluteFill>;
}
const collageNames=['miso','mochi','olive','nori','tofu','pip','bean','luna','sesame','maple','biscuit','suki'];
function Collection() {
 const f=useCurrentFrame();
 return <AbsoluteFill style={{...bg,backgroundColor:C.blue}}>
  <div style={{position:'absolute',inset:44,display:'grid',gridTemplateColumns:'repeat(4,1fr)',gridTemplateRows:'repeat(3,1fr)',gap:27}}>
   {collageNames.map((name,i)=><Photo key={name} name={name} width={438} height={306} style={{boxShadow:`7px 7px 0 ${C.ink}`,transform:`scale(${.76+pop(f,i*2)*.24})`,opacity:interpolate(f,[i*2,i*2+5],[0,1],clamp)}}/>)}
  </div>
  <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',transform:`scale(${pop(f,13)})`}}><Tag color={C.yellow} style={{fontSize:118,padding:'24px 50px',letterSpacing:-5}}>150 CATS.</Tag></div>
 </AbsoluteFill>;
}
function Voices() {
 const f=useCurrentFrame();const p=pop(f);const name=f<55?'sesame':f<105?'suki':'bean';
 return <AbsoluteFill style={bg}>
  <Photo name={name} width={940} height={900} style={{position:'absolute',left:85,top:75,transform:`scale(${.92+.08*p})`}}/>
  <div style={{position:'absolute',left:1120,top:170,transform:`translateY(${(1-p)*50}px)`,opacity:p}}>
    <Tile color={C.pink} size={100}><Volume2 size={60}/></Tile>
    <div style={{fontSize:142,lineHeight:.92,fontWeight:900,letterSpacing:-7,marginTop:50}}>7 REAL<br/><span style={{color:C.blue}}>VOICES.</span></div>
    <div style={{display:'flex',alignItems:'center',height:140,gap:13,marginTop:65}}>
     {Array.from({length:19},(_,i)=><div key={i} style={{width:16,height:24+Math.abs(Math.sin(f*.22+i*.9))*90,background:i%3===0?C.pink:C.blue,border:`2px solid ${C.ink}`,borderRadius:5}}/>)}
    </div>
  </div>
 </AbsoluteFill>;
}
function HttpCats() {
 const f=useCurrentFrame();const i=Math.min(2,Math.floor(f/40));
 const codes:[string,string][]=[['404','NOT FOUND'],['418','I’M A TEAPOT'],['200','OK']];
 return <AbsoluteFill><AppFrame name={['maple','nori','biscuit'][i]} status={codes[i]} mode="status"/><div style={{position:'absolute',top:150,left:85,transform:`scale(${pop(f,5)})`}}><Tag color={C.pink}>HTTP CATS.</Tag></div></AbsoluteFill>;
}
function Closing() {
 const f=useCurrentFrame();const p=pop(f);const shots=[{name:'tofu',left:-90,top:55},{name:'pip',left:1500,top:20},{name:'olive',left:-20,top:650},{name:'mochi',left:1550,top:650}];
 return <AbsoluteFill style={bg}>
  {shots.map((shot,i)=><Photo key={shot.name} name={shot.name} width={440} height={420} style={{position:'absolute',left:shot.left,top:shot.top,transform:`scale(${pop(f,i*3)})`}}/>)}
  <div style={{position:'absolute',left:370,top:200,width:1180,height:640,border:`5px solid ${C.ink}`,borderRadius:22,background:C.paper,boxShadow:`18px 18px 0 ${C.blue},23px 23px 0 ${C.ink}`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',transform:`translateY(${(1-p)*100}px) scale(${.9+p*.1})`,opacity:p}}>
   <div style={{display:'flex',alignItems:'center',gap:28,fontSize:172,fontWeight:900,letterSpacing:-12}}><Cat size={144} strokeWidth={1.8}/>nekotail.</div>
   <div style={{fontSize:38,marginTop:32,fontWeight:600}}>150 cats. 7 voices. Your tailnet.</div>
   <div style={{marginTop:50}}><Button/></div>
  </div>
  <div style={{position:'absolute',bottom:65,width:'100%',textAlign:'center',fontSize:25,fontWeight:700,letterSpacing:2}}>BUN / ASTRO / TAILSCALE SERVE</div>
 </AbsoluteFill>;
}
export const NekotailPromo:React.FC=()=> <AbsoluteFill style={{...bg,overflow:'hidden'}}>
 <Sequence from={0} durationInFrames={90}><Intro/></Sequence>
 <Sequence from={90} durationInFrames={180}><Pictures/></Sequence>
 <Sequence from={270} durationInFrames={90}><Collection/></Sequence>
 <Sequence from={360} durationInFrames={150}><Voices/></Sequence>
 <Sequence from={510} durationInFrames={120}><HttpCats/></Sequence>
 <Sequence from={630} durationInFrames={90}><Closing/></Sequence>
 <Html5Audio src={staticFile('soundtrack.wav')} volume={.5}/>
 <Sequence from={22} durationInFrames={35}><Html5Audio src={staticFile('meows/young-cat.ogg')} volume={.65}/></Sequence>
 <Sequence from={370} durationInFrames={36}><Html5Audio src={staticFile('meows/soft-meow.ogg')} volume={.9}/></Sequence>
 <Sequence from={421} durationInFrames={36}><Html5Audio src={staticFile('meows/young-cat.ogg')} volume={.85}/></Sequence>
 <Sequence from={465} durationInFrames={44}><Html5Audio src={staticFile('meows/impatient-cat.ogg')} volume={.75}/></Sequence>
</AbsoluteFill>;

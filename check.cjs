const fs=require('fs'),vm=require('vm'),assert=require('assert');
const elements=new Map();
function element(){return {value:'10',checked:true,style:{},children:[],classList:{add(){},remove(){}},setAttribute(){},append(x){this.children.push(x)},showModal(){this.open=true},close(){this.open=false}}}
const sandbox={console,performance:{now:()=>0},localStorage:{getItem:()=>JSON.stringify({bounds:[6,94],duration:10000,arrows:true}),setItem(){}},document:{getElementById(id){if(!elements.has(id))elements.set(id,element());return elements.get(id)},createElement:element,addEventListener(){},body:element()},Audio:class{pause(){} async play(){}},Image:class{},requestAnimationFrame(){},setTimeout,clearTimeout};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync('dist/app.js','utf8'),sandbox);
vm.runInContext(`
if(slides.length!==28)throw Error('Expected twenty-eight slides');
for(let i=0;i<slides.length;i++){go(i);if(!$('stage').innerHTML.includes(slides[i].title))throw Error('Slide render failed');}
if(!slides[13].drawing||!slides[14].movie)throw Error('Children’s artwork must follow slide thirteen');
go(14);if(!$('stage').innerHTML.includes('muted loop playsinline'))throw Error('Expected silent looping video');
go(slides.length-1);go(current+1);if(current!==0)throw Error('Loop failed');
go(3);if($('pointer').style.left!=='6%')throw Error('First pointer alignment');
go(11);if($('pointer').style.left!=='94%')throw Error('Last pointer alignment');
if(duration!==20000)throw Error('Old saved timing was not migrated');
go(0);for(let t=1000;t<=19000;t+=1000)tick(t);if(current!==0)throw Error('Advanced before twenty seconds');
if(!$('countdown').textContent.startsWith('1s'))throw Error('Countdown incorrect');
tick(20000);if(current!==1)throw Error('Automatic advance failed');
pause();const held=current;tick(30000);if(current!==held||$('countdown').textContent!=='Paused')throw Error('Pause failed');
if(backgroundAudio.src)throw Error('Unexpected custom music');
`,sandbox);
for(let i=0;i<10;i++)assert(fs.statSync(`dist/assets/goddess-${i}.jpeg`).size>0);
assert(fs.statSync('dist/assets/aigiri-nandini-instrumental.mp3').size>100000);
assert(fs.readFileSync('dist/app.js','utf8').includes("new Audio('assets/aigiri-nandini-instrumental.mp3')"));
console.log('PASS: 28 slides; saved timing migration; 20-second advance; countdown and pause; looping; pointers; MP3 score.');

assert(fs.statSync('dist/assets/childrens-durga-battle.png').size>0);
assert(fs.statSync('dist/assets/childrens-durga-battle.mp4').size>0);

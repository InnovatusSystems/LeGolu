const fs=require('fs'),vm=require('vm'),assert=require('assert');
const elements=new Map();
function element(){return {value:'10',checked:true,style:{},children:[],classList:{add(){},remove(){}},setAttribute(){},append(x){this.children.push(x)},showModal(){this.open=true},close(){this.open=false}}}
const sandbox={console,performance:{now:()=>0},localStorage:{getItem:()=>null,setItem(){}},document:{getElementById(id){if(!elements.has(id))elements.set(id,element());return elements.get(id)},createElement:element,addEventListener(){},body:element()},Image:class{},requestAnimationFrame(){},setTimeout,clearTimeout};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync('dist/app.js','utf8'),sandbox);
vm.runInContext(`
if(slides.length!==20)throw Error('Expected twenty slides');
for(let i=0;i<slides.length;i++){go(i);if(!$('stage').innerHTML.includes(slides[i].title))throw Error('Slide render failed');}
go(19);go(current+1);if(current!==0)throw Error('Loop failed');
go(3);if($('pointer').style.left!=='6%')throw Error('First pointer alignment');
go(11);if($('pointer').style.left!=='94%')throw Error('Last pointer alignment');
go(0);tick(11000);for(let t=12000;t<=20000;t+=1000)tick(t);if(current!==1)throw Error('Automatic advance failed');
pause();const held=current;tick(30000);if(current!==held)throw Error('Pause failed');
`,sandbox);
for(let i=0;i<10;i++)assert(fs.statSync(`dist/assets/goddess-${i}.jpeg`).size>0);
console.log('PASS: 20 slides render; 10 assets present; automatic advance, looping, pause, first/last pointers.');

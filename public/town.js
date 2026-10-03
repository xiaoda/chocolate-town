import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {RoundedBoxGeometry} from './vendor/RoundedBoxGeometry.js';
import {mergeGeometries} from './vendor/BufferGeometryUtils.js';
import {places,getPhoto} from './data.js';
import {stageLayout,focusView} from './layout.js';

// 此模型是人工依据照片建立的展示性微缩场景，不是摄影测量结果。
export async function createTown(container, onSelect, onReady) {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setClearColor(0x000000,0);
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
 container.prepend(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
 const scene=new THREE.Scene();const world=new THREE.Group();scene.add(world);
 const camera=new THREE.PerspectiveCamera(36,1,.1,180);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.075;controls.minDistance=10;controls.maxDistance=68;controls.maxPolarAngle=Math.PI*.475;controls.minPolarAngle=.05;controls.enablePan=true;controls.autoRotateSpeed=.35;controls.target.set(0,1,0);
 const ambient=new THREE.HemisphereLight(0xb8c9ff,0x282030,1.5);scene.add(ambient);
 const key=new THREE.DirectionalLight(0xffe4bb,3.1);key.position.set(-9,20,16);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-22;key.shadow.camera.right=22;key.shadow.camera.top=20;key.shadow.camera.bottom=-20;key.shadow.bias=-.001;key.shadow.normalBias=.04;scene.add(key);
 const fill=new THREE.DirectionalLight(0x857dff,2.5);fill.position.set(2,9,-10);scene.add(fill);
 const blue=new THREE.PointLight(0x5555ff,55,30,1.6);blue.position.set(-4,7,-3);scene.add(blue);
 const blue2=new THREE.PointLight(0x7564ff,45,23,1.6);blue2.position.set(8,6,-4);scene.add(blue2);
 const matCache=new Map();function mat(color,more={}){const k=color+JSON.stringify(more);if(!matCache.has(k))matCache.set(k,new THREE.MeshStandardMaterial({color,roughness:.83,...more}));return matCache.get(k);}
 const brass=mat('#b1935e',{metalness:.58,roughness:.38}),iron=mat('#292b30',{metalness:.62,roughness:.38}),dark=mat('#191d29'),stone=mat('#a39b84'),warm=mat('#ffe1a2',{emissive:'#ffc569',emissiveIntensity:1.1,roughness:.5});
 function mesh(g,m,parent,x=0,y=0,z=0){const a=new THREE.Mesh(g,m);a.position.set(x,y,z);a.castShadow=true;a.receiveShadow=true;parent.add(a);return a;}
 function box(parent,w,h,d,x,y,z,m,r=0){return mesh(r?new RoundedBoxGeometry(w,h,d,1,r):new THREE.BoxGeometry(w,h,d),m,parent,x,y,z);}
 function cyl(parent,rt,rb,h,x,y,z,m,n=12){return mesh(new THREE.CylinderGeometry(rt,rb,h,n),m,parent,x,y,z);}
 function sphere(parent,r,x,y,z,m){return mesh(new THREE.SphereGeometry(r,8,6),m,parent,x,y,z);}
 let seed=4281;function random(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
 function canvasTexture(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy();return t;}
 const brick=canvasTexture(512,512,(c,w,h)=>{c.fillStyle='#574e50';c.fillRect(0,0,w,h);for(let row=0;row<22;row++)for(let col=-1;col<7;col++){const light=47+random()*19;c.fillStyle=`hsl(22 12% ${light}%)`;const x=col*84+(row%2?42:0);const y=row*24;c.fillRect(x+1,y+1,81,21);c.fillStyle='#ffffff0b';c.fillRect(x+3,y+2,77,2);for(let j=0;j<10;j++){c.fillStyle=random()>.5?'#ffffff07':'#0000000b';c.fillRect(x+random()*79,y+random()*19,3,1);}}});brick.wrapS=brick.wrapT=THREE.RepeatWrapping;
 brick.repeat.set(2,2);
 const paving=canvasTexture(1536,1024,(c,w,h)=>{c.fillStyle='#41414a';c.fillRect(0,0,w,h);for(let y=0;y<h;y+=11)for(let x=-15;x<w;x+=17){const b=23+random()*9;c.fillStyle=`hsl(28 6% ${b}%)`;c.beginPath();c.roundRect(x+(Math.round(y/11)%2)*8.5+1,y+1,15,9,2);c.fill();}c.strokeStyle='#b2a180';c.lineWidth=1;c.globalAlpha=.17;for(let x=150;x<w;x+=280)for(let y=70;y<h;y+=280)for(let r=25;r<132;r+=10){c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.stroke();}c.globalAlpha=1;});
 const curtain=canvasTexture(128,256,(c,w,h)=>{const gr=c.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#fff1c7');gr.addColorStop(.12,'#e4d2a3');gr.addColorStop(1,'#9a95b5');c.fillStyle=gr;c.fillRect(0,0,w,h);for(let x=0;x<w;x++){c.fillStyle=`rgba(255,255,245,${.16+Math.sin(x*.25)*.14})`;c.fillRect(x,0,1,h);}c.fillStyle='#ffe9bc';c.fillRect(0,0,w,5);});
 const curtainMat=new THREE.MeshStandardMaterial({map:curtain,emissiveMap:curtain,emissive:0xffd9ac,emissiveIntensity:.6,roughness:.9});
 const manager=new THREE.LoadingManager();const loader=new THREE.TextureLoader(manager);const photoTextures=new Map();let failedTextures=0;
 manager.onError=()=>{failedTextures++;};manager.onLoad=()=>onReady?.(failedTextures);
 function photoMat(id,crop=[0,0,1,1]){const k=id+':'+crop.join(',');if(photoTextures.has(k))return photoTextures.get(k);const tex=loader.load(getPhoto(id).src);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;tex.offset.set(crop[0],1-crop[1]-crop[3]);tex.repeat.set(crop[2],crop[3]);const m=new THREE.MeshBasicMaterial({map:tex,toneMapped:false});photoTextures.set(k,m);return m;}
 function plane(parent,w,h,x,y,z,m){return mesh(new THREE.PlaneGeometry(w,h),m,parent,x,y,z);}
 function textPanel(parent,text,w,h,x,y,z,bg='#352a28',fg='#ecd6a3',size=57){const t=canvasTexture(1024,200,(c,cw,ch)=>{c.fillStyle=bg;c.fillRect(0,0,cw,ch);c.strokeStyle='#d4b27a80';c.lineWidth=3;c.strokeRect(12,12,cw-24,ch-24);c.fillStyle=fg;c.textAlign='center';c.textBaseline='middle';c.font=`${size}px Georgia, "Microsoft YaHei", serif`;c.fillText(text,cw/2,ch/2+3,cw-60);});return plane(parent,w,h,x,y,z,new THREE.MeshStandardMaterial({map:t,emissiveMap:t,emissive:0xb29776,emissiveIntensity:.25,roughness:.8}));}
 // 开放式展台，而非对真实展馆的封闭外形作出断言。
 const {width:stageWidth,depth:stageDepth}=stageLayout;
 box(world,stageWidth,.85,stageDepth,0,-.59,0,mat('#383842'),.3);
 box(world,stageWidth-.3,.08,stageDepth-.3,0,-.16,0,brass,.07);
 box(world,stageWidth-.5,.22,stageDepth-.5,0,-.06,0,mat('#3b3b42'),.12);
 const floor=mesh(new THREE.PlaneGeometry(stageWidth-.6,stageDepth-.6),new THREE.MeshStandardMaterial({map:paving,roughness:1}),world,0,.058,0);floor.rotation.x=-Math.PI/2;floor.castShadow=false;
 const ground=mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.2}),scene,0,-1.03,0);ground.rotation.x=-Math.PI/2;ground.castShadow=false;
 textPanel(world,'CHOCOLATE TOWN   /   03 OCT 2026',10,.36,0,-.56,stageDepth/2+.02,'#2b2b33','#b99b6c',34);
 const placeGroups=new Map(),targets=[],markerPositions=new Map();
 function windowFrame(g,x,y,z,w,h,trim,material=curtainMat,bars=true){box(g,w+.18,h+.18,.15,x,y,z,trim);plane(g,w,h,x,y,z+.086,material);if(bars){box(g,.045,h,.05,x,y,z+.12,trim);box(g,w,.045,.05,x,y-.03,z+.12,trim);}box(g,w+.28,.12,.26,x,y-h/2-.07,z+.05,trim);}
 function plant(g,x,y,z,scale=1,flowers=false){const pot=mat('#675044');cyl(g,.19*scale,.14*scale,.4*scale,x,y+.2*scale,z,pot);for(let j=0;j<5;j++){const dx=(random()-.5)*.35*scale,dz=(random()-.5)*.35*scale;sphere(g,.17*scale,x+dx,y+(.42+random()*.25)*scale,z+dz,mat(flowers&&j%2?'#c09b86':'#485b4d'));}}
 function flowerBox(g,x,y,z,w){box(g,w,.16,.28,x,y,z,mat('#54463d'));for(let j=0;j<Math.floor(w*6);j++){sphere(g,.09,x-w/2+j/6,y+.13,z,mat(j%3===0?'#d3b379':j%3===1?'#85816b':'#657055'));}}
 const windowDetails={book:[2,[.56,.38,.38,.52]],ornament:[3,[.31,.3,.40,.60]],tailor:[5,[.42,.36,.5,.47]],bakery:[7,[.55,.32,.41,.57]],restaurant:[9,[.51,.25,.45,.62]],post:[8,[.44,.40,.50,.52]],toy:[15,[.503,.565,.093,.23]],wine:[12,[.08,.28,.57,.53]],bear:[12,[.8,.25,.18,.6]]};
 function building(p){
  const g=new THREE.Group();g.position.set(p.position[0],.1,p.position[1]);g.rotation.y=p.rotation;g.userData.place=p.id;world.add(g);placeGroups.set(p.id,g);
  const w=p.width,h=p.height,d=2.65,z=d/2,trim=mat(p.trim);const wall=new THREE.MeshStandardMaterial({map:brick,color:p.color,roughness:.93});
  box(g,w+.55,.18,d+1.15,0,.1,.15,mat('#8c877b'));box(g,w+.65,.11,.21,0,.08,z+.68,stone);
  const base=box(g,w,h,d,0,h/2+.18,0,wall);base.userData.place=p.id;targets.push(base);
  // 模型背面明确采用中性的封闭面，避免伪造未拍摄的店面。
  box(g,w-.05,h-.08,.045,0,h/2+.18,-d/2-.025,mat('#41414b'));
  box(g,w+.18,.14,d+.17,0,h+.18,0,trim);box(g,w+.30,.12,d+.3,0,h+.31,0,mat('#a19480'));box(g,w+.1,.14,d+.12,0,h+.44,0,trim);
  box(g,w-.14,.07,d-.14,0,h+.51,0,mat('#424451'));
  box(g,w+.09,.15,.28,0,3.18,z+.025,trim);box(g,w+.2,.09,.33,0,3.29,z+.04,trim);
  box(g,w,.28,.15,0,.37,z+.08,trim);
  for(const x of [-w/2+.12,w/2-.12]){box(g,.22,2.85,.18,x,1.72,z+.09,trim);box(g,.32,.12,.23,x,.45,z+.13,trim);}
  if(p.kind!=='bear'){
   const count=w>3.2?2:1,ww=count===2?w*.255:w*.46;
   for(let i=0;i<count;i++){const xx=count===2?(i-.5)*w*.52:0;windowFrame(g,xx,4.47,z+.07,ww,1.65,mat('#b4a897'));box(g,ww+.24,.12,.38,xx,5.35,z+.16,trim);}
  }
  const sign=p.kind==='restaurant'?'Cocoa Restaurant':p.sign;
  box(g,w-.18,.5,.2,0,2.81,z+.16,trim);textPanel(g,sign,w-.28,.4,0,2.81,z+.267,p.trim,'#ecdab1',p.kind==='wine'?47:p.kind==='restaurant'?65:57);
  const doorX=-w*.31,doorW=w*.24;
  box(g,doorW+.12,2.15,.15,doorX,1.45,z+.11,trim);windowFrame(g,doorX,1.63,z+.2,doorW-.12,1.5,trim,curtainMat,p.kind==='tailor');sphere(g,.045,doorX+doorW*.32,1.35,z+.34,brass);
  const [pid,crop]=windowDetails[p.kind],winW=w*.51,winX=w*.18;
  const depth=['tailor','restaurant','post','toy','ornament'].includes(p.kind)?.43:.12;
  box(g,winW+.2,.45,depth+.1,winX,.59,z+depth/2,trim);
  windowFrame(g,winX,1.66,z+depth,winW,1.66,trim,photoMat(pid,crop),p.kind==='ornament'||p.kind==='restaurant');
  if(depth>.2){for(const s of [-1,1]){const side=box(g,.08,1.7,depth,winX+s*(winW/2+.06),1.66,z+depth/2,trim);side.castShadow=true;}box(g,winW+.25,.12,depth+.17,winX,2.58,z+depth/2+.04,trim);box(g,winW+.27,.12,depth+.17,winX,.7,z+depth/2+.04,trim);}
  if(p.kind==='tailor'){
   const canopy=cyl(g,winW/2+.15,winW/2+.15,.24,winX,2.6,z+.15,trim,24);canopy.scale.z=.8;
  }
  if(p.kind==='restaurant'){
   box(g,.83,2.2,.4,0,5.17,z+.17,mat('#cfbc94'));for(let y=4.5;y<6.1;y+=.12)box(g,.68,.045,.07,0,y,z+.4,mat('#a59c85'));
   const shape=new THREE.Shape();shape.moveTo(-.66,0);shape.lineTo(.66,0);shape.lineTo(0,.55);shape.closePath();const ped=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.3,bevelEnabled:false}),mat('#cdb98d'));ped.position.set(0,h+.23,z+.05);g.add(ped);
  }
  if(p.kind==='post'){
   box(g,w*.75,.11,.54,0,3.45,z+.15,mat('#d7d0b7'));for(let x=-w*.33;x<w*.35;x+=.18)cyl(g,.025,.035,.46,x,3.7,z+.42,mat('#d8d0b3'),6);box(g,w*.78,.09,.1,0,3.96,z+.42,mat('#d8d0b3'));flowerBox(g,0,4.04,z+.32,w*.73);
  }
  if(p.kind==='book'||p.kind==='ornament')flowerBox(g,0,3.43,z+.18,w*.87);
  if(p.kind==='wine'){for(let i=0;i<2;i++){cyl(g,.21,.24,.6,-w/2-.29,.43+i*.58,z+.05,mat('#705338'));cyl(g,.224,.252,.045,-w/2-.29,.25+i*.58,z+.05,iron);cyl(g,.224,.252,.045,-w/2-.29,.58+i*.58,z+.05,iron);}}
  plant(g,w/2+.12,.2,z+.46,.83,true);
  // 柔和的暖光只作用于本店临街区域。
  const light=new THREE.PointLight(0xffc780,3,4,2);light.position.set(winX,1.6,z+.85);g.add(light);
  g.updateMatrixWorld(true);
  const v=new THREE.Vector3(0,h+.92,0);g.localToWorld(v);markerPositions.set(p.id,v);
  return g;
 }
 places.filter(p=>p.width).forEach(building);
 function lamp(x,z,scale=1){const g=new THREE.Group();world.add(g);g.position.set(x,.2,z);g.scale.setScalar(scale);cyl(g,.19,.24,.16,0,.08,0,iron);cyl(g,.1,.16,.4,0,.32,0,iron);cyl(g,.045,.08,2.22,0,1.56,0,iron);cyl(g,.11,.1,.12,0,2.67,0,brass);cyl(g,.24,.13,.57,0,3,0,warm,4);const cone=cyl(g,0,.34,.26,0,3.4,0,iron,4);cone.rotation.y=Math.PI/4;sphere(g,.065,0,3.58,0,brass);for(let i=0;i<4;i++){const a=Math.PI/4+i*Math.PI/2;const xx=Math.cos(a)*.17,zz=Math.sin(a)*.17;box(g,.025,.67,.025,xx,3.03,zz,iron);}cyl(g,.21,.1,.12,0,2.68,0,iron,4);const light=new THREE.PointLight(0xffdba0,4,5,2);light.position.y=3;g.add(light);return g;}
 stageLayout.lamps.forEach(([x,z])=>lamp(x,z));
 // BN 101 是照片中的展览造景，使用双层敞顶外形，而非虚构行驶车辆。
 function bus(){const p=places.find(x=>x.id==='bus');const g=new THREE.Group();g.position.set(...[p.position[0],.18,p.position[1]]);g.rotation.y=p.rotation;world.add(g);placeGroups.set('bus',g);const red=mat('#b52525',{roughness:.5,metalness:.12}),redDark=mat('#6e2025'),cream=mat('#c8bdb0',{metalness:.7,roughness:.35}),glass=mat('#192732',{metalness:.2,roughness:.26});
  const body=box(g,2.28,1.55,3.95,0,1.31,0,red,.16);body.userData.place='bus';targets.push(body);
  box(g,2.32,.19,4.05,0,2.25,0,mat('#d9a047'),.06);
  box(g,2.19,.75,3.92,0,3.15,0,red,.09);box(g,2.21,.16,3.95,0,3.57,0,red,.07);
  // 顶层开口、扶手和前窗。
  box(g,1.95,.12,3.65,0,3.57,0,dark);for(const x of [-1.03,1.03]){box(g,.045,.06,3.8,x,3.99,0,red);for(const z of [-1.85,0,1.85])box(g,.045,.43,.045,x,3.8,z,red);}
  box(g,2.1,.06,.045,0,3.99,1.89,red);box(g,2.1,.06,.045,0,3.99,-1.89,red);
  for(const x of [-.57,.57]){box(g,.95,.42,.05,x,3.16,1.978,glass,.05);box(g,.95,.61,.05,x,1.91,1.997,glass,.06);}
  for(const x of [-1.13,1.13])for(const z of [-1.18,0,1.13]){box(g,.04,.62,.88,x,1.95,z,glass);box(g,.045,.38,.9,x,3.17,z,glass);}
  for(const x of [-1.03,1.03])for(const z of [-1.22,1.22]){const tire=cyl(g,.43,.43,.23,x,.46,z,iron,18);tire.rotation.z=Math.PI/2;const hub=cyl(g,.2,.2,.245,x,.46,z,cream,12);hub.rotation.z=Math.PI/2;}
  box(g,1.38,1.01,.17,0,1.03,2.02,cream,.12);box(g,1.26,.9,.06,0,1.04,2.12,redDark,.09);for(let y=.68;y<1.45;y+=.07)box(g,1.12,.016,.017,0,y,2.16,cream);box(g,.04,.88,.025,0,1.05,2.17,cream);
  for(const x of [-.91,.91]){const light=cyl(g,.14,.14,.08,x,1.18,2,brass,16);light.rotation.x=Math.PI/2;const bulb=cyl(g,.103,.103,.085,x,1.18,2.047,warm,16);bulb.rotation.x=Math.PI/2;}
  textPanel(g,'BN 101',.91,.2,0,.52,2.15,'#171a20','#ffffff',95);
  for(const z of [-1.3,-.3,.7]){box(g,1.5,.12,.45,0,3.69,z,mat('#704338'));box(g,1.5,.35,.12,0,3.88,z-.2,mat('#704338'));}
  const v=new THREE.Vector3(0,4.65,0);g.localToWorld(v);markerPositions.set('bus',v);
 }
 bus();
 // 公告栏位置相对巴士已知，具体距离仍按展台比例安排。
 const board=new THREE.Group();board.position.set(stageLayout.board[0],.2,stageLayout.board[1]);board.rotation.y=.38;world.add(board);box(board,2.55,1.6,.15,0,1.5,0,mat('#39544d'));windowFrame(board,0,1.5,.11,2.3,1.36,mat('#8c7449'),photoMat(17,[.21,.24,.67,.58]),false);for(const x of [-.91,.91])box(board,.1,1.1,.1,x,.55,0,iron);
 for(const [x,z]of stageLayout.plants)plant(world,x,.12,z,1.7,true);
 // 铺装中的细金线提示这是“连接推定”，而非实测道路边界。
 const route=new THREE.CatmullRomCurve3(stageLayout.route.map(([x,z])=>new THREE.Vector3(x,.09,z)));
 const pathGeo=new THREE.BufferGeometry().setFromPoints(route.getPoints(90));const pathLine=new THREE.Line(pathGeo,new THREE.LineDashedMaterial({color:0xbfa57c,dashSize:.16,gapSize:.20,transparent:true,opacity:.6}));pathLine.computeLineDistances();world.add(pathLine);
 // 微缩台面上的装饰铭牌，不对真实场地添加虚构建筑。
 const plaque=textPanel(world,'基于实拍的空间推定  /  非测绘模型',8.5,.6,1,.078,10.8,'#37363b','#b0a38d',43);plaque.rotation.x=-Math.PI/2;
 const markers=document.querySelector('#markers');places.filter(p=>p.position).forEach((p,i)=>{const el=document.createElement('button');el.className='marker';el.dataset.place=p.id;el.innerHTML=`<span class="marker-number">${String(i+1).padStart(2,'0')}</span>${p.name}`;el.setAttribute('aria-label',`查看${p.name}实拍`);el.addEventListener('click',()=>onSelect(p.id));markers.append(el);});
 // 按材质合并静态构件，保留原始代理盒用于点击与地点定位。
 world.updateMatrixWorld(true);const batches=new Map(),originalMeshes=[];
 world.traverse(obj=>{if(!obj.isMesh)return;const key=`${obj.material.uuid}/${obj.castShadow}/${obj.receiveShadow}`;if(!batches.has(key))batches.set(key,{material:obj.material,cast:obj.castShadow,receive:obj.receiveShadow,geometries:[]});let geo=obj.geometry.index?obj.geometry.toNonIndexed():obj.geometry.clone();geo.applyMatrix4(obj.matrixWorld);batches.get(key).geometries.push(geo);originalMeshes.push(obj);});
 for(const obj of originalMeshes)obj.removeFromParent();
 for(const batch of batches.values()){const geometry=mergeGeometries(batch.geometries,false);if(!geometry)throw new Error('静态几何体合并失败');const m=new THREE.Mesh(geometry,batch.material);m.castShadow=batch.cast;m.receiveShadow=batch.receive;world.add(m);for(const g of batch.geometries)g.dispose();}
 let mode='overview',selectedId=null,tween=null,visible=true,last=0;const initial={pos:new THREE.Vector3(...stageLayout.overview),target:new THREE.Vector3(0,1.25,0)};
 function resize(){const w=container.clientWidth,h=container.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();controls.maxDistance=w<640?150:85;if(mode==='overview'){if(w<640){const fit=Math.max(.85,(h/w)/(600/526))*1.2;camera.position.set(-14*fit,37*fit,59*fit);controls.target.set(0,2.5,0);camera.setViewOffset(w,h,-w*.01,-h*.19,w,h);}else{camera.position.copy(initial.pos);controls.target.copy(initial.target);camera.setViewOffset(w,h,-w*.105,-h*.015,w,h);}controls.update();}else if(mode==='focus'&&selectedId){focus(selectedId,false);}else camera.clearViewOffset();}
 function move(pos,target,newMode){mode=newMode;controls.autoRotate=false;camera.clearViewOffset();if(reduced){camera.position.copy(pos);controls.target.copy(target);}else tween={start:performance.now(),from:camera.position.clone(),to:pos,fromTarget:controls.target.clone(),toTarget:target};}
 function reset(){mode='overview';selectedId=null;tween=null;controls.autoRotate=false;resize();}
 function aerial(){move(new THREE.Vector3(...stageLayout.aerial),new THREE.Vector3(0,0,0),'aerial');}
 function focus(id,animate=true){const g=placeGroups.get(id);if(!g)return;selectedId=id;const p=places.find(p=>p.id===id);const rect=container.getBoundingClientRect(),panel=document.querySelector('#detail'),panelRect=panel.getBoundingClientRect();const w=rect.width,h=rect.height;if(!w||!h)return;const availableWidth=!panel.hidden&&w>640?panelRect.left-rect.left-20:w;const availableHeight=!panel.hidden&&w<=640?panelRect.top-rect.top-16:h;const view=focusView(p,{width:w,height:h,availableWidth,availableHeight});const target=g.localToWorld(new THREE.Vector3(...view.target));const pos=g.localToWorld(new THREE.Vector3(...view.position));if(animate)move(pos,target,'focus');else{tween=null;camera.position.copy(pos);controls.target.copy(target);}camera.setViewOffset(w,h,view.offsetX,view.offsetY,w,h);document.querySelectorAll('.marker').forEach(el=>el.classList.toggle('selected',el.dataset.place===id));}
 const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();let down=null;
 renderer.domElement.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];tween=null;});renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)return;const b=renderer.domElement.getBoundingClientRect();mouse.set((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1);ray.setFromCamera(mouse,camera);const hits=ray.intersectObjects(targets);if(hits.length)onSelect(hits[0].object.userData.place);down=null;});
 controls.addEventListener('start',()=>{tween=null;});
 const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(container);resize();
 let raf;function render(now){raf=requestAnimationFrame(render);if(!visible||document.hidden||now-last<29)return;last=now;if(tween){const f=Math.min((now-tween.start)/1050,1),s=1-Math.pow(1-f,3);camera.position.lerpVectors(tween.from,tween.to,s);controls.target.lerpVectors(tween.fromTarget,tween.toTarget,s);if(f===1)tween=null;}controls.update();renderer.render(scene,camera);
  const w=container.clientWidth,h=container.clientHeight;const occupied=[];document.querySelectorAll('.marker').forEach(el=>{const p=markerPositions.get(el.dataset.place).clone().project(camera);const x=(p.x*.5+.5)*w,y=(-p.y*.5+.5)*h;el.style.left=x+'px';el.style.top=y+'px';const overlaps=occupied.some(([a,b])=>Math.abs(a-x)<80&&Math.abs(b-y)<32);const detailOpen=!document.querySelector('#detail').hidden;const inIntro=!detailOpen&&(w<640?x<235&&y<240:x<325&&y<345);const otherLabel=detailOpen&&mode==='focus'&&el.dataset.place!==selectedId;const hidden=p.z>1||p.z< -1||x<15||x>w-20||y<20||y>h-30||inIntro||overlaps||otherLabel;el.classList.toggle('occluded',hidden);if(!hidden)occupied.push([x,y]);});
 }raf=requestAnimationFrame(render);
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();document.querySelector('#webgl-error').hidden=false;document.querySelector('#loading').classList.add('done');});
 let soft=false;
 return {reset,aerial,focus,leaveFocus(){selectedId=null;if(mode==='focus'){tween=null;mode='free';camera.clearViewOffset();}},rotate(value){controls.autoRotate=value;return value;},zoom(scale){camera.position.sub(controls.target).multiplyScalar(scale).add(controls.target);},lighting(){soft=!soft;ambient.intensity=soft?2.9:1.5;key.intensity=soft?4.2:3.1;fill.intensity=soft?1.2:2.5;blue.intensity=soft?10:55;blue2.intensity=soft?10:45;renderer.toneMappingExposure=soft?1.35:1.15;return soft;},setVisible(v){visible=v;if(v)resize();},capture(){renderer.render(scene,camera);const c=document.createElement('canvas');c.width=1920;c.height=1280;const ctx=c.getContext('2d');ctx.fillStyle='#161c29';ctx.fillRect(0,0,c.width,c.height);const ratio=Math.min(1840/renderer.domElement.width,1060/renderer.domElement.height);const ww=renderer.domElement.width*ratio,hh=renderer.domElement.height*ratio;ctx.drawImage(renderer.domElement,(1920-ww)/2,90+(1060-hh)/2,ww,hh);ctx.fillStyle='#e2c69b';ctx.font='36px "Microsoft YaHei",sans-serif';ctx.fillText('巧克力小镇',65,72);ctx.fillStyle='#a4a7b1';ctx.font='19px "Microsoft YaHei",sans-serif';ctx.fillText('2026.10.03  /  基于 19 张实拍的微缩重构 · 空间推定，非测绘模型',65,1220);const a=document.createElement('a');a.download='巧克力小镇-微缩重构.png';a.href=c.toDataURL('image/png');a.click();},stats(){return {objects:scene.children.length,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,places:placeGroups.size,photoMaterials:photoTextures.size,failedTextures,ready:true,view:{mode,selectedId,camera:camera.position.toArray(),target:controls.target.toArray(),offset:camera.view,projectedTarget:controls.target.clone().project(camera).toArray()}};},dispose(){cancelAnimationFrame(raf);resizeObserver.disconnect();controls.dispose();renderer.dispose();}};
}

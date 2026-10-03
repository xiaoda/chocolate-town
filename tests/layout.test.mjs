import test from 'node:test';
import assert from 'node:assert/strict';
import {places,getPlace} from '../public/data.js';
import {stageLayout,focusView} from '../public/layout.js';
import * as THREE from 'three';

function footprint(p,width=p.width,depth=2.65){
 const c=Math.cos(p.rotation),s=Math.sin(p.rotation);
 return [[-width/2,-depth/2],[width/2,-depth/2],[width/2,depth/2+.65],[-width/2,depth/2+.65]].map(([x,z])=>[p.position[0]+c*x+s*z,p.position[1]-s*x+c*z]);
}
function pointSegment(p,a,b){const dx=b[0]-a[0],dz=b[1]-a[1];const t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dz)/(dx*dx+dz*dz)));return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dz);}
function clearance(a,b){let separate=false;for(const poly of [a,b])for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],axis=[q[1]-p[1],p[0]-q[0]],project=v=>v[0]*axis[0]+v[1]*axis[1],aa=a.map(project),bb=b.map(project);if(Math.max(...aa)<Math.min(...bb)||Math.max(...bb)<Math.min(...aa))separate=true;}if(!separate)return 0;let gap=Infinity;for(const [pa,pb] of [[a,b],[b,a]])for(const p of pa)for(let j=0;j<pb.length;j++)gap=Math.min(gap,pointSegment(p,pb[j],pb[(j+1)%pb.length]));return gap;}
const shops=places.filter(p=>p.width);
test('店铺轮廓之间保留至少 0.8 个模型单位的观察间隙',()=>{for(let i=0;i<shops.length;i++)for(let j=i+1;j<shops.length;j++)assert.ok(clearance(footprint(shops[i]),footprint(shops[j]))>=.8,`${shops[i].id} 与 ${shops[j].id} 过近`);});
test('巴士位于左前侧，与任何店铺轮廓相隔至少 3 个模型单位',()=>{const bus=getPlace('bus');assert.ok(bus.position[0]<-11&&bus.position[1]>6);for(const p of shops)assert.ok(clearance(footprint(bus,2.5,4.1),footprint(p))>=3,`${p.id} 与巴士过近`);});
test('建筑、巴士和公告栏均位于扩展后的展台内',()=>{for(const p of [...shops,getPlace('bus')])for(const [x,z]of footprint(p,p.width||2.5,p.width?2.65:4.1)){assert.ok(Math.abs(x)<stageLayout.width/2-.4,p.id);assert.ok(Math.abs(z)<stageLayout.depth/2-.4,p.id);}assert.ok(Math.abs(stageLayout.board[0])+1.4<stageLayout.width/2);assert.ok(Math.abs(stageLayout.board[1])+.3<stageLayout.depth/2);});
test('桌面详情镜头对准未被右侧照片栏覆盖的区域',()=>{const v=focusView(getPlace('book'),{width:1512,height:726,availableWidth:1137,availableHeight:726});assert.equal(v.offsetX,187.5);assert.equal(v.offsetY,0);assert.ok(v.position[2]>10);assert.ok(v.target[1]>2.7);});
test('手机详情镜头上移并拉远，避免被下方详情覆盖',()=>{const v=focusView(getPlace('book'),{width:390,height:600,availableWidth:390,availableHeight:215});assert.equal(v.offsetX,0);assert.equal(v.offsetY,192.5);assert.ok(v.position[2]>25);assert.ok(v.position.every(Number.isFinite));});
test('每家店的默认详情视线不被其他店、巴士或灯柱遮挡',()=>{
 const material=new THREE.MeshBasicMaterial({side:THREE.DoubleSide});
 const blockers=places.filter(p=>p.position).map(p=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(p.width||2.5,p.height||4.1,p.width?2.65:4.1),material);mesh.position.set(p.position[0],(p.height||4.1)/2+.2,p.position[1]);mesh.rotation.y=p.rotation;mesh.userData.id=p.id;mesh.updateMatrixWorld(true);return mesh;});
 stageLayout.lamps.forEach(([x,z],i)=>{const lamp=new THREE.Mesh(new THREE.CylinderGeometry(.26,.26,3.75,8),material);lamp.position.set(x,2.075,z);lamp.userData.id='lamp-'+i;lamp.updateMatrixWorld(true);blockers.push(lamp);});
 for(const p of shops){const pose=new THREE.Object3D();pose.position.set(p.position[0],.1,p.position[1]);pose.rotation.y=p.rotation;pose.updateMatrixWorld(true);const view=focusView(p,{width:1512,height:726,availableWidth:1137,availableHeight:726});const eye=pose.localToWorld(new THREE.Vector3(...view.position));for(const x of [-.46,0,.46])for(const y of [.8,1.8,2.8,p.height-.3]){const target=pose.localToWorld(new THREE.Vector3(p.width*x,y,1.98));const ray=new THREE.Raycaster(eye,target.clone().sub(eye).normalize(),0,eye.distanceTo(target));const hits=ray.intersectObjects(blockers.filter(b=>b.userData.id!==p.id),false);assert.equal(hits.length,0,`${p.id} 被 ${hits[0]?.object.userData.id} 遮挡`);}}
 for(const mesh of blockers)mesh.geometry.dispose();material.dispose();
});

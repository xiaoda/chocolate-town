import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {photos,places} from '../public/data.js';
test('19 张原图全部可读且编号不重复',()=>{assert.equal(photos.length,19);assert.equal(new Set(photos.map(p=>p.id)).size,19);for(const p of photos)assert.ok(fs.statSync(new URL('../public/'+p.src,import.meta.url)).size>0);});
test('每个地点与照片有可回溯的关联',()=>{for(const p of places){assert.ok(p.evidence);for(const id of p.photos)assert.ok(photos.some(x=>x.id===id));}for(const p of photos)assert.ok(places.some(x=>x.photos.includes(p.id)));});
test('未定位节点不能伪装成已定位',()=>{const u=places.filter(p=>p.kind==='unlocated');assert.deepEqual(u.map(p=>p.id),['moon','stairs']);for(const p of u)assert.equal(p.position,undefined);});
test('所有公开图像与原件二进制相同',()=>{const originals=fs.readdirSync(new URL('../photos/',import.meta.url)).sort();photos.forEach((p,i)=>{const a=fs.readFileSync(new URL('../photos/'+originals[i],import.meta.url));const b=fs.readFileSync(new URL('../public/'+p.src,import.meta.url));assert.ok(a.equals(b));});});

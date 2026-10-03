import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {handler} from '../scripts/server.mjs';
test('只暴露静态资源，拒绝目录、脚本源文件与路径穿越',async()=>{const server=http.createServer(handler);await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;try{for(const route of ['/photos/','/vendor/','/../package.json','/%2e%2e%5cpackage.json','/scripts/server.mjs','/photos/%00.jpg']){const r=await fetch(base+route);assert.ok([403,404].includes(r.status),route);}assert.equal((await fetch(base+'/photos/01.jpg')).status,200);assert.equal((await fetch(base+'/',{method:'POST'})).status,405);}finally{server.close();}});

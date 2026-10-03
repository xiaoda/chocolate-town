import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const root=path.join(project,'public');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8'};
export function handler(req,res){
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});res.end();return;}
 let route;
 try{route=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end();return;}
 if(route==='/')route='/index.html';
 if(route.includes('\0')||route.includes('\\')||route.split('/').includes('..')){res.writeHead(403);res.end();return;}
 const target=path.resolve(root,'.'+route);
 if(!target.startsWith(root+path.sep)||!mime[path.extname(target)]){res.writeHead(404);res.end();return;}
 fs.stat(target,(error,stat)=>{
  if(error||!stat.isFile()){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(target)],'Content-Length':stat.size,'X-Content-Type-Options':'nosniff','Cache-Control':'no-cache','Content-Security-Policy':"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"});
  if(req.method==='HEAD')res.end();else fs.createReadStream(target).pipe(res);
 });
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const server=http.createServer(handler);const port=Number(process.env.PORT||0);
 server.listen(port,'127.0.0.1',()=>{
  const info={pid:process.pid,cwd:project,root,port:server.address().port,url:`http://127.0.0.1:${server.address().port}`,startedAt:new Date().toISOString()};
  fs.mkdirSync(path.join(project,'.preview'),{recursive:true});fs.writeFileSync(path.join(project,'.preview','server.json'),JSON.stringify(info,null,2));console.log(JSON.stringify(info));
 });
 server.on('error',error=>{console.error(error);process.exitCode=1;});
}

import {createRequire} from 'node:module'
import {readdirSync} from 'node:fs'
const sharp=createRequire(new URL('../../apps/web/package.json',import.meta.url))('sharp')
for(const phase of ['before','after'])for(const width of [1440,768,390]){
 const dir=new URL(`./${phase}/`,import.meta.url).pathname
 const files=readdirSync(dir).filter(f=>f.endsWith(`-${width}-full.jpg`)).sort()
 const hs=await Promise.all(files.map(async f=>(await sharp(dir+f).metadata()).height))
 const h=Math.ceil(Math.max(...hs)*300/width)+24
 const inputs=await Promise.all(files.map(async(f,i)=>({input:await sharp(dir+f).resize({width:300}).toBuffer(),left:i*300,top:24})))
 const labels=Buffer.from(`<svg width="900" height="24"><style>text{font:12px sans-serif}</style>${files.map((f,i)=>`<text x="${i*300+4}" y="16">${f}</text>`).join('')}</svg>`)
 await sharp({create:{width:900,height:h,channels:3,background:'#eee'}}).composite([...inputs,{input:labels,left:0,top:0}]).jpeg().toFile(`${dir}sheet-${width}-full.jpg`)
}
const dir=new URL('./inspect-profile/',import.meta.url).pathname
const files=readdirSync(dir).filter(f=>f.endsWith('.jpg')).sort();const inputs=[];let top=24
for(const f of files){const im=await sharp(dir+f).resize({width:500}).toBuffer();const meta=await sharp(im).metadata();inputs.push({input:im,top,left:0});top+=meta.height+24}
await sharp({create:{width:500,height:top,channels:3,background:'#eee'}}).composite(inputs).jpeg().toFile(dir+'review-sheet.jpg')

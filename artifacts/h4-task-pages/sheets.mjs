import {createRequire} from 'node:module'
import {readdirSync} from 'node:fs'
const sharp=createRequire(new URL('../../apps/web/package.json',import.meta.url))('sharp')
for (const phase of ['before','after']) for (const width of [1440,768,390]) for (const view of ['fold','full']) {
 const dir=new URL(`./${phase}/`,import.meta.url).pathname
 const files=readdirSync(dir).filter(f=>f.endsWith(`-${width}-${view}.jpg`)).sort()
 const cellWidth=360
 const heights=await Promise.all(files.map(async f=>(await sharp(`${dir}/${f}`).metadata()).height))
 const cellHeight=Math.ceil(Math.max(...heights)*cellWidth/width)+24
 const inputs=await Promise.all(files.map(async(f,i)=>({input:await sharp(`${dir}/${f}`).resize({width:cellWidth}).toBuffer(),left:i*cellWidth,top:24})))
 const labels=Buffer.from(`<svg width="${files.length*cellWidth}" height="24"><style>text{font:12px sans-serif}</style>${files.map((f,i)=>`<text x="${i*cellWidth+4}" y="16">${f.split(`-${width}`)[0]}</text>`).join('')}</svg>`)
 await sharp({create:{width:files.length*cellWidth,height:cellHeight,channels:3,background:'#eee'}}).composite([...inputs,{input:labels,top:0,left:0}]).jpeg().toFile(`${dir}/sheet-${width}-${view}.jpg`)
}

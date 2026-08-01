// build-all.js — regenera TODOS los diagramas SVG con el motor profesional,
// derivando titulo/subtitulo/categoria/nodos desde data.js.
const fs = require('fs'), path = require('path');
const base = process.env.USERPROFILE + '\\Desktop\\n8n-Workflow-Templates';
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

const T = {
  trigger:{g1:"#332607",g2:"#1a1304",stroke:"#f59e0b",icon:"#fbbf24",tag:"TRIGGER",path:"M13 3 L5 13 H11 L10 21 L19 10 H13 Z"},
  ai:{g1:"#241a3d",g2:"#140e24",stroke:"#8b5cf6",icon:"#a78bfa",tag:"AI / ML",path:"M12 3 L14 9 L20 11 L14 13 L12 19 L10 13 L4 11 L10 9 Z"},
  action:{g1:"#0e2b22",g2:"#081812",stroke:"#10b981",icon:"#34d399",tag:"ACTION",path:"M5 13 L10 18 L20 6"},
  logic:{g1:"#0a2a33",g2:"#06181e",stroke:"#06b6d4",icon:"#22d3ee",tag:"LOGIC",path:"M12 3 L20 12 L12 21 L4 12 Z"},
  data:{g1:"#122a3d",g2:"#0b1528",stroke:"#3b82f6",icon:"#60a5fa",tag:"DATA",path:"M5 6 C5 4 19 4 19 6 V18 C19 20 5 20 5 18 Z M5 6 C5 8 19 8 19 6 M5 12 C5 14 19 14 19 12"},
  comms:{g1:"#2c1021",g2:"#1a0913",stroke:"#ec4899",icon:"#f472b6",tag:"COMMS",path:"M4 5 H20 V16 H11 L7 20 V16 H4 Z"},
  wait:{g1:"#1c232c",g2:"#11151b",stroke:"#94a3b8",icon:"#cbd5e1",tag:"WAIT",path:"M12 3 A9 9 0 1 0 12 21 A9 9 0 1 0 12 3 M12 7 V12 L15 14"}
};
const norm = ty => T[ty] ? ty : 'action';

function makeSvg({title, subtitle, category, nodes, rev}){
  const nodeW=212, nodeH=94, gap=90, padX=64;
  const headerH=98, legendH=46, bottomPad=44, titleH=72;
  const count=nodes.length;
  const flowW=count*nodeW+(count-1)*gap;
  const canvasW=Math.max(padX*2+flowW, 760);
  const nodesY=headerH+legendH+24;
  const canvasH=nodesY+nodeH+56+titleH+bottomPad;
  const flowStartX=(canvasW-flowW)/2;
  const L=[]; const p=s=>L.push(s);

  p('<?xml version="1.0" encoding="UTF-8"?>');
  p(`<svg xmlns="http://www.w3.org/2000/svg" width="${canvasW}" height="${canvasH}" viewBox="0 0 ${canvasW} ${canvasH}" font-family="'Segoe UI', system-ui, -apple-system, sans-serif">`);
  p('  <defs>');
  p('    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a1428"/><stop offset="0.5" stop-color="#0b1a33"/><stop offset="1" stop-color="#08111f"/></linearGradient>');
  p('    <linearGradient id="hdr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0e2038"/><stop offset="1" stop-color="#0a1728"/></linearGradient>');
  for(const k in T){ const c=T[k]; p(`    <linearGradient id="grad-${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.g1}"/><stop offset="1" stop-color="${c.g2}"/></linearGradient>`); }
  p('    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="7" stdDeviation="11" flood-color="#000000" flood-opacity="0.5"/></filter>');
  p('    <filter id="glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>');
  p('    <marker id="arrow" markerWidth="11" markerHeight="11" refX="8.5" refY="4.5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L9,4.5 L0,9 L2.5,4.5 Z" fill="#3b82f6"/></marker>');
  p('    <pattern id="grid" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M26 0 L0 0 0 26" fill="none" stroke="#16263f" stroke-width="1"/></pattern>');
  p('  </defs>');

  p(`  <rect width="${canvasW}" height="${canvasH}" fill="url(#bg)"/>`);
  p(`  <rect width="${canvasW}" height="${canvasH}" fill="url(#grid)" opacity="0.5"/>`);
  const m=16;
  p(`  <rect x="${m}" y="${m}" width="${canvasW-2*m}" height="${canvasH-2*m}" fill="none" stroke="#1e3a5f" stroke-width="1.5" rx="6"/>`);
  const cl=14;
  [[m,m,1,1],[canvasW-m,m,-1,1],[m,canvasH-m,1,-1],[canvasW-m,canvasH-m,-1,-1]].forEach(([cx,cy,dx,dy])=>{
    p(`  <path d="M${cx} ${cy+dy*cl} L${cx} ${cy} L${cx+dx*cl} ${cy}" fill="none" stroke="#3b82f6" stroke-width="2"/>`);
  });

  p(`  <rect x="${m}" y="${m}" width="${canvasW-2*m}" height="${headerH-24}" fill="url(#hdr)" rx="6"/>`);
  p(`  <rect x="${m}" y="${headerH-26}" width="${canvasW-2*m}" height="2" fill="#3b82f6" opacity="0.7"/>`);
  const lx=padX, ly=44;
  p(`  <g transform="translate(${lx},${ly})"><path d="M16 0 L30 8 L30 24 L16 32 L2 24 L2 8 Z" fill="none" stroke="#3b82f6" stroke-width="2"/><path d="M16 7 L24 12 L24 20 L16 25 L8 20 L8 12 Z" fill="#3b82f6" opacity="0.18"/><circle cx="16" cy="16" r="3.5" fill="#22d3ee"/></g>`);
  p(`  <text x="${lx+44}" y="${ly+10}" fill="#f1f5f9" font-size="23" font-weight="700">${esc(title)}</text>`);
  if(subtitle) p(`  <text x="${lx+44}" y="${ly+30}" fill="#7d93b8" font-size="13">${esc(subtitle)}</text>`);
  p(`  <text x="${canvasW-padX}" y="${ly+4}" fill="#3b82f6" font-size="12" font-weight="700" text-anchor="end" letter-spacing="2">n8n WORKFLOW</text>`);
  p(`  <text x="${canvasW-padX}" y="${ly+22}" fill="#5a729a" font-size="11" text-anchor="end" letter-spacing="1">AUTOMATION TEMPLATE</text>`);

  const used=[]; nodes.forEach(n=>{ const ty=norm(n[1]); if(!used.includes(ty))used.push(ty); });
  const legY=headerH+14; let cx=padX+70;
  p(`  <text x="${padX}" y="${legY+4}" fill="#5a729a" font-size="10" font-weight="700" letter-spacing="1.5">LEYENDA</text>`);
  used.forEach(ty=>{ const c=T[ty]; p(`  <rect x="${cx}" y="${legY-8}" width="14" height="14" rx="3" fill="url(#grad-${ty})" stroke="${c.stroke}" stroke-width="1.5"/>`); p(`  <text x="${cx+20}" y="${legY+4}" fill="#9fb3d1" font-size="11">${c.tag}</text>`); cx+=20+c.tag.length*7+26; });

  const cy=nodesY; const pos=nodes.map((_,i)=>[flowStartX+i*(nodeW+gap), cy]);
  for(let i=0;i<count-1;i++){ const x1=pos[i][0]+nodeW, x2=pos[i+1][0], yy=cy+nodeH/2, mx=(x1+x2)/2;
    p(`  <path d="M${x1} ${yy} C${mx} ${yy} ${mx} ${yy} ${x2-3} ${yy}" fill="none" stroke="#3b82f6" stroke-width="2.2" marker-end="url(#arrow)"/>`);
    p(`  <circle cx="${x1}" cy="${yy}" r="3.5" fill="#0a1428" stroke="#3b82f6" stroke-width="2"/>`);
  }
  for(let i=0;i<count;i++){
    const label=nodes[i][0]; const ty=norm(nodes[i][1]); const c=T[ty];
    const x=pos[i][0], y=cy, panelW=58;
    p(`  <g filter="url(#shadow)"><rect x="${x}" y="${y}" width="${nodeW}" height="${nodeH}" rx="13" fill="url(#grad-${ty})" stroke="${c.stroke}" stroke-width="1.8"/></g>`);
    p(`  <path d="M${x} ${y+13} Q${x} ${y} ${x+13} ${y} H${x+panelW} V${y+nodeH} H${x+13} Q${x} ${y+nodeH} ${x} ${y+nodeH-13} Z" fill="#000000" opacity="0.22"/>`);
    p(`  <line x1="${x+panelW}" y1="${y+10}" x2="${x+panelW}" y2="${y+nodeH-10}" stroke="${c.stroke}" stroke-width="1" opacity="0.4"/>`);
    const ix=x+panelW/2-13, iy=y+nodeH/2-13;
    p(`  <g transform="translate(${ix},${iy})" fill="none" stroke="${c.icon}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"><path d="${c.path}"/></g>`);
    p(`  <text x="${x+panelW+14}" y="${y+26}" fill="${c.icon}" font-size="10" font-weight="700" letter-spacing="1.5">${c.tag}</text>`);
    const maxC=15, tx=x+panelW+14;
    if(label.length>maxC){ let cut=label.lastIndexOf(' ', Math.min(maxC+3,label.length-1)); if(cut<6)cut=maxC;
      p(`  <text x="${tx}" y="${y+52}" fill="#f1f5f9" font-size="14.5" font-weight="700">${esc(label.slice(0,cut))}</text>`);
      p(`  <text x="${tx}" y="${y+71}" fill="#f1f5f9" font-size="14.5" font-weight="700">${esc(label.slice(cut).trim())}</text>`);
    } else p(`  <text x="${tx}" y="${y+60}" fill="#f1f5f9" font-size="15" font-weight="700">${esc(label)}</text>`);
    p(`  <circle cx="${x+nodeW-2}" cy="${y+2}" r="13" fill="#0a1428" stroke="${c.stroke}" stroke-width="1.6"/>`);
    p(`  <text x="${x+nodeW-2}" y="${y+6}" fill="${c.icon}" font-size="12" font-weight="700" text-anchor="middle">${i+1}</text>`);
  }

  const tbY=canvasH-bottomPad-titleH, tbX=padX, tbW=canvasW-2*padX;
  const today=new Date().toISOString().slice(0,10);
  p(`  <rect x="${tbX}" y="${tbY}" width="${tbW}" height="${titleH}" fill="#0b1a30" stroke="#1e3a5f" stroke-width="1.5" rx="4"/>`);
  const w1=Math.floor(tbW*0.42), w2=Math.floor(tbW*0.20), w3=Math.floor(tbW*0.18), w4=tbW-w1-w2-w3;
  const xs=[tbX, tbX+w1, tbX+w1+w2, tbX+w1+w2+w3];
  [xs[1],xs[2],xs[3]].forEach(xx=>p(`  <line x1="${xx}" y1="${tbY+6}" x2="${xx}" y2="${tbY+titleH-6}" stroke="#1e3a5f" stroke-width="1"/>`));
  p(`  <line x1="${tbX}" y1="${tbY+26}" x2="${tbX+tbW}" y2="${tbY+26}" stroke="#1e3a5f" stroke-width="1"/>`);
  p(`  <text x="${tbX+12}" y="${tbY+18}" fill="#5a729a" font-size="9" font-weight="700" letter-spacing="1.5">TITULO DEL FLUJO</text>`);
  p(`  <text x="${tbX+120}" y="${tbY+18}" fill="#cbd5e1" font-size="11" font-weight="600">${esc(title)}</text>`);
  const cellLbl=["CATEGORIA","NODOS","REV","FECHA"], cellVal=[category, String(count), rev, today];
  for(let j=0;j<4;j++){ p(`  <text x="${xs[j]+12}" y="${tbY+44}" fill="#5a729a" font-size="9" font-weight="700" letter-spacing="1.2">${cellLbl[j]}</text>`); p(`  <text x="${xs[j]+12}" y="${tbY+60}" fill="#e2e8f0" font-size="12.5" font-weight="600">${esc(cellVal[j])}</text>`); }
  p('</svg>');
  return L.join('\n');
}

const dataJs = fs.readFileSync(path.join(base,'data.js'),'utf8');
const loop = `
;(function(){
  let n=0;
  for(const t of TEMPLATES){
    const nodes = t.flow.map(f=>[f[0], f[1]]);
    const subtitle = t.flow.map(f=>f[0]).join('  →  ');
    const category = CATS[t.cat] ? CATS[t.cat].name : t.cat;
    const svg = makeSvg({title:t.name, subtitle, category, nodes, rev:'A'});
    const out = path.join(base, t.cat, t.file + '.svg');
    fs.writeFileSync(out, svg, 'utf8');
    n++;
  }
  console.log('Diagramas profesionales generados:', n);
})();
`;
global.makeSvg = makeSvg;
eval(dataJs + loop);

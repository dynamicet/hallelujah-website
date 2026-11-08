'use strict';
const palette = window.HALLELUJAH_PALETTE;
const colors = Object.fromEntries(palette.colors.map(color => [color.id, color]));
const find = id => document.getElementById(id);
function luminance(hex) {
  const [r,g,b] = hex.match(/[0-9a-f]{2}/gi).map(value => parseInt(value,16)/255).map(value => value <= .04045 ? value/12.92 : ((value+.055)/1.055)**2.4);
  return .2126*r+.7152*g+.0722*b;
}
function contrast(foreground, background) {
  const a = luminance(foreground), b = luminance(background);
  return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
}
let announcementTimer;
function announce(message) {
  clearTimeout(announcementTimer);
  find('announcement').textContent = message;
  find('announcement').classList.add('visible');
  announcementTimer = setTimeout(() => find('announcement').classList.remove('visible'), 3200);
}
async function copy(value) {
  try {
    if (!navigator.clipboard) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(value);
    announce(`${value} copied`);
  } catch {
    // File previews may not have clipboard permission; keep a manual copy path.
    window.prompt('Copy this color:', value);
  }
}
for (const group of ['blue','orange','magenta','yellow','neutral']) {
  for (const color of palette.colors.filter(color => color.group === group)) {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'swatch';
    button.setAttribute('aria-label', `Copy ${color.name}, ${color.hex}. ${color.role}`);
    button.innerHTML = `<span class="swatch-field" style="background:${color.hex};color:${color.ink}"><span>${color.hex}</span></span><span class="swatch-name">${color.name}</span><span class="swatch-role">${color.role}</span>`;
    if (contrast(color.hex, color.ink) < 4.5) button.querySelector('.swatch-field span').classList.add('swatch-label');
    button.addEventListener('click', () => copy(color.hex));
    find(`${group}-swatches`).append(button);
  }
}
for (const color of palette.colors.filter(color => color.group === 'status')) {
  const block = document.createElement('div'); block.className = 'status-item';
  block.style.background = color.background; block.style.color = color.hex;
  block.innerHTML = `<strong>${color.name}</strong><p>${color.role}</p><button type="button">${color.hex}</button><p>On ${color.background} · ${contrast(color.hex,color.background).toFixed(2)}:1</p>`;
  block.querySelector('button').addEventListener('click', () => copy(color.hex));
  find('status-swatches').append(block);
}
document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', () => copy(button.dataset.copy)));
document.querySelectorAll('.chapters a').forEach(link => link.addEventListener('click', () => {
  document.querySelectorAll('.chapters a').forEach(item => item.removeAttribute('aria-current'));
  link.setAttribute('aria-current', 'location');
}));
find('surface').addEventListener('change', event => {
  find('experience-canvas').style.background = colors[event.target.value].hex;
});
for (const id of ['foreground','background']) {
  for (const color of palette.colors) {
    const option = document.createElement('option');
    option.value = color.id; option.textContent = `${color.name} · ${color.hex}`;
    find(id).append(option);
  }
}
find('foreground').value = 'white'; find('background').value = 'blue-600';
function updateContrast() {
  const fg = colors[find('foreground').value], bg = colors[find('background').value];
  const ratio = contrast(fg.hex,bg.hex);
  find('ratio').value = `${ratio.toFixed(2)}:1`;
  find('verdict').textContent = ratio >= 7 ? 'Passes AAA for normal text.' : ratio >= 4.5 ? 'Passes AA for normal text.' : ratio >= 3 ? 'Large text only. Fails AA for normal text.' : 'Fails AA for normal and large text.';
  find('contrast-preview').style.color = fg.hex;
  find('contrast-preview').style.background = bg.hex;
  find('pair-label').textContent = `${fg.hex} on ${bg.hex}`;
}
find('foreground').addEventListener('change',updateContrast);
find('background').addEventListener('change',updateContrast);
updateContrast();
const pairings = [
  ['White on Hallelujah blue','white','blue-600','Main button label'],
  ['Strong blue on warm paper','blue-700','paper','Text link'],
  ['Strong blue on blue mist','blue-700','blue-50','Text link in a tinted section'],
  ['Reading ink on warm paper','ink','paper','Body text'],
  ['Supporting ink on blue mist','muted','blue-50','Secondary text'],
  ['White on deep blue','white','blue-800','Footer text'],
  ['Control edge on white','control','white','Input boundary · 3:1 minimum'],
  ['Deep orange on pale orange','orange-deep','orange-tint','Supporting accent pairing'],
  ['White on agency magenta','white','magenta','Decorative only · fails normal white text'],
  ['Deep magenta on pale magenta','magenta-deep','magenta-tint','Expressive accent pairing'],
  ['White on orange','white','orange','Do not use for normal white text'],
  ['Hallelujah blue on blue mist','blue-600','blue-50','4.47:1 · do not use for normal text']
];
for (const [name,fg,bg,role] of pairings) {
  const row = document.createElement('tr');
  for (const value of [name,`${contrast(colors[fg].hex,colors[bg].hex).toFixed(2)}:1`,role]) {
    const cell = document.createElement('td'); cell.textContent = value; row.append(cell);
  }
  find('pairings').append(row);
}
find('sample-form').addEventListener('submit',event => {
  event.preventDefault();
  find('department').removeAttribute('aria-invalid');
  find('form-message').className = 'form-message success';
  find('form-message').textContent = 'Preview complete. This is a color specimen; no request was sent.';
});
find('department').addEventListener('invalid', () => {
  find('department').setAttribute('aria-invalid','true');
  find('form-message').className = 'form-message error';
  find('form-message').textContent = 'Choose a care area before continuing.';
});
find('department').addEventListener('change', () => {
  find('department').removeAttribute('aria-invalid');
  find('form-message').className = 'form-message';
  find('form-message').textContent = 'Choose an option to try the confirmation style.';
});
find('print').addEventListener('click', () => window.print());
function createCSS() {
  const primitives = palette.colors.flatMap(color => [`  --hh-${color.id}: ${color.hex};`, ...(color.background ? [`  --hh-${color.id}-tint: ${color.background};`] : [])]);
  const semantics = Object.entries(palette.semantic).map(([role,id]) => `  --hh-${role}: var(--hh-${id});`);
  return `/* Hallelujah digital palette v${palette.version} — 2026-11-04. Standalone catalog tokens; runtime tokens have a separate generator. */\n:root {\n${primitives.join('\n')}\n\n${semantics.join('\n')}\n}\n`;
}
find('export').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([createCSS()],{type:'text/css'}));
  const link = document.createElement('a'); link.href = url; link.download = 'hallelujah-color-palette.css'; link.click();
  setTimeout(() => URL.revokeObjectURL(url),1000); announce('Color tokens downloaded');
});

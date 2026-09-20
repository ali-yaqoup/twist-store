import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const dir = path.join("public", "icons");
fs.mkdirSync(dir, { recursive: true });

function makeSvg(size, { pad = 0.18, maskable = false } = {}) {
  const safe = maskable ? 0.22 : pad;
  const box = size * (1 - 2 * safe);
  const ox = (size - box) / 2;
  const oy = (size - box) / 2;
  const s = box / 40;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#000000"/>
  <g transform="translate(${ox} ${oy}) scale(${s})">
    <path fill="#F5C400" d="M22 1.2 25.05 16.7 40.8 20 25.05 23.3 22 38.8 18.95 23.3 3.2 20 18.95 16.7Z"/>
    <path fill="#000000" d="M22 13.6 23.35 18.35 28.2 19.8 23.35 21.25 22 26 20.65 21.25 15.8 19.8 20.65 18.35Z"/>
    <g stroke="#F5C400" stroke-width="1.15" stroke-linecap="round" fill="none">
      <path d="M8 34.5 36.2 9.2"/>
      <path d="M36.2 9.2c1.7-1.5 3.9.5 2.2 2.1"/>
      <path d="M8.2 34.6c-2.6 2.2-.8 4.8 2.2 3.1" opacity=".75"/>
    </g>
  </g>
</svg>`;
}

async function write(name, size, opts) {
  const svg = Buffer.from(makeSvg(size, opts));
  await sharp(svg).png().toFile(path.join(dir, name));
  console.log("wrote", name);
}

await write("favicon-32.png", 32, { pad: 0.12 });
await write("apple-touch-icon.png", 180, { pad: 0.14 });
await write("icon-192.png", 192, { pad: 0.16 });
await write("icon-512.png", 512, { pad: 0.16 });
await write("icon-512-maskable.png", 512, { maskable: true });
console.log("done");

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const outDir = path.join(process.cwd(), "public", "photos");
const JPEG = { quality: 95, mozjpeg: true, chromaSubsampling: "4:4:4" };

function src(name) {
  const file = path.join(outDir, name);
  if (!fs.existsSync(file)) throw new Error("Missing " + file);
  return file;
}

/** Exact-ratio cover crop. x/y = focal 0..1. zoom > 1 tightens on the subject. */
async function coverCrop(file, destName, tw, th, x = 0.5, y = 0.45, zoom = 1) {
  const { data, info } = await sharp(file).rotate().toBuffer({ resolveWithObject: true });
  const sw = info.width;
  const sh = info.height;
  const target = tw / th;
  let cw;
  let ch;
  let cl;
  let ct;
  if (sw / sh > target) {
    ch = sh;
    cw = Math.round(sh * target);
    cl = Math.min(Math.max(0, Math.round((sw - cw) * x)), sw - cw);
    ct = 0;
  } else {
    cw = sw;
    ch = Math.round(sw / target);
    cl = 0;
    ct = Math.min(Math.max(0, Math.round((sh - ch) * y)), sh - ch);
  }
  if (zoom > 1) {
    const nw = Math.round(cw / zoom);
    const nh = Math.round(ch / zoom);
    const cx = cl + cw / 2;
    const cy = ct + ch / 2;
    cl = Math.min(Math.max(0, Math.round(cx - nw / 2)), sw - nw);
    ct = Math.min(Math.max(0, Math.round(cy - nh / 2)), sh - nh);
    cw = nw;
    ch = nh;
  }
  const dest = path.join(outDir, destName);
  await sharp(data)
    .extract({ left: cl, top: ct, width: cw, height: ch })
    .resize(tw, th, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.55 })
    .jpeg(JPEG)
    .toFile(dest);
  const kb = (fs.statSync(dest).size / 1024).toFixed(0);
  console.log(`OK ${destName} ${tw}x${th} from ${cw}x${ch} ${kb}KB`);
}

const WIDE = [2560, 1440];
const TALL = [1600, 2000];
const CARD = [1600, 2134];

await coverCrop(src("hijra-front.jpg"), "hijra-card.jpg", ...CARD, 0.84, 0.38, 1.2);
await coverCrop(src("watanan-front.jpg"), "watanan-card.jpg", ...CARD, 0.5, 0.36, 1.35);
await coverCrop(src("blightnm-look.jpg"), "blightnm-card.jpg", ...CARD, 0.78, 0.5, 1.48);
await coverCrop(src("qalandiya-back.jpg"), "qalandiya-card.jpg", ...CARD, 0.5, 0.38, 1.5);

await coverCrop(src("hijra-front.jpg"), "hero-1-wide.jpg", ...WIDE, 0.6, 0.48, 1.2);
await coverCrop(src("hijra-front.jpg"), "hero-1-tall.jpg", ...TALL, 0.86, 0.38, 1.22);
await coverCrop(src("hijra-set-back.jpg"), "hero-2-wide.jpg", ...WIDE, 0.72, 0.48, 1.32);
await coverCrop(src("hijra-set-back.jpg"), "hero-2-tall.jpg", ...TALL, 0.74, 0.38, 1.2);
await coverCrop(src("watanan-colors.jpg"), "hero-3-wide.jpg", ...WIDE, 0.38, 0.34, 1.18);
await coverCrop(src("watanan-colors.jpg"), "hero-3-tall.jpg", ...TALL, 0.36, 0.36, 1.2);
await coverCrop(src("hijra-backs.jpg"), "hero-4-wide.jpg", ...WIDE, 0.28, 0.48, 1.36);
await coverCrop(src("hijra-backs.jpg"), "hero-4-tall.jpg", ...TALL, 0.22, 0.38, 1.25);

await coverCrop(src("hijra-front.jpg"), "gal-hijra.jpg", ...CARD, 0.5, 0.4, 1.22);
await coverCrop(src("hijra-back-detail.jpg"), "gal-hijra-back.jpg", ...CARD, 0.58, 0.4, 1.32);
await coverCrop(src("watanan-front.jpg"), "gal-watanan.jpg", ...CARD, 0.5, 0.36, 1.3);
await coverCrop(src("qalandiya-back.jpg"), "gal-qalandiya.jpg", ...CARD, 0.5, 0.38, 1.42);
await coverCrop(src("blightnm-look.jpg"), "gal-blightnm.jpg", ...CARD, 0.62, 0.48, 1.28);
await coverCrop(src("hijra-set-back.jpg"), "gal-set.jpg", ...CARD, 0.62, 0.38, 1.24);

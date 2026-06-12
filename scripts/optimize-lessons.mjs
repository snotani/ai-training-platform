// Resize + convert generated lesson art (PNG) to web-optimized WebP.
// Usage: node scripts/optimize-lessons.mjs <sourceDir>
// Reads lesson-*.png from <sourceDir> and writes lesson-*.webp to public/lessons.

import sharp from "sharp";
import { readdirSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SRC = process.argv[2];
if (!SRC) {
  console.error("Pass the source directory containing lesson-*.png");
  process.exit(1);
}
const OUT = "public/lessons";
mkdirSync(OUT, { recursive: true });

const files = readdirSync(SRC).filter((f) => /^lesson-.*\.png$/.test(f));
if (files.length === 0) {
  console.error(`No lesson-*.png found in ${SRC}`);
  process.exit(1);
}

let done = 0;
for (const f of files) {
  const out = join(OUT, f.replace(/\.png$/, ".webp"));
  await sharp(join(SRC, f))
    .resize({ width: 1280, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(out);
  done += 1;
  console.log(`-> ${out}`);
}
console.log(`Optimized ${done} image(s).`);

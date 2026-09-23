// Generates the demo's image and JavaScript assets.
//
// The point of this demo is to give ImpactTrace two versions of the same
// storefront to measure: an "optimised" one with small, well-compressed assets
// and a "legacy" one stuffed with multi-megabyte noise images and a bloated
// client bundle. Assets are generated rather than committed so the repo stays
// small, and a seeded PRNG keeps every run byte-identical.

import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const heavyDir = join(root, 'public', 'heavy');
const optimisedDir = join(root, 'public', 'optimised');

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const crcTable = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i += 1) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([length, typeAndData, crc]);
}

/**
 * @param {number} width
 * @param {number} height
 * @param {(x: number, y: number) => [number, number, number]} pixel
 * @param {number} deflateLevel
 */
function png(width, height, pixel, deflateLevel) {
  const raw = Buffer.alloc(height * (1 + width * 3));
  let offset = 0;
  for (let y = 0; y < height; y += 1) {
    raw[offset] = 0; // filter type: none
    offset += 1;
    for (let x = 0; x < width; x += 1) {
      const [r, g, b] = pixel(x, y);
      raw[offset] = r;
      raw[offset + 1] = g;
      raw[offset + 2] = b;
      offset += 3;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolour

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: deflateLevel })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/** Incompressible noise: the file lands at roughly width * height * 3 bytes. */
function noiseImage(width, height, seed) {
  const rand = mulberry32(seed);
  return png(width, height, () => [
    Math.floor(rand() * 256),
    Math.floor(rand() * 256),
    Math.floor(rand() * 256),
  ], 0);
}

/** Smooth gradient: compresses down to a few KB at the same dimensions. */
function gradientImage(width, height, hueSeed) {
  return png(
    width,
    height,
    (x, y) => [
      Math.floor(40 + (x / width) * 90 + hueSeed),
      Math.floor(110 + (y / height) * 80),
      Math.floor(90 + ((x + y) / (width + height)) * 60),
    ],
    9,
  );
}

function write(dir, name, buffer) {
  writeFileSync(join(dir, name), buffer);
  const kb = (buffer.length / 1024).toFixed(0);
  console.log(`  ${join(dir.endsWith('heavy') ? 'heavy' : 'optimised', name)} — ${kb} KB`);
}

const productSlugs = [
  'rain-shell',
  'merino-hoodie',
  'trail-runners',
  'canvas-tote',
  'wool-beanie',
  'field-trousers',
];

rmSync(heavyDir, { recursive: true, force: true });
rmSync(optimisedDir, { recursive: true, force: true });
mkdirSync(heavyDir, { recursive: true });
mkdirSync(optimisedDir, { recursive: true });

console.log('Generating demo assets...');

write(heavyDir, 'hero.png', noiseImage(1200, 700, 1));
write(optimisedDir, 'hero.png', gradientImage(1200, 700, 1));

productSlugs.forEach((slug, index) => {
  write(heavyDir, `${slug}.png`, noiseImage(520, 520, index + 10));
  write(optimisedDir, `${slug}.png`, gradientImage(520, 520, index * 14));
});

// A deliberately bloated "vendor" bundle. Random identifiers keep it from
// gzipping away to nothing over the wire.
const bundleRand = mulberry32(99);
const lines = [];
lines.push('/* Legacy vendor bundle — intentionally oversized for the ImpactTrace demo. */');
lines.push('window.__legacyWidgets = window.__legacyWidgets || {};');
while (lines.join('\n').length < 620 * 1024) {
  const id = Math.floor(bundleRand() * 1e12).toString(36);
  lines.push(
    `window.__legacyWidgets.w_${id} = function (a_${id}, b_${id}) { ` +
      `var s_${id} = "${Math.floor(bundleRand() * 1e16).toString(36)}"; ` +
      `return (a_${id} || 0) + (b_${id} || 0) + s_${id}.length; };`,
  );
}
lines.push('document.documentElement.setAttribute("data-legacy-bundle", "loaded");');
const bundle = Buffer.from(lines.join('\n'), 'utf8');
writeFileSync(join(heavyDir, 'vendor-bundle.js'), bundle);
console.log(`  heavy/vendor-bundle.js — ${(bundle.length / 1024).toFixed(0)} KB`);

// A small carousel script that keeps the CPU busy after load, so the CPU
// measurement window in ImpactTrace has something to capture.
const busyScript = `/* Legacy carousel: animates continuously after load. */
(function () {
  var start = Date.now();
  function frame() {
    var sink = 0;
    for (var i = 0; i < 90000; i += 1) {
      sink += Math.sqrt(i) * Math.sin(i);
    }
    document.documentElement.setAttribute('data-carousel-frames', String(sink | 0));
    if (Date.now() - start < 20000) {
      requestAnimationFrame(frame);
    }
  }
  requestAnimationFrame(frame);
})();
`;
writeFileSync(join(heavyDir, 'carousel.js'), busyScript);
console.log(`  heavy/carousel.js — ${(Buffer.byteLength(busyScript) / 1024).toFixed(1)} KB`);

console.log('Done.');

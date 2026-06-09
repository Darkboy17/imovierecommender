import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const appDir = path.join(root, "src", "app");

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="82" y1="42" x2="442" y2="482" gradientUnits="userSpaceOnUse">
      <stop stop-color="#20242a"/>
      <stop offset="0.42" stop-color="#101113"/>
      <stop offset="1" stop-color="#070809"/>
    </linearGradient>
    <linearGradient id="ember" x1="126" y1="120" x2="396" y2="406" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffe082"/>
      <stop offset="0.48" stop-color="#f0b429"/>
      <stop offset="1" stop-color="#c76d2b"/>
    </linearGradient>
    <linearGradient id="copper" x1="147" y1="116" x2="390" y2="394" gradientUnits="userSpaceOnUse">
      <stop stop-color="#f8c35b"/>
      <stop offset="1" stop-color="#a65325"/>
    </linearGradient>
    <linearGradient id="teal" x1="302" y1="194" x2="388" y2="319" gradientUnits="userSpaceOnUse">
      <stop stop-color="#43d8c9"/>
      <stop offset="1" stop-color="#1f7a8c"/>
    </linearGradient>
    <filter id="softShadow" x="35" y="37" width="442" height="449" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
    <filter id="innerGlow" x="52" y="52" width="408" height="408" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="0" stdDeviation="9" flood-color="#f0b429" flood-opacity="0.23"/>
    </filter>
  </defs>

  <rect width="512" height="512" rx="118" fill="url(#bg)"/>
  <rect x="18" y="18" width="476" height="476" rx="104" stroke="#f0b429" stroke-opacity="0.22" stroke-width="12"/>
  <path d="M84 384C115 438 174 470 256 470C356 470 429 418 451 332" stroke="#ffffff" stroke-opacity="0.07" stroke-width="18" stroke-linecap="round"/>

  <g filter="url(#softShadow)">
    <rect x="91" y="104" width="330" height="304" rx="48" fill="#15171b" stroke="url(#ember)" stroke-width="18"/>
    <rect x="133" y="151" width="246" height="211" rx="26" fill="#0b0c0e"/>
    <g fill="#f0b429" opacity="0.88">
      <rect x="111" y="147" width="23" height="34" rx="8"/>
      <rect x="111" y="225" width="23" height="34" rx="8"/>
      <rect x="111" y="303" width="23" height="34" rx="8"/>
      <rect x="378" y="147" width="23" height="34" rx="8"/>
      <rect x="378" y="225" width="23" height="34" rx="8"/>
      <rect x="378" y="303" width="23" height="34" rx="8"/>
    </g>
  </g>

  <g filter="url(#innerGlow)">
    <path d="M158 348V176H209L256 264L303 176H354V348H303V267L273 326H239L209 267V348H158Z" fill="url(#ember)"/>
    <path d="M207 176H158V348H207V176Z" fill="url(#copper)" opacity="0.9"/>
    <path d="M314 221L377 256L314 291V221Z" fill="url(#teal)"/>
    <path d="M314 221L377 256L314 291V221Z" stroke="#f7f3ea" stroke-opacity="0.28" stroke-width="7" stroke-linejoin="round"/>
  </g>

  <circle cx="363" cy="145" r="17" fill="#f0b429"/>
  <circle cx="383" cy="129" r="7" fill="#f7f3ea" opacity="0.8"/>
</svg>
`;

function createIco(entries) {
  const headerSize = 6;
  const directorySize = entries.length * 16;
  let imageOffset = headerSize + directorySize;
  const header = Buffer.alloc(headerSize + directorySize);

  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);

  entries.forEach(({ size, png }, index) => {
    const offset = headerSize + index * 16;
    header.writeUInt8(size >= 256 ? 0 : size, offset);
    header.writeUInt8(size >= 256 ? 0 : size, offset + 1);
    header.writeUInt8(0, offset + 2);
    header.writeUInt8(0, offset + 3);
    header.writeUInt16LE(1, offset + 4);
    header.writeUInt16LE(32, offset + 6);
    header.writeUInt32LE(png.length, offset + 8);
    header.writeUInt32LE(imageOffset, offset + 12);
    imageOffset += png.length;
  });

  return Buffer.concat([header, ...entries.map(({ png }) => png)]);
}

async function renderPng(size) {
  return sharp(Buffer.from(svg))
    .resize(size, size, {
      fit: "contain",
      kernel: sharp.kernel.lanczos3,
    })
    .png({
      compressionLevel: 9,
      adaptiveFiltering: true,
      palette: size <= 64,
      quality: 100,
    })
    .toBuffer();
}

await fs.mkdir(publicDir, { recursive: true });
await fs.mkdir(appDir, { recursive: true });
await fs.writeFile(path.join(publicDir, "favicon.svg"), svg);

const icoSizes = [16, 32, 48, 64, 128, 256];
const pngEntries = await Promise.all(icoSizes.map(async (size) => ({ size, png: await renderPng(size) })));
const ico = createIco(pngEntries);

await fs.writeFile(path.join(publicDir, "favicon.ico"), ico);
await fs.writeFile(path.join(appDir, "favicon.ico"), ico);
await fs.writeFile(path.join(publicDir, "favicon-16x16.png"), await renderPng(16));
await fs.writeFile(path.join(publicDir, "favicon-32x32.png"), await renderPng(32));
await fs.writeFile(path.join(publicDir, "apple-touch-icon.png"), await renderPng(180));
await fs.writeFile(path.join(publicDir, "android-chrome-192x192.png"), await renderPng(192));
await fs.writeFile(path.join(publicDir, "android-chrome-512x512.png"), await renderPng(512));

console.log("Generated professional favicon assets in public/ and src/app/favicon.ico");

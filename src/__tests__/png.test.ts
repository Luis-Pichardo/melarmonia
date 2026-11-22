import { describe, it, expect } from '@jest/globals';
import { deflate } from 'pako';

import { averageColorFromPng } from '@/player/png';

function crc32(buf: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of buf) {
    let c = (crc ^ byte) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Uint8Array) {
  const out = new Uint8Array(12 + data.length);
  const view = new DataView(out.buffer);
  view.setUint32(0, data.length);
  for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
  out.set(data, 8);
  view.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
  return out;
}

/** PNG RGBA 4×2: arriba mitad rojo y mitad azul; abajo transparente (filtro "Up"). */
function samplePng() {
  const raw: number[] = [];
  raw.push(0);
  for (let x = 0; x < 4; x++) raw.push(...(x < 2 ? [255, 0, 0, 255] : [0, 0, 255, 255]));
  raw.push(2);
  for (let x = 0; x < 4; x++) raw.push(0, 0, 0, 0);
  const ihdr = new Uint8Array(13);
  const v = new DataView(ihdr.buffer);
  v.setUint32(0, 4);
  v.setUint32(4, 2);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const parts = [
    Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflate(Uint8Array.from(raw))),
    chunk('IEND', new Uint8Array()),
  ];
  const png = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of parts) {
    png.set(p, o);
    o += p.length;
  }
  return png;
}

describe('color medio de una carátula', () => {
  it('promedia los píxeles teniendo en cuenta la transparencia y los filtros', () => {
    expect(averageColorFromPng(samplePng())).toEqual([127.5, 0, 127.5]);
  });

  it('rechaza datos que no son un PNG válido', () => {
    expect(averageColorFromPng(new Uint8Array(20))).toBeNull();
  });
});

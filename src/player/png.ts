/** Lectura mínima de PNG de 8 bits (RGB o RGBA) para calcular su color medio. */
import { inflate } from 'pako';

export function base64ToBytes(base64: string): Uint8Array {
  const binary = globalThis.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function readUint32(bytes: Uint8Array, offset: number): number {
  return (
    ((bytes[offset] << 24) |
      (bytes[offset + 1] << 16) |
      (bytes[offset + 2] << 8) |
      bytes[offset + 3]) >>>
    0
  );
}

function paeth(a: number, b: number, c: number): number {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  return pb <= pc ? b : c;
}

/** Color medio de un PNG de 8 bits RGB o RGBA. Devuelve null si el formato no es ese. */
export function averageColorFromPng(png: Uint8Array): [number, number, number] | null {
  let offset = 8; // firma PNG
  let width = 0;
  let height = 0;
  let channels = 0;
  const idat: Uint8Array[] = [];

  while (offset < png.length) {
    const length = readUint32(png, offset);
    const type = String.fromCharCode(...png.subarray(offset + 4, offset + 8));
    const data = png.subarray(offset + 8, offset + 8 + length);
    if (type === 'IHDR') {
      width = readUint32(data, 0);
      height = readUint32(data, 4);
      const bitDepth = data[8];
      const colorType = data[9];
      if (bitDepth !== 8 || (colorType !== 2 && colorType !== 6)) return null;
      channels = colorType === 6 ? 4 : 3;
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') {
      break;
    }
    offset += 12 + length;
  }
  if (!width || !height || !channels || idat.length === 0) return null;

  const total = idat.reduce((n, c) => n + c.length, 0);
  const joined = new Uint8Array(total);
  let pos = 0;
  for (const c of idat) {
    joined.set(c, pos);
    pos += c.length;
  }
  const raw = inflate(joined);

  const stride = width * channels;
  const prev = new Uint8Array(stride);
  const line = new Uint8Array(stride);
  let r = 0;
  let g = 0;
  let b = 0;
  let weight = 0;

  for (let y = 0; y < height; y++) {
    const start = y * (stride + 1);
    const filter = raw[start];
    for (let x = 0; x < stride; x++) {
      const value = raw[start + 1 + x];
      const left = x >= channels ? line[x - channels] : 0;
      const up = prev[x];
      const upLeft = x >= channels ? prev[x - channels] : 0;
      let out = value;
      if (filter === 1) out = value + left;
      else if (filter === 2) out = value + up;
      else if (filter === 3) out = value + ((left + up) >> 1);
      else if (filter === 4) out = value + paeth(left, up, upLeft);
      line[x] = out & 0xff;
    }
    for (let x = 0; x < width; x++) {
      const i = x * channels;
      const alpha = channels === 4 ? line[i + 3] / 255 : 1;
      r += line[i] * alpha;
      g += line[i + 1] * alpha;
      b += line[i + 2] * alpha;
      weight += alpha;
    }
    prev.set(line);
  }
  if (weight === 0) return null;
  return [r / weight, g / weight, b / weight];
}

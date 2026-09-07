import * as THREE from "three";
import type { PageFace, DoodleKind } from "../data/pages";

export const TEX_W = 1024;
export const TEX_H = 1400;

const PAPER = "#f7f2e8";
const PAPER_DARK = "#ece4d5";
const INK = "#14130f";
const RED = "#c0392b";
const MUTED = "#6f695c";

const SERIF = '"Cormorant Garamond", Georgia, serif';
const HAND = '"Caveat", "Comic Sans MS", cursive';
const SANS = '"Jost", system-ui, sans-serif';

let randomState = 1;

function stableSeed(face: PageFace) {
  let seed = 2166136261;
  for (const character of JSON.stringify(face)) {
    seed = Math.imul(seed ^ character.charCodeAt(0), 16777619);
  }
  return seed >>> 0 || 1;
}

function random() {
  randomState = (Math.imul(1664525, randomState) + 1013904223) >>> 0;
  return randomState / 4294967296;
}

function grain(ctx: CanvasRenderingContext2D, amount = 10) {
  const img = ctx.getImageData(0, 0, TEX_W, TEX_H);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (random() - 0.5) * amount;
    d[i] = (d[i] ?? 0) + n;
    d[i + 1] = (d[i + 1] ?? 0) + n;
    d[i + 2] = (d[i + 2] ?? 0) + n;
  }
  ctx.putImageData(img, 0, 0);
}

function paper(ctx: CanvasRenderingContext2D, tone = PAPER) {
  ctx.fillStyle = tone;
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  const g = ctx.createLinearGradient(0, 0, TEX_W, 0);
  g.addColorStop(0, "rgba(0,0,0,0.10)");
  g.addColorStop(0.12, "rgba(0,0,0,0)");
  g.addColorStop(0.9, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.05)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, TEX_W, TEX_H);
}

function roughLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  wobble = 6,
  width = 5,
  color = INK,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.beginPath();
  const steps = 10;
  ctx.moveTo(x1, y1);
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = x1 + (x2 - x1) * t + (random() - 0.5) * wobble;
    const y = y1 + (y2 - y1) * t + (random() - 0.5) * wobble;
    ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();
}

function roughCircle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  color = RED,
  width = 5,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.beginPath();
  const turns = 1.08;
  for (let i = 0; i <= 90; i++) {
    const a = (i / 90) * Math.PI * 2 * turns - 0.4;
    const w = 1 + Math.sin(i * 0.7) * 0.02;
    const x = cx + Math.cos(a) * rx * w + (random() - 0.5) * 3;
    const y = cy + Math.sin(a) * ry * w + (random() - 0.5) * 3;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();
}

function arrow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  len: number,
  angle: number,
  color = INK,
) {
  const x2 = x + Math.cos(angle) * len;
  const y2 = y + Math.sin(angle) * len;
  roughLine(ctx, x, y, x2, y2, 4, 4, color);
  roughLine(ctx, x2, y2, x2 - Math.cos(angle - 0.5) * 26, y2 - Math.sin(angle - 0.5) * 26, 3, 4, color);
  roughLine(ctx, x2, y2, x2 - Math.cos(angle + 0.5) * 26, y2 - Math.sin(angle + 0.5) * 26, 3, 4, color);
}

function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lh: number,
) {
  const words = text.split(" ");
  let line = "";
  let cy = y;
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, cy);
      cy += lh;
      line = w;
    } else line = test;
  }
  if (line) ctx.fillText(line, x, cy);
  return cy + lh;
}

function doodle(ctx: CanvasRenderingContext2D, kind: DoodleKind, cx: number, cy: number, s: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s, s);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const L = (a: number, b: number, c: number, d: number, col = INK) =>
    roughLine(ctx, a, b, c, d, 3, 4, col);
  switch (kind) {
    case "book":
      L(-80, -50, 0, -34);
      L(0, -34, 80, -50);
      L(-80, -50, -80, 50);
      L(80, -50, 80, 50);
      L(-80, 50, 0, 66);
      L(80, 50, 0, 66);
      L(0, -34, 0, 66);
      break;
    case "scale":
      L(0, -70, 0, 60);
      L(-80, -50, 80, -50);
      L(-80, -50, -110, 10);
      L(-80, -50, -50, 10);
      L(-110, 10, -50, 10);
      L(80, -50, 50, 10);
      L(80, -50, 110, 10);
      L(50, 10, 110, 10);
      L(-45, 60, 45, 60);
      break;
    case "star":
      for (let i = 0; i < 5; i++) {
        const a1 = (i / 5) * Math.PI * 2 - Math.PI / 2;
        const a2 = ((i + 2) / 5) * Math.PI * 2 - Math.PI / 2;
        L(Math.cos(a1) * 78, Math.sin(a1) * 78, Math.cos(a2) * 78, Math.sin(a2) * 78, RED);
      }
      break;
    case "hands":
      L(-90, 20, -20, -10);
      L(-20, -10, 20, 10);
      L(20, 10, 90, -20);
      L(-20, -10, -10, 40);
      L(20, 10, 12, 56);
      roughCircle(ctx, -20, -46, 26, 26, INK, 4);
      roughCircle(ctx, 40, -56, 26, 26, RED, 4);
      break;
    case "megaphone":
      L(-80, -30, -20, -50);
      L(-20, -50, -20, 50);
      L(-80, 30, -20, 50);
      L(-80, -30, -80, 30);
      L(10, -46, 46, -60);
      L(16, 0, 60, 0);
      L(10, 46, 46, 60);
      break;
    case "heart":
      ctx.save();
      ctx.strokeStyle = RED;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, 58);
      ctx.bezierCurveTo(-100, -8, -52, -76, 0, -26);
      ctx.bezierCurveTo(52, -76, 100, -8, 0, 58);
      ctx.stroke();
      ctx.restore();
      break;
    case "speech":
      L(-88, -56, 88, -56);
      L(88, -56, 88, 30);
      L(88, 30, -30, 30);
      L(-30, 30, -56, 66);
      L(-56, 66, -56, 30);
      L(-56, 30, -88, 30);
      L(-88, 30, -88, -56);
      L(-52, -14, 52, -14, RED);
      break;
  }
  ctx.restore();
}

function folio(ctx: CanvasRenderingContext2D, label: string, right: boolean) {
  ctx.save();
  ctx.fillStyle = MUTED;
  ctx.font = `400 26px ${SANS}`;
  ctx.textAlign = right ? "right" : "left";
  ctx.fillText(label.toUpperCase(), right ? TEX_W - 96 : 96, TEX_H - 84);
  ctx.restore();
}

function drawCover(ctx: CanvasRenderingContext2D) {
  paper(ctx, "#f4eee2");
  ctx.fillStyle = INK;
  ctx.textAlign = "left";

  const x = 96;
  ctx.font = `600 178px ${SERIF}`;
  ctx.fillText("HOW", x, 340);
  ctx.font = `600 132px ${SERIF}`;
  ctx.fillText("TO TRACK", x + 14, 470);
  ctx.font = `italic 600 116px ${SERIF}`;
  ctx.fillText(" SKILL OUTCOMES ", x - 4, 606);
  ctx.font = `600 116px ${SERIF}`;
  ctx.fillText("THAT LEAD TO", x + 10, 736);
  ctx.font = `600 158px ${SERIF}`;
  ctx.fillText("SUCCESS", x - 2, 900);

  roughCircle(ctx, 470, 852, 300, 92, RED, 6);
  arrow(ctx, 700, 400, 150, 0.55, INK);
  roughLine(ctx, x + 14, 500, x + 200, 496, 5, 5, INK);

  ctx.fillStyle = MUTED;
  ctx.font = `400 30px ${SANS}`;
  ctx.fillText("KaushalDrishti", x, 1090);
  ctx.font = `400 42px ${HAND}`;
  ctx.fillStyle = INK;
  ctx.fillText("An Interactive Platform Guide", x, 1160);
  roughLine(ctx, x, 1250, TEX_W - 96, 1250, 4, 3, MUTED);
  grain(ctx, 12);
}

function drawBackCover(ctx: CanvasRenderingContext2D) {
  paper(ctx, "#f4eee2");
  ctx.fillStyle = MUTED;
  ctx.textAlign = "center";
  ctx.font = `400 30px ${SANS}`;
  ctx.fillText("A KAUSHALDRISHTI STUDY", TEX_W / 2, 640);
  ctx.fillStyle = INK;
  ctx.font = `italic 400 64px ${SERIF}`;
  ctx.fillText("Keep tracking.", TEX_W / 2, 730);
  roughLine(ctx, TEX_W / 2 - 150, 770, TEX_W / 2 + 150, 766, 5, 4, RED);
  grain(ctx, 12);
}

function drawIntro(ctx: CanvasRenderingContext2D, f: Extract<PageFace, { kind: "intro" }>) {
  paper(ctx);
  ctx.textAlign = "left";
  ctx.fillStyle = MUTED;
  ctx.font = `400 26px ${SANS}`;
  ctx.fillText(f.title.toUpperCase(), 110, 250);
  ctx.fillStyle = INK;
  ctx.font = `italic 400 74px ${SERIF}`;
  let y = wrap(ctx, "Have you ever wondered what actually happens after a skill training program ends?", 110, 380, TEX_W - 240, 88);
  ctx.font = `400 42px ${SERIF}`;
  ctx.fillStyle = "#2c2a22";
  y += 40;
  for (const l of f.lines.slice(1)) {
    y = wrap(ctx, l, 110, y, TEX_W - 240, 60) + 34;
  }
  arrow(ctx, 130, y + 40, 120, 0.15, RED);
  folio(ctx, "intro", false);
  grain(ctx, 9);
}

function drawChapter(ctx: CanvasRenderingContext2D, f: Extract<PageFace, { kind: "chapter" }>) {
  paper(ctx);
  ctx.textAlign = "left";
  ctx.fillStyle = RED;
  ctx.font = `400 30px ${SANS}`;
  ctx.fillText(f.index, 110, 230);
  roughLine(ctx, 110, 258, 172, 256, 4, 3, RED);

  ctx.fillStyle = INK;
  ctx.font = `600 104px ${SERIF}`;
  const lines = f.title.split("\n");
  lines.forEach((l, i) => ctx.fillText(l, 108, 400 + i * 112));

  ctx.font = `400 42px ${SERIF}`;
  ctx.fillStyle = "#2c2a22";
  wrap(ctx, f.body, 110, 420 + lines.length * 112, TEX_W - 250, 62);

  doodle(ctx, f.doodle, TEX_W / 2 + 40, 1080, 1.35);
  folio(ctx, `page ${f.index}`, false);
  grain(ctx, 9);
}

function drawResources(ctx: CanvasRenderingContext2D, f: Extract<PageFace, { kind: "resources" }>) {
  paper(ctx);
  ctx.textAlign = "left";
  ctx.fillStyle = INK;
  ctx.font = `600 96px ${SERIF}`;
  f.title.split("\n").forEach((l, i) => ctx.fillText(l, 108, 320 + i * 104));
  let y = 560;
  for (const it of f.items) {
    ctx.fillStyle = RED;
    ctx.font = `400 28px ${SANS}`;
    ctx.fillText(it.label.toUpperCase(), 110, y);
    ctx.fillStyle = INK;
    ctx.font = `italic 400 46px ${SERIF}`;
    y = wrap(ctx, it.value, 110, y + 58, TEX_W - 260, 56) + 44;
    roughLine(ctx, 110, y - 62, TEX_W - 150, y - 64, 3, 2, "#c9c0b0");
  }
  folio(ctx, "Advanced System Features", false);
  grain(ctx, 9);
}

function drawDedication(ctx: CanvasRenderingContext2D, f: Extract<PageFace, { kind: "dedication" }>) {
  paper(ctx);
  ctx.textAlign = "center";
  ctx.fillStyle = MUTED;
  ctx.font = `400 26px ${SANS}`;
  ctx.fillText("TO OUR YOUTH", TEX_W / 2, 520);
  ctx.fillStyle = INK;
  ctx.font = `italic 400 62px ${SERIF}`;
  f.lines.forEach((l, i) => ctx.fillText(l, TEX_W / 2, 640 + i * 84));
  ctx.font = `400 54px ${HAND}`;
  ctx.fillText(f.sign, TEX_W / 2, 860);
  roughCircle(ctx, TEX_W / 2, 700, 330, 150, RED, 4);
  folio(ctx, "the end", true);
  grain(ctx, 9);
}

export function paintFace(face: PageFace): HTMLCanvasElement {
  randomState = stableSeed(face);
  const c = document.createElement("canvas");
  c.width = TEX_W;
  c.height = TEX_H;
  const ctx = c.getContext("2d")!;
  switch (face.kind) {
    case "cover":
      drawCover(ctx);
      break;
    case "backcover":
      drawBackCover(ctx);
      break;
    case "intro":
      drawIntro(ctx, face);
      break;
    case "chapter":
      drawChapter(ctx, face);
      break;
    case "resources":
      drawResources(ctx, face);
      break;
    case "dedication":
      drawDedication(ctx, face);
      break;
  }
  return c;
}

export function faceTexture(face: PageFace): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(paintFace(face));
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

export const PAPER_EDGE = PAPER_DARK;

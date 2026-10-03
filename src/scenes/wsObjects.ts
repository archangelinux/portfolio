/**
 * Wealthsimple-style object set: a shared studio stage and two factories
 * (coins, tiles). Reusable: import the factories anywhere that has a scene
 * with an environment map.
 */
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

// ——— shared stage ————————————————————————————————————————————————

export interface Stage {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  key: THREE.DirectionalLight;
  /** Units visible vertically at z = 0. */
  viewHeight: number;
}

/**
 * Studio set-up shared by every object: light grey ground, room reflections,
 * one soft key light from the upper left, and a shadow-catching backdrop so
 * objects drop soft contact shadows. Never change this per object.
 */
export const createStage = (host: HTMLElement): Stage => {
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(host.clientWidth, host.clientHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  // PCFSoft ignores shadow.radius; VSM honours it, which is what gives the large soft falloff.
  renderer.shadowMap.type = THREE.VSMShadowMap;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#f5f5f5");
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 1.25;

  const camera = new THREE.PerspectiveCamera(28, host.clientWidth / host.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 12);
  const viewHeight = 2 * 12 * Math.tan(THREE.MathUtils.degToRad(14));

  const key = new THREE.DirectionalLight("#ffffff", 1.6);
  key.position.set(-4, 6, 8);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.radius = 14;
  key.shadow.blurSamples = 20;
  key.shadow.bias = -0.0005;
  const sc = key.shadow.camera;
  sc.left = -6;
  sc.right = 6;
  sc.top = 6;
  sc.bottom = -6;
  sc.near = 1;
  sc.far = 30;
  scene.add(key);

  // backdrop that only shows shadows
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.025 }));
  ground.position.z = -1.0;
  ground.receiveShadow = true;
  scene.add(ground);

  return { renderer, scene, camera, key, viewHeight };
};

// ——— glyph loading ———————————————————————————————————————————————

const imageCache = new Map<string, Promise<HTMLImageElement>>();
const loadImage = (url: string) => {
  let p = imageCache.get(url);
  if (!p) {
    p = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
    imageCache.set(url, p);
  }
  return p;
};

/**
 * A coin face's bump map: black ground, a raised ring just inside the edge,
 * and the glyph (white in its SVG/PNG) raised in shallow relief.
 */
const faceBump = async (glyph?: string) => {
  const S = 1024;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, S, S);
  ctx.filter = "blur(3px)";
  ctx.strokeStyle = "#fff";
  ctx.strokeStyle = "#9a9a9a";
  ctx.lineWidth = S * 0.012;
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S * 0.47, 0, Math.PI * 2);
  ctx.stroke();
  if (glyph) {
    const img = await loadImage(glyph);
    const box = S * 0.74;
    const k = Math.min(box / img.width, box / img.height);
    const w = img.width * k, h = img.height * k;
    ctx.filter = "blur(2px)";
    ctx.globalAlpha = 1;
    ctx.drawImage(img, (S - w) / 2, (S - h) / 2, w, h);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  return tex;
};

// ——— factory 1: coins ————————————————————————————————————————————

export interface CoinSpec {
  color: string;
  metalness: number;
  roughness: number;
  /** URL of an SVG/PNG, white on transparent; only used on the faces. */
  glyph?: string;
}

const D = 1; // diameter
const T = 0.15 * D; // thickness
const RIM = 0.1 * D; // rim rounding, across the face

/**
 * A coin: flat faces with a softly rounded rim (lathe), the glyph and a thin
 * raised ring pressed into both faces as a bump map.
 */
export const makeCoin = async ({ color, metalness, roughness, glyph }: CoinSpec) => {
  const R = D / 2;
  const prof: THREE.Vector2[] = [];
  // bottom to top, so the lathe's faces point outward
  for (let i = 0; i <= 32; i++) {
    const a = -Math.PI / 2 + (i / 32) * Math.PI;
    prof.push(new THREE.Vector2(R - RIM + Math.cos(a) * RIM, Math.sin(a) * (T / 2)));
  }
  const body = new THREE.MeshPhysicalMaterial({ color, metalness, roughness, clearcoat: 0.25, clearcoatRoughness: 0.4 });
  const g = new THREE.Group();
  const rim = new THREE.Mesh(new THREE.LatheGeometry(prof, 160), body);
  rim.rotation.x = Math.PI / 2;
  g.add(rim);
  const bump = await faceBump(glyph);
  const faceMat = body.clone();
  faceMat.bumpMap = bump;
  faceMat.bumpScale = 4;
  for (const side of [1, -1]) {
    const face = new THREE.Mesh(new THREE.CircleGeometry(R - RIM + 0.001, 160), faceMat);
    face.position.z = (side * T) / 2;
    if (side < 0) face.rotation.y = Math.PI;
    g.add(face);
  }
  g.traverse((o) => {
    if (o instanceof THREE.Mesh) o.castShadow = true;
  });
  return g;
};

// ——— factory 2: tiles ————————————————————————————————————————————

export interface TileSpec {
  topMaterial: THREE.Material;
  /** URL of a path-based SVG, extruded onto the top face. */
  glyph?: string;
  glyphColor?: THREE.Material;
  /** Two-layer mode: a translucent body under the top slab, cut with a wave. */
  bodyMaterial?: THREE.Material;
  cutout?: boolean;
  /** Optional decal on the top face (e.g. a label). */
  decal?: THREE.Texture;
}

const W = 1, H = 1, DEPTH = 0.45, CORNER = 0.18;

const svgText = new Map<string, Promise<string>>();
const loadSvg = (url: string) => {
  let p = svgText.get(url);
  if (!p) svgText.set(url, (p = fetch(url).then((r) => r.text())));
  return p;
};

/** A glyph SVG as a thin beveled extrude, centred, `width` units wide, facing +z. */
const extrudeGlyph = async (url: string, width: number, material: THREE.Material) => {
  const data = new SVGLoader().parse(await loadSvg(url));
  const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
  const geo = new THREE.ExtrudeGeometry(shapes, { depth: 0.02, bevelEnabled: true, bevelSize: 0.6, bevelThickness: 0.6, bevelSegments: 3, curveSegments: 16 });
  geo.computeBoundingBox();
  const bb = geo.boundingBox!;
  const k = width / (bb.max.x - bb.min.x);
  geo.translate(-(bb.min.x + bb.max.x) / 2, -(bb.min.y + bb.max.y) / 2, 0);
  geo.scale(k, -k, k * 0.02 / 0.02); // SVG y points down
  // keep the relief shallow regardless of the SVG's units
  geo.computeBoundingBox();
  const zSpan = geo.boundingBox!.max.z - geo.boundingBox!.min.z;
  geo.scale(1, 1, 0.022 / zSpan);
  geo.computeBoundingBox();
  geo.translate(0, 0, -geo.boundingBox!.min.z);
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, material);
};

/**
 * The white top layer of a two-layer tile: covers the top face except a wavy
 * bite out of one side (the outline is drawn in the top plane), so the
 * translucent body shows through on top and around the sides.
 */
const wavySlab = (material: THREE.Material) => {
  const h = DEPTH * 0.42;
  const x0 = -W / 2 + 0.001, x1 = W / 2 - 0.001, y1 = H / 2 - 0.001;
  const r = CORNER;
  const s = new THREE.Shape();
  // top edge and corners, then down the right side to where the wave starts
  s.moveTo(x0, y1 - r);
  s.quadraticCurveTo(x0, y1, x0 + r, y1);
  s.lineTo(x1 - r, y1);
  s.quadraticCurveTo(x1, y1, x1, y1 - r);
  s.lineTo(x1, 0.02);
  // the wave across the face, from right to left
  s.bezierCurveTo(x1 - 0.12, 0.02, x1 - 0.18, -0.2, x1 - 0.32, -0.2);
  s.bezierCurveTo(x1 - 0.46, -0.2, x1 - 0.44, 0.08, x1 - 0.6, 0.08);
  s.bezierCurveTo(x1 - 0.76, 0.08, x0 + 0.14, -0.14, x0, -0.14);
  s.lineTo(x0, y1 - r);
  const geo = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 4, curveSegments: 32 });
  geo.translate(0, 0, DEPTH / 2 - h - 0.004);
  return new THREE.Mesh(geo, material);
};

/** A rounded tile (~1 × 1 × 0.45) with an embossed glyph, optionally two-layer with a wavy cut. */
export const makeTile = async ({ topMaterial, glyph, glyphColor, bodyMaterial, cutout, decal }: TileSpec) => {
  const g = new THREE.Group();
  if (bodyMaterial && cutout) {
    const body = new THREE.Mesh(new RoundedBoxGeometry(W - 0.004, H - 0.004, DEPTH - 0.06, 8, CORNER), bodyMaterial);
    body.position.z = -0.03;
    g.add(body);
    g.add(wavySlab(topMaterial));
  } else {
    g.add(new THREE.Mesh(new RoundedBoxGeometry(W, H, DEPTH, 8, CORNER), topMaterial));
  }
  if (glyph && glyphColor) {
    const m = await extrudeGlyph(glyph, 0.52, glyphColor);
    m.position.z = DEPTH / 2 + 0.002;
    g.add(m);
  }
  if (decal) {
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.17), new THREE.MeshBasicMaterial({ map: decal, transparent: true, toneMapped: false }));
    plane.position.set(-0.12, 0.3, DEPTH / 2 + 0.024);
    g.add(plane);
  }
  g.traverse((o) => {
    if (o instanceof THREE.Mesh) o.castShadow = true;
  });
  return g;
};

// ——— procedural textures ——————————————————————————————————————————

/** Soft white marble with faint veins and pastel flecks. */
export const marbleTexture = () => {
  const S = 1024;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#f6f5f2";
  ctx.fillRect(0, 0, S, S);
  let seed = 7;
  const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  ctx.filter = "blur(12px)";
  for (let i = 0; i < 6; i++) {
    ctx.strokeStyle = ["rgba(170,195,220,0.22)", "rgba(230,190,180,0.2)", "rgba(220,210,170,0.2)"][i % 3];
    ctx.lineWidth = 14 + r() * 26;
    ctx.beginPath();
    let x = r() * S, y = r() * S;
    ctx.moveTo(x, y);
    for (let k = 0; k < 5; k++) ctx.lineTo((x += (r() - 0.4) * 320), (y += (r() - 0.5) * 320));
    ctx.stroke();
  }
  ctx.filter = "none";
  for (let i = 0; i < 1400; i++) {
    ctx.fillStyle = ["rgba(110,160,220,0.6)", "rgba(235,130,130,0.55)", "rgba(185,180,170,0.6)", "rgba(240,185,110,0.5)"][i % 4];
    ctx.beginPath();
    ctx.arc(r() * S, r() * S, 3 + r() * 7, 0, Math.PI * 2);
    ctx.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

/** The "↑ 4.2%" label: green arrow, dark figures, transparent ground. */
export const growthLabel = () => {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 170;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#3f9a2c";
  ctx.beginPath();
  ctx.moveTo(40, 100);
  ctx.lineTo(70, 52);
  ctx.lineTo(100, 100);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(62, 96, 16, 34);
  ctx.fillStyle = "#1e2320";
  ctx.font = "600 92px 'Helvetica Neue', Arial, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText("4.2%", 120, 92);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

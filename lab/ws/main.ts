import * as THREE from "three";
import { createStage, growthLabel, makeCoin, makeTile, marbleTexture, type CoinSpec } from "../../src/scenes/wsObjects";

/**
 * Lab page for the object set. `?step=` picks what to show while building:
 *   coin   → one coin, large (for matching the reference)
 *   coins  → the whole coin catalog in a row
 *   tiles  → the three tiles
 *   layout → (default) the scattered composition
 */

const G = (name: string) => new URL(`../../src/assets/ws-glyphs/${name}.svg`, import.meta.url).href;

export const COINS: (CoinSpec & { name: string })[] = [
  { name: "sage", color: "#a8b07a", metalness: 0.3, roughness: 0.5, glyph: G("w-outline") },
  { name: "gold", color: "#c9a95c", metalness: 0.9, roughness: 0.35, glyph: G("dollar") },
  { name: "copper", color: "#e0955a", metalness: 0.6, roughness: 0.4 },
  { name: "pale blue", color: "#b9d3e6", metalness: 0.3, roughness: 0.5, glyph: G("w-outline") },
  { name: "steel blue", color: "#6e8fae", metalness: 0.4, roughness: 0.45, glyph: G("w-outline") },
  { name: "purple", color: "#8c6fae", metalness: 0.5, roughness: 0.4, glyph: G("btc") },
  { name: "lavender", color: "#b8a5d6", metalness: 0.3, roughness: 0.5 },
];

const gold = () => new THREE.MeshPhysicalMaterial({ color: "#c9a95c", metalness: 0.9, roughness: 0.3 });

export const TILES = {
  marble: () =>
    makeTile({
      topMaterial: new THREE.MeshPhysicalMaterial({ map: marbleTexture(), roughness: 0.6, clearcoat: 0.3, clearcoatRoughness: 0.4 }),
      glyph: G("w"),
      glyphColor: gold(),
    }),
  matte: () =>
    makeTile({
      topMaterial: new THREE.MeshPhysicalMaterial({ color: "#f4f4f2", roughness: 0.7 }),
      glyph: G("w"),
      glyphColor: gold(),
    }),
  growth: () =>
    makeTile({
      topMaterial: new THREE.MeshPhysicalMaterial({ color: "#f7f7f5", roughness: 0.45, clearcoat: 0.4 }),
      bodyMaterial: new THREE.MeshPhysicalMaterial({ color: "#7cc243", transmission: 0.9, thickness: 0.5, roughness: 0.12, ior: 1.45, clearcoat: 1 }),
      cutout: true,
      decal: growthLabel(),
    }),
};

type Placed = { obj: THREE.Object3D; base: THREE.Euler; home: THREE.Vector3; phase: number };

const run = async () => {
  const host = document.getElementById("stage")!;
  const stage = createStage(host);
  const { scene, camera, renderer, viewHeight } = stage;
  const step = new URLSearchParams(location.search).get("step") ?? "layout";
  const placed: Placed[] = [];
  const place = (obj: THREE.Object3D, x: number, y: number, z: number, scale: number, rot: [number, number, number]) => {
    obj.position.set(x, y, z);
    obj.scale.setScalar(scale);
    obj.rotation.set(...rot);
    scene.add(obj);
    placed.push({ obj, base: new THREE.Euler(...rot), home: new THREE.Vector3(x, y, z), phase: placed.length * 1.7 });
  };
  const vw = viewHeight * camera.aspect;

  if (step === "coin") {
    place(await makeCoin(COINS[1]), 0, 0, 0, 2.4, [0.35, -0.6, 0.1]);
  } else if (step === "coins") {
    for (const [i, spec] of COINS.entries()) {
      place(await makeCoin(spec), (i - 3) * (vw / 7.4), (i % 2 ? -0.5 : 0.5), 0, 0.9, [0.3, -0.5, 0.1]);
    }
  } else if (step === "tiles") {
    place(await TILES.marble(), -vw / 3.2, 0, 0, 1.2, [-0.5, 0.45, 0.35]);
    place(await TILES.matte(), 0, 0, 0, 1.2, [-0.5, -0.3, -0.2]);
    place(await TILES.growth(), vw / 3.2, 0, 0, 1.2, [-0.6, 0.35, 0.55]);
  } else {
    // like the reference: big objects steeply tilted (their thick sides show), varied depths, some off-frame
    const h = viewHeight / 2, w = vw / 2;
    place(await TILES.growth(), -w * 0.66, h * 0.62, -0.3, 1.9, [-0.95, 0.3, 0.6]);
    place(await makeCoin(COINS[5]), w * 0.52, h * 0.62, 0, 2.0, [-0.25, -0.55, 0.35]);
    place(await TILES.marble(), -w * 0.05, h * 0.04, 0.4, 1.95, [-0.95, 0.5, 0.75]);
    place(await makeCoin(COINS[6]), -w * 0.98, -h * 0.25, 0.2, 2.2, [0.1, 0.95, -0.15]);
    place(await makeCoin(COINS[3]), -w * 0.12, -h * 0.66, 0.3, 1.9, [-1.1, -0.2, 0.25]);
    place(await makeCoin(COINS[1]), w * 1.02, -h * 0.28, -0.2, 2.3, [0.15, -0.95, 0.08]);
  }

  const clock = new THREE.Clock();
  const still = new URLSearchParams(location.search).has("still");
  const tick = () => {
    const t = still ? 0 : clock.getElapsedTime();
    for (const p of placed) {
      // slow float and a gentle turn
      p.obj.position.y = p.home.y + Math.sin(t * 0.6 + p.phase) * 0.06;
      p.obj.rotation.set(p.base.x + Math.sin(t * 0.35 + p.phase) * 0.05, p.base.y + Math.sin(t * 0.25 + p.phase) * 0.08, p.base.z);
    }
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };
  tick();
  window.addEventListener("resize", () => {
    renderer.setSize(host.clientWidth, host.clientHeight);
    camera.aspect = host.clientWidth / host.clientHeight;
    camera.updateProjectionMatrix();
  });
  (window as unknown as { __ready: boolean }).__ready = true;
};

run();

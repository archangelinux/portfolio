/**
 * A hero photo as a little 3D world: the photo is laid on a dense plane and
 * pushed out by its depth map (from scripts/make-depth.mjs), so on hover the
 * view can shift and near things separate from far ones.
 *
 * Interaction:
 *   move   → the view looks into the scene from the pointer's side (parallax)
 *   hover  → the surface under the cursor presses in like cloth, near things
 *            giving more than far ones
 *   click  → a ripple runs out through the scene from the click
 * When the pointer leaves, everything springs back to the flat photo.
 */
import * as THREE from "three";

const vert = /* glsl */ `
  uniform sampler2D uDepth;
  uniform float uStrength;
  uniform vec2 uPress;      // cursor, uv
  uniform float uPressAmt;  // 0..1
  uniform vec3 uRipple;     // uv.xy, age (s); age < 0 = none
  varying vec2 vUv;
  void main() {
    vUv = uv;
    float d = texture2D(uDepth, uv).r;
    vec3 p = position;
    p.z += d * uStrength;
    // press: a soft dent under the cursor, deeper on near (bright) things
    float r = distance(uv, uPress);
    p.z -= uPressAmt * exp(-r * r / 0.012) * (0.25 + d) * uStrength * 0.55;
    // ripple: a ring travelling outward, fading as it goes
    if (uRipple.z >= 0.0) {
      float rr = distance(uv, uRipple.xy);
      float front = uRipple.z * 0.9;
      float ring = exp(-pow((rr - front) / 0.05, 2.0));
      p.z += ring * sin((rr - front) * 60.0) * uStrength * 0.18 * exp(-uRipple.z * 2.2);
    }
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const frag = /* glsl */ `
  uniform sampler2D uPhoto;
  varying vec2 vUv;
  void main() {
    gl_FragColor = texture2D(uPhoto, vUv);
    #include <colorspace_fragment>
  }
`;

const loadTexture = (url: string, color: boolean) =>
  new Promise<THREE.Texture>((resolve, reject) =>
    new THREE.TextureLoader().load(
      url,
      (t) => {
        if (color) t.colorSpace = THREE.SRGBColorSpace;
        t.minFilter = THREE.LinearFilter;
        resolve(t);
      },
      undefined,
      reject
    )
  );

export interface DepthScene {
  /** Pointer moved over the photo (client coords) or left it (null). */
  pointer(e: { clientX: number; clientY: number } | null): void;
  click(e: { clientX: number; clientY: number }): void;
  dispose(): void;
}

export const createDepthScene = async (host: HTMLElement, photo: string, depth: string, onActive: (active: boolean) => void): Promise<DepthScene> => {
  const [photoTex, depthTex] = await Promise.all([loadTexture(photo, true), loadTexture(depth, false)]);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  const DIST = 4;
  camera.position.set(0, 0, DIST);

  const img = photoTex.image as HTMLImageElement;
  const aspect = img.width / img.height;
  const STRENGTH = 0.32;
  const uniforms = {
    uPhoto: { value: photoTex },
    uDepth: { value: depthTex },
    uStrength: { value: 0 },
    uPress: { value: new THREE.Vector2(0.5, 0.5) },
    uPressAmt: { value: 0 },
    uRipple: { value: new THREE.Vector3(0, 0, -1) },
  };
  // The surface runs OVER past the photo on every side (texture edges are
  // clamped, so the margin just continues the border pixels). At rest the
  // camera frames exactly the photo, as before; when the view shifts, there's
  // always image at the frame's edge instead of the page showing through.
  const OVER = 1.3;
  const geo = new THREE.PlaneGeometry(aspect * OVER, OVER, 360, Math.round(360 / aspect));
  const uvs = geo.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < uvs.count; i++) uvs.setXY(i, (uvs.getX(i) - 0.5) * OVER + 0.5, (uvs.getY(i) - 0.5) * OVER + 0.5);
  photoTex.wrapS = photoTex.wrapT = depthTex.wrapS = depthTex.wrapT = THREE.ClampToEdgeWrapping;
  const plane = new THREE.Mesh(geo, new THREE.ShaderMaterial({ uniforms, vertexShader: vert, fragmentShader: frag }));
  scene.add(plane);

  // size the photo to cover the box exactly like the <img object-fit: cover> under it
  let boxW = 1, boxH = 1;
  const resize = () => {
    boxW = host.clientWidth || 1;
    boxH = host.clientHeight || 1;
    renderer.setSize(boxW, boxH, false);
    camera.aspect = boxW / boxH;
    camera.updateProjectionMatrix();
    const viewH = 2 * DIST * Math.tan(THREE.MathUtils.degToRad(15));
    const viewW = viewH * camera.aspect;
    plane.scale.setScalar(Math.max(viewW / aspect, viewH));
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  // draw the (flat) photo right away so the canvas can be shown the instant the pointer arrives
  renderer.render(scene, camera);

  // state, eased every frame
  const target = { look: new THREE.Vector2(), press: 0, strength: 0 };
  const look = new THREE.Vector2();
  let rippleStart = -1;
  let raf = 0;
  let running = false;
  const clock = new THREE.Clock();

  const frame = () => {
    const dt = Math.min(clock.getDelta(), 0.05);
    const k = (rate: number) => 1 - Math.exp(-dt * rate);
    look.lerp(target.look, k(10));
    uniforms.uStrength.value += (target.strength - uniforms.uStrength.value) * k(14);
    uniforms.uPressAmt.value += (target.press - uniforms.uPressAmt.value) * k(7);
    // look into the scene from the pointer's side, aimed at the photo's centre
    camera.position.set(-look.x * 0.55, -look.y * 0.4, DIST);
    camera.lookAt(0, 0, STRENGTH * 0.4);
    if (rippleStart >= 0) {
      const age = clock.elapsedTime - rippleStart;
      uniforms.uRipple.value.z = age < 2 ? age : -1;
      if (age >= 2) rippleStart = -1;
    }
    renderer.render(scene, camera);
    // stop once everything has settled back flat
    const settled =
      target.strength === 0 && uniforms.uStrength.value < 0.002 && look.length() < 0.002 && rippleStart < 0;
    if (settled) {
      running = false;
      onActive(false);
      return;
    }
    raf = requestAnimationFrame(frame);
  };
  const start = () => {
    if (running) return;
    running = true;
    clock.getDelta();
    raf = requestAnimationFrame(frame);
  };

  const toUv = (e: { clientX: number; clientY: number }) => {
    const b = host.getBoundingClientRect();
    return new THREE.Vector2((e.clientX - b.left) / b.width, (e.clientY - b.top) / b.height);
  };

  return {
    pointer(e) {
      if (!e) {
        target.look.set(0, 0);
        target.press = 0;
        target.strength = 0;
        start();
        return;
      }
      const uv = toUv(e);
      target.look.set(uv.x * 2 - 1, uv.y * 2 - 1);
      // uv in the plane's own space (it may be cropped by the cover fit)
      const viewH = 2 * DIST * Math.tan(THREE.MathUtils.degToRad(15));
      const viewW = viewH * camera.aspect;
      const s = plane.scale.x;
      uniforms.uPress.value.set(0.5 + ((uv.x - 0.5) * viewW) / (aspect * s), 0.5 - ((uv.y - 0.5) * viewH) / s);
      target.press = 1;
      target.strength = STRENGTH;
      onActive(true);
      start();
    },
    click(e) {
      const p = uniforms.uPress.value;
      void e;
      uniforms.uRipple.value.set(p.x, p.y, 0);
      rippleStart = clock.elapsedTime;
      start();
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      plane.geometry.dispose();
      (plane.material as THREE.Material).dispose();
      photoTex.dispose();
      depthTex.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
};

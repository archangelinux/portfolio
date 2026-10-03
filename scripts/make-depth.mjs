// One-off: estimate a depth map for each hero photo (Depth Anything V2, run
// locally in Node) and save it next to the photo as <name>-depth.png.
// Bright = near. The site ships these small images, never the model.
//   node scripts/make-depth.mjs
import { pipeline, RawImage } from "@huggingface/transformers";
import sharp from "sharp";

const photos = ["hero1", "hero2", "hero3"];
const depth = await pipeline("depth-estimation", "onnx-community/depth-anything-v2-small", { dtype: "q8" });

for (const name of photos) {
  const src = `src/assets/${name}.png`;
  const image = await RawImage.read(src);
  const { depth: map } = await depth(image);
  const out = `src/assets/${name}-depth.png`;
  // the model's output is smaller than the photo: upscale smoothly, blur a touch to avoid stair-steps
  await sharp(Buffer.from(map.data), { raw: { width: map.width, height: map.height, channels: 1 } })
    .resize(image.width > 1024 ? 1024 : image.width, null)
    .blur(1.2)
    .png()
    .toFile(out);
  console.log(`${src} → ${out}`);
}

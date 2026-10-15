import * as THREE from "three";

const STORAGE_KEY = "keke-rush-best-ghost-v1";

export type GhostSample = {
  time: number;
  x: number;
  z: number;
  lean: number;
};

export type GhostRun = {
  duration: number;
  samples: GhostSample[];
};

export function createGhostKeke() {
  const ghost = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({
    color: 0x78e7ff,
    emissive: 0x174c59,
    emissiveIntensity: 0.75,
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
  });
  const dark = material.clone();
  dark.color.setHex(0x163a45);
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.15, 1.25, 3.5), material);
  body.position.y = 1.15;
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(2, 1.45, 2.2), dark);
  cabin.position.set(0, 2.15, 0.3);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.18, 2.65), material);
  roof.position.set(0, 2.95, 0.25);
  const nose = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.8, 1.1), material);
  nose.position.set(0, 1.05, -2);
  ghost.add(body, cabin, roof, nose);
  ghost.visible = false;
  ghost.renderOrder = 2;
  return ghost;
}

function isSample(value: unknown): value is GhostSample {
  if (!value || typeof value !== "object") return false;
  const sample = value as Partial<GhostSample>;
  return [sample.time, sample.x, sample.z, sample.lean].every(
    (part) => typeof part === "number" && Number.isFinite(part),
  );
}

export function loadGhostRun(): GhostRun | null {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (!parsed || typeof parsed !== "object") return null;
    const run = parsed as Partial<GhostRun>;
    if (!Number.isFinite(run.duration) || !Array.isArray(run.samples)) return null;
    if (run.samples.length < 2 || !run.samples.every(isSample)) return null;
    return { duration: run.duration!, samples: run.samples };
  } catch {
    return null;
  }
}

export function saveGhostRun(run: GhostRun) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(run));
  } catch {
    // Persistence is optional; the completed race still counts without it.
  }
}

export function replayGhost(ghost: THREE.Group, run: GhostRun | null, elapsed: number) {
  if (!run || elapsed > run.duration) {
    ghost.visible = false;
    return null;
  }
  ghost.visible = true;
  let low = 0;
  let high = run.samples.length - 1;
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (run.samples[middle]!.time < elapsed) low = middle + 1;
    else high = middle;
  }
  const next = run.samples[low]!;
  const previous = run.samples[Math.max(0, low - 1)]!;
  const span = Math.max(0.001, next.time - previous.time);
  const mix = THREE.MathUtils.clamp((elapsed - previous.time) / span, 0, 1);
  ghost.position.set(
    THREE.MathUtils.lerp(previous.x, next.x, mix),
    0,
    THREE.MathUtils.lerp(previous.z, next.z, mix),
  );
  ghost.rotation.z = THREE.MathUtils.lerp(previous.lean, next.lean, mix);
  return ghost.position.z;
}

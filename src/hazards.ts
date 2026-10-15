import * as THREE from "three";

export type RoadHazard = {
  group: THREE.Group;
  kind: "traffic" | "pothole";
  radiusX: number;
  radiusZ: number;
  startX: number;
  startZ: number;
  velocity: number;
};

const material = (color: number) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.82 });

function vehicle(x: number, z: number, color: number, velocity: number): RoadHazard {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.35, 4.4), material(color));
  body.position.y = 1.05;
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.15, 1.15, 2.2), material(0xf0e4c4));
  cabin.position.set(0, 2, 0.25);
  const glass = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.7, 0.08), material(0x8ec6d1));
  glass.position.set(0, 2.05, 1.38);
  const wheelGeometry = new THREE.CylinderGeometry(0.42, 0.42, 0.25, 14);
  const wheelMaterial = material(0x17211c);
  group.add(body, cabin, glass);
  for (const wheelX of [-1.2, 1.2]) {
    for (const wheelZ of [-1.35, 1.35]) {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wheelX, 0.5, wheelZ);
      group.add(wheel);
    }
  }
  group.position.set(x, 0, z);
  group.rotation.y = velocity > 0 ? Math.PI : 0;
  group.traverse((child) => {
    if (child instanceof THREE.Mesh) child.castShadow = true;
  });
  return { group, kind: "traffic", radiusX: 1.55, radiusZ: 2.65, startX: x, startZ: z, velocity };
}

function pothole(x: number, z: number): RoadHazard {
  const group = new THREE.Group();
  const crater = new THREE.Mesh(
    new THREE.CircleGeometry(1.05, 18),
    new THREE.MeshStandardMaterial({ color: 0x171a19, roughness: 1 }),
  );
  crater.rotation.x = -Math.PI / 2;
  crater.position.y = 0.015;
  const rim = new THREE.Mesh(
    new THREE.RingGeometry(0.85, 1.25, 18),
    new THREE.MeshStandardMaterial({ color: 0x4b4c42, roughness: 1 }),
  );
  rim.rotation.x = -Math.PI / 2;
  rim.position.y = 0.02;
  group.add(crater, rim);
  group.position.set(x, 0, z);
  return { group, kind: "pothole", radiusX: 1.2, radiusZ: 1.2, startX: x, startZ: z, velocity: 0 };
}

export function createRoadHazards(scene: THREE.Scene): RoadHazard[] {
  const hazards = [
    pothole(2.4, 78),
    vehicle(-2.6, 66, 0xd95c42, 4.2),
    pothole(-1.8, 35),
    vehicle(2.6, 22, 0x397b76, 3.7),
    pothole(2.1, -18),
    vehicle(-2.5, -33, 0xe0a633, 4.6),
    pothole(-2.2, -68),
    vehicle(2.55, -91, 0x7456a4, 3.9),
  ];
  for (const hazard of hazards) scene.add(hazard.group);
  return hazards;
}

export function resetRoadHazards(hazards: RoadHazard[]) {
  for (const hazard of hazards) {
    hazard.group.position.set(hazard.startX, 0, hazard.startZ);
  }
}

export function moveTraffic(hazards: RoadHazard[], delta: number) {
  for (const hazard of hazards) {
    if (hazard.kind !== "traffic") continue;
    hazard.group.position.z += hazard.velocity * delta;
    if (hazard.group.position.z > 116) hazard.group.position.z = -112;
  }
}

export function findCollision(
  hazards: RoadHazard[],
  playerX: number,
  playerZ: number,
): RoadHazard | undefined {
  return hazards.find(
    (hazard) =>
      Math.abs(playerX - hazard.group.position.x) < hazard.radiusX + 0.8 &&
      Math.abs(playerZ - hazard.group.position.z) < hazard.radiusZ + 1.45,
  );
}

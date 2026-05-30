"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type NodeState = {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
};

/**
 * NetworkGraph — drifting nodes with lines drawn between any pair closer
 * than CONNECT_DIST. Reads as a neural-net / data-graph visualization.
 */
function NetworkGraph({
  count = 70,
  bounds = new THREE.Vector3(7, 4, 3),
  connectDist = 1.6,
}: {
  count?: number;
  bounds?: THREE.Vector3;
  connectDist?: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const nodes = useMemo<NodeState[]>(() => {
    return Array.from({ length: count }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * bounds.x * 2,
        (Math.random() - 0.5) * bounds.y * 2,
        (Math.random() - 0.5) * bounds.z * 2
      ),
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 0.12,
        (Math.random() - 0.5) * 0.08,
        (Math.random() - 0.5) * 0.08
      ),
    }));
  }, [count, bounds.x, bounds.y, bounds.z]);

  // Buffers we'll mutate every frame
  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  const linePositions = useMemo(
    () => new Float32Array(count * count * 6), // max pairs * 2 points * xyz
    [count]
  );
  const lineColors = useMemo(
    () => new Float32Array(count * count * 6),
    [count]
  );

  useFrame((_, delta) => {
    // step + bounce off bounds
    for (let i = 0; i < count; i++) {
      const n = nodes[i];
      n.pos.addScaledVector(n.vel, delta);
      if (Math.abs(n.pos.x) > bounds.x) n.vel.x *= -1;
      if (Math.abs(n.pos.y) > bounds.y) n.vel.y *= -1;
      if (Math.abs(n.pos.z) > bounds.z) n.vel.z *= -1;
      positions[i * 3] = n.pos.x;
      positions[i * 3 + 1] = n.pos.y;
      positions[i * 3 + 2] = n.pos.z;
    }

    // recompute edges
    let li = 0;
    const cdSq = connectDist * connectDist;
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const a = nodes[i].pos;
        const b = nodes[j].pos;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        const dSq = dx * dx + dy * dy + dz * dz;
        if (dSq < cdSq) {
          const alpha = 1 - Math.sqrt(dSq) / connectDist;
          // line endpoints
          linePositions[li] = a.x;
          linePositions[li + 1] = a.y;
          linePositions[li + 2] = a.z;
          linePositions[li + 3] = b.x;
          linePositions[li + 4] = b.y;
          linePositions[li + 5] = b.z;
          // colors per vertex — fading emerald
          const r = 0.06, g = 0.73, blu = 0.51;
          lineColors[li] = r;
          lineColors[li + 1] = g;
          lineColors[li + 2] = blu;
          lineColors[li + 3] = r;
          lineColors[li + 4] = g;
          lineColors[li + 5] = blu;
          // encode alpha into color brightness (we use additive blending)
          for (let k = 0; k < 6; k++) lineColors[li + k] *= alpha;
          li += 6;
        }
      }
    }

    if (pointsRef.current) {
      const attr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      attr.needsUpdate = true;
    }
    if (linesRef.current) {
      const lp = linesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const lc = linesRef.current.geometry.attributes.color as THREE.BufferAttribute;
      lp.needsUpdate = true;
      lc.needsUpdate = true;
      linesRef.current.geometry.setDrawRange(0, li / 3);
    }
  });

  return (
    <group rotation={[0, 0, 0]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={count}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.07}
          color="#34D399"
          transparent
          opacity={0.95}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
            count={linePositions.length / 3}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[lineColors, 3]}
            count={lineColors.length / 3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

/** Slow rotation wrapper so the whole graph drifts gently. */
function Rotator({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.04;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.08;
  });
  return <group ref={ref}>{children}</group>;
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 8], fov: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.4} />
      <Rotator>
        <NetworkGraph />
      </Rotator>
    </Canvas>
  );
}

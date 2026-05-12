import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function ParticleSwarm() {
  const meshRef = useRef();
  const count = 8000;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const pColor = useMemo(() => new THREE.Color(), []);

  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      pos.push(new THREE.Vector3(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      ));
    }
    return pos;
  }, []);

  const target = useMemo(() => new THREE.Vector3(), []);

  const geometry = useMemo(() => new THREE.TetrahedronGeometry(0.18), []);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: 0xffffff }), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    const scale = 80;
    const freq  = 2.2;
    const amp   = 6;
    const speed = 1.2;
    const pull  = 6;
    const twist = 1.5;

    const t = time * speed;

    const w1x = Math.sin(t * 0.3) * scale * 0.4;
    const w1y = Math.cos(t * 0.2) * scale * 0.4;
    const w2x = Math.sin(t * 0.5 + 2.0) * scale * 0.3;
    const w2y = Math.cos(t * 0.4 + 1.0) * scale * 0.3;

    for (let i = 0; i < count; i++) {
      const u = ((Math.sin(i * 12.9898) * 43758.5453) % 1.0 + 1.0) % 1.0;
      const v = ((Math.sin(i * 78.233)  * 12345.6789) % 1.0 + 1.0) % 1.0;

      let x = (u * 2.0 - 1.0) * scale;
      let y = (v * 2.0 - 1.0) * scale;

      const wave = Math.sin(x * 0.02 * freq + t) + Math.sin(y * 0.02 * freq - t * 0.8);
      let z = wave * amp;

      const dx1 = x - w1x, dy1 = y - w1y;
      const d1  = Math.sqrt(dx1 * dx1 + dy1 * dy1 + 4.0);
      const dx2 = x - w2x, dy2 = y - w2y;
      const d2  = Math.sqrt(dx2 * dx2 + dy2 * dy2 + 4.0);

      z += (-pull / d1) + (-pull / d2);

      const ang  = twist * ((-pull / d1) - (-pull / d2));
      const cosA = Math.cos(ang), sinA = Math.sin(ang);
      const tx   = x * cosA - y * sinA;
      const ty   = x * sinA + y * cosA;

      target.set(tx, ty, z);

      // teal / purple color based on depth
      const depth = Math.abs(z) / (amp + 0.001);
      const hue   = (0.5 - depth * 0.3 + 0.05 * Math.sin(t)) % 1.0;
      pColor.setHSL(hue, 0.8, 0.3 + 0.4 * (1.0 - depth));

      positions[i].lerp(target, 0.08);
      dummy.position.copy(positions[i]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, pColor);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, count]} />
  );
}

export default function ParticleBackground({ height = '100%' }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      width: '100%', height,
      pointerEvents: 'none', zIndex: 0,
      opacity: 0.55,
    }}>
      <Canvas
        camera={{ position: [0, 0, 80], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
      >
        <fog attach="fog" args={['#1A1A2E', 60, 160]} />
        <ParticleSwarm />
        <OrbitControls
          enableZoom={false} enablePan={false} enableRotate={false}
          autoRotate autoRotateSpeed={0.3}
        />
      </Canvas>
    </div>
  );
}

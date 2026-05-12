import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

// Single 3D Bar
function Bar({ position, height, color, label, value }) {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = height / 2;
      const hovered = meshRef.current.userData.hovered;
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, hovered ? 1.05 : 1, 0.1);
    }
  });
  return (
    <group position={[position[0], 0, position[2]]}>
      <mesh ref={meshRef} position={[0, height / 2, 0]}
        onPointerOver={() => { meshRef.current.userData.hovered = true; }}
        onPointerOut={() => { meshRef.current.userData.hovered = false; }}>
        <boxGeometry args={[0.6, height, 0.6]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </mesh>
      <Text position={[0, height + 0.3, 0]} fontSize={0.25} color="white" anchorX="center" anchorY="bottom">
        {value}
      </Text>
      <Text position={[0, -0.3, 0]} fontSize={0.2} color="#A0A0B0" anchorX="center" anchorY="top">
        {label}
      </Text>
    </group>
  );
}

// Rotating ring for calorie donut
function CalorieRing({ percentage, color }) {
  const groupRef = useRef();
  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.005;
  });
  const angle = (percentage / 100) * Math.PI * 2;
  const shape = new THREE.Shape();
  shape.absarc(0, 0, 1.2, 0, angle, false);
  const points = shape.getPoints(64);
  return (
    <group ref={groupRef}>
      {/* Background ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.25, 16, 100]} />
        <meshStandardMaterial color="#2F2F4A" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Progress ring */}
      <mesh rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
        <torusGeometry args={[1.2, 0.28, 16, 100, angle]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} emissive={color} emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

// 3D Bar Chart — Weight Trend
export function WeightChart3D({ data = [] }) {
  const defaultData = data.length > 0 ? data : [
    { label: 'W1', value: 72.5 },
    { label: 'W2', value: 71.8 },
    { label: 'W3', value: 70.9 },
    { label: 'W4', value: 70.2 },
  ];
  const min = Math.min(...defaultData.map(d => d.value)) - 1;
  const max = Math.max(...defaultData.map(d => d.value)) + 1;
  const colors = ['#6C63FF', '#4ECDC4', '#A89FFF', '#44A3A0'];

  return (
    <div style={{ width: '100%', height: '220px' }}>
      <Canvas camera={{ position: [0, 3, 6], fov: 50 }} shadows>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#6C63FF" />
        <Suspense fallback={null}>
          {defaultData.map((d, i) => {
            const height = ((d.value - min) / (max - min)) * 3 + 0.3;
            const x = (i - (defaultData.length - 1) / 2) * 1.2;
            return (
              <Bar key={i} position={[x, 0, 0]} height={height}
                color={colors[i % colors.length]} label={d.label} value={d.value} />
            );
          })}
          {/* Floor grid */}
          <gridHelper args={[8, 8, '#2F2F4A', '#2F2F4A']} position={[0, 0, 0]} />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI / 2.5} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}

// 3D Calorie Donut
export function CalorieDonut3D({ current = 0, goal = 1850 }) {
  const pct = Math.min((current / goal) * 100, 100);
  return (
    <div style={{ width: '100%', height: '180px' }}>
      <Canvas camera={{ position: [0, 2.5, 3.5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[3, 3, 3]} intensity={1} color="#4ECDC4" />
        <pointLight position={[-3, -3, -3]} intensity={0.5} color="#6C63FF" />
        <Suspense fallback={null}>
          <CalorieRing percentage={pct} color="#4ECDC4" />
          <Text position={[0, 0, 0]} fontSize={0.4} color="white" anchorX="center" anchorY="middle" font={undefined}>
            {current}
          </Text>
          <Text position={[0, -0.5, 0]} fontSize={0.2} color="#A0A0B0" anchorX="center" anchorY="middle">
            kcal
          </Text>
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
      </Canvas>
    </div>
  );
}

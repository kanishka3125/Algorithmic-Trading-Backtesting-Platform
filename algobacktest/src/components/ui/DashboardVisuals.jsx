import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ParticleLayer = () => {
  const pointsRef = useRef();

  const particles = useMemo(() => {
    const pos = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
        pointsRef.current.rotation.y = time * 0.05;
        pointsRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    }
  });

  return (
    <Points ref={pointsRef} positions={particles}>
      <PointMaterial transparent color="var(--primary)" size={0.05} sizeAttenuation={true} depthWrite={false} opacity={0.15} />
    </Points>
  );
};

const GridLayer = () => {
    const gridRef = useRef();
    
    useFrame((state) => {
        const x = state.mouse.x * 0.2;
        const y = state.mouse.y * 0.2;
        if (gridRef.current) {
            gridRef.current.rotation.x = THREE.MathUtils.lerp(gridRef.current.rotation.x, Math.PI / 2 + y, 0.05);
            gridRef.current.rotation.y = THREE.MathUtils.lerp(gridRef.current.rotation.y, x, 0.05);
        }
    });

    return (
        <gridHelper ref={gridRef} args={[100, 50, "var(--primary-dim)", "var(--border)"]} position={[0, -10, 0]} rotation={[Math.PI / 2, 0, 0]} />
    );
}

const DashboardVisuals = () => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: -1,
            pointerEvents: 'none',
            background: 'var(--bg-deep)',
            opacity: 0.4
        }}>
            <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <Suspense fallback={null}>
                    <ParticleLayer />
                    <GridLayer />
                </Suspense>
            </Canvas>
        </div>
    );
};

import { Suspense } from 'react';

export default DashboardVisuals;

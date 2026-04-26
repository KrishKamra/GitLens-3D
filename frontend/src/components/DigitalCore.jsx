import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

const baseColor = new THREE.Color("#00ffcc"); 

export default function DigitalCore({ stats }) {
  const coreRef = useRef();
  const materialRef = useRef();

  // 1. MEMOIZED DATA PROCESSING
  // We calculate these only when 'stats' changes, not every frame.
  const coreMetrics = useMemo(() => {
    const repoCount = stats?.repos?.length || 0;
    const totalStars =
      stats?.repos?.reduce((acc, repo) => acc + repo.stars, 0) || 0;

    return {
      // More repos = faster distortion
      distortSpeed: Math.min(2 + repoCount * 0.1, 5),
      // More stars = higher emissive glow
      glowIntensity: Math.min(0.5 + totalStars * 0.05, 2),
      // Distort amount based on "density"
      distortAmount: Math.min(0.3 + repoCount * 0.02, 0.6),
    };
  }, [stats]);

  // 2. OPTIMIZED FRAME LOOP
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (coreRef.current) {
      // Use direct mutation for performance (bypassing React state)
      coreRef.current.rotation.x = t * 0.15;
      coreRef.current.rotation.y = t * 0.25;

      // Subtle "breathing" effect on scale
      const pulse = 1 + Math.sin(t * 1.5) * 0.03;
      coreRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={coreRef} args={[1.2, 128, 128]}>
        {/* args explanation: 
          1.2 = Radius
          128, 128 = Higher segments for smoother distortion (looks more "Elite") 
        */}
        <MeshDistortMaterial
          ref={materialRef}
          color={baseColor}
          distort={coreMetrics.distortAmount}
          speed={coreMetrics.distortSpeed}
          roughness={0.1}
          metalness={1} // Adds that "Silicon" metallic feel
          emissive={baseColor}
          emissiveIntensity={coreMetrics.glowIntensity}
          transparent
          opacity={0.9}
        />
      </Sphere>
    </Float>
  );
}

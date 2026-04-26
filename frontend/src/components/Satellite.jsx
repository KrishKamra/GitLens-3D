import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Text } from "@react-three/drei";

export default function Satellite({ repo, index, total }) {
  const meshRef = useRef();

  // 1. DETERMINISTIC SEED
  const seed = useMemo(() => {
    const name = repo?.name || "";
    const charSum = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (charSum % 100) / 100;
  }, [repo?.name]);

  // 2. MEMOIZED ORBITAL PARAMETERS
  const orbitalData = useMemo(() => {
    const angle = (index / total) * Math.PI * 2;
    // Radius: Spread them out further from the core (2.5 is the core's edge)
    const radius = 4 + index * 0.5;
    const speed = 0.1 + seed * 0.15;

    // SCALE FIX: Give 0-star repos a larger baseline (0.25) so they are visible
    const starCount = repo?.stars || 0;
    const scale = 0.25 + Math.min(starCount * 0.05, 0.5);

    return { radius, speed, scale, angle };
  }, [index, total, repo?.stars, seed]);

  // 3. ANIMATION LOOP
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * orbitalData.speed;

    const x = Math.cos(t + orbitalData.angle) * orbitalData.radius;
    const z = Math.sin(t + orbitalData.angle) * orbitalData.radius;
    const y = Math.sin(t * 1.2 + index) * 0.5; // Vertical oscillation

    if (meshRef.current) {
      meshRef.current.position.set(x, y, z);
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group>
      {/* Container for the sphere to apply position once */}
      <group ref={meshRef}>
        <Sphere args={[orbitalData.scale, 32, 32]}>
          <MeshDistortMaterial
            color="#00ffcc"
            speed={4}
            distort={0.3}
            emissive="#00ffcc"
            emissiveIntensity={1.5} // High intensity to match the core's glow
            metalness={1}
            roughness={0}
          />
        </Sphere>

        {/* 4. REPO LABEL */}
        <Text
          onUpdate={(self) => self.lookAt(0, 0, 12)}
          position={[0, orbitalData.scale + 0.3, 0]}
          fontSize={0.12}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {repo?.name?.toUpperCase() || "NODE"}
        </Text>
      </group>
    </group>
  );
}

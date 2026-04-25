import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows, Environment, Float, Html } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { useCustomizerStore } from '../../store/useCustomizerStore';
import { motion as motion3d } from 'framer-motion-3d';

function Shoe() {
  const { material, accentColor } = useCustomizerStore();
  const meshRef = useRef<any>(null);

  // Texture Mock (In a real app, use useTexture from @react-three/drei)
  const colors = {
    akwete: '#5D4037', // Brownish
    ankara: '#AD1457', // Pinkish
    leather: '#212121', // Blackish
  };

  return (
    <group>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* Main Body */}
        <mesh ref={meshRef} castShadow position={[0, -0.5, 0]}>
          <capsuleGeometry args={[0.5, 1, 4, 16]} />
          <meshStandardMaterial 
            color={colors[material]} 
            roughness={0.1} 
            metalness={0.1} 
          />
        </mesh>
        
        {/* Sole */}
        <mesh position={[0, -1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[1, 2.5, 0.4]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Accent Details */}
        <mesh position={[0, 0.2, 0.4]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.2} />
        </mesh>
        
        <Html position={[0, 1.2, 0]} center distanceFactor={10}>
          <div className="bg-charcoal/80 backdrop-blur-md px-3 py-1 rounded-full border border-gold/20 text-[10px] font-bold text-gold uppercase whitespace-nowrap">
            Handcrafted {material}
          </div>
        </Html>
      </Float>
    </group>
  );
}

export default function ShoeCanvas() {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[5, 2, 5]} fov={35} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <Environment preset="city" />
        
        <Suspense fallback={null}>
          <Shoe />
          <ContactShadows position={[0, -1.4, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
        </Suspense>
        
        <OrbitControls 
          enablePan={false} 
          minDistance={3} 
          maxDistance={8} 
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}

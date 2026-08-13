"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
uniform float uProgress;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 pos = position;
  
  // The plane is 1.0 units high, going from y=-0.5 to y=0.5
  // We map it from 0.0 (top) to 1.0 (bottom)
  float normalizedY = 0.5 - pos.y;
  
  float radius = 0.15; // The radius of the roll
  
  if (normalizedY > uProgress) {
    float diff = normalizedY - uProgress;
    float angle = diff / radius;
    
    // Position of the center of the cylinder roll
    float cy = 0.5 - uProgress; 
    float cz = radius;
    
    pos.y = cy - sin(angle) * radius;
    pos.z = cz - cos(angle) * radius;
  }
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uTexture;
uniform float uProgress;
varying vec2 vUv;

// Simple random function for noise
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
  vec4 color = texture2D(uTexture, vUv);
  
  // Add subtle paper noise
  float noise = random(vUv * 1000.0) * 0.05;
  color.rgb -= noise;
  
  // Add a slight shadow gradient where it curls
  float normalizedY = 1.0 - vUv.y;
  if (normalizedY > uProgress) {
    float diff = normalizedY - uProgress;
    float shadow = clamp(diff * 2.0, 0.0, 0.5);
    color.rgb -= shadow;
  }
  
  gl_FragColor = color;
}
`;

interface PaperMeshProps {
  textureUrl: string;
  onAnimationComplete: () => void;
  aspectRatio: number;
}

function PaperMesh({ textureUrl, onAnimationComplete, aspectRatio }: PaperMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(textureUrl);
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    return tex;
  }, [textureUrl]);

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0.0 },
      uTexture: { value: texture },
    }),
    [texture]
  );

  // Animate the progress
  useFrame((state, delta) => {
    if (materialRef.current) {
      if (materialRef.current.uniforms.uProgress.value < 1.0) {
        // Roll out slowly, slowing down as it reaches the end
        const remaining = 1.0 - materialRef.current.uniforms.uProgress.value;
        const speed = Math.max(0.15, remaining * 2.0); // Ease out
        materialRef.current.uniforms.uProgress.value += speed * delta * 1.5;
        
        if (materialRef.current.uniforms.uProgress.value >= 0.999) {
          materialRef.current.uniforms.uProgress.value = 1.0;
          setTimeout(() => {
            onAnimationComplete();
          }, 800); // Wait 0.8s before firing completion
        }
      }
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* 128 height segments for smooth curling */}
      <planeGeometry args={[1 * aspectRatio, 1, 1, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

interface PaperAnimationProps {
  textureUrl: string;
  aspectRatio: number;
  onAnimationComplete: () => void;
}

export default function PaperAnimation({ textureUrl, aspectRatio, onAnimationComplete }: PaperAnimationProps) {
  // Adjust camera distance to fit the paper
  const fov = 45;
  const distance = 1.5; // distance from camera

  return (
    <div className="w-full h-[70vh] flex items-center justify-center">
      <Canvas camera={{ position: [0, 0, distance], fov }}>
        <ambientLight intensity={1.0} />
        <PaperMesh 
          textureUrl={textureUrl} 
          onAnimationComplete={onAnimationComplete} 
          aspectRatio={aspectRatio}
        />
      </Canvas>
    </div>
  );
}

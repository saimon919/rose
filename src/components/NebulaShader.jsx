import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const NebulaShader = ({ chapter, isMobile }) => {
  const mesh = useRef();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uChapter: { value: chapter },
    uColorCenter: { value: new THREE.Color('#010105') },
    uColorMid: { value: new THREE.Color('#1a0b2e') },
    uColorEdge: { value: new THREE.Color('#4c1033') },
  }), []);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
      mesh.current.material.uniforms.uChapter.value = THREE.MathUtils.lerp(
        mesh.current.material.uniforms.uChapter.value,
        chapter,
        0.05
      );
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  // Simplified shader to prevent mobile timeout
  const fragmentShader = `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uChapter;
    uniform vec3 uColorCenter;
    uniform vec3 uColorMid;
    uniform vec3 uColorEdge;

    void main() {
      vec2 p = vUv * 2.0 - 1.0;
      float d = length(p);
      
      vec3 color = mix(uColorCenter, uColorMid, d * 0.8);
      color = mix(color, uColorEdge, smoothstep(0.0, 1.5, d + sin(uTime * 0.1) * 0.2));
      
      // Basic static stars for performance
      float stars = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453);
      if (stars > 0.998) color += 0.5 * (1.0 + sin(uTime + stars));

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
};

export default NebulaShader;

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const NebulaShader = ({ chapter }) => {
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

  const fragmentShader = `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uChapter;
    uniform vec3 uColorCenter;
    uniform vec3 uColorMid;
    uniform vec3 uColorEdge;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 6; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 p = vUv * 2.0 - 1.0;
      float eonSpeed = uTime * (0.01 + uChapter * 0.01);
      
      // Multi-layered gas simulation
      vec2 q = vec2(fbm(p + eonSpeed), fbm(p - eonSpeed * 0.5));
      float r = fbm(p + q + eonSpeed * 0.2);
      
      // Evolving color palette based on chapter
      vec3 col1 = mix(uColorCenter, vec3(0.05, 0.0, 0.1), uChapter / 7.0);
      vec3 col2 = mix(uColorMid, vec3(0.3, 0.05, 0.4), uChapter / 7.0);
      vec3 col3 = mix(uColorEdge, vec3(0.8, 0.2, 0.3), uChapter / 7.0);
      
      vec3 color = mix(col1, col2, r);
      color = mix(color, col3, q.y * 0.7);
      
      // Ancient starfield
      float stars = pow(hash(vUv * 1200.0), 60.0) * (3.0 + uChapter * 0.5);
      float shimmer = sin(uTime * 1.5 + hash(vUv) * 20.0) * 0.5 + 0.5;
      color += stars * shimmer;

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

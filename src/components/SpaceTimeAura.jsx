import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SpaceTimeAura = () => {
    const mesh = useRef();

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color('#02010a') },
        uColor2: { value: new THREE.Color('#1a0a2e') },
        uColor3: { value: new THREE.Color('#4c1033') },
    }), []);

    useFrame((state) => {
        if (mesh.current) {
            mesh.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
        }
    });

    const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

    const fragmentShader = `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;

    void main() {
      vec2 p = vUv * 2.0 - 1.0;
      float d = length(p);
      
      float noise = sin(p.x * 10.0 + uTime) * cos(p.y * 10.0 + uTime) * 0.5 + 0.5;
      vec3 color = mix(uColor1, uColor2, d);
      color = mix(color, uColor3, noise * (1.0 - d));
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

    return (
        <mesh ref={mesh} position={[0, 0, -10]}>
            <planeGeometry args={[100, 100]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    );
};

export default SpaceTimeAura;

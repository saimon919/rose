import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float, Sparkles, Torus } from '@react-three/drei';
import * as THREE from 'three';

const SentientPetal = ({ index, total, chapter, isMobile }) => {
    const mesh = useRef();
    const phi = (1 + Math.sqrt(5)) / 2;
    const angle = index * (2 * Math.PI / (phi * phi));
    const radius = Math.sqrt(index / total) * (isMobile ? 2.2 : 3);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (mesh.current) {
            const breath = 1 + Math.sin(t * 0.5 + index * 0.2) * 0.02;
            mesh.current.scale.set(breath, breath, breath);
            const hue = 340 + Math.sin(t * 0.1 + index * 0.05) * 20;
            mesh.current.material.color.setHSL(hue / 360, 0.8, 0.6);
        }
    });

    return (
        <mesh
            ref={mesh}
            position={[
                Math.cos(angle) * radius,
                (index / total) * 2 - 1,
                Math.sin(angle) * radius
            ]}
            rotation={[
                Math.PI / 4 + (index / total) * Math.PI / 3,
                angle,
                0
            ]}
        >
            <sphereGeometry args={[isMobile ? 0.7 : 0.6, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <MeshTransmissionMaterial
                backside
                samples={4}
                resolution={isMobile ? 128 : 256}
                transmission={1.0}
                roughness={0.1}
                thickness={1.5}
                ior={1.1}
                chromaticAberration={0.02}
                color="#fff"
                emissive="#ff4d6d"
                emissiveIntensity={isMobile ? 1.0 : 0.5}
            />
        </mesh>
    );
};

const Rose3D = ({ chapter, isMobile }) => {
    const groupRef = useRef();
    const growth = chapter / 7;
    const petalCount = isMobile ? 12 : 30;

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.rotation.y = t * 0.1;
            const heartbeat = 1 + Math.pow(Math.sin(t * Math.PI), 12) * 0.05;
            groupRef.current.scale.set(growth * heartbeat, growth * heartbeat, growth * heartbeat);
        }
    });

    return (
        <group ref={groupRef}>
            <mesh>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshStandardMaterial color="#fff" emissive="#ffb703" emissiveIntensity={10} toneMapped={false} />
            </mesh>

            <Sparkles count={isMobile ? 20 : 100} scale={4} size={isMobile ? 2 : 1.5} speed={0.5} color="#ff4d6d" />

            {[...Array(petalCount)].map((_, i) => (
                <SentientPetal key={i} index={i} total={petalCount} chapter={chapter} isMobile={isMobile} />
            ))}

            <mesh position={[0, -3.5, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 7, 8]} />
                <meshStandardMaterial color="#051c12" emissive="#1b4332" emissiveIntensity={2} />
            </mesh>
        </group>
    );
};

export default Rose3D;

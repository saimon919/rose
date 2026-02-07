import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const SentientPetal = ({ index, total, chapter }) => {
    const mesh = useRef();

    // Golden Angle spiral (Sacred Geometry)
    const phi = (1 + Math.sqrt(5)) / 2;
    const angle = index * (2 * Math.PI / (phi * phi));
    const radius = Math.sqrt(index / total) * 3;

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (mesh.current) {
            // Subconscious breathing pulse
            const breath = 1 + Math.sin(t * 0.5 + index * 0.2) * 0.02;
            mesh.current.scale.set(breath, breath, breath);

            // Dynamic color shift based on chapter
            const hue = 340 + Math.sin(t * 0.1 + index * 0.05) * 20;
            mesh.current.material.color.setHSL(hue / 360, 0.8, 0.6 + Math.sin(t) * 0.1);
        }
    });

    return (
        <mesh
            ref={mesh}
            position={[
                Math.cos(angle) * radius,
                (index / total) * 2.5 - 1.25,
                Math.sin(angle) * radius
            ]}
            rotation={[
                Math.PI / 4 + (index / total) * Math.PI / 3,
                angle,
                Math.sin(index) * 0.2
            ]}
        >
            <sphereGeometry args={[0.7, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <MeshTransmissionMaterial
                backside
                samples={16}
                resolution={512}
                transmission={1.0}
                roughness={0.02}
                thickness={2.0}
                ior={1.15}
                chromaticAberration={0.08}
                anisotropy={0.2}
                distortion={0.15}
                color="#ffdce5"
                emissive="#ff4d6d"
                emissiveIntensity={0.3}
            />
        </mesh>
    );
};

const Rose3D = ({ chapter }) => {
    const groupRef = useRef();
    const growth = chapter / 7;

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.rotation.y = t * 0.03;
            // Heartbeat of the universe
            const heartbeat = 1 + Math.pow(Math.sin(t * Math.PI * (60 / 60)), 12) * 0.05;
            groupRef.current.scale.set(growth * heartbeat, growth * heartbeat, growth * heartbeat);
        }
    });

    return (
        <group ref={groupRef}>
            {/* Sentient Core (Singularity) */}
            <mesh>
                <sphereGeometry args={[0.35, 64, 64]} />
                <meshStandardMaterial
                    color="#fff"
                    emissive="#ffb703"
                    emissiveIntensity={15}
                    toneMapped={false}
                />
                <pointLight intensity={2} color="#ffb703" distance={10} />
            </mesh>

            {/* Veins of Ancient Light (Sparkles) */}
            <Sparkles
                count={200}
                scale={2}
                size={2}
                speed={0.5}
                opacity={0.8}
                color="#ff4d6d"
            />

            {/* Recursive Sacred Petals */}
            {[...Array(60)].map((_, i) => (
                <SentientPetal key={i} index={i} total={60} chapter={chapter} />
            ))}

            {/* Divine Stem */}
            <mesh position={[0, -3.5, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 7, 16]} />
                <meshStandardMaterial color="#051c12" emissive="#1b4332" emissiveIntensity={3} />
            </mesh>
        </group>
    );
};

export default Rose3D;

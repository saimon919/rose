import React, { Suspense, useEffect, useState, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls, Environment, Float, PerspectiveCamera, Html } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import Rose3D from './Rose3D';
import SpiritParticles from './SpiritParticles';
import NebulaShader from './NebulaShader';

const QualityLoader = () => (
    <Html center>
        <div style={{
            color: '#ffb703',
            letterSpacing: '5px',
            fontSize: '10px',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            fontFamily: "serif",
            background: 'rgba(0,0,0,0.5)',
            padding: '10px'
        }}>
            IGNITING INFINITY...
        </div>
    </Html>
);

const CinematicCamera = ({ chapter, isMobile }) => {
    const cameraRef = useRef();

    const targets = useMemo(() => [
        { pos: [0, 0, 25], fov: 40 },
        { pos: [-3, 2, 20], fov: 35 },
        { pos: [3, -2, 18], fov: 32 },
        { pos: [0, 4, 15], fov: 30 },
        { pos: [-2, -2, 12], fov: 28 },
        { pos: [0, 0, 10], fov: 35 },
        { pos: [0, 0, isMobile ? 24 : 15], fov: isMobile ? 45 : 30 },
    ], [isMobile]);

    useFrame((state) => {
        if (cameraRef.current) {
            const target = targets[chapter - 1] || targets[6];
            cameraRef.current.position.lerp(new THREE.Vector3(...target.pos), 0.05);
            cameraRef.current.fov = THREE.MathUtils.lerp(cameraRef.current.fov, target.fov, 0.05);
            cameraRef.current.updateProjectionMatrix();
            cameraRef.current.lookAt(0, 0, 0);
        }
    });

    return <PerspectiveCamera ref={cameraRef} makeDefault />;
};

const Experience = ({ chapter }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
            <Canvas
                dpr={isMobile ? 1 : [1, 1.5]}
                camera={{ position: [0, 0, 20], fov: 35 }}
                gl={{
                    antialias: false,
                    powerPreference: "high-performance",
                    alpha: true
                }}
            >
                <CinematicCamera chapter={chapter} isMobile={isMobile} />

                <Suspense fallback={<QualityLoader />}>
                    <NebulaShader chapter={chapter} isMobile={isMobile} />

                    <ambientLight intensity={0.7} />
                    <pointLight position={[10, 10, 10]} intensity={2} color="#fff" />

                    <Stars radius={200} count={isMobile ? 1000 : 5000} factor={4} fade />

                    <SpiritParticles
                        count={isMobile ? 500 : 2000}
                        activeStep={chapter === 7 ? 'final' : 'intro'}
                    />

                    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
                        <Rose3D chapter={chapter} isMobile={isMobile} />
                    </Float>

                    <Environment preset="night" />

                    <EffectComposer multisampling={0}>
                        <Bloom intensity={1.5} luminanceThreshold={0.2} radius={0.8} />
                        <Vignette darkness={1.1} />
                    </EffectComposer>

                    <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Experience;

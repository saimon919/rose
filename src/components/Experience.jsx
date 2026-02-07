import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls, Environment, Float, PerspectiveCamera, Html } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import Rose3D from './Rose3D';
import SpiritParticles from './SpiritParticles';
import NebulaShader from './NebulaShader';

const QualityLoader = () => (
    <Html center>
        <div style={{ color: '#ffb703', letterSpacing: '5px', fontSize: '10px', whiteSpace: 'nowrap' }}>
            IGNITING COSMIC SHADERS...
        </div>
    </Html>
);

const Experience = ({ chapter }) => {
    return (
        <div className="canvas-container" style={{ width: '100%', height: '100%' }}>
            <Canvas dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={30} />

                <Suspense fallback={<QualityLoader />}>
                    <NebulaShader chapter={chapter} />

                    <ambientLight intensity={0.5} />
                    <spotLight position={[20, 20, 20]} angle={0.2} penumbra={1} intensity={5} color="#fff" />

                    <Stars radius={200} depth={50} count={15000} factor={10} saturation={1} fade speed={3} />

                    <SpiritParticles count={8000} activeStep={chapter === 7 ? 'final' : 'intro'} />

                    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
                        <Rose3D chapter={chapter} />
                    </Float>

                    <Environment preset="night" />

                    <EffectComposer disableNormalPass>
                        <Bloom
                            luminanceThreshold={0.1}
                            mipmapBlur
                            intensity={chapter === 7 ? 6.0 : 2.5}
                            radius={0.8}
                        />
                        <Noise opacity={0.08} />
                        <Vignette eskil={false} offset={0.1} darkness={1.3} />
                        <ChromaticAberration offset={[0.01, 0.01]} />
                    </EffectComposer>

                    <OrbitControls
                        enableZoom={false}
                        autoRotate
                        autoRotateSpeed={0.5}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Experience;

import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const SpiritParticles = ({ count = 12000, activeStep }) => {
    const mesh = useRef();
    const { viewport } = useThree();

    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Personality traits: 0=Devoted, 1=Curious, 2=Shy
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const trait = Math.floor(Math.random() * 3);
            const t = Math.random() * 100;
            const factor = 10 + Math.random() * 40;
            const speed = 0.002 + Math.random() / 1000;
            const radius = 2 + Math.random() * 10;
            const xFactor = -20 + Math.random() * 40;
            const yFactor = -20 + Math.random() * 40;
            const zFactor = -20 + Math.random() * 40;
            temp.push({ trait, t, factor, speed, radius, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        const tGlobal = state.clock.getElapsedTime();

        particles.forEach((particle, i) => {
            let { trait, t, factor, speed, radius, xFactor, yFactor, zFactor } = particle;
            t = particle.t += speed;

            const mouseX = state.mouse.x * viewport.width;
            const mouseY = state.mouse.y * viewport.height;

            let targetX = xFactor + Math.cos(t) * radius;
            let targetY = yFactor + Math.sin(t) * radius;
            let targetZ = zFactor + Math.sin(t * 0.5) * radius;

            // Personality behaviors
            if (trait === 0) { // Devoted (Always near the center/rose)
                targetX = Math.cos(tGlobal + xFactor) * 2;
                targetY = Math.sin(tGlobal + yFactor) * 2 + 1;
                targetZ = Math.sin(tGlobal * 0.5) * 2;
            } else if (trait === 1) { // Curious (Follows mouse)
                particle.mx += (mouseX - particle.mx) * 0.05;
                particle.my += (mouseY - particle.my) * 0.05;
                targetX = particle.mx + Math.cos(t) * 2;
                targetY = particle.my + Math.sin(t) * 2;
            } else { // Shy (Moves away from mouse)
                const distToMouse = Math.sqrt(Math.pow(mouseX - targetX, 2) + Math.pow(mouseY - targetY, 2));
                if (distToMouse < 5) {
                    targetX += (targetX - mouseX) * 0.1;
                    targetY += (targetY - mouseY) * 0.1;
                }
            }

            // Heart formation for the final act
            if (activeStep === 'final') {
                const angle = (i / count) * Math.PI * 2;
                const heartX = 16 * Math.pow(Math.sin(angle), 3) * 0.2;
                const heartY = (13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle)) * 0.2;
                targetX = THREE.MathUtils.lerp(targetX, heartX * 8, 0.03);
                targetY = THREE.MathUtils.lerp(targetY, heartY * 8 + 1, 0.03);
                targetZ = THREE.MathUtils.lerp(targetZ, Math.sin(tGlobal + i) * 0.5, 0.03);
            }

            dummy.position.set(targetX, targetY, targetZ);
            const s = 0.5 + Math.cos(t) * 0.5;
            dummy.scale.set(s * 0.05, s * 0.05, s * 0.05);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, count]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial
                color="#fff"
                emissive={activeStep === 'final' ? "#ff4d6d" : "#ffb703"}
                emissiveIntensity={4}
                transparent
                opacity={0.6}
            />
        </instancedMesh>
    );
};

export default SpiritParticles;

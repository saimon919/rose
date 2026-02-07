import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BokehField = ({ count = 40 }) => {
    const mesh = useRef();

    const dummy = useMemo(() => new THREE.Object3D(), []);
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.001 + Math.random() / 1000;
            const radius = 5 + Math.random() * 15;
            const x = -30 + Math.random() * 60;
            const y = -30 + Math.random() * 60;
            const z = -20 + Math.random() * 10;
            const scale = 2 + Math.random() * 4;
            temp.push({ t, factor, speed, radius, x, y, z, scale });
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        particles.forEach((particle, i) => {
            let { t, factor, speed, radius, x, y, z, scale } = particle;
            t = particle.t += speed;

            const s = scale + Math.sin(t) * 1.5;
            dummy.position.set(
                x + Math.cos(t) * 2,
                y + Math.sin(t) * 2,
                z
            );
            dummy.scale.set(s, s, s);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, count]}>
            <circleGeometry args={[1, 32]} />
            <meshBasicMaterial
                color="#fff"
                transparent
                opacity={0.15}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </instancedMesh>
    );
};

export default BokehField;

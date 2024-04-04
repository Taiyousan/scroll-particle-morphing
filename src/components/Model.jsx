// imports
import { useState, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";
import { useControls, folder } from "leva";

// import shaders
import particlesVertexShader from "../shaders/particles/vertex.glsl";
import particlesFragmentShader from "../shaders/particles/fragment.glsl";

export default function Model() {
  let model = useGLTF(`models/models.glb`);

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
  };

  let particles = null;
  const [particlesObj, setParticlesObj] = useState({});

  const [active, setActive] = useState(false);
  const { scale } = useSpring({
    scale: active ? 1 : 0,
    config: { mass: 5, tension: 400, friction: 50, precision: 0.0001 },
  });

  useEffect(() => {
    setActive(true);
  }, []);

  // controls
  // const [{ uProgress }, set] = useControls(() => ({ uProgress: {
  //   value: 0,
  //   min: 0,
  //   max:1
  // } }));

  useEffect(() => {
    particles = {};
    particles.index = 0;
    // Positions
    const positions = model.scene.children.map((child) => {
      return child.geometry.attributes.position;
    });
    particles.maxCount = 0;
    for (const position of positions) {
      if (position.count > particles.maxCount) {
        particles.maxCount = position.count;
      }
    }

    particles.positions = [];
    for (const position of positions) {
      const originalArray = position.array;
      const newArray = new Float32Array(particles.maxCount * 3);

      for (let i = 0; i < particles.maxCount; i++) {
        const i3 = i * 3;

        if (i3 < originalArray.length) {
          newArray[i3 + 0] = originalArray[i3 + 0];
          newArray[i3 + 1] = originalArray[i3 + 1];
          newArray[i3 + 2] = originalArray[i3 + 2];
        } else {
          const randomIndex = Math.floor(position.count * Math.random()) * 3;
          newArray[i3 + 0] = originalArray[randomIndex + 0];
          newArray[i3 + 1] = originalArray[randomIndex + 1];
          newArray[i3 + 2] = originalArray[randomIndex + 2];
        }
      }

      particles.positions.push(new THREE.Float32BufferAttribute(newArray, 3));
    }

    // Geometry
    particles.geometry = new THREE.BufferGeometry();
    particles.geometry.setAttribute("position", particles.positions[0]);
    particles.geometry.setAttribute("aPositionTarget", particles.positions[3]);
    // particles.geometry.setIndex(null)

    // Material
    particles.material = new THREE.ShaderMaterial({
      vertexShader: particlesVertexShader,
      fragmentShader: particlesFragmentShader,
      // transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uSize: new THREE.Uniform(0.1),
        uResolution: new THREE.Uniform(
          new THREE.Vector2(
            sizes.width * sizes.pixelRatio,
            sizes.height * sizes.pixelRatio
          )
        ),
        uProgress: new THREE.Uniform(0),
      },
    });

    // Points
    particles.points = new THREE.Points(particles.geometry, particles.material);

    setParticlesObj(particles);
  }, []);

  return (
    <animated.group scale={scale}>
      {particlesObj.points && <primitive object={particlesObj.points} />}
      {/* <primitive object={model.scene} /> */}
    </animated.group>
  );
}

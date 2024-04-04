import React from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import Overlay from "./components/Overlay";
import { AppContextProvider } from "./context/store";
import { Leva } from "leva";

export const LevelContext = React.createContext();

export default function CanvasContent() {
  return (
    <>
      <Canvas
        shadows
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [4, 2, 25],
        }}
        style={{ pointerEvents: "none" }} // Désactive les événements de la souris
      >
        <Scene />
      </Canvas>
      <Overlay />
      <Leva />
    </>
  );
}

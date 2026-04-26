import { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, PerspectiveCamera } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import axios from "axios";

// Component Imports
import DigitalCore from "./components/DigitalCore";
import Satellite from "./components/Satellite";

// 1. SILICON UI VARIANTS
const containerVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, staggerChildren: 0.1, ease: "easeOut" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  // 2. SMOOTH SCROLL INITIALIZATION
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // 3. SECURE DATA FETCHING
  useEffect(() => {
    const controller = new AbortController();
    axios
      .get("http://127.0.0.1:8000/stats/KrishKamra", {
        signal: controller.signal,
      })
      .then((res) => setData(res.data))
      .catch((err) => {
        if (!axios.isCancel(err)) {
          console.error("Engine Sync Failed:", err);
          setError(true);
        }
      });
    return () => controller.abort();
  }, []);

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#050505",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* 3D CANVAS LAYER */}
      <Canvas
        shadows
        dpr={[1, 2]}
        // alpha: true is critical when using Post-Processing over a CSS background
        gl={{ antialias: false, alpha: true, stencil: false, depth: true }}
        style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[3, 0, 12]} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />

          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} color="#00ffcc" intensity={2} />
          <spotLight
            position={[-10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
          />

          <Stars
            radius={100}
            depth={50}
            count={6000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />

          {/* Logic: EffectComposer must wrap the objects or sit at the same level */}
          <EffectComposer disableNormalPass multisampling={4}>
            <Bloom
              luminanceThreshold={1}
              mipmapBlur
              intensity={1.5}
              radius={0.4}
            />
            <Noise opacity={0.05} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>

          <group>
            {/* Render Core */}
            {data?.user && <DigitalCore stats={data} />}

            {/* Render Satellites with Null Safety */}
            {data?.repos?.map((repo, index) => (
              <Satellite
                key={repo.id || `repo-${index}`}
                repo={repo}
                index={index}
                total={data.repos.length}
              />
            ))}
          </group>
        </Suspense>
      </Canvas>

      {/* 4. ELITE UI OVERLAY */}
      <AnimatePresence>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            position: "absolute",
            top: 60,
            left: 60,
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <motion.h1
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              margin: 0,
              color: "white",
              fontWeight: 500,
            }}
          >
            GITLENS<span style={{ color: "#00ffcc" }}>-3D</span>
          </motion.h1>

          <motion.div variants={itemVariants} style={{ marginTop: "1rem" }}>
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "0.8rem",
                letterSpacing: "2px",
                fontFamily: "monospace",
              }}
            >
              SYSTEM_STATUS:{" "}
              {error ? (
                <span style={{ color: "#ff4444" }}>CRITICAL_FAILURE</span>
              ) : (
                <span style={{ color: "#00ffcc" }}>
                  {data ? "SYNCED" : "INITIALIZING..."}
                </span>
              )}
            </p>
          </motion.div>

          {data?.user && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} style={{ marginTop: "2rem" }}>
                <p
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 300,
                    color: "white",
                  }}
                >
                  NODE: {data?.user?.name?.toUpperCase() ?? "KRISH_KAMRA"}
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "0.9rem",
                    maxWidth: "350px",
                  }}
                >
                  {data?.user?.bio ??
                    "Silicon-to-Software mastery in progress."}
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                style={{
                  height: "2px",
                  width: "150px",
                  background: "#00ffcc",
                  marginTop: "1.5rem",
                  boxShadow: "0 0 15px #00ffcc",
                }}
              />

              <motion.p
                variants={itemVariants}
                style={{
                  marginTop: "1rem",
                  fontSize: "0.7rem",
                  opacity: 0.4,
                  color: "white",
                  fontFamily: "monospace",
                }}
              >
                LATENCY: 14MS // SECTOR: {data?.repos?.length ?? 0} REPOS FOUND
              </motion.p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

export default App;

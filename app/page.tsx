"use client";

import React, { useRef, useMemo, Suspense } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Stars,
  OrbitControls,
  QuadraticBezierLine,
} from "@react-three/drei";
import * as THREE from "three";
import {
  ArrowRight,
  Leaf,
  ShieldCheck,
  FileText,
  BarChart3,
  Clock,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface TravelArcProps {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}

interface Feature {
  span: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}


const TravelArc: React.FC<TravelArcProps> = ({ start, end, color }) => {
  return (
    <QuadraticBezierLine
      start={start}
      end={end}
      mid={[
        ((start[0] + end[0]) / 2) * 1.5,
        ((start[1] + end[1]) / 2) * 1.5,
        ((start[2] + end[2]) / 2) * 1.5,
      ]}
      color={color}
      lineWidth={1}
      transparent
      opacity={0.4}
    />
  );
};

const InteractiveGlobe: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const globeRef = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();

  const points: [number, number, number][] = useMemo(
    () => [
      [1.5, 0.5, 1], // Mindoro
      [1.2, 1.2, -0.5], // Marinduque
      [0.5, -1.2, 1.5], // Romblon
      [-1.5, -1, 1], // Palawan
      [0, 1.8, 0], // Regional Office
    ],
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (globeRef.current) globeRef.current.rotation.y = t * 0.1;
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouse.y * 0.2,
        0.05
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouse.x * 0.2,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef}>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
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

      <mesh ref={globeRef}>
        <icosahedronGeometry args={[2.2, 12]} />
        <meshStandardMaterial
          color="#10b981"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color="#065f46"
          transparent
          opacity={0.2}
          emissive="#10b981"
          emissiveIntensity={0.5}
        />
      </mesh>

      {points.map((p, i) => (
        <group key={i}>
          <Float speed={2} rotationIntensity={0.5}>
            <mesh position={p}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshBasicMaterial color="#34d399" />
              <pointLight color="#34d399" intensity={2} distance={2} />
            </mesh>
          </Float>
          {i < points.length - 1 && (
            <TravelArc start={p} end={points[i + 1]} color="#10b981" />
          )}
        </group>
      ))}
    </group>
  );
};

// --- UI Logic ---

const transition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] };

const features: Feature[] = [
  {
    span: "md:col-span-7",
    icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
    title: "COA Compliance",
    description:
      "Automated checks against Commission on Audit travel guidelines. Pre-travel authority and per diem computation built in.",
  },
  {
    span: "md:col-span-5",
    icon: <FileText className="w-5 h-5 text-emerald-500" />,
    title: "Digital Processing",
    description:
      "Paperless travel order creation, routing, and multi-level approval workflows.",
  },
  {
    span: "md:col-span-4",
    icon: <Clock className="w-5 h-5 text-emerald-500" />,
    title: "Approval Tracking",
    description: "Real-time status from division head to Regional Director.",
  },
  {
    span: "md:col-span-4",
    icon: <Users className="w-5 h-5 text-emerald-500" />,
    title: "Multi-Division",
    description:
      "Operations, Admin, Finance, and Field Office units in one system.",
  },
  {
    span: "md:col-span-4",
    icon: <BarChart3 className="w-5 h-5 text-emerald-500" />,
    title: "Travel Analytics",
    description: "Track expenses, frequency, and fund utilization per office.",
  },
];

const Navbar: React.FC = () => (
  <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
          <Leaf className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-white tracking-tight">
            TravelOrder
          </span>
          <span className="text-[10px] text-zinc-400 leading-tight font-medium uppercase">
            DA MIMAROPA
          </span>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-8">
        {["Dashboard", "Orders", "Reports"].map((item) => (
          <a
            key={item}
            href="#"
            className="text-[13px] font-medium text-zinc-400 hover:text-emerald-500 transition-colors"
          >
            {item}
          </a>
        ))}
      </div>
      <Button
        variant="default"
        className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-9 px-5"
      >
      </Button>
    </div>
  </nav>
);

const HeroSection: React.FC = () => (
  <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-black">
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#10b981" />
        <Suspense fallback={null}>
          <InteractiveGlobe />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-90 pointer-events-none" />
    </div>

    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 pointer-events-none">
      <div className="lg:col-span-7 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          //@ts-ignore
          transition={transition}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-md mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-500 font-bold">
            System Online • 2026
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          //@ts-ignore
          transition={{ ...transition, delay: 0.1 }}
          className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.85] mb-8 text-white"
        >
          Travel Order <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
            Management
          </span>
          <br />
          <span className="text-zinc-600 font-semibold text-5xl tracking-tight">
            System.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          //@ts-ignore
          transition={{ ...transition, delay: 0.2 }}
          className="text-xl text-zinc-400 max-w-xl mb-10 leading-relaxed"
        >
          Streamlining logistics for the Department of Agriculture MIMAROPA across
          Mindoro, Marinduque, Romblon, and Palawan.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          //@ts-ignore
          transition={{ ...transition, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <Button
            size="lg"
            className="h-14 px-8 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-lg font-bold shadow-xl shadow-emerald-900/20 group border-none"
          >
            Access Portal{" "}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-14 px-8 border-zinc-800 bg-transparent hover:bg-zinc-900 rounded-2xl text-zinc-300 font-semibold"
          >
            View Guidelines
          </Button>
        </motion.div>
      </div>
    </div>
  </section>
);

const FeaturesGrid: React.FC = () => (
  <section className="max-w-7xl mx-auto px-6 py-32">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {features.map((f, i) => (
        <motion.div
          key={f.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className={f.span}
        >
          <Card className="h-full bg-zinc-900/40 border-zinc-800 hover:border-emerald-500/30 transition-all duration-500 group overflow-hidden relative">
            <CardContent className="p-8">
              <div className="mb-6 p-3 w-fit rounded-2xl bg-emerald-500/10 border border-emerald-500/10">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{f.title}</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                {f.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </section>
);

const Footer: React.FC = () => (
  <footer className="border-t border-zinc-900 bg-black py-20">
    <div className="max-w-7xl mx-auto px-6 text-center">
      <div className="flex justify-center items-center gap-3 mb-6">
        <Leaf className="w-6 h-6 text-emerald-500" />
        <span className="font-bold text-xl text-white tracking-tight">
          TravelOrder
        </span>
      </div>
      <p className="text-zinc-500 text-sm max-w-md mx-auto leading-relaxed">
        Department of Agriculture — MIMAROPA Region IV-B. <br />
        Modernizing agricultural logistics through digital excellence.
      </p>
      <Separator className="my-12 bg-zinc-900" />
      <div className="text-zinc-600 text-[10px] uppercase tracking-widest font-medium">
        © 2026 DA-MIMAROPA • Official Government Portal
      </div>
    </div>
  </footer>
);

export default function TravelOrderLanding() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans antialiased">
      <Navbar />
      <HeroSection />
      <FeaturesGrid />
      <Footer />
    </div>
  );
}
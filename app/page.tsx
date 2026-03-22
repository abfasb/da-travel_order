"use client";

import React, { useRef, useMemo, Suspense } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Stars,
  OrbitControls,
  QuadraticBezierLine,
  Sphere,
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

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// --- 3D Elements ---

interface TravelArcProps {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}

const TravelArc: React.FC<TravelArcProps> = ({ start, end, color }) => {
  return (
    <QuadraticBezierLine
      start={start}
      end={end}
      mid={[
        ((start[0] + end[0]) / 2) * 1.2,
        ((start[1] + end[1]) / 2) * 1.2,
        ((start[2] + end[2]) / 2) * 1.2,
      ]}
      color={color}
      lineWidth={1.5}
      transparent
      opacity={0.6}
    />
  );
};

const ProfessionalGlobe: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  // MIMAROPA Coordinates mapped to a 3D sphere
  const points: [number, number, number][] = useMemo(
    () => [
      [1.8, 0.6, 1.2], // Mindoro
      [1.4, 1.4, -0.6], // Marinduque
      [0.6, -1.4, 1.8], // Romblon
      [-1.8, -1.2, 1.2], // Palawan
      [0, 2.2, 0], // Regional Office
    ],
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Smooth, slow rotation
      groupRef.current.rotation.y = t * 0.05;
      
      // Subtle mouse parallax
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouse.y * 0.1,
        0.05
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        mouse.x * 0.1,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef}>
      <OrbitControls enableZoom={false} enablePan={false} />
      
      <Stars radius={100} depth={50} count={4000} factor={3} saturation={0} fade speed={0.5} />

      {/* Core Solid Planet */}
      <Sphere args={[2, 64, 64]}>
        <meshStandardMaterial
          color="#022c22"
          roughness={0.8}
          metalness={0.2}
        />
      </Sphere>

      {/* Atmospheric Glow */}
      <Sphere args={[2.15, 32, 32]}>
        <meshBasicMaterial
          color="#059669"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Data Nodes & Arcs */}
      {points.map((p, i) => (
        <group key={i}>
          <Float speed={3} rotationIntensity={0.2} floatIntensity={0.5}>
            <mesh position={p}>
              <sphereGeometry args={[0.08, 24, 24]} />
              <meshStandardMaterial
                color="#34d399"
                emissive="#10b981"
                emissiveIntensity={2}
                toneMapped={false}
              />
              {/* Node Glow Effect */}
              <pointLight color="#10b981" intensity={1.5} distance={3} />
            </mesh>
            
            {/* Pulsing ring around nodes */}
            <mesh position={p}>
              <ringGeometry args={[0.12, 0.14, 32]} />
              <meshBasicMaterial color="#34d399" transparent opacity={0.4} side={THREE.DoubleSide} />
            </mesh>
          </Float>
          
          {i < points.length - 1 && (
            <TravelArc start={p} end={points[i + 1]} color="#34d399" />
          )}
          {/* Connect back to Regional Office */}
          {i === points.length - 1 && (
            <TravelArc start={p} end={points[0]} color="#059669" />
          )}
        </group>
      ))}
    </group>
  );
};

// --- UI Logic ---

const transition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] };

const features = [
  {
    span: "md:col-span-7",
    icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
    title: "COA Compliance Protocol",
    description: "Automated checks against Commission on Audit travel guidelines. Pre-travel authority and per diem computation built natively into the engine.",
  },
  {
    span: "md:col-span-5",
    icon: <FileText className="w-6 h-6 text-emerald-400" />,
    title: "Paperless Processing",
    description: "Instant travel order creation, intelligent routing, and cryptographic multi-level approval workflows.",
  },
  {
    span: "md:col-span-4",
    icon: <Clock className="w-6 h-6 text-emerald-400" />,
    title: "Live Tracking",
    description: "Real-time telemetry and status monitoring from division head to the Regional Director.",
  },
  {
    span: "md:col-span-4",
    icon: <Users className="w-6 h-6 text-emerald-400" />,
    title: "Unified Command",
    description: "Operations, Admin, Finance, and Field Office units synced in one centralized ecosystem.",
  },
  {
    span: "md:col-span-4",
    icon: <BarChart3 className="w-6 h-6 text-emerald-400" />,
    title: "Fund Analytics",
    description: "Granular tracking of expenses, deployment frequency, and fund utilization per office.",
  },
];

const Navbar: React.FC = () => (
  <nav className="fixed top-0 w-full z-50 border-b border-white/[0.05] bg-black/50 backdrop-blur-2xl">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-4 hover:opacity-80 transition-opacity cursor-pointer">
        <div className="relative w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <Leaf className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-base text-white tracking-tight">TravelOrder</span>
          <span className="text-[11px] text-emerald-500/80 font-bold uppercase tracking-widest">DA MIMAROPA</span>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-10">
        {["Dashboard", "Orders", "Reports"].map((item) => (
          <a
            key={item}
            href="#"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            {item}
          </a>
        ))}
      </div>
      <Button className="hidden md:flex bg-white text-black hover:bg-zinc-200 rounded-lg h-10 px-6 font-semibold transition-all">
        Sign In
      </Button>
    </div>
  </nav>
);

const HeroSection: React.FC = () => (
  <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-[#020202]">
    {/* 3D Background */}
    <div className="absolute inset-0 z-0 opacity-80">
      <Canvas camera={{ position: [0, 0, 7], fov: 40 }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#10b981" />
        <Suspense fallback={null}>
          <ProfessionalGlobe />
        </Suspense>
      </Canvas>
      {/* Vignetee effect to ensure text readability */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020202_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-[#020202]/50 to-transparent w-1/2 pointer-events-none" />
    </div>

    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 pointer-events-none w-full">
      <div className="lg:col-span-8 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          // @ts-ignore
          transition={transition}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-emerald-400 font-semibold">
            System Operational
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          // @ts-ignore
          transition={{ ...transition, delay: 0.1 }}
          className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8 text-white"
        >
          Travel Order <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 to-emerald-700">
            Management
          </span>
          <br />
          <span className="text-zinc-600 font-bold tracking-tight">System.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          // @ts-ignore
          transition={{ ...transition, delay: 0.2 }}
          className="text-lg md:text-xl text-zinc-400 max-w-xl mb-12 leading-relaxed font-light"
        >
          Modernizing logistics and automated approvals for the Department of Agriculture MIMAROPA across Mindoro, Marinduque, Romblon, and Palawan.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          // @ts-ignore
          transition={{ ...transition, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <Button
            size="lg"
            className="h-14 px-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-base font-bold shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all group border-none"
          >
            Access Portal
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-14 px-8 border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-800 hover:text-white rounded-xl text-zinc-300 font-semibold transition-all"
          >
            View Guidelines
          </Button>
        </motion.div>
      </div>
    </div>
  </section>
);

const FeaturesGrid: React.FC = () => (
  <section className="bg-[#020202] py-32 relative z-10 border-t border-white/[0.02]">
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">Platform Capabilities</h2>
        <p className="text-zinc-400 max-w-2xl text-lg">Engineered for security, compliance, and speed across regional operations.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className={f.span}
          >
            <Card className="h-full bg-zinc-900/30 border-white/[0.05] hover:border-emerald-500/50 hover:bg-zinc-900/60 transition-all duration-300 group overflow-hidden relative rounded-2xl">
              {/* Subtle hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardContent className="p-8 relative z-10">
                <div className="mb-6 p-4 w-fit rounded-xl bg-black/50 border border-white/[0.05] shadow-inner">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-zinc-100 group-hover:text-white transition-colors">{f.title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm group-hover:text-zinc-400 transition-colors">
                  {f.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Footer: React.FC = () => (
  <footer className="border-t border-white/[0.05] bg-[#020202] py-16">
    <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
      <div className="flex justify-center items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <Leaf className="w-5 h-5 text-emerald-500" />
        </div>
        <span className="font-bold text-xl text-white tracking-tight">
          TravelOrder
        </span>
      </div>
      <p className="text-zinc-500 text-sm max-w-md leading-relaxed">
        Department of Agriculture — MIMAROPA Region IV-B. <br />
        Modernizing agricultural logistics through digital excellence.
      </p>
      <Separator className="my-10 bg-white/[0.05] w-full max-w-2xl" />
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-2xl text-zinc-600 text-[11px] uppercase tracking-widest font-semibold">
        <span>© 2026 DA-MIMAROPA</span>
        <span>Official Government Portal</span>
      </div>
    </div>
  </footer>
);

export default function TravelOrderLanding() {
  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-emerald-500/30 font-sans antialiased">
      <Navbar />
      <HeroSection />
      <FeaturesGrid />
      <Footer />
    </div>
  );
}
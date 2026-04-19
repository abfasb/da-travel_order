"use client";

import React, { useRef, useMemo, Suspense, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, OrbitControls, QuadraticBezierLine, Sphere } from "@react-three/drei";
import * as THREE from "three";
import {
  ArrowRight,
  Leaf,
  ShieldCheck,
  FileText,
  BarChart3,
  Clock,
  Users,
  ChevronRight,
  CheckCircle2,
  Globe2,
  Lock,
  Zap,
  ArrowUpRight,
  Menu,
  X,
  Building2,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

// ─── Types ─────────────────────────────────────────────────────────────────

interface TravelArcProps {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  opacity?: number;
}

// ─── 3D Globe ──────────────────────────────────────────────────────────────

const TravelArc: React.FC<TravelArcProps> = ({ start, end, color, opacity = 0.5 }) => (
  <QuadraticBezierLine
    start={start}
    end={end}
    mid={[
      ((start[0] + end[0]) / 2) * 1.3,
      ((start[1] + end[1]) / 2) * 1.3,
      ((start[2] + end[2]) / 2) * 1.3,
    ]}
    color={color}
    lineWidth={1}
    transparent
    opacity={opacity}
  />
);

const ProfessionalGlobe: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  const points: [number, number, number][] = useMemo(() => [
    [1.8, 0.6, 1.2],
    [1.4, 1.4, -0.6],
    [0.6, -1.4, 1.8],
    [-1.8, -1.2, 1.2],
    [0, 2.2, 0],
  ], []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.04;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.y * 0.08, 0.04);
    }
  });

  return (
    <group ref={groupRef}>
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      <Stars radius={120} depth={60} count={3000} factor={2.5} saturation={0} fade speed={0.3} />

      {/* Grid lines overlay */}
      <Sphere args={[2.02, 32, 16]}>
        <meshBasicMaterial color="#16a34a" transparent opacity={0.04} wireframe />
      </Sphere>

      <Sphere args={[2, 64, 64]}>
        <meshStandardMaterial color="#030712" roughness={0.9} metalness={0.1} />
      </Sphere>

      <Sphere args={[2.12, 32, 32]}>
        <meshBasicMaterial color="#16a34a" transparent opacity={0.06} side={THREE.BackSide} />
      </Sphere>

      {points.map((p, i) => (
        <group key={i}>
          <mesh position={p}>
            <sphereGeometry args={[0.065, 24, 24]} />
            <meshStandardMaterial color="#4ade80" emissive="#16a34a" emissiveIntensity={3} toneMapped={false} />
            <pointLight color="#16a34a" intensity={1.2} distance={2.5} />
          </mesh>
          {i < points.length - 1 && <TravelArc start={p} end={points[i + 1]} color="#4ade80" opacity={0.35} />}
          {i === points.length - 1 && <TravelArc start={p} end={points[0]} color="#16a34a" opacity={0.25} />}
        </group>
      ))}
    </group>
  );
};

// ─── Animation Variants ────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] } }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({ opacity: 1, transition: { duration: 0.6, delay } }),
};

// ─── Announcement Bar ──────────────────────────────────────────────────────

const AnnouncementBar: React.FC = () => (
  <div className="w-full bg-green-950/80 border-b border-green-800/40 backdrop-blur-sm py-2.5 px-6 flex items-center justify-center gap-3 z-50 relative">
    <span className="flex h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
    <p className="text-[11px] font-semibold tracking-widest uppercase text-green-300/90 text-center">
      DA-MIMAROPA Digital Transformation Initiative — Travel Order System v2.0 Now Live
    </p>
    <ArrowUpRight className="w-3 h-3 text-green-400 shrink-0" />
  </div>
);

// ─── Navbar ────────────────────────────────────────────────────────────────

const Navbar: React.FC = () => {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = ["Features", "Workflow", "Compliance", "Support"];

  return (
    <nav className={`fixed top-8 w-full z-40 transition-all duration-500 ${scrolled ? "bg-black/80 border-b border-white/[0.06] backdrop-blur-2xl shadow-2xl shadow-black/50" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-900/40 group-hover:bg-green-500 transition-colors">
            <Leaf className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <div className="text-[13px] font-black text-white tracking-tight leading-none">TravelOrder</div>
            <div className="text-[9px] text-green-500 font-bold uppercase tracking-[0.25em] leading-tight">DA · MIMAROPA</div>
          </div>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <a key={item} href="#" className="text-[13px] font-medium text-zinc-400 hover:text-white transition-colors duration-200 tracking-wide">
              {item}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" onClick={() => router.push("/login")} className="text-[13px] text-zinc-400 hover:text-white h-9 px-4 font-medium">
            Sign In
          </Button>
          <Button onClick={() => router.push("/login")} className="h-9 px-5 bg-green-600 hover:bg-green-500 text-white text-[13px] font-semibold rounded-lg shadow-lg shadow-green-900/30 border-0 transition-all">
            Request Access
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-zinc-400 hover:text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/[0.06] bg-black/95 backdrop-blur-2xl px-6 pb-6"
          >
            <div className="flex flex-col gap-4 pt-6">
              {navLinks.map((item) => (
                <a key={item} href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                  {item}
                </a>
              ))}
              <Separator className="bg-white/[0.06]" />
              <Button onClick={() => router.push("/login")} className="bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg border-0">
                Request Access
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// ─── Hero ──────────────────────────────────────────────────────────────────

const HeroSection: React.FC = () => {
  const router = useRouter();

  const trustBadges = [
    { icon: <ShieldCheck className="w-3.5 h-3.5" />, label: "COA Compliant" },
    { icon: <Lock className="w-3.5 h-3.5" />, label: "DICT Certified" },
    { icon: <Globe2 className="w-3.5 h-3.5" />, label: "MIMAROPA-Wide" },
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-32 pb-20 overflow-hidden bg-[#030712]">
      {/* 3D Globe */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 7], fov: 42 }}>
          <ambientLight intensity={0.15} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#16a34a" />
          <Suspense fallback={null}>
            <ProfessionalGlobe />
          </Suspense>
        </Canvas>
        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_50%,transparent_0%,#030712_70%)]" />
        {/* Left mask for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-[#030712]/75 to-transparent" style={{ width: "65%" }} />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#030712] to-transparent" />
      </div>

      {/* Subtle grid texture */}
      <div className="absolute inset-0 z-0 opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="max-w-2xl">
          {/* Status badge */}
          <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible" className="flex items-center gap-2 mb-8">
            <Badge className="bg-green-950 border-green-800/60 text-green-400 text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-md hover:bg-green-950">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse mr-2 inline-block" />
              All Systems Operational
            </Badge>
            <Badge variant="outline" className="border-zinc-800 text-zinc-500 text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-md font-semibold">
              Version 2.0
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.div variants={fadeUp} custom={0.1} initial="hidden" animate="visible">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.92] tracking-tight mb-6 text-white">
              Government
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                Travel Order
              </span>
              <span className="block text-zinc-500 font-semibold text-4xl md:text-5xl lg:text-6xl mt-1">
                Management System
              </span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p variants={fadeUp} custom={0.2} initial="hidden" animate="visible"
            className="text-base md:text-lg text-zinc-400 leading-relaxed mb-10 max-w-xl font-light">
            A centralized digital platform engineered for the Department of Agriculture MIMAROPA — automating travel authorities, approval workflows, and fund disbursement across all provincial offices.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} custom={0.3} initial="hidden" animate="visible" className="flex flex-wrap items-center gap-3 mb-10">
            <Button onClick={() => router.push("/login")} size="lg"
              className="h-12 px-7 bg-green-600 hover:bg-green-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-green-900/40 border-0 transition-all group">
              Access Portal
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <Button size="lg" variant="outline"
              className="h-12 px-7 border-zinc-700/60 bg-white/[0.03] hover:bg-white/[0.07] text-zinc-300 hover:text-white font-semibold text-sm rounded-xl transition-all backdrop-blur-sm">
              View Documentation
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div variants={fadeIn} custom={0.5} initial="hidden" animate="visible" className="flex items-center gap-5 flex-wrap">
            {trustBadges.map((b) => (
              <div key={b.label} className="flex items-center gap-2 text-zinc-500">
                <span className="text-green-600">{b.icon}</span>
                <span className="text-[11px] font-semibold uppercase tracking-widest">{b.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── Metrics Bar ───────────────────────────────────────────────────────────

const stats = [
  { value: "1,240+", label: "Travel Orders Processed", icon: <FileText className="w-4 h-4" /> },
  { value: "5", label: "Provinces Connected", icon: <Globe2 className="w-4 h-4" /> },
  { value: "98.6%", label: "Approval Accuracy", icon: <CheckCircle2 className="w-4 h-4" /> },
  { value: "72 hrs", label: "Average Processing Time", icon: <Clock className="w-4 h-4" /> },
];

const MetricsBar: React.FC = () => (
  <section className="bg-[#030712] border-y border-white/[0.05] relative z-10">
    <div className="max-w-7xl mx-auto px-6 py-0">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/[0.05]">
        {stats.map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="flex flex-col items-center justify-center py-10 px-6 gap-2 group hover:bg-white/[0.02] transition-colors"
          >
            <div className="text-green-600 mb-1">{s.icon}</div>
            <div className="text-3xl font-black text-white tracking-tight">{s.value}</div>
            <div className="text-[11px] text-zinc-500 font-semibold uppercase tracking-widest text-center">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Features Grid ─────────────────────────────────────────────────────────

const features = [
  {
    span: "md:col-span-8",
    number: "01",
    icon: <ShieldCheck className="w-5 h-5 text-green-400" />,
    title: "COA Compliance Engine",
    description: "Built-in automated validation against Commission on Audit travel guidelines. Pre-travel authority computation, per diem schedule adherence, and fund availability checks are enforced at every submission stage — before a single peso is committed.",
    tags: ["COA RA 9184", "Auto-validation", "Per Diem Calculator"],
  },
  {
    span: "md:col-span-4",
    number: "02",
    icon: <FileText className="w-5 h-5 text-green-400" />,
    title: "Paperless Travel Orders",
    description: "Digital form generation, structured routing, and cryptographic e-signatures replace manual paper trails entirely.",
    tags: ["E-signature", "Auto-routing"],
  },
  {
    span: "md:col-span-4",
    number: "03",
    icon: <Clock className="w-5 h-5 text-green-400" />,
    title: "Real-Time Status Tracking",
    description: "Live approval telemetry visible to both the requestor and all approving officers — no more chasing signatures.",
    tags: ["Live Updates", "Notifications"],
  },
  {
    span: "md:col-span-4",
    number: "04",
    icon: <Users className="w-5 h-5 text-green-400" />,
    title: "Unified Command Center",
    description: "Operations, Admin, Finance, and all Field Offices operate within a single governed ecosystem with role-based access.",
    tags: ["RBAC", "Multi-office"],
  },
  {
    span: "md:col-span-4",
    number: "05",
    icon: <BarChart3 className="w-5 h-5 text-green-400" />,
    title: "Fund Utilization Analytics",
    description: "Granular dashboards tracking expenditure per office, deployment frequency, and budget absorption rates at fiscal year end.",
    tags: ["Dashboards", "Export to PDF"],
  },
];

const FeaturesGrid: React.FC = () => (
  <section className="bg-[#030712] py-32 relative z-10">
    <div className="max-w-7xl mx-auto px-6">
      {/* Section header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-green-600 mb-4">Platform Capabilities</p>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight max-w-sm">
            Everything your office needs. Nothing it doesn't.
          </h2>
        </div>
        <p className="text-zinc-500 max-w-xs text-sm leading-relaxed">
          Designed from the ground up for Philippine government travel operations — not adapted from generic SaaS.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {features.map((f, i) => (
          <motion.div key={f.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className={f.span}
          >
            <div className="h-full rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-green-800/50 transition-all duration-300 group p-8 relative overflow-hidden">
              {/* Number watermark */}
              <div className="absolute top-6 right-8 text-7xl font-black text-white/[0.03] select-none leading-none">
                {f.number}
              </div>
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-green-950/80 border border-green-900/50 flex items-center justify-center mb-6 group-hover:bg-green-900/50 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-[15px] font-bold text-zinc-100 mb-3 tracking-tight">{f.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-6 group-hover:text-zinc-400 transition-colors">
                  {f.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {f.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border border-white/[0.06] text-zinc-500 bg-white/[0.02]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Workflow Section ──────────────────────────────────────────────────────

const workflowSteps = [
  {
    step: "01",
    title: "Submit Travel Request",
    description: "Personnel file a travel request with destination, purpose, itinerary, and projected expenses. The system auto-computes per diem entitlements based on CSC and DBM rates.",
    role: "Field Personnel",
    color: "green",
  },
  {
    step: "02",
    title: "Multi-Level Approval",
    description: "Requests route automatically — Division Chief, Admin Officer, Budget Officer, and Regional Director are notified in sequence. Approvals are timestamped and audit-logged.",
    role: "Approving Officers",
    color: "emerald",
  },
  {
    step: "03",
    title: "Travel Order Issuance",
    description: "Upon full approval, a COA-compliant Travel Order is generated, digitally signed, and stored. Liquidation deadlines are tracked automatically post-travel.",
    role: "Admin & Finance",
    color: "teal",
  },
];

const WorkflowSection: React.FC = () => (
  <section className="bg-[#04090f] py-32 border-t border-white/[0.04]">
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-green-600 mb-4">How It Works</p>
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight max-w-lg leading-tight">
          From request to approval in 3 structured steps.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {/* Connector line */}
        <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-green-900/60 to-transparent" style={{ top: "2.5rem", left: "16.67%", right: "16.67%" }} />

        {workflowSteps.map((s, i) => (
          <motion.div key={s.step}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-8 h-full relative group hover:border-green-900/60 hover:bg-white/[0.03] transition-all duration-300">
              {/* Step number circle */}
              <div className="w-10 h-10 rounded-full border border-green-800/60 bg-green-950/50 flex items-center justify-center mb-8 text-[11px] font-black text-green-400 tracking-widest">
                {s.step}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-green-700 mb-3">{s.role}</p>
              <h3 className="text-lg font-bold text-white mb-4 tracking-tight">{s.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-zinc-400 transition-colors">
                {s.description}
              </p>
              {i < workflowSteps.length - 1 && (
                <ChevronRight className="hidden md:block absolute -right-3 top-10 w-6 h-6 text-green-900 z-10" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Compliance Section ────────────────────────────────────────────────────

const complianceItems = [
  "Commission on Audit (COA) Circular No. 2012-001",
  "Department of Budget and Management Travel Rate Guidelines",
  "Civil Service Commission Official Time Policies",
  "GSIS and PhilHealth Deduction Compliance",
  "RA 9184 — Government Procurement Reform Act",
  "Executive Order No. 77 — Official Travel Abroad",
];

const ComplianceSection: React.FC = () => (
  <section className="bg-[#030712] py-32 border-t border-white/[0.04]">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-green-600 mb-4">Regulatory Compliance</p>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-6">
            Built on government standards. Not bolted on.
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-10">
            Every feature in the system was designed with Philippine government regulatory frameworks at its core — not retrofitted. Your travel orders will always meet audit requirements.
          </p>
          <div className="space-y-3">
            {complianceItems.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                <span className="text-zinc-400 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
          <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-8 space-y-6">
            {/* Mock compliance score */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Compliance Score</p>
              <Badge className="bg-green-950 border-green-800/50 text-green-400 text-[10px] font-bold tracking-widest">EXCELLENT</Badge>
            </div>
            <div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-5xl font-black text-white">98</span>
                <span className="text-2xl font-black text-zinc-600 pb-1">/100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/[0.05] overflow-hidden">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-green-600 to-emerald-500"
                  initial={{ width: 0 }} whileInView={{ width: "98%" }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }} />
              </div>
            </div>

            <Separator className="bg-white/[0.05]" />

            {[
              { label: "COA Audit Readiness", score: "100%" },
              { label: "Fund Documentation", score: "97%" },
              { label: "Approval Chain Integrity", score: "100%" },
              { label: "Liquidation Compliance", score: "95%" },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">{r.label}</span>
                <span className="text-sm font-bold text-green-400">{r.score}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

// ─── CTA Section ───────────────────────────────────────────────────────────

const CTASection: React.FC = () => {
  const router = useRouter();
  return (
    <section className="bg-[#04090f] py-32 border-t border-white/[0.04]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <Badge className="bg-green-950 border-green-800/50 text-green-400 text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-md mb-8 hover:bg-green-950">
            Ready to Deploy
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
            Modernize your region's<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">travel management today.</span>
          </h2>
          <p className="text-zinc-400 text-base leading-relaxed mb-10 max-w-xl mx-auto">
            Join all DA-MIMAROPA offices now on the platform. Contact the Regional ICT Officer for onboarding and system access provisioning.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button onClick={() => router.push("/login")} size="lg"
              className="h-13 px-8 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-2xl shadow-green-900/40 border-0 group">
              Access the Portal
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <Button size="lg" variant="outline"
              className="h-13 px-8 border-zinc-700/60 bg-transparent hover:bg-white/[0.04] text-zinc-300 hover:text-white rounded-xl font-semibold">
              Contact ICT Support
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ─── Footer ────────────────────────────────────────────────────────────────

const Footer: React.FC = () => (
  <footer className="bg-[#020609] border-t border-white/[0.04]">
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand column */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-green-700 rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-[13px] font-black text-white">TravelOrder</div>
              <div className="text-[9px] text-green-600 font-bold uppercase tracking-[0.25em]">DA · MIMAROPA</div>
            </div>
          </div>
          <p className="text-zinc-600 text-xs leading-relaxed max-w-xs">
            Department of Agriculture — MIMAROPA Region IV-B. Official digital platform for travel order processing and approval management.
          </p>
          <div className="mt-6 flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-zinc-700" />
            <span className="text-[10px] text-zinc-700 font-semibold uppercase tracking-widest">Official Government System</span>
          </div>
        </div>

        {/* Links */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-5">Platform</p>
          <div className="space-y-3">
            {["Dashboard", "Travel Orders", "Approval Workflow", "Reports & Analytics", "System Logs"].map((l) => (
              <a key={l} href="#" className="block text-xs text-zinc-500 hover:text-zinc-300 transition-colors">{l}</a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-5">Resources</p>
          <div className="space-y-3">
            {["COA Guidelines", "DBM Travel Rates", "User Manual", "ICT Support", "Privacy Policy"].map((l) => (
              <a key={l} href="#" className="block text-xs text-zinc-500 hover:text-zinc-300 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>

      <Separator className="bg-white/[0.04] mb-8" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[10px] text-zinc-700 font-semibold uppercase tracking-widest">
          © 2026 Department of Agriculture — MIMAROPA. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          {["Privacy", "Accessibility", "Terms of Use"].map((l) => (
            <a key={l} href="#" className="text-[10px] text-zinc-700 hover:text-zinc-500 font-semibold uppercase tracking-widest transition-colors">{l}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);


export default function TravelOrderLanding() {
  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-green-500/25 antialiased">
      <AnnouncementBar />
      <Navbar />
      <HeroSection />
      <MetricsBar />
      <FeaturesGrid />
      <WorkflowSection />
      <ComplianceSection />
      <CTASection />
      <Footer />
    </div>
  );
}
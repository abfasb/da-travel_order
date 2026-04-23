"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ArrowUpRight,
  Menu,
  X,
  Building2,
  TrendingUp,
  Calendar,
  User,
  MapPin,
  Briefcase,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay },
  }),
};

const AnnouncementBar: React.FC = () => (
  <div className="w-full bg-green-50 border-b border-green-200 py-2.5 px-6 flex items-center justify-center gap-3 z-50 relative">
    <span className="flex h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse" />
    <p className="text-[11px] font-bold tracking-widest uppercase text-green-800 text-center">
      DA-MIMAROPA Digital Transformation Initiative — Travel Order System Now Live
    </p>
    <ArrowUpRight className="w-3 h-3 text-green-700 shrink-0" />
  </div>
);

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
    <nav
      className={`fixed top-8 w-full z-40 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 border-b border-stone-200 backdrop-blur-xl shadow-sm shadow-black/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Department_of_Agriculture_of_the_Philippines.svg/1280px-Department_of_Agriculture_of_the_Philippines.svg.png"
            alt="TravelOrder Logo"
            className="w-9 h-9 rounded-lg"
          />
          <div>
            <div className="text-[13px] font-black text-stone-900 tracking-tight leading-none">
              TravelOrder
            </div>
            <div className="text-[9px] text-green-700 font-bold uppercase tracking-[0.25em] leading-tight">
              DA · MIMAROPA
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <a
              key={item}
              href="#"
              className="text-[13px] font-medium text-stone-500 hover:text-stone-900 transition-colors duration-200 tracking-wide"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => router.push("/login")}
            className="text-[13px] text-stone-500 hover:text-stone-900 h-9 px-4 font-medium hover:bg-stone-100"
          >
            Sign In
          </Button>
          <Button
            onClick={() => router.push("/registration")}
            className="h-9 px-5 bg-green-700 hover:bg-green-600 text-white text-[13px] font-semibold rounded-lg shadow-md shadow-green-800/20 border-0 transition-all"
          >
            Register
          </Button>
        </div>

        <button
          className="md:hidden text-stone-500 hover:text-stone-900"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-stone-200 bg-white/98 backdrop-blur-xl px-6 pb-6"
          >
            <div className="flex flex-col gap-4 pt-6">
              {navLinks.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
                >
                  {item}
                </a>
              ))}
              <Separator className="bg-stone-100" />
              <Button
                onClick={() => router.push("/login")}
                className="bg-green-700 hover:bg-green-600 text-white font-semibold rounded-lg border-0"
              >
                Request Access
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const HeroSection: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "recent">("overview");

  const trustBadges = [
    { icon: <ShieldCheck className="w-3.5 h-3.5" />, label: "COA Compliant" },
    { icon: <Lock className="w-3.5 h-3.5" />, label: "DICT Certified" },
    { icon: <Globe2 className="w-3.5 h-3.5" />, label: "MIMAROPA-Wide" },
  ];

  const provinces = [
    { name: "Oriental Mindoro", count: 342, color: "bg-emerald-100 text-emerald-700" },
    { name: "Occidental Mindoro", count: 218, color: "bg-green-100 text-green-700" },
    { name: "Marinduque", count: 156, color: "bg-teal-100 text-teal-700" },
    { name: "Romblon", count: 189, color: "bg-cyan-100 text-cyan-700" },
    { name: "Palawan", count: 421, color: "bg-sky-100 text-sky-700" },
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-[#FAFAF8]">
      <div
        className="absolute inset-0 z-0 opacity-[0.4]"
        style={{
          backgroundImage: "radial-gradient(circle, #d6d3d1 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-green-100/60 via-green-50/30 to-transparent rounded-full translate-x-1/3 -translate-y-1/4 z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAFAF8] to-transparent z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-6 xl:col-span-5">
          <motion.div
          /* @ts-ignore */
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-2 mb-8"
          >
            <Badge className="bg-green-100 border-green-300 text-green-800 text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-md hover:bg-green-100">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse mr-2 inline-block" />
              All Systems Operational
            </Badge>
          </motion.div>

{ /* @ts-ignore */}
          <motion.div variants={fadeUp} custom={0.1} initial="hidden" animate="visible">
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-[0.9] tracking-tight mb-6 text-stone-900">
              Government
              <span className="block text-transparent bg-clip-text bg-gradient-to-br from-green-600 to-green-800">
                Travel Order
              </span>
              <span className="block text-stone-400 font-semibold text-4xl md:text-5xl xl:text-6xl mt-1">
                Management System
              </span>
            </h1>
          </motion.div>

          <motion.p
          /* @ts-ignore */
            variants={fadeUp}
            custom={0.2}
            initial="hidden"
            animate="visible"
            className="text-base md:text-lg text-stone-500 leading-relaxed mb-10 max-w-lg font-light"
          >
            A centralized digital platform engineered for the Department of Agriculture MIMAROPA  automating travel authorities, approval workflows, and fund disbursement across all provincial offices.
          </motion.p>

          <motion.div
          /* @ts-ignore */
            variants={fadeUp}
            custom={0.3}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center gap-3 mb-10"
          >
            <Button
              onClick={() => router.push("/login")}
              size="lg"
              className="h-12 px-7 bg-green-700 hover:bg-green-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-green-800/25 border-0 transition-all group"
            >
              Access Portal
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-7 border-stone-300 bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-900 font-semibold text-sm rounded-xl transition-all shadow-sm"
            >
              View Documentation
            </Button>
          </motion.div>

          <motion.div
            variants={fadeIn}
            custom={0.5}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-6 flex-wrap"
          >
            {trustBadges.map((b) => (
              <div key={b.label} className="flex items-center gap-2 text-stone-400">
                <span className="text-green-700">{b.icon}</span>
                <span className="text-[11px] font-bold uppercase tracking-widest">{b.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
 /* @ts-ignore */
          variants={fadeUp}
          custom={0.2}
          initial="hidden"
          animate="visible"
          className="lg:col-span-6 xl:col-span-7 relative"
        >
          <div className="relative rounded-2xl bg-white border border-stone-200/80 shadow-2xl shadow-black/5 overflow-hidden backdrop-blur-sm">
            {/* Header with tabs */}
            <div className="border-b border-stone-100 px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-green-700" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-stone-900 tracking-tight">
                    Regional Command Center
                  </h3>
                  <p className="text-[9px] text-stone-400 font-medium uppercase tracking-wider">
                    MIMAROPA Travel Operations
                  </p>
                </div>
              </div>
              <div className="flex gap-1 bg-stone-100 p-0.5 rounded-lg">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                    activeTab === "overview"
                      ? "bg-white text-stone-800 shadow-sm"
                      : "text-stone-500 hover:text-stone-700"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("recent")}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                    activeTab === "recent"
                      ? "bg-white text-stone-800 shadow-sm"
                      : "text-stone-500 hover:text-stone-700"
                  }`}
                >
                  Recent Orders
                </button>
              </div>
            </div>

            {/* Content based on active tab */}
            <div className="p-5">
              {activeTab === "overview" ? (
                <div className="space-y-4">
                  {/* Mini stats row */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Total Orders", value: "1,426", change: "+12%", icon: FileText },
                      { label: "Pending", value: "38", change: "-5%", icon: Clock },
                      { label: "Approved", value: "1,388", change: "+18%", icon: CheckCircle2 },
                    ].map((stat, i) => (
                      <div key={i} className="bg-stone-50 rounded-lg p-3 border border-stone-100">
                        <div className="flex items-center gap-1.5 mb-1">
                          <stat.icon className="w-3 h-3 text-green-600" />
                          <span className="text-[9px] font-medium text-stone-500">{stat.label}</span>
                        </div>
                        <div className="text-lg font-black text-stone-900">{stat.value}</div>
                        <span className="text-[9px] font-bold text-green-600">{stat.change}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-stone-50 rounded-lg p-4 border border-stone-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                        Approval Pipeline
                      </span>
                      <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        98% Complete
                      </span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { step: "APCO", status: "approved", date: "Apr 22" },
                        { step: "Chief Agriculturist", status: "approved", date: "Apr 22" },
                        { step: "Chief Administrative", status: "approved", date: "Apr 23" },
                        { step: "Regional Director", status: "pending", date: "Pending" },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              item.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {item.status === "approved" ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : (
                              <Clock className="w-3 h-3" />
                            )}
                          </div>
                          <span className="text-xs font-medium text-stone-700 flex-1">{item.step}</span>
                          <span className="text-[9px] text-stone-400">{item.date}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "75%" }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Province distribution */}
                  <div className="flex flex-wrap gap-1.5">
                    {provinces.map((p) => (
                      <Badge
                        key={p.name}
                        className={`${p.color} border-0 text-[9px] font-bold px-2.5 py-1`}
                      >
                        {p.name} ({p.count})
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Recent travel orders list */}
                  {[
                    {
                      employee: "Cloyd R. Sapico",
                      destination: "Puerto Princesa, Palawan",
                      purpose: "Field Monitoring",
                      date: "Apr 24-28, 2026",
                      status: "Pending Director",
                      avatar: "MS",
                    },
                    {
                      employee: "Kate M. Manay",
                      destination: "Boac, Marinduque",
                      purpose: "Training Workshop",
                      date: "Apr 20-22, 2026",
                      status: "Approved",
                      avatar: "JR",
                    },
                    {
                      employee: "Rae Mae L. Fababaer",
                      destination: "Calapan, Oriental Mindoro",
                      purpose: "Stakeholder Meeting",
                      date: "Apr 18-19, 2026",
                      status: "Completed",
                      avatar: "AC",
                    },
                  ].map((order, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg border border-stone-200 p-3 hover:border-green-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-black">
                          {order.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-stone-800">{order.employee}</span>
                            <Badge
                              className={`text-[8px] font-bold ${
                                order.status === "Approved"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : order.status === "Completed"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              {order.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-[9px] text-stone-500 mb-1">
                            <MapPin className="w-2.5 h-2.5" />
                            <span>{order.destination}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[9px] text-stone-400">
                            <span className="flex items-center gap-0.5">
                              <Briefcase className="w-2.5 h-2.5" /> {order.purpose}
                            </span>
                            <span className="flex items-center gap-0.5">
                              <Calendar className="w-2.5 h-2.5" /> {order.date}
                            </span>
                          </div>
                        </div>
                        <button className="text-stone-400 hover:text-stone-600">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-[10px] font-bold text-green-700 hover:text-green-800 hover:bg-green-50"
                  >
                    View All Orders
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              )}
            </div>

            {/* Bottom status bar */}
            <div className="border-t border-stone-100 px-5 py-2.5 flex items-center justify-between bg-stone-50/50">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full bg-white border border-stone-200 flex items-center justify-center text-[8px] font-bold text-stone-500"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-[9px] text-stone-400">5 active users</span>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-3 h-3" />
                <span className="text-[9px] font-bold">+23% this month</span>
              </div>
            </div>

          </div>

          {/* Background decorative blobs */}
          <div className="absolute -z-10 top-1/2 -translate-y-1/2 -right-6 w-40 h-40 bg-green-100/40 rounded-full blur-3xl" />
          <div className="absolute -z-10 bottom-0 left-0 w-48 h-48 bg-amber-50/40 rounded-full blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
};

const stats = [
  { value: "5+", label: "Travel Orders Processed", icon: <FileText className="w-4 h-4" /> },
  { value: "5", label: "Provinces Connected", icon: <Globe2 className="w-4 h-4" /> },
  { value: "98.6%", label: "Approval Accuracy", icon: <CheckCircle2 className="w-4 h-4" /> },
  { value: "72 hrs  ", label: "Average Processing Time", icon: <Clock className="w-4 h-4" /> },
];

const MetricsBar: React.FC = () => (
  <section className="bg-white border-y border-stone-200">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-stone-100">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="flex flex-col items-center justify-center py-10 px-6 gap-2 group hover:bg-stone-50 transition-colors"
          >
            <div className="text-green-700 mb-1">{s.icon}</div>
            <div className="text-3xl font-black text-stone-900 tracking-tight">{s.value}</div>
            <div className="text-[11px] text-stone-400 font-bold uppercase tracking-widest text-center">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const features = [
  {
    span: "md:col-span-8",
    number: "01",
    icon: <ShieldCheck className="w-5 h-5 text-green-700" />,
    title: "COA Compliance Engine",
    description:
      "Built-in automated validation against Commission on Audit travel guidelines. Pre-travel authority computation, per diem schedule adherence, and fund availability checks are enforced at every submission stage — before a single peso is committed.",
    tags: ["COA RA 9184", "Auto-validation", "Per Diem Calculator"],
  },
  {
    span: "md:col-span-4",
    number: "02",
    icon: <FileText className="w-5 h-5 text-green-700" />,
    title: "Paperless Travel Orders",
    description:
      "Digital form generation, structured routing, and cryptographic e-signatures replace manual paper trails entirely.",
    tags: ["E-signature", "Auto-routing"],
  },
  {
    span: "md:col-span-4",
    number: "03",
    icon: <Clock className="w-5 h-5 text-green-700" />,
    title: "Real-Time Status Tracking",
    description:
      "Live approval telemetry visible to both the requestor and all approving officers — no more chasing signatures.",
    tags: ["Live Updates", "Notifications"],
  },
  {
    span: "md:col-span-4",
    number: "04",
    icon: <Users className="w-5 h-5 text-green-700" />,
    title: "Unified Command Center",
    description:
      "Operations, Admin, Finance, and all Field Offices operate within a single governed ecosystem with role-based access.",
    tags: ["RBAC", "Multi-office"],
  },
  {
    span: "md:col-span-4",
    number: "05",
    icon: <BarChart3 className="w-5 h-5 text-green-700" />,
    title: "Fund Utilization Analytics",
    description:
      "Granular dashboards tracking expenditure per office, deployment frequency, and budget absorption rates at fiscal year end.",
    tags: ["Dashboards", "Export to PDF"],
  },
];

const FeaturesGrid: React.FC = () => (
  <section className="bg-[#FAFAF8] py-32 border-t border-stone-100">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-green-700 mb-4">
            Platform Capabilities
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight leading-tight max-w-sm">
            Everything your office needs. Nothing it doesn't.
          </h2>
        </div>
        <p className="text-stone-400 max-w-xs text-sm leading-relaxed">
          Designed from the ground up for Philippine government travel operations — not adapted from generic SaaS.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {features.map((f, i) => (
          <motion.div
            key={f.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className={f.span}
          >
            <div className="h-full rounded-2xl border border-stone-200 bg-white hover:border-green-300 hover:shadow-md hover:shadow-green-100/80 transition-all duration-300 group p-8 relative overflow-hidden shadow-sm">
              <div className="absolute top-6 right-8 text-7xl font-black text-stone-100 select-none leading-none">
                {f.number}
              </div>
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center mb-6 group-hover:bg-green-100 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-[15px] font-bold text-stone-800 mb-3 tracking-tight">{f.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed mb-6 group-hover:text-stone-500 transition-colors">
                  {f.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {f.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border border-stone-200 text-stone-400 bg-stone-50"
                    >
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

const workflowSteps = [
  {
    step: "01",
    title: "Submit Travel Request",
    description:
      "Personnel file a travel request with destination, purpose, itinerary, and projected expenses. The system auto-computes per diem entitlements based on CSC and DBM rates.",
    role: "Field Personnel",
  },
  {
    step: "02",
    title: "Multi-Level Approval",
    description:
      "Requests route automatically  Division Chief, Admin Officer, Budget Officer, and Regional Director are notified in sequence. Approvals are timestamped and audit-logged.",
    role: "Approving Officers",
  },
  {
    step: "03",
    title: "Travel Order Issuance",
    description:
      "Upon full approval, a COA-compliant Travel Order is generated, digitally signed, and stored. Liquidation deadlines are tracked automatically post-travel.",
    role: "Admin & Finance",
  },
];

const WorkflowSection: React.FC = () => (
  <section className="bg-white py-32 border-t border-stone-100">
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-green-700 mb-4">How It Works</p>
        <h2 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight max-w-lg leading-tight">
          From request to approval in 3 structured steps.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        <div
          className="hidden md:block absolute h-px bg-gradient-to-r from-transparent via-green-200 to-transparent"
          style={{ top: "2.5rem", left: "16.67%", right: "16.67%" }}
        />

        {workflowSteps.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="rounded-2xl border border-stone-200 bg-white p-8 h-full relative group hover:border-green-300 hover:shadow-md hover:shadow-green-50 transition-all duration-300 shadow-sm">
              <div className="w-10 h-10 rounded-full border-2 border-green-200 bg-green-50 flex items-center justify-center mb-8 text-[11px] font-black text-green-700 tracking-widest group-hover:bg-green-100 group-hover:border-green-300 transition-colors">
                {s.step}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-green-600 mb-3">{s.role}</p>
              <h3 className="text-lg font-bold text-stone-800 mb-4 tracking-tight">{s.title}</h3>
              <p className="text-stone-400 text-sm leading-relaxed group-hover:text-stone-500 transition-colors">
                {s.description}
              </p>
              {i < workflowSteps.length - 1 && (
                <ChevronRight className="hidden md:block absolute -right-3 top-10 w-6 h-6 text-green-300 z-10" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const complianceItems = [
  "Commission on Audit (COA) Circular No. 2012-001",
  "Department of Budget and Management Travel Rate Guidelines",
  "Civil Service Commission Official Time Policies",
  "GSIS and PhilHealth Deduction Compliance",
  "RA 9184 — Government Procurement Reform Act",
  "Executive Order No. 77 — Official Travel Abroad",
];

const ComplianceSection: React.FC = () => (
  <section className="bg-[#FAFAF8] py-32 border-t border-stone-100">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-green-700 mb-4">
            Regulatory Compliance
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight leading-tight mb-6">
            Built on government standards. Not bolted on.
          </h2>
          <p className="text-stone-400 text-sm leading-relaxed mb-10">
            Every feature was designed with Philippine government regulatory frameworks at its core — not retrofitted.
            Your travel orders will always meet audit requirements.
          </p>
          <div className="space-y-3.5">
            {complianceItems.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                <span className="text-stone-500 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="rounded-2xl border border-stone-200 bg-white p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Compliance Score</p>
              <Badge className="bg-green-100 border-green-300 text-green-800 text-[10px] font-bold tracking-widest hover:bg-green-100">
                EXCELLENT
              </Badge>
            </div>
            <div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-5xl font-black text-stone-900">98</span>
                <span className="text-2xl font-black text-stone-300 pb-1">/100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-700"
                  initial={{ width: 0 }}
                  whileInView={{ width: "98%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                />
              </div>
            </div>

            <Separator className="bg-stone-100" />

            {[
              { label: "COA Audit Readiness", score: "100%" },
              { label: "Fund Documentation", score: "97%" },
              { label: "Approval Chain Integrity", score: "100%" },
              { label: "Liquidation Compliance", score: "95%" },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between">
                <span className="text-sm text-stone-500">{r.label}</span>
                <span className="text-sm font-bold text-green-700">{r.score}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const CTASection: React.FC = () => {
  const router = useRouter();
  return (
    <section className="bg-white py-32 border-t border-stone-100">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl bg-[#080f1a] overflow-hidden px-10 py-20 text-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_100%,rgba(22,163,74,0.25),transparent)] pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <Badge className="bg-green-950 border-green-800/50 text-green-400 text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-md mb-8 hover:bg-green-950 relative z-10">
            Ready to Deploy
          </Badge>
          <h2 className="relative z-10 text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
            Modernize your region's
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
              travel management today.
            </span>
          </h2>
          <p className="relative z-10 text-stone-400 text-base leading-relaxed mb-10 max-w-xl mx-auto">
            Join all DA-MIMAROPA offices now on the platform. Contact the Regional ICT Officer for onboarding and
            system access provisioning.
          </p>
          <div className="relative z-10 flex flex-wrap gap-4 justify-center">
            <Button
              onClick={() => router.push("/login")}
              size="lg"
              className="h-12 px-8 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-xl shadow-green-900/40 border-0 group"
            >
              Access the Portal
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 border-white/20 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white rounded-xl font-semibold backdrop-blur-sm"
            >
              Contact ICT Support
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-[#FAFAF8] border-t border-stone-200">
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-green-700 rounded-lg flex items-center justify-center shadow-sm">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-[13px] font-black text-stone-900">TravelOrder</div>
              <div className="text-[9px] text-green-700 font-bold uppercase tracking-[0.25em]">DA · MIMAROPA</div>
            </div>
          </div>
          <p className="text-stone-400 text-xs leading-relaxed max-w-xs">
            Department of Agriculture — MIMAROPA Region IV-B. Official digital platform for travel order processing and
            approval management.
          </p>
          <div className="mt-6 flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-stone-300" />
            <span className="text-[10px] text-stone-300 font-bold uppercase tracking-widest">
              Official Government System
            </span>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-5">Platform</p>
          <div className="space-y-3">
            {["Dashboard", "Travel Orders", "Approval Workflow", "Reports & Analytics", "System Logs"].map((l) => (
              <a key={l} href="#" className="block text-xs text-stone-400 hover:text-stone-700 transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-5">Resources</p>
          <div className="space-y-3">
            {["COA Guidelines", "DBM Travel Rates", "User Manual", "ICT Support", "Privacy Policy"].map((l) => (
              <a key={l} href="#" className="block text-xs text-stone-400 hover:text-stone-700 transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>

      <Separator className="bg-stone-200 mb-8" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[10px] text-stone-300 font-semibold uppercase tracking-widest">
          © 2026 Department of Agriculture — MIMAROPA. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          {["Privacy", "Accessibility", "Terms of Use"].map((l) => (
            <a
              key={l}
              href="#"
              className="text-[10px] text-stone-300 hover:text-stone-600 font-semibold uppercase tracking-widest transition-colors"
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default function TravelOrderLandingLight() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-stone-900 selection:bg-green-200/60 antialiased">
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
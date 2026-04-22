"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { registerUser } from "@/app/actions/register";
import {
  User, Mail, Briefcase, Lock, ChevronRight,
  MapPin, Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

const EMPLOYMENT_STATUSES = ["Permanent", "Contract of Service (COS)", "Job Order (JO)"] as const;

const PROVINCES = [
  "Oriental Mindoro",
  "Occidental Mindoro",
  "Marinduque",
  "Palawan",
  "Romblon",
];

const ORIENTAL_MINDORO_STATIONS = ["DA Victoria", "DA Barcenaga", "DA Calapan"];

const DIVISION_CHOICES = [
  { value: "regulatory", label: "Regulatory Division" },
  { value: "laboratory", label: "Integrated Laboratory Division" },
  { value: "research", label: "Research Division" },
  { value: "field_ops", label: "Field Operations Division" },
  { value: "agri_marketing", label: "Agribusiness and Marketing Assistance Division" },
  { value: "engineering", label: "Regional Agricultural Engineering Division" },
  { value: "planning", label: "Planning, Monitoring and Evaluation Division" },
  { value: "info_section", label: "Regional Agriculture & Fisheries Information Section" },
  { value: "admin_finance", label: "Administrative & Finance Division" },
  { value: "procurement", label: "Procurement of Goods and Infrastructure" },
] as const;

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  middleInitial: z.string().max(2, "Initial only").optional(),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  mobileNumber: z.string().min(10, "Valid mobile number is required"),
  employmentStatus: z.string().min(1, "Employment status is required"),
  division: z.string().min(1, "Division is required"),
  province: z.string().min(1, "Please select a province"),
  subStation: z.string().optional(),
  officialStation: z.string().min(1, "Official station is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof formSchema>;

/* ── Dot-grid SVG background for the hero panel ── */
function DotGrid() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.07]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="white" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  );
}

/* ── Section header pill ── */
function SectionLabel({
  step,
  icon,
  label,
}: {
  step: number;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold shrink-0">
        {step}
      </span>
      <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em]">
        {icon} {label}
      </span>
      <span className="flex-1 h-px bg-slate-200" />
    </div>
  );
}

const inputCls =
  "h-12 px-4 text-[15px] rounded-xl border border-slate-200 bg-white shadow-sm placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-400 transition-colors";

const selectTriggerCls =
  "h-12 px-4 text-[15px] rounded-xl border border-slate-200 bg-white shadow-sm font-normal focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-colors";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "", middleInitial: "", lastName: "",
      email: "", mobileNumber: "", division: "", employmentStatus: "",
      province: "", subStation: "", officialStation: "", password: "",
    },
  });

  const selectedProvince = watch("province");
  const selectedSubStation = watch("subStation");

  useEffect(() => {
    if (selectedProvince === "Oriental Mindoro") {
      setValue("officialStation", selectedSubStation || "");
    } else {
      setValue("officialStation", selectedProvince);
      setValue("subStation", "");
    }
  }, [selectedProvince, selectedSubStation, setValue]);

  async function onSubmit(values: FormValues) {
    const toastId = toast.loading("Creating your account…");
    const result = await registerUser(values);
    if (result.success) {
      toast.success("Account created successfully!", { id: toastId });
      reset();
    } else {
      toast.error(result.error || "Failed to create account.", { id: toastId });
    }
  }

  return (
    <div className="flex min-h-screen w-full font-[system-ui]">

      {/* ── LEFT HERO PANEL ── */}
      <aside className="relative hidden lg:flex lg:w-[42%] xl:w-[38%] bg-[#0d2f1f] flex-col justify-between p-14 overflow-hidden">
        <DotGrid />

        {/* Diagonal accent stripe */}
        <div className="absolute -right-16 top-0 h-full w-48 bg-emerald-500/10 rotate-[8deg] pointer-events-none" />
        <div className="absolute -right-8 top-0 h-full w-24 bg-emerald-400/5 rotate-[8deg] pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Logo + brand */}
          <div className="flex items-center gap-3">
            <Image
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMVJJK1z4PWdaWJG9ArC6U45RvjxMJsEZVKQ&s"
              alt="Logo"
              width={48}
              height={48}
              className="h-12 w-12 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20"
            />
            <div>
              <p className="text-[10px] text-emerald-400/70 uppercase tracking-[0.2em] font-semibold">
                Department of Agriculture
              </p>
              <p className="text-white text-[15px] font-black tracking-tight leading-tight">
                Travel Order System
              </p>
            </div>
          </div>

          {/* Hero text */}
          <div className="mt-[65px] mb-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 text-xs font-semibold tracking-wide">
                Personnel Registration
              </span>
            </div>
            <h1 className="text-[3.5rem] xl:text-[4rem] font-black leading-[1.05] text-white tracking-tight">
              Welcome<br />
              Aboard,<br />
              <span className="text-emerald-400">Officer.</span>
            </h1>
            <p className="mt-6 text-slate-400 text-[15px] leading-relaxed max-w-xs">
              Register your credentials to gain access to official travel order management and monitoring.
            </p>
          </div>

          {/* Bottom badge strip */}
          <div className="flex gap-3 flex-wrap">
            {["MIMAROPA Region", "DA-RFO IV-B", "Official Use Only"].map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/60 border border-emerald-500/20 rounded-full px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </aside>

      {/* ── RIGHT FORM PANEL ── */}
      <main className="flex-1 bg-slate-50 overflow-y-auto">
        <div className="min-h-full flex items-start justify-center px-6 py-14 md:px-16">
          <div className="w-full max-w-2xl">

            {/* Page heading */}
            <div className="mb-10">
              {/* Mobile logo */}
              <div className="flex items-center gap-3 mb-8 lg:hidden">
                <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMVJJK1z4PWdaWJG9ArC6U45RvjxMJsEZVKQ&s"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="h-10 w-10 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20"
                />
                <span className="text-sm font-black text-slate-800 tracking-tight">
                  DA — Travel Order System
                </span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                Create Account
              </h2>
              <p className="text-slate-500 mt-2 text-[15px]">
                Fill in your details to register as DA personnel.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* ── SECTION 1: Personal ── */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <SectionLabel step={1} icon={<User className="w-3.5 h-3.5" />} label="Personal Details" />
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-12 sm:col-span-5">
                    <Input
                      {...register("firstName")}
                      placeholder="First Name"
                      className={inputCls}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="col-span-12 sm:col-span-2">
                    <Input
                      {...register("middleInitial")}
                      placeholder="M.I."
                      className={`${inputCls} text-center`}
                    />
                  </div>
                  <div className="col-span-12 sm:col-span-5">
                    <Input
                      {...register("lastName")}
                      placeholder="Last Name"
                      className={inputCls}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── SECTION 2: Contact ── */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <SectionLabel step={2} icon={<Mail className="w-3.5 h-3.5" />} label="Contact Information" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Input
                      {...register("email")}
                      placeholder="Official Email Address"
                      className={inputCls}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Input
                      {...register("mobileNumber")}
                      placeholder="Mobile Number"
                      className={inputCls}
                    />
                    {errors.mobileNumber && (
                      <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.mobileNumber.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── SECTION 3: Assignment ── */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <SectionLabel step={3} icon={<Briefcase className="w-3.5 h-3.5" />} label="Assignment Details" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {/* Employment Status */}
                  <div>
                    <Controller
                      control={control}
                      name="employmentStatus"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className={selectTriggerCls}>
                            <SelectValue placeholder="Employment Status" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {EMPLOYMENT_STATUSES.map((s) => (
                              <SelectItem key={s} value={s} className="py-2.5">{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.employmentStatus && (
                      <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.employmentStatus.message}</p>
                    )}
                  </div>

                  {/* Province / Station */}
                  <div>
                    <Controller
                      control={control}
                      name="province"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className={selectTriggerCls}>
                            <div className="flex items-center gap-2 text-slate-500">
                              <MapPin className="w-4 h-4 shrink-0" />
                              <SelectValue placeholder="Province / Station" />
                            </div>
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {PROVINCES.map((p) => (
                              <SelectItem key={p} value={p} className="py-2.5">{p}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.province && (
                      <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.province.message}</p>
                    )}
                  </div>

                  {/* Sub-station — Oriental Mindoro only */}
                  {selectedProvince === "Oriental Mindoro" && (
                    <div className="sm:col-span-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      <Controller
                        control={control}
                        name="subStation"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className={`${selectTriggerCls} border-emerald-200 bg-emerald-50/40`}>
                              <SelectValue placeholder="Select Specific Station (Oriental Mindoro)" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              {ORIENTAL_MINDORO_STATIONS.map((s) => (
                                <SelectItem key={s} value={s} className="py-2.5">{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.officialStation && (
                        <p className="text-red-500 text-xs mt-1.5 ml-1">Please select a specific station</p>
                      )}
                    </div>
                  )}

                  {/* Division */}
                  <div className="sm:col-span-2">
                    <Controller
                      control={control}
                      name="division"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className={selectTriggerCls}>
                            <div className="flex items-center gap-2 text-slate-500">
                              <Building2 className="w-4 h-4 shrink-0" />
                              <SelectValue placeholder="Assigned Division" />
                            </div>
                          </SelectTrigger>
                          <SelectContent className="max-h-72 rounded-xl">
                            {DIVISION_CHOICES.map((c) => (
                              <SelectItem key={c.value} value={c.value} className="py-2.5">{c.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.division && (
                      <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.division.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── SECTION 4: Security ── */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <SectionLabel step={4} icon={<Lock className="w-3.5 h-3.5" />} label="Account Security" />
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors pointer-events-none" />
                  <Input
                    {...register("password")}
                    type="password"
                    placeholder="Set a password (min. 8 characters)"
                    className={`${inputCls} pl-11`}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password.message}</p>
                )}
              </div>

              {/* ── SUBMIT ── */}
              <div className="pt-2 space-y-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-13 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-base font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Creating Account…
                    </>
                  ) : (
                    <>
                      Create Account
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-slate-500">
                  Already have an account?{" "}
                  <a href="/login" className="text-emerald-600 font-semibold hover:underline underline-offset-4">
                    Sign In
                  </a>
                </p>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
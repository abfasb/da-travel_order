"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { registerUser } from "@/app/actions/register";

import { 
  User, Mail, Briefcase, Lock, ChevronRight,
  ShieldCheck, MapPin, Building2 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const EMPLOYMENT_STATUSES = ["Permanent", "Contract of Service (COS)", "Job Order (JO)"] as const;

const PROVINCES = [
  "Oriental Mindoro",
  "Occidental Mindoro",
  "Marinduque",
  "Palawan",
  "Romblon"
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
  // Logic fields
  province: z.string().min(1, "Please select a province"),
  subStation: z.string().optional(),
  officialStation: z.string().min(1, "Official station is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof formSchema>;

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
    const toastId = toast.loading("Creating your account...");
    const result = await registerUser(values);

    if (result.success) {
      toast.success("Account created successfully!", { id: toastId });
      reset();
    } else {
      toast.error(result.error || "Failed to create account.", { id: toastId });
    }
  }

  const fieldHeight = "h-14 md:h-16";

  return (
    <div className="flex min-h-screen w-full bg-white overflow-hidden">
      
      <div className="relative hidden lg:flex lg:w-1/2 bg-emerald-950 p-16 flex-col justify-between text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="h-12 w-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="text-emerald-950 w-7 h-7" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">DA - Travel Order</span>
          </div>
          <h1 className="text-7xl font-black leading-[1] mb-8 tracking-tighter">
            Personnel <br />
            <span className="text-emerald-400 underline decoration-emerald-500/30">Onboarding.</span>
          </h1>
          <p className="text-emerald-100/60 text-xl max-w-md font-light leading-relaxed">
            Register your credentials to access the Official Travel Order Management System.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-20 bg-slate-50/30 overflow-y-auto">
        <div className="w-full max-w-2xl py-10">
          <div className="mb-14">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Register</h2>
            <p className="text-slate-500 text-lg font-medium">Join the professional network of DA personnel.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* NAME SECTION */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <User className="w-4 h-4" /> Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-5">
                  <Input {...register("firstName")} placeholder="First Name" className={`${fieldHeight} px-6 border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-emerald-500/20 text-lg rounded-xl`} />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1 ml-2">{errors.firstName.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <Input {...register("middleInitial")} placeholder="M.I." className={`${fieldHeight} text-center border-slate-200 bg-white shadow-sm rounded-xl text-lg`} />
                </div>
                <div className="md:col-span-5">
                  <Input {...register("lastName")} placeholder="Last Name" className={`${fieldHeight} px-6 border-slate-200 bg-white shadow-sm rounded-xl text-lg`} />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1 ml-2">{errors.lastName.message}</p>}
                </div>
              </div>
            </div>

            {/* CONTACT SECTION */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <Mail className="w-4 h-4" /> Reachability
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input {...register("email")} placeholder="Official Email" className={`${fieldHeight} px-6 border-slate-200 bg-white shadow-sm rounded-xl text-lg`} />
                  {errors.email && <p className="text-red-500 text-xs mt-1 ml-2">{errors.email.message}</p>}
                </div>
                <div>
                  <Input {...register("mobileNumber")} placeholder="Mobile Number" className={`${fieldHeight} px-6 border-slate-200 bg-white shadow-sm rounded-xl text-lg`} />
                  {errors.mobileNumber && <p className="text-red-500 text-xs mt-1 ml-2">{errors.mobileNumber.message}</p>}
                </div>
              </div>
            </div>

            {/* ASSIGNMENT SECTION */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Assignment
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Controller
                    control={control}
                    name="employmentStatus"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={`${fieldHeight} px-6 border-slate-200 bg-white shadow-sm rounded-xl text-lg font-medium`}>
                          <SelectValue placeholder="Employment Status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200">
                          {EMPLOYMENT_STATUSES.map(s => <SelectItem key={s} value={s} className="py-3">{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.employmentStatus && <p className="text-red-500 text-xs mt-1 ml-2">{errors.employmentStatus.message}</p>}
                </div>

                {/* PROVINCE SELECTOR */}
                <div>
                  <Controller
                    control={control}
                    name="province"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={`${fieldHeight} px-6 border-slate-200 bg-white shadow-sm rounded-xl text-lg font-medium`}>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-slate-400" />
                            <SelectValue placeholder="Official Station" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200">
                          {PROVINCES.map(p => <SelectItem key={p} value={p} className="py-3">{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.province && <p className="text-red-500 text-xs mt-1 ml-2">{errors.province.message}</p>}
                </div>
              </div>

              {/* CONDITIONAL SUB-STATION DROPDOWN */}
              {selectedProvince === "Oriental Mindoro" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <Controller
                    control={control}
                    name="subStation"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={`${fieldHeight} px-6 border-emerald-200 bg-emerald-50/30 shadow-sm rounded-xl text-lg font-medium`}>
                          <SelectValue placeholder="Select Specific Station" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200">
                          {ORIENTAL_MINDORO_STATIONS.map(s => <SelectItem key={s} value={s} className="py-3">{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.officialStation && <p className="text-red-500 text-xs mt-1 ml-2">Please select a specific station</p>}
                </div>
              )}

              {/* DIVISION SELECTOR */}
              <div>
                <Controller
                  control={control}
                  name="division"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={`${fieldHeight} px-6 border-slate-200 bg-white shadow-sm rounded-xl text-lg font-medium`}>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-slate-400" />
                          <SelectValue placeholder="Select Assigned Division" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px] rounded-xl border-slate-200">
                        {DIVISION_CHOICES.map(choice => (
                          <SelectItem key={choice.value} value={choice.value} className="py-3">
                            {choice.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.division && <p className="text-red-500 text-xs mt-1 ml-2">{errors.division.message}</p>}
              </div>
            </div>

            {/* SECURITY SECTION */}
            <div className="pt-8 border-t border-slate-200 space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Security</h3>
              <div>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <Input {...register("password")} type="password" placeholder="Set Account Password" className={`${fieldHeight} pl-14 border-slate-200 bg-white shadow-sm rounded-xl text-lg`} />
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1 ml-2">{errors.password.message}</p>}
              </div>
            </div>

            {/* SUBMIT */}
            <div className="flex flex-col gap-6 pt-6">
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white text-xl font-black rounded-2xl shadow-2xl shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {isSubmitting ? "Generating Account..." : "Create Account"}
                {!isSubmitting && <ChevronRight className="w-6 h-6" />}
              </Button>
              
              <p className="text-center text-slate-500 font-semibold">
                Already registered? <a href="/login" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-8">Sign In</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
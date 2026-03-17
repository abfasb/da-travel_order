import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { 
  PlaneTakeoff, MapPin, FileText, Wallet, Users, CalendarDays, Briefcase 
} from "lucide-react";

export default async function EmployeeDashboardPage() {
  // 1. Verify access
  const cookieStore = await cookies();
  const role = cookieStore.get("user_role")?.value;
  
  if (!role || role !== "STAFF") {
    // If they aren't logged in or aren't STAFF, middleware usually catches this,
    // but this is a good secondary check.
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-emerald-900 text-white p-8 rounded-3xl shadow-lg flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black mb-2 tracking-tight">My Workspace</h1>
            <p className="text-emerald-200/80 font-medium tracking-wide">
              Official DA Employee Dashboard
            </p>
          </div>
          <div className="hidden md:flex h-16 w-16 bg-emerald-800 rounded-2xl items-center justify-center border border-emerald-700">
            <Briefcase className="w-8 h-8 text-emerald-400" />
          </div>
        </div>

        {/* Travel Order Form Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/50 p-8">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <PlaneTakeoff className="text-emerald-600 w-6 h-6" />
              File New Travel Order
            </h2>
            <p className="text-slate-500 mt-1">Submit your official itinerary and request for approval.</p>
          </div>

          <form className="p-8 space-y-10">
            
            {/* SECTION 1: Personal Profile */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <Users className="w-4 h-4" /> Employee Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-600">Full Name</label>
                  <input type="text" placeholder="Juan Dela Cruz" className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-600">Position</label>
                  <input type="text" placeholder="Agriculturist II" className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-600">Salary per Month</label>
                  <input type="text" placeholder="₱ 35,000" className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-600">Official Station</label>
                  <input type="text" placeholder="DA Calapan" className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20" />
                </div>
              </div>
            </div>

            {/* SECTION 2: Schedule & Location */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <CalendarDays className="w-4 h-4" /> Itinerary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-600">Departure Date</label>
                  <input type="date" className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-600">Return Date</label>
                  <input type="date" className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-600">Dest. Province</label>
                  <input type="text" placeholder="e.g. Palawan" className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-600">Specific Location</label>
                  <input type="text" placeholder="e.g. Puerto Princesa City" className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20" />
                </div>
              </div>
            </div>

            {/* SECTION 3: Details & Purpose */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-4 h-4" /> Purpose & Objectives
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-600">Destination Summary</label>
                  <input type="text" placeholder="Brief summary of where you are going" className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-600">Specific Purpose</label>
                  <textarea placeholder="State the exact reason for travel..." rows={2} className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20 resize-none"></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-600">Objectives</label>
                    <textarea placeholder="Expected outcomes..." rows={3} className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20 resize-none"></textarea>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-600">Travel Details (Activities)</label>
                    <textarea placeholder="Step-by-step activities..." rows={3} className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20 resize-none"></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: Logistics & Finance */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <Wallet className="w-4 h-4" /> Logistics & Funding
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1 lg:col-span-2">
                  <label className="text-sm font-semibold text-slate-600">Means of Transportation</label>
                  <input type="text" placeholder="e.g. Official DA Vehicle, Commute, Flight" className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-600">Estimated Expenses</label>
                  <input type="text" placeholder="₱ 0.00" className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-600">Source of Funds</label>
                  <input type="text" placeholder="e.g. Division Fund" className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20" />
                </div>
                <div className="space-y-1 lg:col-span-4">
                  <label className="text-sm font-semibold text-slate-600">Accompanying Personnel (Optional)</label>
                  <input type="text" placeholder="Names of other staff joining you..." className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20" />
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button 
                type="button" 
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Submit Travel Order
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
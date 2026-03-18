import React from 'react';
import Image from 'next/image';
import logo from "@/assets/logo.png";

export default function TravelOrderDocument() {
  return (
    <>
      <style type="text/css" media="print">
        {`
          @page { size: A4; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        `}
      </style>

      <div className="min-h-screen bg-slate-200 py-8 flex justify-center print:bg-white print:py-0 print:block">
        
        <div className="bg-white w-[210mm] h-[297mm] shadow-xl p-[15mm] px-[15mm] font-serif text-black print:shadow-none print:w-full print:h-[297mm] box-border print:overflow-hidden relative">
          
          <div className="flex justify-between items-start mb-2">
            <div className="w-[75%] relative h-25">
              <Image
                src={logo}
                alt="DA Logo" 
                fill
                className="object-fill object-left"
                priority
              />
            </div>
            
            <div className="w-[15%] flex justify-end pt-2">
              <div className="border-[1.5px] border-black px-2 py-0.5 font-bold text-sm h-fit min-w-[100px] text-center">
                Annex A-4
              </div>
            </div>
          </div>

          <div className="text-center mb-4">
            <h1 className="font-bold underline text-[13px] tracking-widest">TRAVEL ORDER</h1>
          </div>

          <div className="flex justify-end mb-3 text-[11px]">
            <div className="w-[240px]">
              <div className="flex items-end mb-0.5">
                <span className="w-10">No.</span>
                <span className="mr-2">:</span>
                <span className="flex-1 border-b border-black"></span>
              </div>
              <div className="flex items-end">
                <span className="w-10">Date</span>
                <span className="mr-2">:</span>
                <span className="flex-1 border-b border-black font-bold px-2">January 28, 2026</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-[11px]">
            
            <div className="flex items-end">
              <div className="w-36 flex justify-between pr-2 shrink-0">
                <span>NAME</span><span>:</span>
              </div>
              <div className="w-[43%] border-b border-black font-bold px-2 shrink-0">JUAN A. DELA CRUZ</div>
              <div className="w-32 flex justify-between px-2 shrink-0">
                <span>SALARY PER MONTH</span><span>:</span>
              </div>
              <div className="flex-1 border-b border-black"></div>
            </div>

            <div className="flex items-end">
              <div className="w-36 flex justify-between pr-2 shrink-0">
                <span>POSITION</span><span>:</span>
              </div>
              <div className="w-[43%] border-b border-black font-bold px-2 shrink-0">ADMINISTRATIVE ASSISTANT IV</div>
              <div className="w-32 flex justify-between px-2 shrink-0">
                <span>OFFICIAL STATION</span><span>:</span>
              </div>
              <div className="flex-1 border-b border-black font-bold px-1 text-[10px] leading-tight pb-0.5">
                DA Regional Office, Camilmil, Calapan City
              </div>
            </div>

            <div className="flex items-end">
              <div className="w-36 flex justify-between pr-2 shrink-0">
                <span>DEPARTURE DATE</span><span>:</span>
              </div>
              <div className="w-[43%] border-b border-black font-bold px-2 shrink-0">January 29, 2026</div>
              <div className="w-32 flex justify-between px-2 shrink-0">
                <span>RETURN DATE</span><span>:</span>
              </div>
              <div className="flex-1 border-b border-black font-bold px-2 text-[10px]">January 29,2026</div>
            </div>

            <div className="flex items-end mt-1">
              <div className="w-36 flex justify-between pr-2 shrink-0">
                <span>DESTINATION</span><span>:</span>
              </div>
              <div className="flex-1 border-b border-black font-bold px-2 text-[10px]">
                Integrated Laboratory Division & Research Barcenaga, Naujan Oriental Mindoro
              </div>
            </div>

            <div className="flex items-start pt-1">
              <div className="w-36 flex justify-between pr-2 shrink-0 mt-0.5">
                <span>SPECIFIC PURPOSE OF THE</span><span>:</span>
              </div>
              <div className="flex-1 flex flex-col space-y-3.5">
                <div className="border-b border-black font-bold px-2 leading-none">To assist in the conduct of personnel audit.</div>
                <div className="border-b border-black"></div>
                <div className="border-b border-black"></div>
              </div>
            </div>

            <div className="flex items-start pt-1">
              <div className="w-36 flex justify-between pr-2 shrink-0 mt-0.5">
                <span>OBJECTIVES</span><span>:</span>
              </div>
              <div className="flex-1 flex flex-col space-y-3.5">
                <div className="border-b border-black font-bold px-2 text-[10px] leading-none">
                  To evaluate personnel practices, policies and procedures to identify areas for improvement and ensure compliance
                </div>
                <div className="border-b border-black"></div>
                <div className="border-b border-black"></div>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-[11px]">
            <div className="flex items-end">
              <div className="w-[220px] flex justify-between pr-2 shrink-0">
                <span>PER DIEM EXPENSES</span><span>:</span>
              </div>
              <div className="flex-1 border-b border-black"></div>
            </div>
            <div className="flex items-end">
              <div className="w-[220px] flex justify-between pr-2 shrink-0">
                <span>ASSISTANT OR LABORERS ALLOWED</span><span>:</span>
              </div>
              <div className="flex-1 border-b border-black"></div>
            </div>
            <div className="flex items-end">
              <div className="w-[220px] flex justify-between pr-2 shrink-0">
                <span>APPROPRIATION TO WHICH TRAVEL</span><span>:</span>
              </div>
              <div className="flex-1 border-b border-black"></div>
            </div>
            
            <div className="flex items-start pt-0.5">
              <div className="w-[220px] flex justify-between pr-2 shrink-0">
                <span>REMARKS OR SPECIAL INSTRUCTIONS</span><span>:</span>
              </div>
              <div className="flex-1 flex flex-col space-y-3.5">
                <div className="border-b border-black"></div>
                <div className="border-b border-black"></div>
                <div className="border-b border-black"></div>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-5 text-[11px]">
            <div className="w-[45%]">
              <p className="font-bold mb-6">RECOMMENDING APPROVAL:</p>
              <div className="border-b border-black text-center font-bold px-2 text-[11px]">
                ATTY. MARVIN P. APDUHAN, CPA
              </div>
              <p className="text-center font-bold text-[10px]">Chief, Administrative Officer</p>
              
              <div className="mt-4 text-[8px] leading-[1.2]">
                <p>DA-MIMAROPA</p>
                <p className="font-bold">M.G.R.ILEDAN</p>
                <p>Chief Agriculturist-Regulatory Division</p>
              </div>
            </div>

            <div className="w-[45%]">
              <p className="font-bold mb-6">APPROVED BY:</p>
              <div className="border-b border-black text-center font-bold px-2 text-[11px]">
                ATTY. CHRISTOPHER R.BAÑAS
              </div>
              <p className="text-center font-bold text-[10px]">Regional Executive Director</p>
            </div>
          </div>

          <div className="my-3 overflow-hidden whitespace-nowrap text-center text-gray-400 tracking-widest text-[9px]">
            ================================================================================================================================
          </div>

          <div className="text-center mb-3">
            <h2 className="font-bold text-[11px]">CERTIFICATE OF APPEARANCE</h2>
          </div>

          <div className="grid grid-cols-3 gap-x-8 gap-y-4 text-center text-[10px]">
            <div>
              <div className="border-b border-black"></div>
              <p className="pt-0.5">Inclusive Date/s</p>
            </div>
            <div>
              <div className="border-b border-black"></div>
              <p className="pt-0.5">Place Signed</p>
            </div>
            <div>
              <div className="border-b border-black"></div>
              <p className="pt-0.5">Certifying Officer/s</p>
            </div>

            <div>
              <div className="border-b border-black"></div>
              <p className="pt-0.5">Inclusive Date/s</p>
            </div>
            <div>
              <div className="border-b border-black"></div>
              <p className="pt-0.5">Place Signed</p>
            </div>
            <div>
              <div className="border-b border-black"></div>
              <p className="pt-0.5">Certifying Officer/s</p>
            </div>

            <div>
              <div className="border-b border-black"></div>
              <p className="pt-0.5">Inclusive Date/s</p>
            </div>
            <div>
              <div className="border-b border-black"></div>
              <p className="pt-0.5">Place Signed</p>
            </div>
            <div>
              <div className="border-b border-black"></div>
              <p className="pt-0.5">Certifying Officer/s</p>
            </div>

            <div>
              <div className="border-b border-black"></div>
              <p className="pt-0.5">Inclusive Date/s</p>
            </div>
            <div>
              <div className="border-b border-black"></div>
              <p className="pt-0.5">Place Signed</p>
            </div>
            <div>
              <div className="border-b border-black"></div>
              <p className="pt-0.5">Certifying Officer/s</p>
            </div>
          </div>

          <div className="absolute bottom-[15mm] left-[15mm] right-[15mm] mt-4 text-[7px] text-gray-700 leading-tight">
            <p>Doc. No.: DAMIMAROPA-F013-2023</p>
            <p>Rev. No.: 1</p>
            <p>Issued Date: 09/27/2023</p>
          </div>

        </div>
      </div>
    </>
  );
}
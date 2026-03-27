import Image from "next/image";
import logo from "@/assets/logo.png";

export default function ProposedItineraryDocument() {
  return (
    <>
      {/* This style block forces the printer to strip its default margins. 
        This fixes the blank second page and the scaling inaccuracies! 
      */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 0 !important; 
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}} />

      <div className="flex justify-center bg-gray-100 min-h-screen py-10 print:py-0 print:bg-white">
        {/* A4 Paper Container - 0 Padding here so the logo touches the edges */}
        <div 
          className="bg-white shadow-lg box-border print:shadow-none overflow-hidden relative"
          style={{ 
            width: '210mm', 
            height: '297mm', // Strictly enforced 1 page
            padding: '0',    // Removed padding
            fontFamily: '"Times New Roman", Times, serif',
            color: 'black'
          }}
        >
          {/* Full-Width Header Logo */}
          <header className="w-full">
            <Image 
              src={logo} 
              alt="Department of Agriculture Header Banner" 
              className="w-full h-auto object-contain"
              width={1000} 
              height={200} 
              priority
            />
          </header>

          {/* Content Wrapper - Re-applies the padding only to the text content */}
          <div style={{ padding: '10mm 20mm 20mm 20mm' }}>
            
            {/* Document Title */}
            <div className="text-center mb-10">
              <h1 className="font-bold uppercase tracking-wide" style={{ fontSize: '12pt' }}>
                PROPOSED ITINERARY FOR OFFICIAL TRAVEL
              </h1>
            </div>

            {/* Employee & Travel Details */}
            <div className="grid grid-cols-2 gap-y-6 mb-8" style={{ fontSize: '11pt', paddingLeft: '5mm', paddingRight: '5mm' }}>
              {/* Left Column */}
              <div className="flex flex-col gap-y-4">
                <div className="flex">
                  <span className="w-[20mm]">Name:</span>
                  <span className="font-bold">Juan A. Dela Cruz</span>
                </div>
                <div className="flex">
                  <span className="w-[20mm]">Position:</span>
                  <span className="font-bold">Administrative Assistant IV</span>
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-y-4">
                <div className="flex">
                  <span className="w-[22mm]">Date:</span>
                  <span className="font-bold">January 29, 2026</span>
                </div>
                <div className="flex items-start">
                  <span className="w-[22mm]">Travel<br/>Destination:</span>
                  <span className="font-bold leading-tight">
                    ILD & Research Barcenaga<br/>Naujan,<br/>Oriental Mindoro
                  </span>
                </div>
              </div>
            </div>

            {/* Itinerary Table */}
            <table 
              className="w-full border-collapse mb-16" 
              style={{ border: '1.5px solid black', fontSize: '11pt' }}
            >
              <thead>
                <tr>
                  <th className="border border-black p-2 font-bold uppercase w-[20%] text-center">Date</th>
                  <th className="border border-black p-2 font-bold uppercase w-[35%] text-center">Location</th>
                  <th className="border border-black p-2 font-bold uppercase w-[25%] text-center">Activity</th>
                  <th className="border border-black p-2 font-bold uppercase w-[20%] text-center leading-tight">
                    Responsible<br/>Group/Individual
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-2 align-top font-bold text-center">
                    January 29, 2026
                  </td>
                  <td className="border border-black p-2 align-top">
                    Integrated Laboratory Division & Research Barcenaga Naujan, Oriental Mindoro
                  </td>
                  <td className="border border-black p-2 align-top">
                    To assist in the conduct of personnel audit.
                  </td>
                  <td className="border border-black p-2 align-top text-center">
                    Christine Anne Gizzlle E. Montiano
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-10" style={{ fontSize: '11pt', paddingLeft: '5mm', paddingRight: '5mm' }}>
              {/* Requested By */}
              <div className="flex flex-col">
                <span className="mb-10">Requested by:</span>
                <span className="font-bold uppercase">Juan A. Dela Cruz</span>
                <span>Administrative Assistant IV</span>
              </div>

              {/* Approved By */}
              <div className="flex flex-col">
                <span className="mb-10">Approved by:</span>
                <span className="font-bold uppercase">Atty. Marvin P. Apduhan, CPA</span>
                <span>Chief, Administrative Officer</span>
              </div>
            </div>

          </div> 
          {/* End Content Wrapper */}

        </div>
      </div>
    </>
  );
}
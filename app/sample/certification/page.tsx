import Image from "next/image";
import logo from "@/assets/logo.png";

export default function CertificationDocument() {
  return (
    <>
      {/* Forces the printer to strip its default margins, fixing blank pages and scaling */}
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
            padding: '0',    // Removed padding for the top logo
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

          {/* Content Wrapper - Re-applies padding only to the text content */}
          <div style={{ padding: '15mm 25mm 20mm 25mm' }}>
            
            {/* Document Title */}
            <div className="text-center mb-12 mt-4">
              <h1 className="font-bold uppercase" style={{ fontSize: '13pt', letterSpacing: '0.25em' }}>
                CERTIFICATION
              </h1>
            </div>

            {/* Paragraph 1 */}
            <p className="text-justify mb-6" style={{ fontSize: '12pt', textIndent: '12.5mm', lineHeight: '1.8' }}>
              In the interest of service and to attain efficient implementation of Department of 
              Agriculture Programs in Region IV-B (MIMAROPA), Mr. <span className="underline">Juan A. Dela Cruz</span> of <span className="underline">DA-RFO 
              MIMAROPA</span> is hereby authorized to travel from the period of <span className="italic">February 22-25, 2026</span> in <span className="italic">DA-
              APCO, Odiongan, Romblon</span> to <span className="underline italic">assist in the conduct of personnel audit and orientation activities 
              as well as to address and respond to employees' concerns and queries.</span>
            </p>

            {/* Paragraph 2 */}
            <p className="text-justify mb-24" style={{ fontSize: '12pt', textIndent: '12.5mm', lineHeight: '1.8' }}>
              As such, Mr. <span className="underline">Juan A. Dela Cruz</span> is authorized to travel with the following conditions: 
              (1) The official task cannot be performed by/or assigned to any other regular/permanent 
              personnel, and (2) the task/ activities are necessary to fulfill the obligations as stipulated in 
              his/ her contract. In addition to the above mentioned name is entitled to claim/reimburse her 
              traveling expenses and per diem, subject to the availability of funds, accounting and auditing 
              rules and regulations.
            </p>

            {/* Signatory */}
            <div className="flex flex-col" style={{ fontSize: '12pt' }}>
              <span className="font-bold underline uppercase">Atty. Christopher R. Bañas</span>
              <span>Regional Executive Director</span>
            </div>

          </div> 
          {/* End Content Wrapper */}

          {/* Document Control Footer - Absolutely positioned to always stay at the bottom left */}
          <div 
            className="absolute" 
            style={{ 
              bottom: '25mm', 
              left: '25mm', 
              fontSize: '9pt', 
              lineHeight: '1.3',
              fontFamily: 'Arial, Helvetica, sans-serif'
            }}
          >
            <p>Doc. No.: DAMIMAROPA-F015-2023</p>
            <p>Rev. No.: 2</p>
            <p>Issued Date: 02/06/26</p>
          </div>

        </div>
      </div>
    </>
  );
}
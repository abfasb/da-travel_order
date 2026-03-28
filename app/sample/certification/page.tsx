import Image from "next/image";
import logo from "@/assets/logo.png"; 

export default function CertificationDocument({ data }: { data: any }) {
  const formatTravelPeriod = (start: Date, end: Date) => {
    if (!start || !end) return '';
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
      return `${startDate.toLocaleString('default', { month: 'long' })} ${startDate.getDate()}-${endDate.getDate()}, ${startDate.getFullYear()}`;
    }
    
    return `${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`;
  };

  return (
    <>
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

      <div className="flex justify-center bg-white">
        <div 
          className="bg-white box-border relative overflow-hidden print:shadow-none"
          style={{ 
            width: '210mm', 
            height: '297mm',
            padding: '0',    // Removed padding to allow header to touch edges
            fontFamily: '"Times New Roman", Times, serif',
            color: 'black'
          }}
        >
          {/* Full-Width Header Logo Banner */}
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

          {/* Content Wrapper - Applies padding only to the text content */}
          <div style={{ padding: '10mm 20mm 20mm 20mm' }}>
            
            {/* Title */}
            <div className="text-center mb-16 mt-10">
              <h1 className="font-bold uppercase tracking-[0.2em]" style={{ fontSize: '14pt' }}>
                C E R T I F I C A T I O N
              </h1>
            </div>

            {/* Paragraph 1 */}
            <p className="mb-8 text-justify leading-loose" style={{ fontSize: '12pt', textIndent: '12.5mm' }}>
              In the interest of service and to attain efficient implementation of Department of 
              Agriculture Programs in Region IV-B (MIMAROPA), Mr./Ms. <span className="font-bold underline">{data?.requestorName || '[Name]'}</span> of 
              <span className="underline ml-1 uppercase">{data?.requestorStation || 'DA-RFO MIMAROPA'}</span> is hereby authorized to travel from the period of 
              <span className="italic font-semibold mx-1">{formatTravelPeriod(data?.departureDate, data?.returnDate)}</span> in 
              <span className="italic font-semibold mx-1">{data?.specificLocation}, {data?.destinationProvince}</span> to 
              <span className="italic font-semibold underline mx-1">{data?.purpose?.toLowerCase()}</span>.
            </p>

            {/* Paragraph 2 */}
            <p className="mb-20 text-justify leading-loose" style={{ fontSize: '12pt', textIndent: '12.5mm' }}>
              As such, Mr./Ms. <span className="font-bold underline">{data?.requestorName || '[Name]'}</span> is authorized to travel with the following conditions: 
              (1) The official task cannot be performed by/or assigned to any other regular/permanent 
              personnel, and (2) the task/activities are necessary to fulfill the obligations as stipulated in 
              his/her contract. In addition to the above mentioned name is entitled to claim/reimburse her 
              traveling expenses and per diem, subject to the availability of funds, accounting and auditing 
              rules and regulations.
            </p>

            {/* Signature Block */}
            <div className="mt-24">
              <p className="font-bold underline uppercase" style={{ fontSize: '12pt' }}>
                ATTY. CHRISTOPHER R. BAÑAS
              </p>
              <p style={{ fontSize: '12pt' }}>
                Regional Executive Director
              </p>
            </div>

          </div> 

        </div>
      </div>
    </>
  );
}
'use client'

import Image from "next/image";
import logo from "@/assets/logo.png";

export default function ProposedItineraryDocument(props: any) {
  const data = props.data as any;

  const formatDate = (date: Date | string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const chiefAdmin = data?.approvals?.find((a: any) => a.approverRole === 'CHIEF_ADMINISTRATIVE');
  const isChiefAdminApproved = chiefAdmin && chiefAdmin.status === 'APPROVED';
  const signatureImage = isChiefAdminApproved ? chiefAdmin.signatureData : null;

  const approverName = "Atty. Marvin P. Apduhan, CPA";
  const approverTitle = "Chief, Administrative Officer";

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

      <div className="flex justify-center p-8 bg-white dark:bg-black">
        <div 
          className="bg-white box-border shadow-xl print:shadow-none relative overflow-hidden"
          style={{ 
            width: '210mm', 
            minHeight: '287mm',
            padding: '0',    
            fontFamily: '"Times New Roman", Times, serif',
            color: 'black'
          }}
        >
          <div className="w-full">
            <Image 
              src={logo} 
              alt="Department of Agriculture Header Banner" 
              className="w-full h-auto object-contain"
              width={1000} 
              height={200} 
              priority
            />
          </div>

          <div style={{ padding: '10mm 20mm 20mm 20mm' }}>
            <div className="text-center mb-10">
              <h1 className="font-bold uppercase tracking-wide" style={{ fontSize: '12pt' }}>
                PROPOSED ITINERARY FOR OFFICIAL TRAVEL
              </h1>
            </div>

            <div className="grid grid-cols-2 gap-y-6 mb-8" style={{ fontSize: '11pt', paddingLeft: '5mm', paddingRight: '5mm' }}>
              <div className="flex flex-col gap-y-4">
                <div className="flex">
                  <span className="w-[20mm]">Name:</span>
                  <span className="font-bold uppercase">{data?.requestorName || 'N/A'}</span>
                </div>
                <div className="flex">
                  <span className="w-[20mm]">Position:</span>
                  <span className="font-bold">{data?.requestorPosition || 'N/A'}</span>
                </div>
              </div>

              <div className="flex flex-col gap-y-4">
                <div className="flex">
                  <span className="w-[22mm]">Date:</span>
                  <span className="font-bold">
                    {formatDate(data?.departureDate)}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="w-[22mm]">Travel<br/>Destination:</span>
                  <span className="font-bold leading-tight">
                    {data?.specificLocation}<br/>{data?.destinationProvince}
                  </span>
                </div>
              </div>
            </div>

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
                {data?.itineraryItems && data.itineraryItems.length > 0 ? (
                  data.itineraryItems.map((item: any, index: number) => (
                    <tr key={index}>
                      <td className="border border-black p-2 align-top font-bold text-center">
                        {formatDate(item.date)}
                      </td>
                      <td className="border border-black p-2 align-top">
                        {item.location}
                      </td>
                      <td className="border border-black p-2 align-top">
                        {item.activity}
                      </td>
                      <td className="border border-black p-2 align-top text-center">
                        {item.responsiblePerson}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="border border-black p-4 text-center italic">
                      No itinerary items provided.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="grid grid-cols-2 gap-10" style={{ fontSize: '11pt', paddingLeft: '5mm', paddingRight: '5mm' }}>
              <div className="flex flex-col">
                <span className="mb-2">Requested by:</span>
                {data?.requestorSignature && (
                  <div className="">
                    <img src={data.requestorSignature} alt="Signature" className="h-8 ml-12 object-contain" />
                  </div>
                )}
                <span className="font-bold uppercase">{data?.requestorName}</span>
                <span className="ml-10">{data?.requestorPosition}</span>
              </div>

              <div className="flex flex-col">
                <span className="mb-2">Approved by:</span>
                <div style={{ minHeight: '18px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                  {signatureImage && (
                    <img src={signatureImage} alt="Signature" className="h-8 ml-20 text- object-contain" />
                  )}
                </div>
                <span className="font-bold uppercase">{approverName}</span>
                <span className="ml-8">{approverTitle}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
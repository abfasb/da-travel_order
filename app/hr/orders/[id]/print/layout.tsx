export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        @media print {
          aside, .sidebar, nav, header, .print-button, footer {
            display: none !important;
          }

          main, .main-content, #root, .layout-wrapper {
            margin: 0 !important;
            padding: 0 !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
          }

          body {
            background-color: white !important;
          }
        }
      `}</style>
      {children}
    </>
  )
}
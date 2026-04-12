export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        @media print {
          /* 1. Hide everything that isn't the print content */
          aside, .sidebar, nav, .print-button, footer {
            display: none !important;
          }

          /* 2. Reset the layout containers */
          /* If your dashboard uses a main tag or a wrapper with margins */
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
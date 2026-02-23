import "./globals.css";
import type { Metadata } from "next";

import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
// import { Lato } from "next/font/google";
import '../app/lib/config/invoiceReminderCron';
import Sidebar from "@/components/common/Sidebar";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

export const metadata: Metadata = {
  title: "SUD",
  description:
    "SUD Ship Management",
};

// const lato = Lato({
//   subsets: ["latin"], // Specify the subset
//   weight: ["100", "300", "400", "700", "900"], // Only supported weights
//   variable: "--font-lato", // CSS variable for the font
//   style: ["normal", "italic"], // Include both normal and italic styles
//   display: "swap", // Use swap for better performance
// });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} relative antialiased`}
      >
        <AuthProvider>
          <div className="flex">
            <Sidebar />
            <div className="flex-1 w-[83%] border-l border-secondary">
              <Navbar />
              <main>{children}</main>
              <div id="modal-root"></div>
              <ToastContainer
                rtl={false}
                autoClose={2000}
                newestOnTop={true}
                position="top-right"
                hideProgressBar={false}
              />
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

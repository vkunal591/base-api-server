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
import { FaLock } from "react-icons/fa";
import Link from "next/link";

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
        {/* <div className="flex flex-col items-center justify-center h-screen bg-white rounded-2xl">
          <div className="max-w-2xl text-center">
            <div className="flex items-center justify-center mb-6">
              <FaLock className="text-red-500 text-7xl" />
            </div>
            <h1 className="text-3xl md:text-6xl font-bold text-gray-800 mb-4">
              Plan Expire 
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              You don&apos;t have the required permissions. If you believe this
              is a mistake, please contact your administrator.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={""}
                className="px-6 py-3 bg-red-500 text-white rounded-lg text-xl hover:bg-red-600 transition"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div> */}

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

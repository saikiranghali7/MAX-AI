"use client";

import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";

export default function AppLayout({ children }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0D0D0D] text-white">

      {/* Top Navbar */}
      <Navbar />

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex min-w-0 flex-1 overflow-hidden">
          {children}
        </main>

      </div>

    </div>
  );
}
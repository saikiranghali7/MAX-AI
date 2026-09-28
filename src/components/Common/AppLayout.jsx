import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";

export default function AppLayout({ children }) {
  return (
    <div className="h-screen bg-[#09090B] text-white flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

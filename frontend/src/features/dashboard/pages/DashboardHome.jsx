import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MainSection from "../components/MainSection";
// import TableData from "../components/TableData";

export default function DashboardHome() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#F7F8FA] flex flex-col">
      <Navbar />

      <div className="flex flex-1 min-w-0 overflow-x-hidden">
        <Sidebar />

        <div className="flex-1 min-w-0 overflow-x-hidden">
          <MainSection />
          {/* <TableData /> */}
        </div>
      </div>
    </div>
  );
}
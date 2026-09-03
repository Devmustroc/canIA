import React from 'react';
import Sidebar from "@/app/(dashboard)/_components/sidebar";
import Navbar from "@/app/(dashboard)/_components/navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="h-full min-h-screen bg-[#F8F9FA]">
      <Sidebar />
      <div className="lg:pl-[300px] flex flex-col h-full min-h-screen">
        <Navbar />
        <main className="flex-1 overflow-auto p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
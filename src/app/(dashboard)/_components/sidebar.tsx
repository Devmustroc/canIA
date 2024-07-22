import React from 'react';
import Logo from "@/app/(dashboard)/_components/logo";
import SidebarRoutes from "@/app/(dashboard)/_components/sidebar-routes";

const Sidebar = () => {
    return (
        <aside
            className="hidden lg:flex fixed flex-col w-[300px] left-0 shrink-0 h-full"
        >
            <Logo />
            <SidebarRoutes />
        </aside>
    );
};

export default Sidebar;
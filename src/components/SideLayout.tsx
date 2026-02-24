import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Package, BarChart2, Star, LayoutDashboard, Calendar, Bell, LayoutGrid, ClipboardList } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useStarred } from "@/contexts/StarredContext";
import { UserMenu } from "@/components/UserMenu";

interface SideLayoutProps {
  children: React.ReactNode;
}

const SideLayout = ({ children }: SideLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { starredIndices } = useStarred();

  const menuItems = [
    {
      title: "Portal Home",
      path: "/portal",
      icon: LayoutGrid,
    },
    {
      title: "Index Inventory / Report",
      path: "/inventory",
      icon: Package,
    },
    {
      title: "Starred Indices",
      path: "/starred",
      icon: Star,
      badge: starredIndices.length > 0 ? starredIndices.length : undefined,
    },
    {
      title: "My Dashboards",
      path: "/dashboards",
      icon: LayoutDashboard,
    },
    {
      title: "Simulate / Backtest",
      path: "/simulator",
      icon: BarChart2,
    },
    {
      title: "Operate",
      path: "/manage",
      icon: ClipboardList,
    },
    {
      title: "Events",
      path: "/events",
      icon: Bell,
    },
    {
      title: "Corporate Events",
      path: "/corporate-events",
      icon: Calendar,
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar variant="inset" collapsible="icon">
          <SidebarHeader className="flex items-center justify-between px-2 py-4">
            <div className="text-teal-500 font-bold text-lg">SOLACTIVE</div>
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={location.pathname === item.path}
                    tooltip={item.title}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon
                      className={`h-5 w-5 ${item.path === "/starred" && starredIndices.length > 0 ? "text-yellow-400" : ""}`}
                    />
                    <span>{item.title}</span>
                    {item.badge && (
                      <span className="ml-auto bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 overflow-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
            <div className="font-semibold">SOLACTIVE</div>
            <UserMenu />
          </div>
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SideLayout;

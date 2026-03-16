import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Package, BarChart2, Star, LayoutDashboard, Calendar, LayoutGrid, ClipboardList, RotateCcw, FileChartLine, ShoppingBasket, Briefcase, Database, X } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SideLayoutProps {
  children: React.ReactNode;
}

const portalApps = [
  { id: "index-insights", name: "Index Insights", description: "View and manage index data, simulations and dashboards", icon: FileChartLine, path: "/manage", active: true },
  { id: "basket-insights", name: "Basket Insights", description: "Analyze and manage basket instruments", icon: ShoppingBasket, path: "/basket-insights", active: false },
  { id: "corporate-action-insights", name: "Corporate Action Insights", description: "Monitor and handle corporate actions", icon: Briefcase, path: "/corporate-action-insights", active: false },
  { id: "index-platform", name: "Index Platform", description: "Comprehensive index management platform", icon: Database, path: "/index-platform", active: false },
];

const SideLayout = ({ children }: SideLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { starredIndices } = useStarred();
  const [showAppPicker, setShowAppPicker] = useState(false);

  const menuItems = [
    {
      title: "Portal Home",
      path: "__portal_picker__",
      icon: LayoutGrid,
    },
    {
      title: "Operate",
      path: "/manage",
      icon: ClipboardList,
    },
    {
      title: "Index Inventory",
      path: "/inventory",
      icon: Package,
    },
    {
      title: "My Dashboards",
      path: "/dashboards",
      icon: LayoutDashboard,
    },
    {
      title: "Starred Indices",
      path: "/starred",
      icon: Star,
      badge: starredIndices.length > 0 ? starredIndices.length : undefined,
    },
    {
      title: "Simulate / Backtest",
      path: "/simulator",
      icon: BarChart2,
    },
    {
      title: "Rollback / Correction",
      path: "/rollback",
      icon: RotateCcw,
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

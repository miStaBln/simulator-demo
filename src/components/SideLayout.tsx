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
                    isActive={item.path !== "__portal_picker__" && location.pathname === item.path}
                    tooltip={item.title}
                    onClick={() => {
                      if (item.path === "__portal_picker__") {
                        setShowAppPicker(true);
                      } else {
                        navigate(item.path);
                      }
                    }}
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

      {/* App Picker Overlay */}
      {showAppPicker && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center" onClick={() => setShowAppPicker(false)}>
          <div className="bg-background border rounded-xl shadow-xl max-w-3xl w-full mx-4 p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Solactive Portal</h2>
              <button onClick={() => setShowAppPicker(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {portalApps.map((app) => (
                <Card
                  key={app.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-lg",
                    app.active ? "border-primary hover:border-primary" : "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => {
                    if (app.active) {
                      setShowAppPicker(false);
                      navigate(app.path);
                    }
                  }}
                >
                  <CardContent className="p-5 flex flex-col items-center text-center">
                    <div className={cn(
                      "p-3 rounded-full mb-3",
                      app.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      <app.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-sm font-semibold mb-1">{app.name}</h3>
                    <p className="text-xs text-muted-foreground">{app.description}</p>
                    {!app.active && (
                      <span className="mt-2 text-[10px] py-0.5 px-2 bg-muted rounded-full text-muted-foreground">Coming Soon</span>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </SidebarProvider>
  );
};

export default SideLayout;

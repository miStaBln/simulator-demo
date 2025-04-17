
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Package, BarChart2, Star, LayoutDashboard, Calendar } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { useStarred } from '@/contexts/StarredContext';

interface SideLayoutProps {
  children: React.ReactNode;
}

const SideLayout = ({ children }: SideLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { starredIndices } = useStarred();

  const menuItems = [
    {
      title: 'Index Inventory',
      path: '/inventory',
      icon: Package,
    },
    {
      title: 'My Dashboards',
      path: '/dashboards',
      icon: LayoutDashboard,
    },
    {
      title: 'Corporate Events',
      path: '/corporate-events',
      icon: Calendar,
    },
    {
      title: 'Simulator',
      path: '/simulator',
      icon: BarChart2,
    },
    {
      title: 'Starred Indices',
      path: '/starred',
      icon: Star,
      badge: starredIndices.length > 0 ? starredIndices.length : undefined,
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar variant="inset" collapsible="icon">
          <SidebarHeader className="px-2 py-4">
            <div className="text-teal-500 font-bold text-lg">SOLACTIVE</div>
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
                    <item.icon className={`h-5 w-5 ${item.path === '/starred' && starredIndices.length > 0 ? 'text-yellow-400' : ''}`} />
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
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SideLayout;

import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  UserCog,
  MapPin,
  BarChart3,
  Menu
} from "lucide-react";
import logoTicketIdeal from "@/assets/logo-ticket-ideal.png";
import logoTicketIdealGray from "@/assets/logo-ticket-ideal-gray.png";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
    description: "Visão geral e métricas"
  },
  {
    title: "Clientes",
    url: "/clientes",
    icon: Users,
    description: "Busca por nome, CPF, celular ou e-mail"
  },
  {
    title: "Eventos",
    url: "/eventos",
    icon: Calendar,
    description: "Gestão de eventos"
  },
  {
    title: "Financeiro",
    url: "/financeiro",
    icon: DollarSign,
    description: "Controle financeiro"
  },
  {
    title: "Vendas",
    url: "/vendas",
    icon: TrendingUp,
    description: "Relatórios e acompanhamento"
  },
  {
    title: "Produtores",
    url: "/produtores",
    icon: UserCog,
    description: "Gerenciamento de produtores"
  },
  {
    title: "Locais",
    url: "/locais",
    icon: MapPin,
    description: "Gestão de locais de eventos"
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for dark mode on mount
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const logoSrc = isDarkMode ? logoTicketIdealGray : logoTicketIdeal;

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    const active = isActive(path);
    return active 
      ? "bg-gradient-primary text-primary-foreground font-medium shadow-soft" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground hover:text-sidebar-accent-foreground";
  };

  return (
    <Sidebar
      collapsible="icon"
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] transition-all duration-300 border-r border-sidebar-border bg-sidebar shadow-medium z-40 ${
        collapsed ? "w-16" : "w-64"
      } md:block ${state === "expanded" ? "block" : "hidden md:block"}`}
    >
      <SidebarContent className={collapsed ? "p-1" : "p-2"}>
        <SidebarGroup>
          <SidebarGroupLabel className={`${collapsed ? "px-0" : "px-2"} text-sidebar-foreground/60`}>
            {!collapsed && "Navegação"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className={collapsed ? "space-y-2" : "space-y-1"}>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`${getNavClassName(item.url)} ${
                        collapsed 
                          ? "rounded-lg p-3 h-12 w-12 flex items-center justify-center mx-auto relative group" 
                          : "rounded-lg px-3 py-2"
                      } transition-all duration-200`}
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className={`${collapsed ? "h-5 w-5" : "h-5 w-5 mr-3"} flex-shrink-0`} />
                      {!collapsed && (
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="font-medium text-sm">{item.title}</span>
                          <span className="text-xs opacity-70 truncate">
                            {item.description}
                          </span>
                        </div>
                      )}
                      
                      {/* Tooltip for collapsed state */}
                      {collapsed && (
                        <div className="absolute left-full ml-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[60] border border-border">
                          <div className="font-medium">{item.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{item.description}</div>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <div className="mt-auto p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between">
          <SidebarTrigger className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
          {!collapsed && (
            <div className="text-xs text-sidebar-foreground/50">
              © 2024 Ticket Ideal
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
}
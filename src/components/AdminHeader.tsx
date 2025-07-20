import { useState } from "react";
import { 
  Bell, 
  HelpCircle, 
  Eye, 
  EyeOff, 
  Settings,
  LogOut,
  Sun,
  Moon,
  User,
  ChevronDown,
  Shield
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface AdminHeaderProps {
  showFinancialValues: boolean;
  onToggleFinancialValues: () => void;
  selectedEvent: string;
  onEventChange: (eventId: string) => void;
  userRole: "total" | "producer" | "admin";
  username: string;
  onThemeToggle: () => void;
  isDarkMode: boolean;
}

const mockEvents = [
  { id: "1", name: "Rock in Rio 2024", status: "open" },
  { id: "2", name: "Festival de Verão Salvador", status: "private" },
  { id: "3", name: "Lollapalooza Brasil", status: "open" },
  { id: "4", name: "Villa Mix Festival", status: "open" },
];

export function AdminHeader({
  showFinancialValues,
  onToggleFinancialValues,
  selectedEvent,
  onEventChange,
  userRole,
  username,
  onThemeToggle,
  isDarkMode
}: AdminHeaderProps) {
  const [notifications] = useState(3);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "total": return "Acesso Total";
      case "producer": return "Produtor";
      case "admin": return "Administrador";
      default: return role;
    }
  };

  const getAvailableEvents = () => {
    if (userRole === "producer") {
      // Producers only see their own events
      return mockEvents.filter(event => event.id === "2");
    }
    return mockEvents;
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border shadow-soft flex items-center justify-between px-3 md:px-6 relative z-50">
      {/* Left side - Logo and Menu trigger */}
      <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <img 
            src="/src/assets/logo-ticket-ideal.png" 
            alt="Ticket Ideal" 
            className="h-6 md:h-8 w-auto object-contain"
          />
        </div>
      </div>

      {/* Right side - Controls and user menu */}
      <div className="flex items-center gap-1 md:gap-3 flex-shrink-0">
        {/* Financial visibility toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFinancialValues}
          className="bg-background border-input hover:bg-accent hover:text-accent-foreground hidden lg:flex"
        >
          {showFinancialValues ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          <span className="ml-2">
            {showFinancialValues ? "Ocultar" : "Mostrar"} Valores
          </span>
        </Button>

        {/* Financial visibility toggle mobile */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFinancialValues}
          className="bg-background border-input hover:bg-accent hover:text-accent-foreground lg:hidden"
        >
          {showFinancialValues ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </Button>

        {/* Support button */}
        <Button
          variant="outline"
          size="sm"
          className="bg-background border-input hover:bg-accent hover:text-accent-foreground hidden md:flex"
        >
          <HelpCircle className="h-4 w-4" />
          <span className="ml-2">Suporte</span>
        </Button>

        {/* Support button mobile */}
        <Button
          variant="outline"
          size="sm"
          className="bg-background border-input hover:bg-accent hover:text-accent-foreground md:hidden"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <Button
          variant="outline"
          size="sm"
          className="relative bg-background border-input hover:bg-accent hover:text-accent-foreground"
        >
          <Bell className="h-4 w-4" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
              {notifications}
            </span>
          )}
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-background border-input hover:bg-accent hover:text-accent-foreground">
              <User className="h-4 w-4" />
              <span className="ml-2 hidden sm:block">{username}</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-popover border-border z-[100]" align="end">
            <DropdownMenuLabel className="text-popover-foreground">
              <div>
                <p className="font-medium">{username}</p>
                <p className="text-xs text-muted-foreground">
                  {getRoleDisplayName(userRole)}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/alterar-senha" className="flex items-center text-popover-foreground hover:bg-accent hover:text-accent-foreground">
                <Shield className="h-4 w-4 mr-2" />
                Alterar Senha
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onThemeToggle}
              className="text-popover-foreground hover:bg-accent hover:text-accent-foreground"
            >
              {isDarkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
              {isDarkMode ? "Tema Claro" : "Tema Escuro"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
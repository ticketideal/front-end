import { useState, useEffect } from "react";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AdminHeader } from "@/components/AdminHeader";
import ProtectedRoute from "@/components/ProtectedRoute";

interface LayoutProps {
  children: React.ReactNode | ((props: {
    selectedEvent: string;
    showFinancialValues: boolean;
    userRole: "total" | "producer" | "admin";
  }) => React.ReactNode);
}

export function Layout({ children }: LayoutProps) {
  const [showFinancialValues, setShowFinancialValues] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState("1");
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Mock user data - in real app this would come from authentication
  const [userRole] = useState<"total" | "producer" | "admin">("total");
  const [username] = useState("João Silva");

  // Theme management
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleToggleFinancialValues = () => {
    setShowFinancialValues(!showFinancialValues);
  };

  const handleEventChange = (eventId: string) => {
    setSelectedEvent(eventId);
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ProtectedRoute>
      <SidebarProvider defaultOpen={false}>
        <LayoutContent 
          showFinancialValues={showFinancialValues}
          onToggleFinancialValues={handleToggleFinancialValues}
          selectedEvent={selectedEvent}
          onEventChange={handleEventChange}
          userRole={userRole}
          username={username}
          onThemeToggle={handleThemeToggle}
          isDarkMode={isDarkMode}
          children={children}
        />
      </SidebarProvider>
    </ProtectedRoute>
  );
}

function LayoutContent({ 
  showFinancialValues, 
  onToggleFinancialValues, 
  selectedEvent, 
  onEventChange, 
  userRole, 
  username, 
  onThemeToggle, 
  isDarkMode, 
  children 
}: any) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      <AdminHeader
        showFinancialValues={showFinancialValues}
        onToggleFinancialValues={onToggleFinancialValues}
        selectedEvent={selectedEvent}
        onEventChange={onEventChange}
        userRole={userRole}
        username={username}
        onThemeToggle={onThemeToggle}
        isDarkMode={isDarkMode}
      />
      
      <div className="flex flex-1">
        <div className={`hidden md:block flex-shrink-0 transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}></div>
        <main className="flex-1 h-[calc(100vh-4rem)] overflow-auto">
          {typeof children === 'function' ? children({ 
            selectedEvent, 
            showFinancialValues, 
            userRole 
          }) : children}
        </main>
      </div>
      <AppSidebar />
    </div>
  );
}
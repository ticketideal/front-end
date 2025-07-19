import { AdminDashboard } from "@/components/AdminDashboard";

// As props agora vêm do Layout através do contexto ou props
interface IndexProps {
  selectedEvent?: string;
  showFinancialValues?: boolean;
  userRole?: "total" | "producer" | "admin";
}

const Index = ({ 
  selectedEvent = "1", 
  showFinancialValues = true, 
  userRole = "total" 
}: IndexProps) => {
  return (
    <AdminDashboard
      selectedEvent={selectedEvent}
      showFinancialValues={showFinancialValues}
      userRole={userRole}
    />
  );
};

export default Index;

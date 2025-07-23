import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  customerService,
  CustomerApiParams,
  CustomerFilters,
  Customer,
} from "@/services/customerService";
import { useToast } from "@/components/ui/use-toast";

export const useCustomers = (params: CustomerApiParams) => {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => customerService.getCustomers(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useCustomerById = (id: string) => {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => customerService.getCustomerById(id),
    enabled: !!id,
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      id,
      customer,
    }: {
      id: string;
      customer: Partial<Customer>;
    }) => customerService.updateCustomer(id, customer),
    onSuccess: (updatedCustomer) => {
      // Invalida as queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.setQueryData(
        ["customer", updatedCustomer.id],
        updatedCustomer
      );

      toast({
        title: "Cliente atualizado",
        description: "As informações do cliente foram atualizadas com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar as informações do cliente.",
        variant: "destructive",
      });
      console.error("Erro ao atualizar cliente:", error);
    },
  });
};

export const useExportCustomers = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      filters,
      format,
    }: {
      filters: CustomerFilters;
      format: "excel" | "pdf";
    }) => customerService.exportCustomers(filters, format),
    onSuccess: (blob, variables) => {
      // Cria download do arquivo
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `clientes.${variables.format === "excel" ? "xlsx" : "pdf"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Exportação concluída",
        description: `Arquivo ${variables.format.toUpperCase()} baixado com sucesso.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados.",
        variant: "destructive",
      });
      console.error("Erro ao exportar:", error);
    },
  });
};

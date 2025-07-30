import { api } from "@/lib/axios"; // usa seu interceptor configurado

export interface Customer {
  id: string;
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  telefone: string;
  ingressos: number;
  valorTotal: number;
  dataCompra: string;
  status: string;
  totalVendas: number;
  produtores: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CustomerFilters {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface CustomerApiParams extends CustomerFilters {
  page: number;
  limit: number;
}

class CustomerService {
  async getCustomers(params: CustomerApiParams): Promise<PaginatedResponse<Customer>> {
    const response = await api.get("/clientes", { params });
    return response.data;
  }

  async getCustomerById(id: string): Promise<Customer> {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  }

  async updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer> {
    const response = await api.put(`/clientes/${id}`, customer);
    return response.data;
  }

  async exportCustomers(filters: CustomerFilters, format: "excel" | "pdf"): Promise<Blob> {
    const response = await api.get("/clientes/export", {
      params: { ...filters, format },
      responseType: "blob",
    });

    return response.data;
  }
}

export const customerService = new CustomerService();

import { api } from "@/lib/axios";

export interface Event {
  id: number;
  status: string;
  produtor: string;
  tipoEvento: string;
  nomeEvento: string;
  formaPagamento: string;
  cobrarTaxa: boolean;
  taxaTicketIdeal: string;
  taxaBancaria: boolean;
  nomearIngressos: boolean;
  classificacao: string;
  pixelFacebook: string;
  arteEvento: string;
  descricao: string;
  certificadoCurso: boolean;
  quantidadeSessoes: number;
  urlEvento: string;
}

export interface EventFilters {
  search?: string;
  showArchived?: boolean;
  status?: string;
  tipoEvento?: string;
  produtor?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateEventData {
  nomeEvento: string;
  produtor: string;
  tipoEvento: string;
  classificacao: string;
  formaPagamento: string;
  taxaTicketIdeal: string;
  pixelFacebook: string;
  descricao: string;
  cobrarTaxa: boolean;
  taxaBancaria: boolean;
  nomearIngressos: boolean;
  certificadoCurso: boolean;
  arteEvento?: string;
}

// Interface para a resposta da sua API
interface ApiResponse {
  current_page: number;
  data: Event[];
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
  path: string;
}

class EventService {
  private baseUrl = '/eventos'; // Substitua pela URL da sua API

  async getEvents(
    page: number = 1,
    limit: number = 10,
    filters: EventFilters = {}
  ): Promise<PaginatedResponse<Event>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
        )
      });

      const response = await api.get(`${this.baseUrl}?${params}`);
      console.log(response);
      if (!response.data) {
        throw new Error(`Erro ao buscar eventos: ${response.statusText}`);
      }

      const apiResponse: ApiResponse = await response.data;

      // Mapear a resposta da API para o formato esperado pelo frontend
      return {
        data: apiResponse.data,
        total: apiResponse.total,
        page: apiResponse.current_page,
        limit: apiResponse.per_page,
        totalPages: apiResponse.last_page,
      };
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      throw error;
    }
  }

  async getEvent(id: number): Promise<Event> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar evento: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar evento:', error);
      throw error;
    }
  }

  async createEvent(eventData: CreateEventData): Promise<Event> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error(`Erro ao criar evento: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      throw error;
    }
  }

  async updateEvent(id: number, eventData: Partial<CreateEventData>): Promise<Event> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar evento: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      throw error;
    }
  }

  async deleteEvent(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Erro ao deletar evento: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      throw error;
    }
  }

  async updateEventStatus(id: number, status: string): Promise<Event> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar status: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  }

  async archiveEvent(id: number): Promise<Event> {
    return this.updateEventStatus(id, 'Arquivado');
  }

  async unarchiveEvent(id: number, newStatus: string = 'Aguardando Revisão'): Promise<Event> {
    return this.updateEventStatus(id, newStatus);
  }

  async searchEvents(query: string, limit: number = 8): Promise<Event[]> {
    try {
      const params = new URLSearchParams({
        search: query,
        limit: limit.toString(),
      });

      const response = await api.get(`${this.baseUrl}/search?${params}`);
      
      if (!response.data) {
        throw new Error(`Erro ao buscar eventos: ${response.statusText}`);
      }

      return await response.data;
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      throw error;
    }
  }
}

export const eventService = new EventService();

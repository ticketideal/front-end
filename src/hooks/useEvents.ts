import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService, EventFilters, CreateEventData } from '@/services/eventService';
import { toast } from '@/hooks/use-toast';

export const useEvents = (page: number = 1, limit: number = 10, filters: EventFilters = {}) => {
  const queryClient = useQueryClient();

  // Desabilitar chamadas à API por enquanto (API não implementada)
  const query = useQuery({
    queryKey: ['events', page, limit, filters],
    queryFn: () => eventService.getEvents(page, limit, filters),
    placeholderData: (previousData) => previousData,
    enabled: true, // Desabilita a chamada automática à API
  });

  const createEventMutation = useMutation({
    mutationFn: (eventData: CreateEventData) => eventService.createEvent(eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Sucesso",
        description: "Evento criado com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar evento",
        variant: "destructive",
      });
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateEventData> }) =>
      eventService.updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Sucesso",
        description: "Evento atualizado com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar evento",
        variant: "destructive",
      });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id: number) => eventService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Sucesso",
        description: "Evento deletado com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao deletar evento",
        variant: "destructive",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      eventService.updateEventStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Sucesso",
        description: "Status atualizado com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar status",
        variant: "destructive",
      });
    },
  });

  return {
    ...query,
    createEvent: createEventMutation.mutate,
    updateEvent: updateEventMutation.mutate,
    deleteEvent: deleteEventMutation.mutate,
    updateStatus: updateStatusMutation.mutate,
    isCreating: createEventMutation.isPending,
    isUpdating: updateEventMutation.isPending,
    isDeleting: deleteEventMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
  };
};

export const useEvent = (id: number) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => eventService.getEvent(id),
    enabled: !!id,
  });
};
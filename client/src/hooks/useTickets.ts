/**
 * hooks/useTickets.ts
 * Hook untuk manajemen ticket — dipakai semua role.
 */

"use client";

import { useState, useCallback } from "react";
import ticketService, {
  Ticket, TicketFull, PaymentSummary,
  CreateTicketPayload, ApproveTicketPayload,
  UpdateStatusPayload, TicketListParams,
} from "../services/ticket.service";

export function useTickets() {
  const [tickets, setTickets]           = useState<Ticket[]>([]);
  const [ticket, setTicket]             = useState<TicketFull | null>(null);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null);
  const [isLoading, setIsLoading]       = useState(false);
  const [error, setError]               = useState<string | null>(null);

  const clearError = () => setError(null);

  const fetchAll = useCallback(async (params?: TicketListParams) => {
    setIsLoading(true); setError(null);
    try {
      const data = await ticketService.getAll(params);
      setTickets(data);
    } catch (e) { setError(e as string); }
    finally { setIsLoading(false); }
  }, []);

  const fetchById = useCallback(async (id: string) => {
    setIsLoading(true); setError(null);
    try {
      const data = await ticketService.getFull(id);
      setTicket(data);
    } catch (e) { setError(e as string); }
    finally { setIsLoading(false); }
  }, []);

  const fetchPaymentSummary = useCallback(async (id: string) => {
    try {
      const data = await ticketService.getPaymentSummary(id);
      setPaymentSummary(data);
    } catch (e) { setError(e as string); }
  }, []);

  const createTicket = useCallback(async (payload: CreateTicketPayload): Promise<Ticket | null> => {
    setIsLoading(true); setError(null);
    try {
      const data = await ticketService.create(payload);
      setTickets((prev) => [data, ...prev]);
      return data;
    } catch (e) { setError(e as string); return null; }
    finally { setIsLoading(false); }
  }, []);

  const approveTicket = useCallback(async (id: string, payload: ApproveTicketPayload): Promise<boolean> => {
    setIsLoading(true); setError(null);
    try {
      const updated = await ticketService.approve(id, payload);
      setTickets((prev) => prev.map((t) => (t._id === id ? updated : t)));
      if (ticket?._id === id) setTicket((prev) => prev ? { ...prev, ...updated } : null);
      return true;
    } catch (e) { setError(e as string); return false; }
    finally { setIsLoading(false); }
  }, [ticket]);

  const updateStatus = useCallback(async (id: string, payload: UpdateStatusPayload): Promise<boolean> => {
    setIsLoading(true); setError(null);
    try {
      const updated = await ticketService.updateStatus(id, payload);
      setTickets((prev) => prev.map((t) => (t._id === id ? updated : t)));
      return true;
    } catch (e) { setError(e as string); return false; }
    finally { setIsLoading(false); }
  }, []);

  return {
    tickets, ticket, paymentSummary,
    isLoading, error, clearError,
    fetchAll, fetchById, fetchPaymentSummary,
    createTicket, approveTicket, updateStatus,
  };
}
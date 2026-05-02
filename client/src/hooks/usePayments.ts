/**
 * hooks/usePayments.ts
 */
"use client";
import { useState, useCallback } from "react";
import paymentService, {
  Payment, CreatePaymentPayload, ApprovePaymentPayload,
} from "../services/payment.service";

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [payment, setPayment]   = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const clearError = () => setError(null);

  const fetchByTicket = useCallback(async (ticketId: string) => {
    setIsLoading(true); setError(null);
    try { setPayments(await paymentService.getByTicket(ticketId)); }
    catch (e) { setError(e as string); }
    finally { setIsLoading(false); }
  }, []);

  const fetchById = useCallback(async (id: string) => {
    setIsLoading(true); setError(null);
    try { setPayment(await paymentService.getById(id)); }
    catch (e) { setError(e as string); }
    finally { setIsLoading(false); }
  }, []);

  const createPayment = useCallback(async (payload: CreatePaymentPayload): Promise<Payment | null> => {
    setIsLoading(true); setError(null);
    try {
      const data = await paymentService.create(payload);
      setPayments((prev) => [...prev, data]);
      return data;
    } catch (e) { setError(e as string); return null; }
    finally { setIsLoading(false); }
  }, []);

  const approvePayment = useCallback(async (id: string, payload: ApprovePaymentPayload): Promise<boolean> => {
    setIsLoading(true); setError(null);
    try {
      const updated = await paymentService.approve(id, payload);
      setPayments((prev) => prev.map((p) => (p._id === id ? updated : p)));
      return true;
    } catch (e) { setError(e as string); return false; }
    finally { setIsLoading(false); }
  }, []);

  return {
    payments, payment, isLoading, error, clearError,
    fetchByTicket, fetchById, createPayment, approvePayment,
  };
}
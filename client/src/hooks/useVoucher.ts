/**
 * hooks/useVoucher.ts
 */
"use client";
import { useState, useCallback } from "react";
import voucherService, { Voucher } from "../services/voucher.service";

export function useVoucher() {
  const [vouchers, setVouchers]   = useState<Voucher[]>([]);
  const [voucher, setVoucher]     = useState<Voucher | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const clearError = () => setError(null);

  const fetchMine = useCallback(async () => {
    setIsLoading(true); setError(null);
    try { setVouchers(await voucherService.getMine()); }
    catch (e) { setError(e as string); }
    finally { setIsLoading(false); }
  }, []);

  const findByCode = useCallback(async (code: string): Promise<Voucher | null> => {
    setIsLoading(true); setError(null);
    try {
      const data = await voucherService.getByCode(code);
      setVoucher(data);
      return data;
    } catch (e) { setError(e as string); return null; }
    finally { setIsLoading(false); }
  }, []);

  return { vouchers, voucher, isLoading, error, clearError, fetchMine, findByCode };
}
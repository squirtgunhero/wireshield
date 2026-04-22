"use client";

import { useState, useEffect, useCallback } from "react";

interface TransactionData {
  id: string;
  status: string;
  currentPhase: string;
  propertyAddress: string;
  propertyCity?: string | null;
  propertyState?: string | null;
  purchasePrice?: number | null;
  riskScore?: number | null;
  riskLevel: string;
  parties: Array<{ id: string; name: string; role: string; status: string }>;
  wireInstructions: unknown[];
  alerts: unknown[];
  riskEvents: unknown[];
  _count?: Record<string, number>;
}

export function useTransaction(id: string) {
  const [data, setData] = useState<TransactionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch(`/api/transactions/${id}`);
      if (!res.ok) throw new Error("Failed to fetch transaction");
      const { transaction } = await res.json();
      setData(transaction);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { transaction: data, loading, error, refetch: fetch_ };
}

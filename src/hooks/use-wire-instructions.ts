"use client";

import { useState, useEffect, useCallback } from "react";

interface WireData {
  id: string;
  direction: string;
  bankName: string;
  amount: number | string | null;
  status: string;
  accountHolderName: string;
  plaidVerified: boolean;
  fromParty?: { name: string } | null;
  toParty?: { name: string } | null;
}

export function useWireInstructions(transactionId: string) {
  const [wires, setWires] = useState<WireData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWires = useCallback(async () => {
    try {
      const res = await fetch(`/api/transactions/${transactionId}`);
      if (!res.ok) throw new Error("Failed to fetch wires");
      const { transaction } = await res.json();
      setWires(transaction.wireInstructions ?? []);
    } catch {
      setWires([]);
    } finally {
      setLoading(false);
    }
  }, [transactionId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/transactions/${transactionId}`);
        if (cancelled) return;
        if (!res.ok) throw new Error("Failed");
        const { transaction } = await res.json();
        if (!cancelled) setWires(transaction.wireInstructions ?? []);
      } catch {
        if (!cancelled) setWires([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [transactionId]);

  return { wires, loading, refetch: fetchWires };
}

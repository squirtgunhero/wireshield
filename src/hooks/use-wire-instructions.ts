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

  const fetch_ = useCallback(async () => {
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

  useEffect(() => { fetch_(); }, [fetch_]);

  return { wires, loading, refetch: fetch_ };
}

"use client";

import { useState, useEffect, useCallback } from "react";

interface RiskScoreData {
  score: number | null;
  level: string;
  riskEventCount: number;
  activeAlertCount: number;
  suspiciousEmailCount: number;
}

export function useRiskScore(transactionId: string) {
  const [data, setData] = useState<RiskScoreData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchScore = useCallback(async () => {
    try {
      const res = await fetch(`/api/risk/score/${transactionId}`);
      if (!res.ok) throw new Error("Failed to fetch risk score");
      const d = await res.json();
      setData(d);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [transactionId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/risk/score/${transactionId}`);
        if (cancelled) return;
        if (!res.ok) throw new Error("Failed");
        const d = await res.json();
        if (!cancelled) setData(d);
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [transactionId]);

  return { riskScore: data, loading, refetch: fetchScore };
}

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

  const fetch_ = useCallback(async () => {
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

  useEffect(() => { fetch_(); }, [fetch_]);

  return { riskScore: data, loading, refetch: fetch_ };
}

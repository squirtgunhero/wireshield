"use client";

import Link from "next/link";
import { GraduationCap, Users, ArrowRight } from "lucide-react";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { TRAINING_SCENARIOS } from "@/lib/seed-data";

const DIFFICULTY_MAP: Record<string, string> = {
  Easy: "MEDIUM",
  Medium: "HIGH",
  Hard: "CRITICAL",
};

export default function TrainingPage() {
  return (
    <div className="p-4 sm:p-6 max-w-[860px]">
      <div className="mb-5 sm:mb-6">
        <h1 className="text-[20px] sm:text-[22px] font-semibold text-navy tracking-[-0.03em]">Security training</h1>
        <p className="text-[13px] text-slate-light mt-0.5">Practice identifying real-world fraud scenarios</p>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl border border-border-card p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <p className="text-[11px] text-slate-muted font-medium">Available</p>
          <p className="text-[20px] font-semibold text-navy mt-0.5">{TRAINING_SCENARIOS.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-border-card p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <p className="text-[11px] text-slate-muted font-medium">Completed</p>
          <p className="text-[20px] font-semibold text-severity-safe mt-0.5">0</p>
        </div>
        <div className="bg-white rounded-xl border border-border-card p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <p className="text-[11px] text-slate-muted font-medium">Success rate</p>
          <p className="text-[20px] font-semibold text-navy mt-0.5">--</p>
        </div>
      </div>

      <div className="space-y-3">
        {TRAINING_SCENARIOS.map((scenario) => (
          <Link
            key={scenario.id}
            href={`/training/${scenario.id}`}
            className="flex items-center gap-4 bg-white rounded-xl border border-border-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-200 group"
          >
            <div className="size-10 rounded-lg bg-indigo-bg flex items-center justify-center shrink-0">
              <GraduationCap className="size-5 text-indigo" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[14px] font-semibold text-navy group-hover:text-indigo transition-colors">{scenario.title}</h3>
              <p className="text-[12px] text-slate-light mt-0.5 line-clamp-1">{scenario.description}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <SeverityBadge severity={DIFFICULTY_MAP[scenario.difficulty] ?? "MEDIUM"} size="sm" />
                <span className="text-[11px] text-slate-muted">{scenario.difficulty}</span>
                <span className="flex items-center gap-1 text-[11px] text-slate-muted">
                  <Users className="size-3" />
                  {scenario.role}
                </span>
              </div>
            </div>
            <ArrowRight className="size-4 text-slate-muted group-hover:text-indigo transition-colors shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}

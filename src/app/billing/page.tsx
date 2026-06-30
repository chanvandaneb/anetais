"use client";

import { useState } from "react";
import {
  BarChart3,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Zap,
  Activity,
  Gauge,
  Inbox,
  CreditCard,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { plans } from "@/lib/mock-data";
import { useToast } from "@/components/ui/Toast";
import { useUsage } from "@/components/ui/UsageContext";

const columns = ["Creation Time", "Type", "Model", "Total Tokens", "Credits"];

export default function BillingPage() {
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [section, setSection] = useState<"usage" | "plans">("usage");
  const [currentPlan, setCurrentPlan] = useState("free");
  const { showToast } = useToast();
  const { rows: billingRows, usedQuota, rpm, tpm } = useUsage();

  function handleUpgrade(planId: string, name: string) {
    setCurrentPlan(planId);
    showToast(`Switched to the ${name} plan`);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* LEFT NAV */}
      <div className="flex w-[280px] flex-shrink-0 flex-col border-r border-white/10 bg-white/[0.02] p-6">
        <h1 className="text-lg font-semibold text-white">Billing</h1>
        <p className="mt-1 text-xs text-zinc-500">Usage and Subscription Management</p>

        <nav className="mt-6 flex flex-col gap-1">
          <button
            onClick={() => setSection("usage")}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium",
              section === "usage" ? "bg-white/10 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
            )}
          >
            <BarChart3 className="h-4 w-4 text-yellow-500" />
            📊 Usage
          </button>
          <button
            onClick={() => setSection("plans")}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium",
              section === "plans" ? "bg-white/10 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
            )}
          >
            <CreditCard className="h-4 w-4 text-yellow-500" />
            Plans
          </button>
        </nav>
      </div>

      {/* RIGHT CONTENT */}
      {section === "plans" ? (
        <div className="flex-1 overflow-y-auto p-8">
          <h2 className="text-xl font-semibold text-white">Plans &amp; Pricing</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Choose the plan that fits your usage. Upgrade or downgrade anytime.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
            {plans.map((plan) => {
              const isCurrent = currentPlan === plan.id;
              return (
                <Card
                  key={plan.id}
                  className={cn(
                    "flex flex-col p-6",
                    plan.highlight && "border-yellow-500/40 bg-yellow-500/[0.04]"
                  )}
                >
                  {plan.highlight && (
                    <span className="mb-3 inline-block w-fit rounded-full bg-yellow-500/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-yellow-400">
                      Most Popular
                    </span>
                  )}
                  <div className="text-sm font-medium text-zinc-300">{plan.name}</div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-3xl font-semibold text-white">{plan.price}</span>
                    <span className="text-sm text-zinc-500">{plan.period}</span>
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">{plan.credits}</div>

                  <ul className="mt-5 flex-1 space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                        <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-yellow-500" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleUpgrade(plan.id, plan.name)}
                    disabled={isCurrent}
                    className={cn(
                      "mt-6 rounded-lg py-2.5 text-sm font-medium transition-colors",
                      isCurrent
                        ? "cursor-not-allowed bg-white/5 text-zinc-500"
                        : plan.highlight
                        ? "bg-yellow-500 text-black hover:bg-yellow-400"
                        : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                    )}
                  >
                    {isCurrent ? "Current Plan" : `Switch to ${plan.name}`}
                  </button>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
      <div className="flex-1 overflow-y-auto p-8">
        <h2 className="text-xl font-semibold text-white">Credits Details</h2>

        <div className="mt-5 grid grid-cols-3 gap-4">
          <Card className="p-5">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Gauge className="h-4 w-4 text-yellow-500" />
              Used Quota
            </div>
            <div className="mt-3 text-2xl font-semibold text-white">{usedQuota}</div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Zap className="h-4 w-4 text-yellow-500" />
              RPM
            </div>
            <div className="mt-3 text-2xl font-semibold text-white">{rpm}</div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Activity className="h-4 w-4 text-yellow-500" />
              TPM
            </div>
            <div className="mt-3 text-2xl font-semibold text-white">{tpm}</div>
          </Card>
        </div>

        <Card className="mt-6 p-5">
          <button
            onClick={() => setDetailsOpen((v) => !v)}
            className="flex w-full items-center justify-between"
          >
            <div className="text-left">
              <div className="text-sm font-medium text-white">Compute Credits Usage Details</div>
              <p className="mt-1 text-xs text-zinc-500">
                Details of computational integration for text generation, vectorization, and
                text-to-image generation
              </p>
            </div>
            {detailsOpen ? (
              <ChevronUp className="h-4 w-4 flex-shrink-0 text-zinc-500" />
            ) : (
              <ChevronDown className="h-4 w-4 flex-shrink-0 text-zinc-500" />
            )}
          </button>

          {detailsOpen && (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-zinc-500">
                    {columns.map((col) => (
                      <th key={col} className="whitespace-nowrap px-3 py-2 font-medium">
                        <span className="flex items-center gap-1">
                          {col}
                          <ChevronsUpDown className="h-3 w-3" />
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {billingRows.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="py-14">
                        <div className="flex flex-col items-center justify-center text-zinc-500">
                          <Inbox className="h-7 w-7" />
                          <p className="mt-2 text-sm">No data</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    billingRows.map((row) => (
                      <tr key={row.id} className="border-b border-white/5 text-zinc-300">
                        <td className="px-3 py-2.5">{row.createdAt}</td>
                        <td className="px-3 py-2.5">{row.type}</td>
                        <td className="px-3 py-2.5">{row.model}</td>
                        <td className="px-3 py-2.5">{row.totalTokens}</td>
                        <td className="px-3 py-2.5">{row.credits}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
      )}
    </div>
  );
}

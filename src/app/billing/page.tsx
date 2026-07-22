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

  const navBtn = (label: string, id: "usage" | "plans", Icon: React.ElementType) => (
    <button
      onClick={() => setSection(id)}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
        section === id ? "bg-[var(--bg-active)]" : "hover:bg-[var(--bg-hover)]"
      )}
      style={{ color: section === id ? "var(--text-primary)" : "var(--text-secondary)" }}
    >
      <Icon className="h-4 w-4 text-yellow-500" />
      {label}
    </button>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      {/* LEFT NAV */}
      <div className="flex w-[280px] flex-shrink-0 flex-col border-r p-6" style={{ borderColor: "var(--border)", background: "var(--bg-subtle)" }}>
        <h1 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Billing</h1>
        <p className="mt-1 text-xs" style={{ color: "var(--text-tertiary)" }}>Usage and Subscription Management</p>

        <nav className="mt-6 flex flex-col gap-1">
          {navBtn("📊 Usage", "usage", BarChart3)}
          {navBtn("Plans", "plans", CreditCard)}
        </nav>
      </div>

      {/* RIGHT CONTENT */}
      {section === "plans" ? (
        <div className="flex-1 overflow-y-auto p-8">
          <h2 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>Plans &amp; Pricing</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>
            Choose the plan that fits your usage. Upgrade or downgrade anytime.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
            {plans.map((plan) => {
              const isCurrent = currentPlan === plan.id;
              return (
                <Card
                  key={plan.id}
                  className={cn("flex flex-col p-6", plan.highlight && "border-yellow-500/40 bg-yellow-500/[0.04]")}
                >
                  {plan.highlight && (
                    <span className="mb-3 inline-block w-fit rounded-full bg-yellow-500/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-yellow-400">
                      Most Popular
                    </span>
                  )}
                  <div className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{plan.name}</div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>{plan.price}</span>
                    <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>{plan.period}</span>
                  </div>
                  <div className="mt-1 text-xs" style={{ color: "var(--text-tertiary)" }}>{plan.credits}</div>

                  <ul className="mt-5 flex-1 space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
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
                        ? "cursor-not-allowed bg-[var(--bg-muted)] text-[var(--text-tertiary)]"
                        : plan.highlight
                        ? "bg-yellow-500 text-black hover:bg-yellow-400"
                        : "border border-[var(--border)] bg-[var(--bg-muted)] hover:bg-[var(--bg-hover)]"
                    )}
                    style={!isCurrent && !plan.highlight ? { color: "var(--text-primary)" } : {}}
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
          <h2 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>Credits Details</h2>

          <div className="mt-5 grid grid-cols-3 gap-4">
            {[
              { icon: Gauge, label: "Used Quota", value: usedQuota },
              { icon: Zap, label: "RPM", value: rpm },
              { icon: Activity, label: "TPM", value: tpm },
            ].map(({ icon: Icon, label, value }) => (
              <Card key={label} className="p-5">
                <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-tertiary)" }}>
                  <Icon className="h-4 w-4 text-yellow-500" />
                  {label}
                </div>
                <div className="mt-3 text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>{value}</div>
              </Card>
            ))}
          </div>

          <Card className="mt-6 p-5">
            <button onClick={() => setDetailsOpen((v) => !v)} className="flex w-full items-center justify-between">
              <div className="text-left">
                <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Compute Credits Usage Details</div>
                <p className="mt-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
                  Details of computational integration for text generation, vectorization, and text-to-image generation
                </p>
              </div>
              {detailsOpen
                ? <ChevronUp className="h-4 w-4 flex-shrink-0" style={{ color: "var(--text-tertiary)" }} />
                : <ChevronDown className="h-4 w-4 flex-shrink-0" style={{ color: "var(--text-tertiary)" }} />
              }
            </button>

            {detailsOpen && (
              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-xs" style={{ borderColor: "var(--border)", color: "var(--text-tertiary)" }}>
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
                          <div className="flex flex-col items-center justify-center" style={{ color: "var(--text-tertiary)" }}>
                            <Inbox className="h-7 w-7" />
                            <p className="mt-2 text-sm">No data</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      billingRows.map((row) => (
                        <tr key={row.id} className="border-b" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
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

"use client";

import { Card } from "@/components/northstar/shared/card";
import { MetricRow } from "@/components/northstar/shared/metric-row";
import { SectionHeader } from "@/components/northstar/shared/section-header";
import { useNorthstarState } from "@/lib/northstar/context";
import { getDashboardSummary } from "@/lib/northstar/selectors";

export function DashboardScreen() {
  const state = useNorthstarState();
  const summary = getDashboardSummary(state);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-ink">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted">
          Quick scan for today&apos;s movement.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <SectionHeader
            title="Today"
            meta="Top priorities only."
          />
          <div className="mt-4 divide-y divide-line">
            {summary.today.length === 0 ? (
              <div className="py-3 first:pt-0 last:pb-0">
                <p className="text-sm text-muted">No priorities to scan.</p>
              </div>
            ) : null}
            {summary.today.map((item) => (
              <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                <p className="text-sm font-medium text-ink">{item.title}</p>
                <p className="mt-1 text-sm text-muted">{item.nextStep}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader
            title="Approvals"
            meta="What still needs a decision."
          />
          <div className="mt-4 divide-y divide-line">
            {summary.approvals.length === 0 ? (
              <div className="py-3 first:pt-0 last:pb-0">
                <p className="text-sm text-muted">No approvals waiting.</p>
              </div>
            ) : null}
            {summary.approvals.map((approval) => (
              <div key={approval.id} className="py-3 first:pt-0 last:pb-0">
                <p className="text-sm font-medium text-ink">{approval.title}</p>
                <p className="mt-1 text-sm text-muted">{approval.dueTime}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader
            title="Live campaigns"
            meta="What is already moving."
          />
          <div className="mt-4 divide-y divide-line">
            {summary.liveCampaigns.length === 0 ? (
              <div className="py-3 first:pt-0 last:pb-0">
                <p className="text-sm text-muted">No live campaigns to review.</p>
              </div>
            ) : null}
            {summary.liveCampaigns.map((campaign) => (
              <div key={campaign.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-medium text-ink">{campaign.name}</p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                    {campaign.primaryMetricValue}
                  </p>
                </div>
                <p className="mt-1 text-sm text-muted">{campaign.lastUpdated}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader
            title="Performance"
            meta="Decision-ready metrics."
          />
          <div className="mt-4">
            <MetricRow
              label="Active campaigns"
              value={String(summary.performance.activeCampaigns)}
            />
            <MetricRow
              label="Pending approvals"
              value={String(summary.performance.pendingApprovals)}
              tone="warning"
            />
            <MetricRow
              label={summary.performance.movementLabel}
              value={summary.performance.movementValue}
              change={summary.performance.movementNote}
              tone="positive"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

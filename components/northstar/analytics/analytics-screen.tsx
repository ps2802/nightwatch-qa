"use client";

import { Badge } from "@/components/northstar/shared/badge";
import { Card } from "@/components/northstar/shared/card";
import { MetricRow } from "@/components/northstar/shared/metric-row";
import { SectionHeader } from "@/components/northstar/shared/section-header";
import { SegmentedFilter } from "@/components/northstar/shared/segmented-filter";
import { useNorthstarActions, useNorthstarState } from "@/lib/northstar/context";
import { getAnalyticsSummary } from "@/lib/northstar/selectors";
import type { Channel } from "@/types/northstar";

const channelOptions: Array<{ label: string; value: Channel | "all" }> = [
  { label: "All channels", value: "all" },
  { label: "X", value: "x" },
  { label: "Email", value: "email" },
  { label: "Intercom", value: "intercom" },
  { label: "Multi", value: "multi" },
];

const timeframeOptions = [
  { label: "7d", value: "7d" as const },
  { label: "30d", value: "30d" as const },
  { label: "90d", value: "90d" as const },
];

function channelLabel(channel: Channel) {
  if (channel === "x") {
    return "X";
  }

  if (channel === "multi") {
    return "Multi";
  }

  return channel.charAt(0).toUpperCase() + channel.slice(1);
}

export function AnalyticsScreen() {
  const state = useNorthstarState();
  const actions = useNorthstarActions();
  const summary = getAnalyticsSummary(state);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-ink">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-muted">
            Use this page to decide where to push next.
          </p>
        </div>
        <p className="max-w-md text-sm text-muted md:text-right">
          {summary.topTakeaway}
        </p>
      </div>

      <Card>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
          <SectionHeader
            title="Views"
            meta="Filter by channel and timeframe."
          />
          <div className="space-y-3">
            <SegmentedFilter
              value={summary.channelFilter}
              options={channelOptions}
              onChange={(value) => actions.setFilter("channel", value)}
            />
            <SegmentedFilter
              value={summary.timeframe}
              options={timeframeOptions}
              onChange={(value) => actions.setFilter("timeframe", value)}
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <MetricRow
            label="Active campaigns"
            value={String(summary.activeCampaigns)}
            change="Keep focus on live work"
            tone="positive"
          />
          <p className="mt-4 text-sm text-muted">
            Active work is concentrated enough to stay manageable.
          </p>
        </Card>
        <Card>
          <MetricRow
            label="Approval turnaround"
            value={summary.approvalTurnaround}
            change="Founder pace"
            tone="warning"
          />
          <p className="mt-4 text-sm text-muted">
            Faster review is still the easiest way to unlock more output.
          </p>
        </Card>
        <Card>
          <MetricRow
            label="Best channel"
            value={channelLabel(summary.bestChannel)}
            change="Current leader"
            tone="positive"
          />
          <p className="mt-4 text-sm text-muted">
            Put the next urgent campaign where performance is already strongest.
          </p>
        </Card>
        <Card>
          <MetricRow
            label={summary.movementLabel}
            value={summary.movementValue}
            change={summary.timeframe}
            tone="positive"
          />
          <p className="mt-4 text-sm text-muted">{summary.timeframeTakeaway}</p>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
        <Card>
          <SectionHeader
            title="By campaign"
            meta="See which campaigns deserve attention now."
          />
          <div className="mt-5 space-y-4">
            {summary.campaignRows.length === 0 ? (
              <p className="text-sm text-muted">
                No campaigns match the current channel filter.
              </p>
            ) : null}
            {summary.campaignRows.map((row) => (
              <div key={row.id}>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium text-ink">{row.label}</p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                    {row.value}
                  </p>
                </div>
                <div className="mt-2 h-2 rounded-full bg-surfaceMuted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${row.width}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-muted">{row.takeaway}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader
            title="By channel"
            meta="Compare where momentum is strongest."
          />
          <div className="mt-5 space-y-4">
            {summary.channelRows.map((row) => (
              <div key={row.channel}>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium text-ink">
                    {channelLabel(row.channel)}
                  </p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                    {row.count} campaigns
                  </p>
                </div>
                <div className="mt-2 h-2 rounded-full bg-surfaceMuted">
                  <div
                    className={`h-2 rounded-full ${
                      row.channel === summary.bestChannel ? "bg-success" : "bg-ink"
                    }`}
                    style={{ width: `${row.score}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-muted">{row.takeaway}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

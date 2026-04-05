"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/northstar/shared/badge";
import { Button } from "@/components/northstar/shared/button";
import { Card } from "@/components/northstar/shared/card";
import { MetricRow } from "@/components/northstar/shared/metric-row";
import { SectionHeader } from "@/components/northstar/shared/section-header";
import { Tabs } from "@/components/northstar/shared/tabs";
import { useNorthstarState } from "@/lib/northstar/context";
import {
  getCampaignApprovalSummary,
  getCampaignApprovals,
  getCampaignBoardItems,
  getCampaignById,
  getCampaignPerformanceRows,
} from "@/lib/northstar/selectors";
import type { CampaignStatus, Channel } from "@/types/northstar";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "assets", label: "Assets" },
  { id: "approvals", label: "Approvals" },
  { id: "performance", label: "Performance" },
];

function getStatusVariant(status: CampaignStatus) {
  if (status === "live" || status === "ready_to_send") {
    return "success" as const;
  }

  if (status === "changes_requested") {
    return "danger" as const;
  }

  if (status === "needs_approval") {
    return "warning" as const;
  }

  return "neutral" as const;
}

function getChannelLabel(channel: Channel) {
  if (channel === "x") {
    return "X";
  }

  if (channel === "multi") {
    return "Multi";
  }

  return channel.charAt(0).toUpperCase() + channel.slice(1);
}

export function CampaignDetailScreen({ campaignId }: { campaignId: string }) {
  const state = useNorthstarState();
  const campaign = getCampaignById(state, campaignId);
  const [activeTab, setActiveTab] = useState("overview");

  if (!campaign) {
    return (
      <div className="space-y-5">
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-ink">
          Campaign not found
        </h1>
        <Card className="max-w-2xl">
          <p className="text-sm text-muted">
            This local draft is not available in the current session.
          </p>
          <div className="mt-4">
            <Button href="/campaigns" variant="secondary">
              Back to campaigns
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const approvals = getCampaignApprovals(state, campaign.id);
  const approvalSummary = getCampaignApprovalSummary(approvals);
  const boardItems = getCampaignBoardItems(state, campaign.id);
  const performanceRows = getCampaignPerformanceRows(campaign);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-ink">
              {campaign.name}
            </h1>
            <Badge variant={getStatusVariant(campaign.status)}>
              {campaign.status.replaceAll("_", " ")}
            </Badge>
            <Badge variant="neutral">{getChannelLabel(campaign.channel)}</Badge>
          </div>
          <p className="mt-2 text-sm text-muted">{campaign.objective}</p>
        </div>
        <Button href="/campaigns/new" variant="primary">
          Create campaign
        </Button>
      </div>

      <div className="space-y-4">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "overview" ? (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <Card>
              <SectionHeader
                title="Overview"
                meta="Objective, audience, message, and linked work."
              />
              <div className="mt-5 space-y-5">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                    Objective
                  </p>
                  <p className="mt-1 text-sm text-ink">{campaign.objective}</p>
                </div>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                    Target audience
                  </p>
                  <p className="mt-1 text-sm text-ink">{campaign.audience}</p>
                </div>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                    Core message
                  </p>
                  <p className="mt-1 text-sm text-ink">{campaign.coreMessage}</p>
                </div>
              </div>
            </Card>

            <Card>
              <SectionHeader
                title="Linked board tasks"
                meta="What still needs to move."
              />
              <div className="mt-5 divide-y divide-line">
                {boardItems.length === 0 ? (
                  <div className="py-3 first:pt-0 last:pb-0">
                    <p className="text-sm text-muted">No linked board tasks yet.</p>
                  </div>
                ) : null}
                {boardItems.map((item) => (
                  <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                    <p className="text-sm font-medium text-ink">{item.title}</p>
                    <p className="mt-1 text-sm text-muted">{item.nextStep}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : null}

        {activeTab === "assets" ? (
          <Card>
            <SectionHeader
              title="Assets"
              meta="Generated and drafted by channel."
            />
            <div className="mt-5 divide-y divide-line">
              {campaign.assets.length === 0 ? (
                <div className="py-4 first:pt-0 last:pb-0">
                  <p className="text-sm text-muted">No assets generated yet.</p>
                </div>
              ) : null}
              {campaign.assets.map((asset) => (
                <div key={asset.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-ink">{asset.title}</p>
                    <Badge variant="neutral">
                      {asset.type.replaceAll("_", " ")}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted">{asset.content}</p>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        {activeTab === "approvals" ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <SectionHeader
                title="Pending"
                meta="Still blocked on review."
              />
              <div className="mt-5 divide-y divide-line">
                {approvalSummary.pending.length === 0 ? (
                  <div className="py-3 first:pt-0 last:pb-0">
                    <p className="text-sm text-muted">No pending approvals.</p>
                  </div>
                ) : null}
                {approvalSummary.pending.map((approval) => (
                  <div key={approval.id} className="py-3 first:pt-0 last:pb-0">
                    <p className="text-sm font-medium text-ink">{approval.title}</p>
                    <p className="mt-1 text-sm text-muted">{approval.dueTime}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <SectionHeader
                title="Completed"
                meta="Already resolved."
              />
              <div className="mt-5 divide-y divide-line">
                {approvalSummary.completed.length === 0 ? (
                  <div className="py-3 first:pt-0 last:pb-0">
                    <p className="text-sm text-muted">
                      No completed approvals yet.
                    </p>
                  </div>
                ) : null}
                {approvalSummary.completed.map((approval) => (
                  <div key={approval.id} className="py-3 first:pt-0 last:pb-0">
                    <p className="text-sm font-medium text-ink">{approval.title}</p>
                    <p className="mt-1 text-sm text-muted">
                      {approval.status.replaceAll("_", " ")}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : null}

        {activeTab === "performance" ? (
          <Card>
            <SectionHeader
              title="Performance"
              meta="Channel-appropriate status and movement."
            />
            <div className="mt-4">
              {performanceRows.map((row) => (
                <MetricRow
                  key={row.label}
                  label={row.label}
                  value={row.value}
                  change={row.change}
                  tone={row.tone}
                />
              ))}
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

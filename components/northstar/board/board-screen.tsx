"use client";

import { Badge } from "@/components/northstar/shared/badge";
import { Button } from "@/components/northstar/shared/button";
import { Card } from "@/components/northstar/shared/card";
import { MetricRow } from "@/components/northstar/shared/metric-row";
import { SectionHeader } from "@/components/northstar/shared/section-header";
import { useNorthstarState } from "@/lib/northstar/context";
import {
  getBoardApprovalSummaryReadState,
  getBoardCampaignSummaryReadState,
  getBoardHomeReadState,
  getBoardPerformanceSnapshot,
  getLiveCampaignsForBoard,
  getPendingApprovalSummaryCount,
  getPendingApprovalsForBoard,
  getTodayItemsForBoard,
  getVisibleSearchCount,
} from "@/lib/northstar/selectors";
import type {
  ApprovalStatus,
  CampaignStatus,
  Channel,
} from "@/types/northstar";

function getStatusVariant(
  status: CampaignStatus | ApprovalStatus,
): "neutral" | "success" | "warning" | "danger" {
  if (status === "live" || status === "ready_to_send" || status === "approved") {
    return "success";
  }

  if (status === "changes_requested") {
    return "danger";
  }

  if (status === "waiting_on_me" || status === "needs_approval") {
    return "warning";
  }

  return "neutral";
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

function getSectionBadge(status: "idle" | "loading" | "success" | "empty" | "error") {
  if (status === "loading" || status === "idle") {
    return <Badge variant="neutral">Loading</Badge>;
  }

  if (status === "error") {
    return <Badge variant="neutral">Unavailable</Badge>;
  }

  return null;
}

function LoadingRows({ count = 3 }: { count?: number }) {
  return (
    <div className="mt-5 space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="h-16 rounded-2xl bg-surfaceMuted"
        />
      ))}
    </div>
  );
}

export function BoardScreen() {
  const state = useNorthstarState();
  const boardHomeRead = getBoardHomeReadState(state);
  const approvalSummaryRead = getBoardApprovalSummaryReadState(state);
  const campaignSummaryRead = getBoardCampaignSummaryReadState(state);
  const todayItems = getTodayItemsForBoard(state);
  const pendingApprovals = getPendingApprovalsForBoard(state);
  const liveCampaigns = getLiveCampaignsForBoard(state);
  const performance = getBoardPerformanceSnapshot(state);
  const pendingApprovalCount = getPendingApprovalSummaryCount(
    approvalSummaryRead.data,
  );
  const visibleCount = getVisibleSearchCount(
    todayItems.length,
    pendingApprovals.length,
    liveCampaigns.length,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-ink">
            Board
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Top priorities, pending reviews, live campaigns, and movement in one
            scan.
          </p>
        </div>
        <Badge variant="neutral">{visibleCount}</Badge>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)]">
        <div className="space-y-4">
          <Card>
            <SectionHeader
              title="Today"
              meta="Top priorities right now."
              action={
                getSectionBadge(boardHomeRead.status) ?? (
                  <Badge variant="neutral">{`${todayItems.length} items`}</Badge>
                )
              }
            />
            {boardHomeRead.status === "loading" || boardHomeRead.status === "idle" ? (
              <LoadingRows />
            ) : null}
            {boardHomeRead.status === "error" ? (
              <div className="mt-5">
                <p className="text-sm text-muted">
                  {boardHomeRead.error ?? "Board priorities are unavailable right now."}
                </p>
              </div>
            ) : null}
            {boardHomeRead.status === "success" || boardHomeRead.status === "empty" ? (
              <div className="mt-5 divide-y divide-line">
              {todayItems.length === 0 ? (
                <div className="py-4 first:pt-0 last:pb-0">
                  <p className="text-sm text-muted">
                    No priorities match the current search.
                  </p>
                </div>
              ) : null}
              {todayItems.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-ink">{item.title}</p>
                        <Badge variant={getStatusVariant(item.status)}>
                          {item.status.replaceAll("_", " ")}
                        </Badge>
                      </div>
                      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                        {item.owner} · {getChannelLabel(item.channel)}
                      </p>
                    </div>
                    <p className="text-sm text-muted md:max-w-[220px] md:text-right">
                      {item.nextStep}
                    </p>
                  </div>
                </div>
              ))}
              </div>
            ) : null}
          </Card>

          <Card>
            <SectionHeader
              title="Live campaigns"
              meta="Work already in motion."
              action={
                getSectionBadge(campaignSummaryRead.status) ?? (
                  <Badge variant="success">{`${liveCampaigns.length} live`}</Badge>
                )
              }
            />
            {campaignSummaryRead.status === "loading" || campaignSummaryRead.status === "idle" ? (
              <LoadingRows />
            ) : null}
            {campaignSummaryRead.status === "error" ? (
              <div className="mt-5">
                <p className="text-sm text-muted">
                  {campaignSummaryRead.error ?? "Campaign summaries are unavailable right now."}
                </p>
              </div>
            ) : null}
            {campaignSummaryRead.status === "success" || campaignSummaryRead.status === "empty" ? (
              <div className="mt-5 divide-y divide-line">
              {liveCampaigns.length === 0 ? (
                <div className="py-4 first:pt-0 last:pb-0">
                  <p className="text-sm text-muted">
                    No live campaigns match the current search.
                  </p>
                </div>
              ) : null}
              {liveCampaigns.map((campaign) => (
                <div key={campaign.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-ink">
                          {campaign.name}
                        </p>
                        <Badge variant={getStatusVariant(campaign.status)}>
                          {campaign.status.replaceAll("_", " ")}
                        </Badge>
                      </div>
                      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                        {getChannelLabel(campaign.channel)} · {campaign.lastUpdated}
                      </p>
                    </div>
                    <div className="lg:text-right">
                      <p className="text-sm text-muted">
                        {campaign.primaryMetricLabel}
                      </p>
                      <p className="mt-1 text-lg font-semibold tracking-[-0.03em] text-ink">
                        {campaign.primaryMetricValue}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            ) : null}
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <SectionHeader
              title="Needs approval"
              meta="Blocked on founder input."
              action={
                getSectionBadge(approvalSummaryRead.status) ?? (
                  <Badge variant="warning">{`${pendingApprovalCount} pending`}</Badge>
                )
              }
            />
            {approvalSummaryRead.status === "loading" || approvalSummaryRead.status === "idle" ? (
              <LoadingRows count={2} />
            ) : null}
            {approvalSummaryRead.status === "error" ? (
              <div className="mt-5">
                <p className="text-sm text-muted">
                  {approvalSummaryRead.error ?? "Approval summaries are unavailable right now."}
                </p>
              </div>
            ) : null}
            {approvalSummaryRead.status === "success" || approvalSummaryRead.status === "empty" ? (
              <div className="mt-5 divide-y divide-line">
              {pendingApprovals.length === 0 ? (
                <div className="py-4 first:pt-0 last:pb-0">
                  <p className="text-sm text-muted">
                    No pending approvals match the current search.
                  </p>
                </div>
              ) : null}
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-col gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-ink">
                          {approval.title}
                        </p>
                        <Badge variant={getStatusVariant(approval.status)}>
                          {approval.status.replaceAll("_", " ")}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted">
                        {approval.whyItMatters}
                      </p>
                      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                        {approval.requester} · {approval.dueTime}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="secondary" href="/approvals">
                        Review
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            ) : null}
          </Card>

          <Card>
            <SectionHeader
              title="Performance snapshot"
              meta="Lightweight proof of movement."
            />
            <div className="mt-4">
              {performance.campaignsStatus === "error" ? (
                <p className="mb-3 text-sm text-muted">
                  Campaign totals are unavailable right now.
                </p>
              ) : null}
              <MetricRow
                label="Active campaigns"
                value={
                  performance.activeCampaigns === null
                    ? "Unavailable"
                    : String(performance.activeCampaigns)
                }
              />
              {performance.approvalsStatus === "error" ? (
                <p className="mb-3 text-sm text-muted">
                  Approval totals are unavailable right now.
                </p>
              ) : null}
              <MetricRow
                label="Pending approvals"
                value={
                  performance.pendingApprovals === null
                    ? "Unavailable"
                    : String(performance.pendingApprovals)
                }
                change={
                  performance.pendingApprovals === null ? undefined : "Actionable now"
                }
                tone={performance.pendingApprovals === null ? "neutral" : "warning"}
              />
              <MetricRow
                label="Top channel"
                value={
                  performance.topChannel ? getChannelLabel(performance.topChannel) : "Unavailable"
                }
                change={performance.topChannel ? performance.topChannelNote : undefined}
                tone={performance.topChannel ? "positive" : "neutral"}
              />
              <MetricRow
                label={performance.movementLabel}
                value={performance.movementValue}
                change={performance.movementNote}
                tone={performance.movementStatus === "error" ? "neutral" : "positive"}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

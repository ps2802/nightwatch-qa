"use client";

import { useEffect } from "react";
import { Badge } from "@/components/northstar/shared/badge";
import { Button } from "@/components/northstar/shared/button";
import { Card } from "@/components/northstar/shared/card";
import { Drawer } from "@/components/northstar/shared/drawer";
import { SectionHeader } from "@/components/northstar/shared/section-header";
import { SegmentedFilter } from "@/components/northstar/shared/segmented-filter";
import { Sheet } from "@/components/northstar/shared/sheet";
import { useNorthstarActions, useNorthstarState } from "@/lib/northstar/context";
import { getActiveApproval, getApprovalsForList } from "@/lib/northstar/selectors";
import type { ApprovalStatus } from "@/types/northstar";

const FILTERS: Array<{ label: string; value: ApprovalStatus | "all" }> = [
  { label: "All", value: "all" },
  { label: "Waiting on me", value: "waiting_on_me" },
  { label: "Approved", value: "approved" },
  { label: "Changes requested", value: "changes_requested" },
];

function getStatusVariant(status: ApprovalStatus) {
  if (status === "approved") {
    return "success" as const;
  }

  if (status === "changes_requested") {
    return "danger" as const;
  }

  return "warning" as const;
}

function ApprovalDetail({
  onApprove,
  onRequestChanges,
}: {
  onApprove: () => void;
  onRequestChanges: () => void;
}) {
  const state = useNorthstarState();
  const approval = getActiveApproval(state);

  if (!approval) {
    return null;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={getStatusVariant(approval.status)}>
          {approval.status.replaceAll("_", " ")}
        </Badge>
        <Badge variant="neutral">{approval.type.replaceAll("_", " ")}</Badge>
      </div>

      <div className="space-y-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            Goal
          </p>
          <p className="mt-1 text-sm text-ink">{approval.goal}</p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            Audience
          </p>
          <p className="mt-1 text-sm text-ink">{approval.audience}</p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            Channel
          </p>
          <p className="mt-1 text-sm text-ink">{approval.channel}</p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            Final draft
          </p>
          <p className="mt-1 text-sm leading-6 text-ink">{approval.finalDraft}</p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            Notes
          </p>
          <p className="mt-1 text-sm text-muted">{approval.notes}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="primary" onClick={onApprove}>
          Approve
        </Button>
        <Button variant="destructive" onClick={onRequestChanges}>
          Request changes
        </Button>
      </div>
    </div>
  );
}

export default function ApprovalsPage() {
  const state = useNorthstarState();
  const actions = useNorthstarActions();
  const approvals = getApprovalsForList(state);
  const activeApproval = getActiveApproval(state);
  const activeFilter = state.ui.activeFilters.approvals ?? "all";

  useEffect(() => {
    if (!activeApproval) {
      document.body.style.removeProperty("overflow");
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [activeApproval]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-ink">
            Approvals
          </h1>
          <p className="mt-1 text-sm text-muted">
            Review what matters and clear it quickly.
          </p>
        </div>
        <Badge variant="warning">{`${approvals.filter((item) => item.status === "waiting_on_me").length} waiting`}</Badge>
      </div>

      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <SectionHeader
            title="Review queue"
            meta="Compact filters and direct actions only."
          />
          <div className="w-full lg:w-auto lg:min-w-[440px]">
            <SegmentedFilter
              value={activeFilter}
              options={FILTERS}
              onChange={(value) => actions.setFilter("approvals", value)}
            />
          </div>
        </div>

        <div className="mt-5 divide-y divide-line">
          {approvals.length === 0 ? (
            <div className="py-6">
              <p className="text-sm text-muted">
                No approvals match this filter right now.
              </p>
            </div>
          ) : null}
          {approvals.map((approval) => (
            <div key={approval.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-ink">{approval.title}</p>
                    <Badge variant={getStatusVariant(approval.status)}>
                      {approval.status.replaceAll("_", " ")}
                    </Badge>
                    <Badge variant="neutral">
                      {approval.type.replaceAll("_", " ")}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted">{approval.whyItMatters}</p>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                    {approval.requester} · {approval.dueTime}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 xl:justify-end">
                  <Button
                    variant="secondary"
                    onClick={() => actions.openApproval(approval.id)}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => actions.approveItem(approval.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => actions.requestChanges(approval.id)}
                  >
                    Request changes
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Drawer
        open={Boolean(activeApproval)}
        title={activeApproval?.title ?? ""}
        subtitle={activeApproval?.whyItMatters}
        onClose={() => actions.openApproval(null)}
      >
        <ApprovalDetail
          onApprove={() => {
            if (activeApproval) {
              actions.approveItem(activeApproval.id);
            }
          }}
          onRequestChanges={() => {
            if (activeApproval) {
              actions.requestChanges(activeApproval.id);
            }
          }}
        />
      </Drawer>

      <Sheet
        open={Boolean(activeApproval)}
        title={activeApproval?.title ?? ""}
        subtitle={activeApproval?.whyItMatters}
        onClose={() => actions.openApproval(null)}
      >
        <ApprovalDetail
          onApprove={() => {
            if (activeApproval) {
              actions.approveItem(activeApproval.id);
            }
          }}
          onRequestChanges={() => {
            if (activeApproval) {
              actions.requestChanges(activeApproval.id);
            }
          }}
        />
      </Sheet>
    </div>
  );
}

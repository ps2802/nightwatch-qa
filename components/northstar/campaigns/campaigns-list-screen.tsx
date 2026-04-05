"use client";

import Link from "next/link";
import { Badge } from "@/components/northstar/shared/badge";
import { Card } from "@/components/northstar/shared/card";
import { SectionHeader } from "@/components/northstar/shared/section-header";
import { useNorthstarState } from "@/lib/northstar/context";
import { getCampaignsForList } from "@/lib/northstar/selectors";
import type { CampaignStatus, Channel } from "@/types/northstar";

function getChannelLabel(channel: Channel) {
  if (channel === "x") {
    return "X";
  }

  if (channel === "multi") {
    return "Multi";
  }

  return channel.charAt(0).toUpperCase() + channel.slice(1);
}

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

export function CampaignsListScreen() {
  const state = useNorthstarState();
  const campaigns = getCampaignsForList(state);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-ink">
            Campaigns
          </h1>
          <p className="mt-1 text-sm text-muted">
            Active, draft, and review-ready campaigns in one list.
          </p>
        </div>
        <Badge variant="neutral">{`${campaigns.length} campaigns`}</Badge>
      </div>

      <Card>
        <SectionHeader
          title="Campaign list"
          meta="Operational objects only."
        />
        <div className="mt-5 divide-y divide-line">
          {campaigns.length === 0 ? (
            <div className="py-4 first:pt-0 last:pb-0">
              <p className="text-sm text-muted">
                No campaigns match the current search or filter.
              </p>
            </div>
          ) : null}
          {campaigns.map((campaign) => (
            <Link
              key={campaign.id}
              href={`/campaigns/${campaign.id}`}
              className="block py-4 first:pt-0 last:pb-0"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
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
                    {getChannelLabel(campaign.channel)} · {campaign.owner}
                  </p>
                  <p className="mt-2 text-sm text-muted">{campaign.audience}</p>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm xl:min-w-[280px] xl:justify-items-end">
                  <div>
                    <p className="text-muted">Updated</p>
                    <p className="mt-1 text-ink">{campaign.lastUpdated}</p>
                  </div>
                  <div>
                    <p className="text-muted">{campaign.primaryMetricLabel}</p>
                    <p className="mt-1 font-semibold text-ink">
                      {campaign.primaryMetricValue}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}

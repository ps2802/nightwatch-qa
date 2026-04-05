"use client";

import { Badge } from "@/components/northstar/shared/badge";
import { Card } from "@/components/northstar/shared/card";
import { SectionHeader } from "@/components/northstar/shared/section-header";
import {
  getNotificationSummary,
  getSettingsSummary,
} from "@/lib/northstar/selectors";
import { useNorthstarState } from "@/lib/northstar/context";

function accountVariant(status: "connected" | "needs_reconnect" | "not_connected") {
  if (status === "connected") {
    return "success" as const;
  }

  if (status === "needs_reconnect") {
    return "warning" as const;
  }

  return "neutral" as const;
}

export function SettingsScreen() {
  const state = useNorthstarState();
  const summary = getSettingsSummary(state);
  const notificationSummary = getNotificationSummary(summary.notifications);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-ink">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted">
          Keep workspace state clear and low drama.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]">
        <Card>
          <SectionHeader
            title="Workspace"
            meta="Core workspace state at a glance."
          />
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                Name
              </p>
              <p className="mt-2 text-sm text-ink">{summary.workspace.name}</p>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                Active campaigns
              </p>
              <p className="mt-2 text-sm text-ink">
                {summary.workspace.activeCampaigns}
              </p>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                Pending approvals
              </p>
              <p className="mt-2 text-sm text-ink">
                {summary.workspace.pendingApprovals}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <SectionHeader
            title="Brand voice"
            meta="Simple operating constraints for copy."
          />
          <div className="mt-5 space-y-3">
            {summary.brandVoice.map((item) => (
              <p key={item} className="text-sm text-ink">
                {item}
              </p>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <SectionHeader
          title="Connected accounts"
          meta="Status should be obvious instantly."
        />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-line bg-surface px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-ink">Connected</p>
              <Badge variant="success">{summary.accounts.connected.length}</Badge>
            </div>
            <div className="mt-4 space-y-2">
              {summary.accounts.connected.length === 0 ? (
                <p className="text-sm text-muted">No connected accounts.</p>
              ) : null}
              {summary.accounts.connected.map((account) => (
                <div key={account.id} className="flex items-center justify-between gap-3">
                  <p className="text-sm text-ink">{account.name}</p>
                  <Badge variant={accountVariant(account.status)}>
                    {account.status.replaceAll("_", " ")}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-line bg-surface px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-ink">Needs reconnect</p>
              <Badge variant="warning">{summary.accounts.reconnect.length}</Badge>
            </div>
            <div className="mt-4 space-y-2">
              {summary.accounts.reconnect.length === 0 ? (
                <p className="text-sm text-muted">Nothing waiting for reconnect.</p>
              ) : null}
              {summary.accounts.reconnect.map((account) => (
                <div key={account.id} className="flex items-center justify-between gap-3">
                  <p className="text-sm text-ink">{account.name}</p>
                  <Badge variant={accountVariant(account.status)}>
                    {account.status.replaceAll("_", " ")}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-line bg-surface px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-ink">Not connected</p>
              <Badge variant="neutral">{summary.accounts.disconnected.length}</Badge>
            </div>
            <div className="mt-4 space-y-2">
              {summary.accounts.disconnected.length === 0 ? (
                <p className="text-sm text-muted">No disconnected accounts.</p>
              ) : null}
              {summary.accounts.disconnected.map((account) => (
                <div key={account.id} className="flex items-center justify-between gap-3">
                  <p className="text-sm text-ink">{account.name}</p>
                  <Badge variant={accountVariant(account.status)}>
                    {account.status.replaceAll("_", " ")}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionHeader
            title="Team and permissions"
            meta="Who is operating in this workspace."
          />
          <div className="mt-5 divide-y divide-line">
            {summary.team.map((person) => (
              <div key={person} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <p className="text-sm text-ink">{person}</p>
                <Badge variant="neutral">Editor</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader
            title="Notification preferences"
            meta="Local-state visibility only."
          />
          <div className="mt-5 flex flex-wrap gap-2">
            <Badge variant="success">{`${notificationSummary.enabled} enabled`}</Badge>
            <Badge variant="neutral">{`${notificationSummary.paused} paused`}</Badge>
          </div>
          <div className="mt-5 divide-y divide-line">
            {summary.notifications.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <p className="text-sm text-ink">{item.label}</p>
                <Badge variant={item.enabled ? "success" : "neutral"}>
                  {item.enabled ? "enabled" : "paused"}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

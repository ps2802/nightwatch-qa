"use client";

import { Button } from "@/components/northstar/shared/button";
import { Badge } from "@/components/northstar/shared/badge";
import { Input } from "@/components/northstar/shared/input";
import { useNorthstarActions, useNorthstarState } from "@/lib/northstar/context";
import { getConnectedAccountSummary } from "@/lib/northstar/selectors";

export function TopBar() {
  const state = useNorthstarState();
  const actions = useNorthstarActions();
  const accountSummary = getConnectedAccountSummary(state.connectedAccounts);

  return (
    <div className="rounded-shell border border-line bg-surface px-4 py-4 shadow-shell md:px-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center">
          <button
            type="button"
            className="inline-flex w-fit items-center rounded-full border border-line bg-surfaceMuted px-3 py-2 text-sm font-medium text-ink"
          >
            {state.workspace.name}
          </button>
          <div className="w-full max-w-xl">
            <Input
              value={state.ui.searchQuery}
              onChange={(event) => actions.setSearchQuery(event.target.value)}
              placeholder="Search board, approvals, campaigns"
              leadingIcon={
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                  Find
                </span>
              }
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="md:hidden">
            <Badge variant="neutral">
              {`${accountSummary.connectedLabel} · ${accountSummary.reconnectLabel} · ${accountSummary.disconnectedLabel}`}
            </Badge>
          </div>
          <div className="hidden md:flex md:flex-wrap md:items-center md:gap-2">
            <Badge variant="success">{accountSummary.connectedLabel}</Badge>
            <Badge variant="warning">{accountSummary.reconnectLabel}</Badge>
            <Badge variant="neutral">{accountSummary.disconnectedLabel}</Badge>
          </div>
          <Button href="/campaigns/new" variant="primary">
            Create campaign
          </Button>
        </div>
      </div>
    </div>
  );
}

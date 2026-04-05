export type Phase2AReadScenario = "default" | "empty" | "error";

export const PHASE_2A_REQUEST_PARAM_KEYS = {
  scenario: "scenario",
  delayMs: "delayMs",
} as const;

export const PHASE_2A_DEBUG_PARAM_KEYS = {
  globalScenario: "phase2aScenario",
  delayMs: "phase2aDelayMs",
  boardHomeScenario: "boardHomeScenario",
  approvalSummaryScenario: "approvalSummaryScenario",
  campaignSummaryScenario: "campaignSummaryScenario",
} as const;

export function isPhase2ADebugEnabled() {
  return process.env.NEXT_PUBLIC_PHASE_2A_DEBUG === "true";
}

export type RemoteBoardPriorityRecord = {
  id: string;
  title: string;
  status: string;
  owner_name: string;
  channel: string;
  audience: string;
  next_step: string;
  linked_campaign_id?: string | null;
};

export type RemoteBoardSnapshotRecord = {
  movement_label: string;
  movement_value: string;
  movement_note: string;
};

export type RemoteBoardHomeRecord = {
  priorities: RemoteBoardPriorityRecord[];
  snapshot: RemoteBoardSnapshotRecord;
};

export type RemoteApprovalSummaryRecord = {
  id: string;
  title: string;
  status: string;
  why_it_matters: string;
  requester_name: string;
  due_at: string;
  channel: string;
  linked_campaign_id?: string | null;
};

export type RemoteCampaignSummaryRecord = {
  id: string;
  name: string;
  channel: string;
  status: string;
  owner_name: string;
  audience: string;
  last_updated_at: string;
  primary_metric_label: string;
  primary_metric_value: string;
};

export type RemotePhase2AErrorResponse = {
  error: string;
};

export type NorthstarSessionStub = {
  sessionId: string;
  workspace: {
    id: string;
    name: string;
  };
};

export function parsePhase2AScenario(
  value: string | null | undefined,
): Phase2AReadScenario {
  if (value === "empty" || value === "error") {
    return value;
  }

  return "default";
}

export function parsePhase2ADelayMs(value: string | null | undefined): number {
  if (!value) {
    return 0;
  }

  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed) || parsed <= 0) {
    return 0;
  }

  return Math.min(parsed, 3000);
}

export async function delayPhase2A(ms: number) {
  if (ms <= 0) {
    return;
  }

  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

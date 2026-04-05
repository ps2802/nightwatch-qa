import type {
  BoardApprovalSummary,
  BoardItem,
  BoardMovementSnapshot,
  CampaignStatus,
  CampaignSummary,
  Channel,
} from "@/types/northstar";
import type {
  RemoteApprovalSummaryRecord,
  RemoteBoardHomeRecord,
  RemoteBoardPriorityRecord,
  RemoteCampaignSummaryRecord,
} from "@/lib/northstar/phase-2a-client";

function toChannel(value: string): Channel {
  if (value === "x" || value === "email" || value === "intercom" || value === "multi") {
    return value;
  }

  throw new Error(`Unsupported channel value: ${value}`);
}

function toCampaignStatus(value: string): CampaignStatus | "waiting_on_me" | "approved" {
  if (
    value === "draft" ||
    value === "needs_approval" ||
    value === "changes_requested" ||
    value === "ready_to_send" ||
    value === "live" ||
    value === "paused" ||
    value === "completed" ||
    value === "waiting_on_me" ||
    value === "approved"
  ) {
    return value;
  }

  throw new Error(`Unsupported status value: ${value}`);
}

export function adaptBoardPriority(record: RemoteBoardPriorityRecord): BoardItem {
  return {
    id: record.id,
    title: record.title,
    status: toCampaignStatus(record.status),
    owner: record.owner_name,
    channel: toChannel(record.channel),
    audience: record.audience,
    nextStep: record.next_step,
    linkedCampaignId: record.linked_campaign_id ?? undefined,
  };
}

export function adaptBoardHome(record: RemoteBoardHomeRecord): {
  items: BoardItem[];
  snapshot: BoardMovementSnapshot;
} {
  return {
    items: record.priorities.map(adaptBoardPriority),
    snapshot: {
      movementLabel: record.snapshot.movement_label,
      movementValue: record.snapshot.movement_value,
      movementNote: record.snapshot.movement_note,
    },
  };
}

export function adaptBoardApprovalSummary(
  record: RemoteApprovalSummaryRecord,
): BoardApprovalSummary {
  const status = toCampaignStatus(record.status);
  if (
    status !== "waiting_on_me" &&
    status !== "approved" &&
    status !== "changes_requested"
  ) {
    throw new Error(`Unsupported approval summary status: ${record.status}`);
  }

  return {
    id: record.id,
    title: record.title,
    status,
    whyItMatters: record.why_it_matters,
    requester: record.requester_name,
    dueTime: record.due_at,
    channel: toChannel(record.channel),
    linkedCampaignId: record.linked_campaign_id ?? undefined,
  };
}

export function adaptCampaignSummary(
  record: RemoteCampaignSummaryRecord,
): CampaignSummary {
  const status = toCampaignStatus(record.status);
  if (
    status === "waiting_on_me" ||
    status === "approved"
  ) {
    throw new Error(`Unsupported campaign summary status: ${record.status}`);
  }

  return {
    id: record.id,
    name: record.name,
    channel: toChannel(record.channel),
    status,
    owner: record.owner_name,
    audience: record.audience,
    lastUpdated: record.last_updated_at,
    primaryMetricLabel: record.primary_metric_label,
    primaryMetricValue: record.primary_metric_value,
  };
}

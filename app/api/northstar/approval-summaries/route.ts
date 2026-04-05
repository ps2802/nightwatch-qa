import { NextRequest, NextResponse } from "next/server";
import { phase2ASeedSource } from "@/lib/northstar/mock-data";
import {
  delayPhase2A,
  isPhase2ADebugEnabled,
  parsePhase2ADelayMs,
  parsePhase2AScenario,
  PHASE_2A_REQUEST_PARAM_KEYS,
  type RemoteApprovalSummaryRecord,
  type RemotePhase2AErrorResponse,
} from "@/lib/northstar/phase-2a-contract";
import { getNorthstarSessionStub } from "@/lib/northstar/session-stub";

export const dynamic = "force-dynamic";

function buildApprovalSummaryRecords(): RemoteApprovalSummaryRecord[] {
  return phase2ASeedSource.approvals.map((approval) => ({
    id: approval.id,
    title: approval.title,
    status: approval.status,
    why_it_matters: approval.whyItMatters,
    requester_name: approval.requester,
    due_at: approval.dueTime,
    channel: approval.channel,
    linked_campaign_id: approval.linkedCampaignId ?? null,
  }));
}

export async function GET(request: NextRequest) {
  await getNorthstarSessionStub();
  const debugEnabled = isPhase2ADebugEnabled();

  const scenario = debugEnabled
    ? parsePhase2AScenario(
        request.nextUrl.searchParams.get(PHASE_2A_REQUEST_PARAM_KEYS.scenario),
      )
    : "default";
  const delayMs = debugEnabled
    ? parsePhase2ADelayMs(
        request.nextUrl.searchParams.get(PHASE_2A_REQUEST_PARAM_KEYS.delayMs),
      )
    : 0;

  await delayPhase2A(delayMs);

  if (scenario === "error") {
    return NextResponse.json<RemotePhase2AErrorResponse>(
      {
        error: "Approval summaries are unavailable right now.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json<RemoteApprovalSummaryRecord[]>(
    scenario === "empty" ? [] : buildApprovalSummaryRecords(),
  );
}

import { NextRequest, NextResponse } from "next/server";
import { phase2ASeedSource } from "@/lib/northstar/mock-data";
import {
  delayPhase2A,
  isPhase2ADebugEnabled,
  parsePhase2ADelayMs,
  parsePhase2AScenario,
  PHASE_2A_REQUEST_PARAM_KEYS,
  type RemoteBoardHomeRecord,
  type RemotePhase2AErrorResponse,
} from "@/lib/northstar/phase-2a-contract";
import { getNorthstarSessionStub } from "@/lib/northstar/session-stub";

export const dynamic = "force-dynamic";

function buildBoardHomeRecord(): RemoteBoardHomeRecord {
  return {
    priorities: phase2ASeedSource.boardItems.map((item) => ({
      id: item.id,
      title: item.title,
      status: item.status,
      owner_name: item.owner,
      channel: item.channel,
      audience: item.audience,
      next_step: item.nextStep,
      linked_campaign_id: item.linkedCampaignId ?? null,
    })),
    snapshot: {
      movement_label: phase2ASeedSource.analytics.movementLabel,
      movement_value: phase2ASeedSource.analytics.movementValue,
      movement_note: `${phase2ASeedSource.analytics.approvalTurnaround} turnaround`,
    },
  };
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
        error: "Board priorities are unavailable right now.",
      },
      { status: 503 },
    );
  }

  const record = buildBoardHomeRecord();

  return NextResponse.json<RemoteBoardHomeRecord>(
    scenario === "empty"
      ? {
          priorities: [],
          snapshot: record.snapshot,
        }
      : record,
  );
}

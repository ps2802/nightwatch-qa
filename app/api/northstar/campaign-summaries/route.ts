import { NextRequest, NextResponse } from "next/server";
import { phase2ASeedSource } from "@/lib/northstar/mock-data";
import {
  delayPhase2A,
  isPhase2ADebugEnabled,
  parsePhase2ADelayMs,
  parsePhase2AScenario,
  PHASE_2A_REQUEST_PARAM_KEYS,
  type RemoteCampaignSummaryRecord,
  type RemotePhase2AErrorResponse,
} from "@/lib/northstar/phase-2a-contract";
import { getNorthstarSessionStub } from "@/lib/northstar/session-stub";

export const dynamic = "force-dynamic";

function buildCampaignSummaryRecords(): RemoteCampaignSummaryRecord[] {
  return phase2ASeedSource.campaigns.map((campaign) => ({
    id: campaign.id,
    name: campaign.name,
    channel: campaign.channel,
    status: campaign.status,
    owner_name: campaign.owner,
    audience: campaign.audience,
    last_updated_at: campaign.lastUpdated,
    primary_metric_label: campaign.primaryMetricLabel,
    primary_metric_value: campaign.primaryMetricValue,
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
        error: "Campaign summaries are unavailable right now.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json<RemoteCampaignSummaryRecord[]>(
    scenario === "empty" ? [] : buildCampaignSummaryRecords(),
  );
}

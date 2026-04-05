import {
  PHASE_2A_DEBUG_PARAM_KEYS,
  PHASE_2A_REQUEST_PARAM_KEYS,
  isPhase2ADebugEnabled,
  type RemoteApprovalSummaryRecord,
  type RemoteBoardHomeRecord,
  type RemoteBoardPriorityRecord,
  type RemoteCampaignSummaryRecord,
  type RemotePhase2AErrorResponse,
} from "@/lib/northstar/phase-2a-contract";

type Phase2AEndpointName = "boardHome" | "approvalSummary" | "campaignSummary";

const scenarioParamByEndpoint: Record<Phase2AEndpointName, string> = {
  boardHome: PHASE_2A_DEBUG_PARAM_KEYS.boardHomeScenario,
  approvalSummary: PHASE_2A_DEBUG_PARAM_KEYS.approvalSummaryScenario,
  campaignSummary: PHASE_2A_DEBUG_PARAM_KEYS.campaignSummaryScenario,
};

function buildRequestUrl(pathname: string, endpointName: Phase2AEndpointName) {
  if (typeof window === "undefined" || !isPhase2ADebugEnabled()) {
    return pathname;
  }

  const pageSearchParams = new URLSearchParams(window.location.search);
  const requestSearchParams = new URLSearchParams();
  const scenario =
    pageSearchParams.get(scenarioParamByEndpoint[endpointName]) ??
    pageSearchParams.get(PHASE_2A_DEBUG_PARAM_KEYS.globalScenario);
  const delayMs = pageSearchParams.get(PHASE_2A_DEBUG_PARAM_KEYS.delayMs);

  if (scenario) {
    requestSearchParams.set(PHASE_2A_REQUEST_PARAM_KEYS.scenario, scenario);
  }

  if (delayMs) {
    requestSearchParams.set(PHASE_2A_REQUEST_PARAM_KEYS.delayMs, delayMs);
  }

  const query = requestSearchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

async function parseJsonPayload<T>(
  response: Response,
  pathname: string,
): Promise<T | RemotePhase2AErrorResponse> {
  const rawBody = await response.text();

  if (!rawBody.trim()) {
    throw new Error(`Received an empty JSON response from ${pathname}.`);
  }

  try {
    return JSON.parse(rawBody) as T | RemotePhase2AErrorResponse;
  } catch {
    throw new Error(`Received an invalid JSON response from ${pathname}.`);
  }
}

async function readJson<T>(
  pathname: string,
  endpointName: Phase2AEndpointName,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(buildRequestUrl(pathname, endpointName), {
    method: "GET",
    cache: "no-store",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  let payload: T | RemotePhase2AErrorResponse | null = null;

  try {
    payload = await parseJsonPayload<T>(response, pathname);
  } catch (error) {
    if (response.ok) {
      throw error;
    }
  }

  if (!response.ok) {
    const errorMessage =
      payload &&
      typeof payload === "object" &&
      "error" in payload &&
      typeof payload.error === "string"
        ? payload.error
        : `Request failed with status ${response.status}.`;

    throw new Error(errorMessage);
  }

  return payload as T;
}

export async function readBoardHomeRecord(
  signal?: AbortSignal,
): Promise<RemoteBoardHomeRecord> {
  return readJson<RemoteBoardHomeRecord>(
    "/api/northstar/board-home",
    "boardHome",
    signal,
  );
}

export async function readApprovalSummaryRecords(
  signal?: AbortSignal,
): Promise<RemoteApprovalSummaryRecord[]> {
  return readJson<RemoteApprovalSummaryRecord[]>(
    "/api/northstar/approval-summaries",
    "approvalSummary",
    signal,
  );
}

export async function readCampaignSummaryRecords(
  signal?: AbortSignal,
): Promise<RemoteCampaignSummaryRecord[]> {
  return readJson<RemoteCampaignSummaryRecord[]>(
    "/api/northstar/campaign-summaries",
    "campaignSummary",
    signal,
  );
}

export type {
  RemoteApprovalSummaryRecord,
  RemoteBoardHomeRecord,
  RemoteBoardPriorityRecord,
  RemoteCampaignSummaryRecord,
} from "@/lib/northstar/phase-2a-contract";

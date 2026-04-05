import {
  buildCampaignDraftPreview,
  buildChannelAssets,
  initialNorthstarState,
} from "@/lib/northstar/mock-data";
import type {
  BoardApprovalSummary,
  BoardItem,
  BoardMovementSnapshot,
  ApprovalStatus,
  CampaignAsset,
  CampaignDetail,
  CampaignSummary,
  Channel,
  NorthstarState,
} from "@/types/northstar";

type DraftPayload = NonNullable<NorthstarState["ui"]["createCampaignDraft"]>;

type NorthstarAction =
  | { type: "approve_item"; payload: { approvalId: string } }
  | { type: "request_changes"; payload: { approvalId: string } }
  | { type: "create_campaign_draft" }
  | { type: "update_campaign_draft_step"; payload: Partial<DraftPayload> }
  | {
      type: "submit_campaign_draft";
      payload: {
        campaign: CampaignDetail;
        boardItems: NorthstarState["boardItems"];
      };
    }
  | { type: "set_search_query"; payload: { query: string } }
  | { type: "load_board_home_start" }
  | {
      type: "load_board_home_success";
      payload: { items: BoardItem[]; snapshot: BoardMovementSnapshot | null };
    }
  | { type: "load_board_home_error"; payload: { error: string } }
  | { type: "load_approval_summary_start" }
  | {
      type: "load_approval_summary_success";
      payload: { items: BoardApprovalSummary[] };
    }
  | { type: "load_approval_summary_error"; payload: { error: string } }
  | { type: "load_campaign_summary_start" }
  | {
      type: "load_campaign_summary_success";
      payload: { items: CampaignSummary[] };
    }
  | { type: "load_campaign_summary_error"; payload: { error: string } }
  | {
      type: "set_filter";
      payload: {
        key: keyof NorthstarState["ui"]["activeFilters"];
        value:
          NorthstarState["ui"]["activeFilters"][keyof NorthstarState["ui"]["activeFilters"]];
      };
    }
  | { type: "open_approval"; payload: { approvalId: string | null } };

function mapApprovalStatus(status: ApprovalStatus): ApprovalStatus {
  return status;
}

function updateLinkedCampaignStatus(
  state: NorthstarState,
  approvalId: string,
  nextStatus: ApprovalStatus,
): NorthstarState["campaigns"] {
  const approval = state.approvals.find((item) => item.id === approvalId);
  if (!approval?.linkedCampaignId) {
    return state.campaigns;
  }

  return state.campaigns.map((campaign) =>
    campaign.id === approval.linkedCampaignId
      ? {
          ...campaign,
          status:
            nextStatus === "approved"
              ? "ready_to_send"
              : "changes_requested",
          lastUpdated: "Updated just now",
        }
      : campaign,
  );
}

function updateLinkedBoardStatus(
  state: NorthstarState,
  approvalId: string,
  nextStatus: ApprovalStatus,
): NorthstarState["boardItems"] {
  const approval = state.approvals.find((item) => item.id === approvalId);
  if (!approval?.linkedCampaignId) {
    return state.boardItems;
  }

  return state.boardItems.map((item) =>
    item.linkedCampaignId === approval.linkedCampaignId
      ? {
          ...item,
          status: mapApprovalStatus(nextStatus),
          nextStep:
            nextStatus === "approved"
              ? "Prepare launch"
              : "Revise draft and resubmit",
        }
      : item,
  );
}

export function northstarReducer(
  state: NorthstarState,
  action: NorthstarAction,
): NorthstarState {
  switch (action.type) {
    case "load_board_home_start":
      return {
        ...state,
        reads: {
          ...state.reads,
          boardHome: {
            status: "loading",
            data: {
              items: [],
              snapshot: null,
            },
            error: null,
          },
        },
      };
    case "load_board_home_success":
      return {
        ...state,
        reads: {
          ...state.reads,
          boardHome: {
            status: action.payload.items.length === 0 ? "empty" : "success",
            data: {
              items: action.payload.items,
              snapshot: action.payload.snapshot,
            },
            error: null,
          },
        },
      };
    case "load_board_home_error":
      return {
        ...state,
        reads: {
          ...state.reads,
          boardHome: {
            status: "error",
            data: {
              items: [],
              snapshot: null,
            },
            error: action.payload.error,
          },
        },
      };
    case "load_approval_summary_start":
      return {
        ...state,
        reads: {
          ...state.reads,
          approvalSummary: {
            status: "loading",
            data: [],
            error: null,
          },
        },
      };
    case "load_approval_summary_success":
      return {
        ...state,
        reads: {
          ...state.reads,
          approvalSummary: {
            status: action.payload.items.length === 0 ? "empty" : "success",
            data: action.payload.items,
            error: null,
          },
        },
      };
    case "load_approval_summary_error":
      return {
        ...state,
        reads: {
          ...state.reads,
          approvalSummary: {
            status: "error",
            data: [],
            error: action.payload.error,
          },
        },
      };
    case "load_campaign_summary_start":
      return {
        ...state,
        reads: {
          ...state.reads,
          campaignSummary: {
            status: "loading",
            data: [],
            error: null,
          },
        },
      };
    case "load_campaign_summary_success":
      return {
        ...state,
        reads: {
          ...state.reads,
          campaignSummary: {
            status: action.payload.items.length === 0 ? "empty" : "success",
            data: action.payload.items,
            error: null,
          },
        },
      };
    case "load_campaign_summary_error":
      return {
        ...state,
        reads: {
          ...state.reads,
          campaignSummary: {
            status: "error",
            data: [],
            error: action.payload.error,
          },
        },
      };
    case "approve_item": {
      const approvals: NorthstarState["approvals"] = state.approvals.map((approval) =>
        approval.id === action.payload.approvalId
          ? { ...approval, status: "approved" }
          : approval,
      );

      return {
        ...state,
        approvals,
        campaigns: updateLinkedCampaignStatus(
          state,
          action.payload.approvalId,
          "approved",
        ),
        boardItems: updateLinkedBoardStatus(
          state,
          action.payload.approvalId,
          "approved",
        ),
        ui: {
          ...state.ui,
          activeApprovalId:
            state.ui.activeApprovalId === action.payload.approvalId
              ? null
              : state.ui.activeApprovalId,
        },
      };
    }
    case "request_changes": {
      const approvals: NorthstarState["approvals"] = state.approvals.map((approval) =>
        approval.id === action.payload.approvalId
          ? { ...approval, status: "changes_requested" }
          : approval,
      );

      return {
        ...state,
        approvals,
        campaigns: updateLinkedCampaignStatus(
          state,
          action.payload.approvalId,
          "changes_requested",
        ),
        boardItems: updateLinkedBoardStatus(
          state,
          action.payload.approvalId,
          "changes_requested",
        ),
        ui: {
          ...state.ui,
          activeApprovalId:
            state.ui.activeApprovalId === action.payload.approvalId
              ? null
              : state.ui.activeApprovalId,
        },
      };
    }
    case "create_campaign_draft":
      return {
        ...state,
        ui: {
          ...state.ui,
          createCampaignDraft: {
            currentStep: 1,
          },
        },
      };
    case "update_campaign_draft_step":
      return {
        ...state,
        ui: {
          ...state.ui,
          createCampaignDraft: {
            ...(state.ui.createCampaignDraft ?? { currentStep: 1 }),
            ...action.payload,
          },
        },
      };
    case "submit_campaign_draft":
      return {
        ...state,
        campaigns: [action.payload.campaign, ...state.campaigns],
        boardItems: [...action.payload.boardItems, ...state.boardItems],
        analytics: {
          ...state.analytics,
          activeCampaigns: state.analytics.activeCampaigns + 1,
        },
        ui: {
          ...state.ui,
          createCampaignDraft: null,
        },
      };
    case "set_search_query":
      return {
        ...state,
        ui: {
          ...state.ui,
          searchQuery: action.payload.query,
        },
      };
    case "set_filter":
      return {
        ...state,
        ui: {
          ...state.ui,
          activeFilters: {
            ...state.ui.activeFilters,
            [action.payload.key]: action.payload.value,
          },
        },
      };
    case "open_approval":
      return {
        ...state,
        ui: {
          ...state.ui,
          activeApprovalId: action.payload.approvalId,
        },
      };
    default:
      return state;
  }
}

export function createCampaignArtifacts(
  draft: DraftPayload | null,
  owner: string,
): { campaign: CampaignDetail; boardItems: NorthstarState["boardItems"] } | null {
  if (!draft?.channel || !draft.goal || !draft.audience) {
    return null;
  }

  const campaignId = `campaign-${Date.now().toString(36)}`;
  const channel = draft.channel as Channel;
  const draftPreview =
    draft.generatedPlan && draft.generatedAssets
      ? draft
      : {
          ...draft,
          ...buildCampaignDraftPreview({
            channel,
            goal: draft.goal,
            audience: draft.audience,
            notes: draft.notes,
          }),
        };
  const assets = (draftPreview.generatedAssets ?? buildChannelAssets(channel)).map(
    (asset): CampaignAsset => asset,
  );

  return {
    campaign: {
      id: campaignId,
      name: draft.goal,
      channel,
      status: "draft",
      owner,
      audience: draft.audience,
      lastUpdated: "Updated just now",
      primaryMetricLabel: "Pipeline",
      primaryMetricValue: "0%",
      objective: draft.goal,
      coreMessage:
        draftPreview.generatedPlan?.[0] ?? draft.notes ?? "Draft message in progress.",
      linkedBoardItemIds: [`${campaignId}-board-1`],
      assets,
    },
    boardItems: [
      {
        id: `${campaignId}-board-1`,
        title: `Review draft plan for ${draft.goal}`,
        status: "draft",
        owner,
        channel,
        audience: draft.audience,
        nextStep: "Open campaign draft",
        linkedCampaignId: campaignId,
      },
    ],
  };
}

export { initialNorthstarState };

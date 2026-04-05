"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import {
  adaptBoardApprovalSummary,
  adaptBoardHome,
  adaptCampaignSummary,
} from "@/lib/northstar/phase-2a-adapters";
import {
  readApprovalSummaryRecords,
  readBoardHomeRecord,
  readCampaignSummaryRecords,
} from "@/lib/northstar/phase-2a-client";
import { createCampaignArtifacts, initialNorthstarState, northstarReducer } from "@/lib/northstar/reducer";
import type { NorthstarState } from "@/types/northstar";

type NorthstarAppProviderProps = {
  children: ReactNode;
};

const NorthstarStateContext = createContext<NorthstarState | null>(null);

const NorthstarActionsContext = createContext<{
  approveItem: (approvalId: string) => void;
  requestChanges: (approvalId: string) => void;
  createCampaignDraft: () => void;
  updateCampaignDraftStep: (
    partial: Partial<NonNullable<NorthstarState["ui"]["createCampaignDraft"]>>,
  ) => void;
  submitCampaignDraft: () => string | null;
  setSearchQuery: (query: string) => void;
  setFilter: (
    key: keyof NorthstarState["ui"]["activeFilters"],
    value:
      NorthstarState["ui"]["activeFilters"][keyof NorthstarState["ui"]["activeFilters"]],
  ) => void;
  openApproval: (approvalId: string | null) => void;
} | null>(null);

export function NorthstarAppProvider({
  children,
}: NorthstarAppProviderProps) {
  const [state, dispatch] = useReducer(northstarReducer, initialNorthstarState);

  useEffect(() => {
    const controller = new AbortController();

    dispatch({ type: "load_board_home_start" });
    dispatch({ type: "load_approval_summary_start" });
    dispatch({ type: "load_campaign_summary_start" });

    void readBoardHomeRecord(controller.signal)
      .then((record) => {
        const adapted = adaptBoardHome(record);
        dispatch({
          type: "load_board_home_success",
          payload: adapted,
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        dispatch({
          type: "load_board_home_error",
          payload: {
            error: error instanceof Error ? error.message : "Board priorities did not load.",
          },
        });
      });

    void readApprovalSummaryRecords(controller.signal)
      .then((records) => {
        dispatch({
          type: "load_approval_summary_success",
          payload: {
            items: records.map(adaptBoardApprovalSummary),
          },
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        dispatch({
          type: "load_approval_summary_error",
          payload: {
            error:
              error instanceof Error
                ? error.message
                : "Approval summaries did not load.",
          },
        });
      });

    void readCampaignSummaryRecords(controller.signal)
      .then((records) => {
        dispatch({
          type: "load_campaign_summary_success",
          payload: {
            items: records.map(adaptCampaignSummary),
          },
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        dispatch({
          type: "load_campaign_summary_error",
          payload: {
            error:
              error instanceof Error
                ? error.message
                : "Campaign summaries did not load.",
          },
        });
      });

    return () => {
      controller.abort();
    };
  }, []);

  const actions = {
    approveItem(approvalId: string) {
      dispatch({ type: "approve_item", payload: { approvalId } });
    },
    requestChanges(approvalId: string) {
      dispatch({ type: "request_changes", payload: { approvalId } });
    },
    createCampaignDraft() {
      dispatch({ type: "create_campaign_draft" });
    },
    updateCampaignDraftStep(
      partial: Partial<
        NonNullable<NorthstarState["ui"]["createCampaignDraft"]>
      >,
    ) {
      dispatch({ type: "update_campaign_draft_step", payload: partial });
    },
    submitCampaignDraft() {
      const artifacts = createCampaignArtifacts(
        state.ui.createCampaignDraft,
        "Founder",
      );

      if (!artifacts) {
        return null;
      }

      dispatch({
        type: "submit_campaign_draft",
        payload: artifacts,
      });

      return artifacts.campaign.id;
    },
    setSearchQuery(query: string) {
      dispatch({ type: "set_search_query", payload: { query } });
    },
    setFilter(
      key: keyof NorthstarState["ui"]["activeFilters"],
      value:
        NorthstarState["ui"]["activeFilters"][keyof NorthstarState["ui"]["activeFilters"]],
    ) {
      dispatch({ type: "set_filter", payload: { key, value } });
    },
    openApproval(approvalId: string | null) {
      dispatch({ type: "open_approval", payload: { approvalId } });
    },
  };

  return (
    <NorthstarStateContext.Provider value={state}>
      <NorthstarActionsContext.Provider value={actions}>
        {children}
      </NorthstarActionsContext.Provider>
    </NorthstarStateContext.Provider>
  );
}

export function useNorthstarState(): NorthstarState {
  const context = useContext(NorthstarStateContext);
  if (!context) {
    throw new Error("useNorthstarState must be used within NorthstarAppProvider");
  }
  return context;
}

export function useNorthstarActions() {
  const context = useContext(NorthstarActionsContext);
  if (!context) {
    throw new Error(
      "useNorthstarActions must be used within NorthstarAppProvider",
    );
  }
  return context;
}

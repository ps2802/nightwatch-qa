export type Channel = "x" | "email" | "intercom" | "multi";

export type CampaignStatus =
  | "draft"
  | "needs_approval"
  | "changes_requested"
  | "ready_to_send"
  | "live"
  | "paused"
  | "completed";

export type ApprovalStatus =
  | "waiting_on_me"
  | "approved"
  | "changes_requested";

export type AccountStatus =
  | "connected"
  | "needs_reconnect"
  | "not_connected";

export type Workspace = {
  id: string;
  name: string;
};

export type BoardItem = {
  id: string;
  title: string;
  status: CampaignStatus | ApprovalStatus;
  owner: string;
  channel: Channel;
  audience: string;
  nextStep: string;
  linkedCampaignId?: string;
};

export type ApprovalItem = {
  id: string;
  title: string;
  type: "tweet" | "email" | "intercom" | "page_copy";
  status: ApprovalStatus;
  whyItMatters: string;
  requester: string;
  dueTime: string;
  channel: Channel;
  audience: string;
  goal: string;
  finalDraft: string;
  notes: string;
  linkedCampaignId?: string;
};

export type BoardApprovalSummary = {
  id: string;
  title: string;
  status: ApprovalStatus;
  whyItMatters: string;
  requester: string;
  dueTime: string;
  channel: Channel;
  linkedCampaignId?: string;
};

export type CampaignSummary = {
  id: string;
  name: string;
  channel: Channel;
  status: CampaignStatus;
  owner: string;
  audience: string;
  lastUpdated: string;
  primaryMetricLabel: string;
  primaryMetricValue: string;
};

export type CampaignAsset = {
  id: string;
  channel: Channel;
  type: "post" | "email" | "message" | "landing_copy";
  title: string;
  content: string;
};

export type CampaignDetail = CampaignSummary & {
  objective: string;
  coreMessage: string;
  linkedBoardItemIds: string[];
  assets: CampaignAsset[];
};

export type AnalyticsSnapshot = {
  activeCampaigns: number;
  approvalTurnaround: string;
  bestChannel: Channel;
  movementLabel: string;
  movementValue: string;
};

export type BoardMovementSnapshot = {
  movementLabel: string;
  movementValue: string;
  movementNote: string;
};

export type ConnectedAccount = {
  id: string;
  name: string;
  channel: Channel | "website";
  status: AccountStatus;
};

export type NotificationPreference = {
  id: string;
  label: string;
  enabled: boolean;
};

export type ReadStatus = "idle" | "loading" | "success" | "empty" | "error";

export type Phase2AReadState<T> = {
  status: ReadStatus;
  data: T;
  error: string | null;
};

export type NorthstarState = {
  workspace: Workspace;
  boardItems: BoardItem[];
  approvals: ApprovalItem[];
  campaigns: CampaignDetail[];
  analytics: AnalyticsSnapshot;
  connectedAccounts: ConnectedAccount[];
  notificationPreferences: NotificationPreference[];
  reads: {
    boardHome: Phase2AReadState<{
      items: BoardItem[];
      snapshot: BoardMovementSnapshot | null;
    }>;
    approvalSummary: Phase2AReadState<BoardApprovalSummary[]>;
    campaignSummary: Phase2AReadState<CampaignSummary[]>;
  };
  ui: {
    searchQuery: string;
    activeFilters: {
      approvals?: ApprovalStatus | "all";
      campaigns?: CampaignStatus | "all";
      channel?: Channel | "all";
      timeframe?: "7d" | "30d" | "90d";
    };
    activeApprovalId: string | null;
    createCampaignDraft: {
      channel?: Channel;
      goal?: string;
      audience?: string;
      notes?: string;
      generatedPlan?: string[];
      generatedAssets?: CampaignAsset[];
      currentStep: number;
    } | null;
  };
};

import type {
  ApprovalItem,
  BoardApprovalSummary,
  CampaignDetail,
  Channel,
  ConnectedAccount,
  NorthstarState,
  NotificationPreference,
} from "@/types/northstar";

export function getConnectedAccountSummary(accounts: ConnectedAccount[]) {
  const connected = accounts.filter((account) => account.status === "connected");
  const reconnect = accounts.filter(
    (account) => account.status === "needs_reconnect",
  );
  const disconnected = accounts.filter(
    (account) => account.status === "not_connected",
  );

  return {
    connectedLabel: `${connected.length} connected`,
    reconnectLabel: `${reconnect.length} reconnect`,
    disconnectedLabel: `${disconnected.length} not connected`,
  };
}

function sectionHasData(status: NorthstarState["reads"]["boardHome"]["status"]) {
  return status === "success" || status === "empty";
}

function matchesSearch(values: Array<string | undefined>, query: string) {
  if (!query) {
    return true;
  }

  const normalizedQuery = query.trim().toLowerCase();
  return values.some((value) =>
    (value ?? "").toLowerCase().includes(normalizedQuery),
  );
}

export function getTodayItemsForBoard(state: NorthstarState) {
  return state.reads.boardHome.data.items
    .filter((item) =>
      matchesSearch(
        [
          item.title,
          item.owner,
          item.channel,
          item.status,
          item.audience,
          item.nextStep,
        ],
        state.ui.searchQuery,
      ),
    )
    .slice(0, 4);
}

export function getPendingApprovalsForBoard(state: NorthstarState) {
  return state.reads.approvalSummary.data.filter(
    (approval) =>
      approval.status === "waiting_on_me" &&
      matchesSearch(
        [
          approval.title,
          approval.requester,
          approval.channel,
          approval.status,
          approval.whyItMatters,
        ],
        state.ui.searchQuery,
      ),
  );
}

export function getLiveCampaignsForBoard(state: NorthstarState) {
  return state.reads.campaignSummary.data.filter(
    (campaign) =>
      (campaign.status === "live" || campaign.status === "ready_to_send") &&
      matchesSearch(
        [
          campaign.name,
          campaign.owner,
          campaign.channel,
          campaign.status,
          campaign.audience,
        ],
        state.ui.searchQuery,
      ),
  );
}

export function getBoardPerformanceSnapshot(state: NorthstarState) {
  const boardHomeStatus = state.reads.boardHome.status;
  const approvalStatus = state.reads.approvalSummary.status;
  const campaignStatus = state.reads.campaignSummary.status;
  const liveCampaigns = getLiveCampaignsForBoard(state);
  const pendingApprovals = getPendingApprovalsForBoard(state);
  const snapshot = state.reads.boardHome.data.snapshot;

  const byChannel = liveCampaigns.reduce<Record<Channel, number>>(
    (acc, campaign) => {
      acc[campaign.channel] += 1;
      return acc;
    },
    { x: 0, email: 0, intercom: 0, multi: 0 },
  );

  const topChannel =
    campaignStatus === "success" && liveCampaigns.length > 0
      ? ((Object.entries(byChannel).sort((a, b) => b[1] - a[1])[0]?.[0] as Channel) ??
        null)
      : null;

  return {
    activeCampaigns: sectionHasData(campaignStatus) ? liveCampaigns.length : null,
    pendingApprovals: sectionHasData(approvalStatus) ? pendingApprovals.length : null,
    topChannel,
    topChannelNote:
      topChannel === "x"
        ? "Fastest reach this week"
        : topChannel === "intercom"
          ? "Best conversion path"
          : topChannel === "email"
            ? "Strongest reply volume"
            : topChannel === "multi"
              ? "Most active mix"
              : "Unavailable",
    movementLabel: snapshot?.movementLabel ?? "Movement",
    movementValue: snapshot?.movementValue ?? "Unavailable",
    movementNote:
      snapshot?.movementNote ??
      (boardHomeStatus === "loading"
        ? "Loading"
        : boardHomeStatus === "error"
          ? "Unavailable"
          : "No movement data"),
    approvalsStatus: approvalStatus,
    campaignsStatus: campaignStatus,
    movementStatus: boardHomeStatus,
  };
}

export function getVisibleSearchCount(
  todayCount: number,
  approvalsCount: number,
  liveCampaignCount: number,
) {
  const total = todayCount + approvalsCount + liveCampaignCount;
  return `${total} visible`;
}

export function getDashboardSummary(state: NorthstarState) {
  const today = getTodayItemsForBoard(state).slice(0, 3);
  const approvals = getPendingApprovalsForBoard(state).slice(0, 3);
  const liveCampaigns = getLiveCampaignsForBoard(state).slice(0, 3);
  const performance = getBoardPerformanceSnapshot(state);

  return {
    today,
    approvals,
    liveCampaigns,
    performance,
  };
}

export function getApprovalsForList(state: NorthstarState) {
  const filter = state.ui.activeFilters.approvals ?? "all";

  return state.approvals.filter((approval) => {
    const matchesStatus = filter === "all" ? true : approval.status === filter;
    const matchesQuery = matchesSearch(
      [
        approval.title,
        approval.requester,
        approval.channel,
        approval.status,
        approval.audience,
      ],
      state.ui.searchQuery,
    );

    return matchesStatus && matchesQuery;
  });
}

export function getBoardHomeReadState(state: NorthstarState) {
  return state.reads.boardHome;
}

export function getBoardApprovalSummaryReadState(state: NorthstarState) {
  return state.reads.approvalSummary;
}

export function getBoardCampaignSummaryReadState(state: NorthstarState) {
  return state.reads.campaignSummary;
}

export function getActiveApproval(state: NorthstarState) {
  if (!state.ui.activeApprovalId) {
    return null;
  }

  return (
    state.approvals.find((approval) => approval.id === state.ui.activeApprovalId) ??
    null
  );
}

export function getCampaignsForList(state: NorthstarState) {
  const filter = state.ui.activeFilters.campaigns ?? "all";

  return state.campaigns.filter((campaign) => {
    const matchesStatus = filter === "all" ? true : campaign.status === filter;
    const matchesQuery = matchesSearch(
      [
        campaign.name,
        campaign.owner,
        campaign.channel,
        campaign.status,
        campaign.audience,
      ],
      state.ui.searchQuery,
    );

    return matchesStatus && matchesQuery;
  });
}

export function getCampaignById(state: NorthstarState, campaignId: string) {
  return state.campaigns.find((campaign) => campaign.id === campaignId) ?? null;
}

export function getCampaignApprovals(state: NorthstarState, campaignId: string) {
  return state.approvals.filter(
    (approval) => approval.linkedCampaignId === campaignId,
  );
}

export function getCampaignBoardItems(state: NorthstarState, campaignId: string) {
  return state.boardItems.filter((item) => item.linkedCampaignId === campaignId);
}

export function getCampaignPerformanceRows(campaign: CampaignDetail) {
  const rows = [
    {
      label: campaign.primaryMetricLabel,
      value: campaign.primaryMetricValue,
      change:
        campaign.status === "live"
          ? "Live now"
          : campaign.status === "ready_to_send"
            ? "Queued"
            : "Draft",
      tone:
        campaign.status === "live"
          ? ("positive" as const)
          : campaign.status === "ready_to_send"
            ? ("warning" as const)
            : ("neutral" as const),
    },
    {
      label: "Audience",
      value: campaign.audience,
      change: campaign.channel === "multi" ? "Multi-channel" : campaign.channel,
      tone: "neutral" as const,
    },
    {
      label: "Last updated",
      value: campaign.lastUpdated,
      change: "Operational",
      tone: "neutral" as const,
    },
  ];

  return rows;
}

export function getCampaignApprovalSummary(approvals: ApprovalItem[]) {
  return {
    pending: approvals.filter((approval) => approval.status === "waiting_on_me"),
    completed: approvals.filter((approval) => approval.status !== "waiting_on_me"),
  };
}

export function getPendingApprovalSummaryCount(items: BoardApprovalSummary[]) {
  return items.filter((approval) => approval.status === "waiting_on_me").length;
}

export function getAnalyticsSummary(state: NorthstarState) {
  const timeframe = state.ui.activeFilters.timeframe ?? "30d";
  const channelFilter = state.ui.activeFilters.channel ?? "all";

  const visibleCampaigns = state.campaigns.filter((campaign) =>
    channelFilter === "all" ? true : campaign.channel === channelFilter,
  );

  const campaignRows = visibleCampaigns.map((campaign, index) => ({
    id: campaign.id,
    label: campaign.name,
    value: campaign.primaryMetricValue,
    width: Math.max(34, 88 - index * 14),
    takeaway:
      index === 0
        ? `${campaign.name} is setting the pace right now.`
        : `${campaign.name} needs less attention than the lead campaign.`,
  }));

  const byChannel = ["x", "email", "intercom", "multi"].map((channel) => {
    const campaigns = state.campaigns.filter((campaign) => campaign.channel === channel);
    const score = campaigns.length === 0 ? 0 : 26 + campaigns.length * 18;

    return {
      channel: channel as Channel,
      count: campaigns.length,
      score,
      takeaway:
        channel === state.analytics.bestChannel
          ? "This channel is converting fastest."
          : campaigns.length === 0
            ? "No active campaign here yet."
            : "This channel is moving, but it is not leading.",
    };
  });

  const timeframeMovement = {
    "7d": {
      value: "+3.1%",
      takeaway: "Short-term movement is positive but still narrow.",
    },
    "30d": {
      value: state.analytics.movementValue,
      takeaway: "The current month shows enough movement to keep pushing.",
    },
    "90d": {
      value: "+15.4%",
      takeaway: "Longer-term trend is up, which supports staying consistent.",
    },
  }[timeframe];

  return {
    timeframe,
    channelFilter,
    activeCampaigns: visibleCampaigns.length || state.analytics.activeCampaigns,
    approvalTurnaround: state.analytics.approvalTurnaround,
    bestChannel: state.analytics.bestChannel,
    movementLabel: state.analytics.movementLabel,
    movementValue: timeframeMovement.value,
    topTakeaway: `${state.analytics.bestChannel.toUpperCase()} is the strongest channel right now, so it should keep the most urgent work.`,
    campaignRows,
    channelRows: byChannel,
    timeframeTakeaway: timeframeMovement.takeaway,
  };
}

export function getSettingsSummary(state: NorthstarState) {
  const owners = new Set<string>();

  state.campaigns.forEach((campaign) => owners.add(campaign.owner));
  state.approvals.forEach((approval) => owners.add(approval.requester));

  const accountSummary = {
    connected: state.connectedAccounts.filter((account) => account.status === "connected"),
    reconnect: state.connectedAccounts.filter(
      (account) => account.status === "needs_reconnect",
    ),
    disconnected: state.connectedAccounts.filter(
      (account) => account.status === "not_connected",
    ),
  };

  return {
    workspace: {
      name: state.workspace.name,
      activeCampaigns: state.campaigns.length,
      pendingApprovals: state.approvals.filter(
        (approval) => approval.status === "waiting_on_me",
      ).length,
    },
    brandVoice: [
      "Direct over clever",
      "Short labels, low jargon",
      "Operational tone, not philosophy",
    ],
    accounts: accountSummary,
    team: Array.from(owners),
    notifications: state.notificationPreferences,
  };
}

export function getNotificationSummary(
  notifications: NotificationPreference[],
) {
  const enabled = notifications.filter((item) => item.enabled).length;
  const paused = notifications.length - enabled;

  return {
    enabled,
    paused,
  };
}

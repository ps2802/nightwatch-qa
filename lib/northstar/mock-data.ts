import type {
  AnalyticsSnapshot,
  CampaignAsset,
  CampaignDetail,
  Channel,
  ConnectedAccount,
  NorthstarState,
  NotificationPreference,
} from "@/types/northstar";

const baseAssets: Record<"x" | "email" | "intercom" | "multi", CampaignAsset[]> =
  {
    x: [
      {
        id: "asset-x-1",
        channel: "x",
        type: "post",
        title: "Launch thread draft",
        content: "Three-post thread focused on activation proof points.",
      },
    ],
    email: [
      {
        id: "asset-email-1",
        channel: "email",
        type: "email",
        title: "Activation nudge",
        content: "Short founder-style note to re-engage trial signups.",
      },
    ],
    intercom: [
      {
        id: "asset-intercom-1",
        channel: "intercom",
        type: "message",
        title: "Checklist prompt",
        content: "In-app message prompting users to finish setup.",
      },
    ],
    multi: [
      {
        id: "asset-multi-1",
        channel: "multi",
        type: "email",
        title: "Cross-channel kickoff",
        content: "Short email kickoff aligned with product launch copy.",
      },
      {
        id: "asset-multi-2",
        channel: "multi",
        type: "post",
        title: "Proof tweet",
        content: "A short social post anchored to outcome proof.",
      },
    ],
  };

const campaigns: CampaignDetail[] = [
  {
    id: "campaign-launch-week",
    name: "Launch week reactivation",
    channel: "email",
    status: "ready_to_send",
    owner: "Maya",
    audience: "Dormant trial users",
    lastUpdated: "Updated 2h ago",
    primaryMetricLabel: "Replies",
    primaryMetricValue: "4.8%",
    objective: "Re-activate dormant trials before launch week closes.",
    coreMessage: "A fast path back into the product with one clear next step.",
    linkedBoardItemIds: ["board-1", "board-2"],
    assets: baseAssets.email,
  },
  {
    id: "campaign-onboarding-push",
    name: "Onboarding completion push",
    channel: "intercom",
    status: "live",
    owner: "Theo",
    audience: "New signups with partial setup",
    lastUpdated: "Updated 45m ago",
    primaryMetricLabel: "Completions",
    primaryMetricValue: "+13%",
    objective: "Increase setup completion in the first session.",
    coreMessage: "Finish setup now and reach the first win faster.",
    linkedBoardItemIds: ["board-3"],
    assets: baseAssets.intercom,
  },
  {
    id: "campaign-founder-proof",
    name: "Founder proof thread",
    channel: "x",
    status: "live",
    owner: "Riya",
    audience: "Investors and warm leads",
    lastUpdated: "Updated 18m ago",
    primaryMetricLabel: "Profile visits",
    primaryMetricValue: "+22%",
    objective: "Convert launch proof into more qualified conversations.",
    coreMessage: "Show product movement through concise proof, not hype.",
    linkedBoardItemIds: ["board-4"],
    assets: baseAssets.x,
  },
];

const connectedAccounts: ConnectedAccount[] = [
  { id: "account-x", name: "X", channel: "x", status: "connected" },
  {
    id: "account-intercom",
    name: "Intercom",
    channel: "intercom",
    status: "connected",
  },
  {
    id: "account-email",
    name: "Email",
    channel: "email",
    status: "needs_reconnect",
  },
  {
    id: "account-site",
    name: "Website",
    channel: "website",
    status: "not_connected",
  },
];

const notificationPreferences: NotificationPreference[] = [
  { id: "notif-approvals", label: "Approval reminders", enabled: true },
  { id: "notif-launch", label: "Launch movement", enabled: true },
];

const analytics: AnalyticsSnapshot = {
  activeCampaigns: 3,
  approvalTurnaround: "1h 48m",
  bestChannel: "x",
  movementLabel: "Activation movement",
  movementValue: "+8.6%",
};

export const phase2ASeedSource = {
  boardItems: [
    {
      id: "board-1",
      title: "Approve launch week subject line",
      status: "waiting_on_me",
      owner: "Maya",
      channel: "email",
      audience: "Dormant trial users",
      nextStep: "Approve or request changes",
      linkedCampaignId: "campaign-launch-week",
    },
    {
      id: "board-2",
      title: "Tighten launch email preview text",
      status: "needs_approval",
      owner: "Maya",
      channel: "email",
      audience: "Dormant trial users",
      nextStep: "Review draft revision",
      linkedCampaignId: "campaign-launch-week",
    },
    {
      id: "board-3",
      title: "Watch onboarding message completion trend",
      status: "live",
      owner: "Theo",
      channel: "intercom",
      audience: "New signups with partial setup",
      nextStep: "Check results tomorrow",
      linkedCampaignId: "campaign-onboarding-push",
    },
    {
      id: "board-4",
      title: "Ship proof thread before afternoon traffic",
      status: "ready_to_send",
      owner: "Riya",
      channel: "x",
      audience: "Investors and warm leads",
      nextStep: "Give final publish sign-off",
      linkedCampaignId: "campaign-founder-proof",
    },
  ] as NorthstarState["boardItems"],
  approvals: [
    {
      id: "approval-1",
      title: "Launch week subject line",
      type: "email",
      status: "waiting_on_me",
      whyItMatters: "This email opens the reactivation sequence.",
      requester: "Maya",
      dueTime: "Due today, 4:00 PM",
      channel: "email",
      audience: "Dormant trial users",
      goal: "Lift reactivation before launch week ends.",
      finalDraft: "Come back in before launch week closes",
      notes: "Keep the tone direct and low-friction.",
      linkedCampaignId: "campaign-launch-week",
    },
    {
      id: "approval-2",
      title: "Founder proof thread opener",
      type: "tweet",
      status: "waiting_on_me",
      whyItMatters: "This thread carries the proof point for launch week traffic.",
      requester: "Riya",
      dueTime: "Due today, 2:30 PM",
      channel: "x",
      audience: "Investors and warm leads",
      goal: "Drive more qualified replies from public proof.",
      finalDraft: "Three weeks in, activation is already moving in the right direction",
      notes: "Lead with the result before the opinion.",
      linkedCampaignId: "campaign-founder-proof",
    },
  ] as NorthstarState["approvals"],
  campaigns,
  analytics,
};

export const initialNorthstarState: NorthstarState = {
  workspace: {
    id: "workspace-nightwatch",
    name: "Northstar HQ",
  },
  boardItems: phase2ASeedSource.boardItems,
  approvals: phase2ASeedSource.approvals,
  campaigns,
  analytics,
  connectedAccounts,
  notificationPreferences,
  reads: {
    boardHome: {
      status: "loading",
      data: {
        items: [],
        snapshot: null,
      },
      error: null,
    },
    approvalSummary: {
      status: "loading",
      data: [],
      error: null,
    },
    campaignSummary: {
      status: "loading",
      data: [],
      error: null,
    },
  },
  ui: {
    searchQuery: "",
    activeFilters: {
      approvals: "all",
      campaigns: "all",
      channel: "all",
      timeframe: "30d",
    },
    activeApprovalId: null,
    createCampaignDraft: null,
  },
};

export function buildChannelAssets(channel: "x" | "email" | "intercom" | "multi") {
  return baseAssets[channel].map((asset) => ({
    ...asset,
    id: `${asset.id}-${Math.random().toString(36).slice(2, 8)}`,
  }));
}

export function buildCampaignDraftPreview({
  channel,
  goal,
  audience,
  notes,
}: {
  channel: Channel;
  goal: string;
  audience: string;
  notes?: string;
}) {
  const planByChannel: Record<Channel, string[]> = {
    x: [
      `Frame one proof-led angle for ${audience.toLowerCase()}.`,
      "Write a concise opening post with one measurable claim.",
      "Set a follow-up reply path for qualified interest.",
    ],
    email: [
      `Write a short email focused on ${goal.toLowerCase()}.`,
      "Lead with the main outcome in the subject line and preview text.",
      "Keep the CTA to one next step only.",
    ],
    intercom: [
      `Trigger the message when ${audience.toLowerCase()} hit the key moment.`,
      "Keep the body under two short sentences.",
      "Route the CTA directly into the next product action.",
    ],
    multi: [
      `Anchor the campaign around one message for ${audience.toLowerCase()}.`,
      "Sequence channel rollout from strongest intent to widest reach.",
      "Reuse the same proof point with channel-specific framing.",
    ],
  };

  const assets = buildChannelAssets(channel).map((asset, index) => ({
    ...asset,
    title:
      asset.title ||
      `${goal} asset ${index + 1}`,
    content:
      notes && notes.trim()
        ? `${asset.content} Context: ${notes.trim()}`
        : asset.content,
  }));

  return {
    generatedPlan: planByChannel[channel],
    generatedAssets: assets,
  };
}

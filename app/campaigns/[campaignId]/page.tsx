import { CampaignDetailScreen } from "@/components/northstar/campaigns/campaign-detail-screen";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;

  return <CampaignDetailScreen campaignId={campaignId} />;
}

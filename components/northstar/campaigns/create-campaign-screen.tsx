"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/northstar/shared/badge";
import { Button } from "@/components/northstar/shared/button";
import { Card } from "@/components/northstar/shared/card";
import { Input } from "@/components/northstar/shared/input";
import { SectionHeader } from "@/components/northstar/shared/section-header";
import { useNorthstarActions, useNorthstarState } from "@/lib/northstar/context";
import { buildCampaignDraftPreview } from "@/lib/northstar/mock-data";
import type { Channel } from "@/types/northstar";

const steps = [
  "Channel",
  "Goal",
  "Audience",
  "Notes",
  "Generated plan",
  "Founder review",
];

const channelOptions: Array<{ value: Channel; label: string; note: string }> = [
  { value: "x", label: "X", note: "Short public proof and updates." },
  { value: "email", label: "Email", note: "Direct message for owned audience." },
  {
    value: "intercom",
    label: "Intercom",
    note: "In-product prompt tied to a specific moment.",
  },
  {
    value: "multi",
    label: "Multi-channel",
    note: "One message rolled out across multiple surfaces.",
  },
];

export function CreateCampaignScreen() {
  const state = useNorthstarState();
  const actions = useNorthstarActions();
  const router = useRouter();
  const draft = state.ui.createCampaignDraft;
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);

  useEffect(() => {
    if (!draft) {
      actions.createCampaignDraft();
    }
  }, [actions, draft]);

  const currentStep = draft?.currentStep ?? 1;

  const preview = useMemo(() => {
    if (!draft?.channel || !draft.goal || !draft.audience) {
      return null;
    }

    return buildCampaignDraftPreview({
      channel: draft.channel,
      goal: draft.goal,
      audience: draft.audience,
      notes: draft.notes,
    });
  }, [draft?.audience, draft?.channel, draft?.goal, draft?.notes]);

  const moveToStep = (nextStep: number) => {
    if (!draft) {
      return;
    }

    if (nextStep > currentStep) {
      if (currentStep === 1 && !draft.channel) {
        setStepError("Choose a channel before moving on.");
        return;
      }

      if (currentStep === 2 && !draft.goal?.trim()) {
        setStepError("Add a goal before moving on.");
        return;
      }

      if (currentStep === 3 && !draft.audience?.trim()) {
        setStepError("Add an audience before moving on.");
        return;
      }
    }

    setStepError(null);

    if (nextStep === 5 && preview) {
      actions.updateCampaignDraftStep({
        currentStep: nextStep,
        generatedPlan: preview.generatedPlan,
        generatedAssets: preview.generatedAssets,
      });
      return;
    }

    actions.updateCampaignDraftStep({ currentStep: nextStep });
  };

  const submit = () => {
    setSubmitError(null);
    setStepError(null);
    const campaignId = actions.submitCampaignDraft();

    if (!campaignId) {
      setSubmitError("Complete the required fields before creating the draft.");
      return;
    }

    router.push(`/campaigns/${campaignId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-ink">
            Create campaign
          </h1>
          <p className="mt-1 text-sm text-muted">
            One decision per step. No giant form.
          </p>
        </div>
        <Badge variant="neutral">{`Step ${currentStep} of 6`}</Badge>
      </div>

      <Card>
        <SectionHeader
          title="Progress"
          meta="Move one step at a time."
        />
        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-6">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const active = stepNumber === currentStep;
            const complete = stepNumber < currentStep;

            return (
              <div
                key={step}
                className={`rounded-2xl border px-3 py-3 text-sm ${
                  active
                    ? "border-transparent bg-ink text-white"
                    : complete
                      ? "border-transparent bg-surfaceMuted text-ink"
                      : "border-line bg-surface text-muted"
                }`}
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.16em]">
                  {stepNumber}
                </p>
                <p className="mt-1">{step}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {draft ? (
        <Card>
          {currentStep === 1 ? (
            <div className="space-y-5">
              <SectionHeader title="Choose channel" meta="Pick the primary surface first." />
              <div className="grid gap-3 md:grid-cols-2">
                {channelOptions.map((option) => {
                  const active = draft.channel === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        actions.updateCampaignDraftStep({ channel: option.value })
                      }
                      className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
                        active
                          ? "border-transparent bg-ink text-white"
                          : "border-line bg-surface hover:bg-surfaceMuted"
                      }`}
                    >
                      <p className="text-sm font-medium">{option.label}</p>
                      <p
                        className={`mt-2 text-sm ${
                          active ? "text-white/76" : "text-muted"
                        }`}
                      >
                        {option.note}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {currentStep === 2 ? (
            <div className="space-y-5">
              <SectionHeader title="Set goal" meta="State the outcome plainly." />
              <Input
                value={draft.goal ?? ""}
                onChange={(event) =>
                  actions.updateCampaignDraftStep({ goal: event.target.value })
                }
                placeholder="Example: Re-activate dormant trials before Friday"
              />
            </div>
          ) : null}

          {currentStep === 3 ? (
            <div className="space-y-5">
              <SectionHeader title="Define audience" meta="Who should this move?" />
              <Input
                value={draft.audience ?? ""}
                onChange={(event) =>
                  actions.updateCampaignDraftStep({ audience: event.target.value })
                }
                placeholder="Example: Dormant trial users from the last 14 days"
              />
            </div>
          ) : null}

          {currentStep === 4 ? (
            <div className="space-y-5">
              <SectionHeader title="Add context" meta="Keep notes short and useful." />
              <textarea
                value={draft.notes ?? ""}
                onChange={(event) =>
                  actions.updateCampaignDraftStep({ notes: event.target.value })
                }
                placeholder="Relevant context, proof point, or constraint."
                className="min-h-[140px] w-full rounded-3xl border border-line bg-surface px-4 py-4 text-sm text-ink outline-none placeholder:text-muted"
              />
            </div>
          ) : null}

          {currentStep === 5 ? (
            <div className="space-y-5">
              <SectionHeader
                title="Generated plan"
                meta="Review the draft plan and seeded assets."
              />
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-3xl border border-line bg-surface px-4 py-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                    Plan
                  </p>
                  <div className="mt-4 space-y-3">
                    {draft.generatedPlan?.map((item) => (
                      <p key={item} className="text-sm text-ink">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl border border-line bg-surface px-4 py-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                    Assets
                  </p>
                  <div className="mt-4 divide-y divide-line">
                    {draft.generatedAssets?.map((asset) => (
                      <div key={asset.id} className="py-3 first:pt-0 last:pb-0">
                        <p className="text-sm font-medium text-ink">{asset.title}</p>
                        <p className="mt-1 text-sm text-muted">{asset.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {currentStep === 6 ? (
            <div className="space-y-5">
              <SectionHeader
                title="Founder review"
                meta="Final check before creating the local draft."
              />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-line bg-surface px-4 py-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                    Channel
                  </p>
                  <p className="mt-2 text-sm text-ink">{draft.channel}</p>
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                    Goal
                  </p>
                  <p className="mt-2 text-sm text-ink">{draft.goal}</p>
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                    Audience
                  </p>
                  <p className="mt-2 text-sm text-ink">{draft.audience}</p>
                </div>
                <div className="rounded-3xl border border-line bg-surface px-4 py-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                    Draft plan
                  </p>
                  <div className="mt-3 space-y-2">
                    {draft.generatedPlan?.map((item) => (
                      <p key={item} className="text-sm text-ink">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              {submitError ? (
                <p className="text-sm text-danger">{submitError}</p>
              ) : null}
              {stepError ? <p className="text-sm text-danger">{stepError}</p> : null}
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap justify-between gap-3">
            <Button
              variant="secondary"
              onClick={() => moveToStep(Math.max(1, currentStep - 1))}
            >
              Back
            </Button>
            <div className="flex flex-wrap gap-2">
              {stepError && currentStep < 6 ? (
                <p className="self-center text-sm text-danger">{stepError}</p>
              ) : null}
              {currentStep < 6 ? (
                <Button
                  variant="primary"
                  onClick={() => moveToStep(Math.min(6, currentStep + 1))}
                >
                  Next step
                </Button>
              ) : (
                <Button variant="primary" onClick={submit}>
                  Create draft
                </Button>
              )}
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

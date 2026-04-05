"use client";

type TabOption = {
  id: string;
  label: string;
};

export function Tabs({
  tabs,
  activeTab,
  onChange,
}: {
  tabs: TabOption[];
  activeTab: string;
  onChange: (tabId: string) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Campaign sections"
      className="inline-flex w-full flex-wrap gap-2 rounded-2xl border border-line bg-surfaceMuted p-1"
    >
      {tabs.map((tab) => {
        const active = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`rounded-xl px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-surface text-ink shadow-card"
                : "text-muted hover:bg-surface/70"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

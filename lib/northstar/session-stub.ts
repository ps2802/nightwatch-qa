import { cookies } from "next/headers";
import type { NorthstarSessionStub } from "@/lib/northstar/phase-2a-contract";

const DEFAULT_WORKSPACE = {
  id: "workspace-nightwatch",
  name: "Northstar HQ",
} as const;

export async function getNorthstarSessionStub(): Promise<NorthstarSessionStub> {
  const cookieStore = await cookies();
  const workspaceId =
    cookieStore.get("northstar-workspace-id")?.value ?? DEFAULT_WORKSPACE.id;
  const sessionId =
    cookieStore.get("northstar-session-id")?.value ?? "northstar-session-local";

  return {
    sessionId,
    workspace: {
      id: workspaceId,
      name: DEFAULT_WORKSPACE.name,
    },
  };
}

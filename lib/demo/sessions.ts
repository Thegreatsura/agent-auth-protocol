import { AgentAuthClient, MemoryStorage, type ApprovalInfo } from "@auth/agent";

export interface DemoSettings {
  directoryUrl?: string;
  providerUrl?: string;
  hostName?: string;
  allowDirectDiscovery?: boolean;
}

export interface DemoSession {
  client: AgentAuthClient;
  storage: MemoryStorage;
  pendingApproval: ApprovalInfo | null;
  lastAgentId: string | null;
  awaitingChoice: boolean;
}

function parseHostName(ua: string): string {
  let browser = "Unknown Browser";
  let os = "Unknown OS";

  if (ua.includes("Firefox/")) browser = "Firefox";
  else if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("OPR/") || ua.includes("Opera/")) browser = "Opera";
  else if (ua.includes("Chrome/") && ua.includes("Safari/")) browser = "Chrome";
  else if (ua.includes("Safari/") && !ua.includes("Chrome/")) browser = "Safari";

  if (ua.includes("Macintosh") || ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("CrOS")) os = "ChromeOS";

  return `${browser} on ${os}`;
}

const globalStore = globalThis as unknown as {
  __demoSessions?: Map<string, DemoSession>;
  __demoTimers?: Map<string, ReturnType<typeof setTimeout>>;
};
const sessions = (globalStore.__demoSessions ??= new Map<string, DemoSession>());
const sessionTimers = (globalStore.__demoTimers ??= new Map<string, ReturnType<typeof setTimeout>>());

const SESSION_TTL = 30 * 60 * 1000;

function touchSession(id: string) {
  const existing = sessionTimers.get(id);
  if (existing) clearTimeout(existing);
  sessionTimers.set(
    id,
    setTimeout(() => {
      const session = sessions.get(id);
      session?.client.destroy();
      sessions.delete(id);
      sessionTimers.delete(id);
    }, SESSION_TTL),
  );
}

export function getSession(id: string): DemoSession | undefined {
  const session = sessions.get(id);
  if (session) touchSession(id);
  return session;
}

export function getOrCreateSession(
  id: string,
  opts?: { userAgent?: string; settings?: DemoSettings },
): DemoSession {
  const existing = sessions.get(id);
  if (existing) {
    touchSession(id);
    return existing;
  }

  const settings = opts?.settings;
  const hostName = settings?.hostName
    || (opts?.userAgent
      ? `Agent Auth Demo — ${parseHostName(opts.userAgent)}`
      : "Agent Auth Interactive Demo");

  const storage = new MemoryStorage();
  const session: DemoSession = {
    client: new AgentAuthClient({
      storage,
      hostName,
      directoryUrl: settings?.directoryUrl || "https://agent-auth.directory",
      allowDirectDiscovery: settings?.allowDirectDiscovery,
      approvalTimeoutMs: 1,
      onApprovalRequired(info) {
        session.pendingApproval = info;
      },
      onApprovalStatusChange(status) {
        if (status === "active") {
          session.pendingApproval = null;
        }
      },
    }),
    storage,
    pendingApproval: null,
    lastAgentId: null,
    awaitingChoice: false,
  };

  sessions.set(id, session);
  touchSession(id);
  return session;
}

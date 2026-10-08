// Shared lab types. Document shapes come from the Zod schemas in ./schemas.

export type LabState = 'live' | 'delayed' | 'offline';

/** What every /api/lab/* document route returns: the parsed document plus its freshness. */
export type LabPayload<T> =
  | ({ state: 'live' | 'delayed'; age_s: number; demo?: true } & T)
  | { state: 'offline' };

export const CATEGORIES = ['recon', 'brute_force', 'web_exploit', 'intrusion', 'malware', 'ai_agent'] as const;
export type Category = (typeof CATEGORIES)[number];

export const TARGETS = ['sensor', 'web'] as const;
export type Target = (typeof TARGETS)[number];

export const SERVICES = ['ssh', 'telnet', 'http', 'https', 'other'] as const;
export type Service = (typeof SERVICES)[number];

export const BEHAVIORS = [
  'system_recon',
  'cred_change',
  'ssh_key_persistence',
  'cron_persistence',
  'download_attempt',
  'miner',
  'botnet_dropper',
  'cleanup',
  'other',
] as const;
export type Behavior = (typeof BEHAVIORS)[number];

export const MALWARE_VIA = ['scp', 'sftp', 'upload'] as const;

export const ROLES = ['storage', 'gpu', 'apps'] as const;
export type Role = (typeof ROLES)[number];

/** `/api/lab/summary`: a few numbers for the home page, never a full document. */
export interface LabSummary {
  demo?: true;
  telemetry: {
    state: LabState;
    age_s?: number;
    power_w?: number | null;
    energy_kwh_24h?: number | null;
    hosts_up?: number;
    hosts_expected?: number;
    power_24h?: (number | null)[];
  };
  threats: {
    state: LabState;
    age_s?: number;
    events?: number;
    sources?: number;
    countries?: number;
    by_category?: Record<Category, number>;
  };
}

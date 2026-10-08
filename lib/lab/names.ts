// Hardware names live here, not in the documents: the status contract carries only `role` and
// `index` (no free text). Category and behavior wording from THREATS_VIEW.md.

import type { Behavior, Category, Role } from './types';

export const HOSTS: Record<Role, { name: string; short: string; job: string }> = {
  storage: { name: 'PowerEdge T430', short: 'T430', job: 'NAS · media' },
  gpu: { name: 'PowerEdge R730', short: 'R730', job: 'GPU · inference' },
  apps: { name: 'PowerEdge R720xd', short: 'R720xd', job: 'apps · CI' },
};

const GPUS: Record<string, string> = {
  'storage:0': 'Quadro RTX 4000',
  'gpu:0': 'RTX A4000 #0',
  'gpu:1': 'RTX A4000 #1',
};

/** A card not in the table renders as `GPU <role>:<index>`, so a new one needs no code change. */
export function gpuName(role: Role, index: number): string {
  return GPUS[`${role}:${index}`] ?? `GPU ${role}:${index}`;
}

/** The tile's GPU table shows the model without the `#n` suffix (the host column tells them apart). */
export function gpuModel(role: Role, index: number): string {
  return gpuName(role, index).replace(/ #\d+$/, '');
}

export const CATEGORY_MEANING: Record<Category, string> = {
  recon: 'a probe of a port where nothing listens, or a connection that never tried to log in',
  brute_force: 'failed SSH or Telnet logins',
  web_exploit: 'an HTTP request matching an exploit or scanner rule, or a hit on a decoy path',
  intrusion: 'a successful (fake) login followed by commands',
  malware: 'a file pushed to the honeypot, or a command that fetches one',
  ai_agent: 'a session or request that followed an instruction planted for AI agents',
};

export const BEHAVIOR_LABEL: Record<Behavior, string> = {
  system_recon: 'looked around the system',
  cred_change: 'changed a password',
  ssh_key_persistence: 'planted an SSH key',
  cron_persistence: 'added a cron job',
  download_attempt: 'tried to download something',
  miner: 'started a miner',
  botnet_dropper: 'dropped a bot',
  cleanup: 'cleaned up after itself',
  other: 'other',
};

/** CSS variable for a category's color: `--lab-brute-force` for `brute_force`. */
export const categoryVar = (c: Category) => `var(--lab-${c.replace(/_/g, '-')})`;

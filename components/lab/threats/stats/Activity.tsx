'use client';

import React from 'react';
import { fmtAge, fmtInt, DASH } from '@/lib/lab/format';
import { BEHAVIOR_LABEL } from '@/lib/lab/names';
import { BEHAVIORS } from '@/lib/lab/types';
import type { DigestLive } from '../useThreats';
import { StatBox } from './StatBox';

const table: React.CSSProperties = { width: '100%', borderCollapse: 'collapse' };
// Links built from data only from values that pass these again here (LAB_UI_SPEC.md §9).
const CVE = /^CVE-\d{4}-\d{4,7}$/;
const SHA256 = /^[a-f0-9]{64}$/;
const ext = { target: '_blank', rel: 'noopener noreferrer', className: 'lab-link' } as const;

/** The nine behaviors in the fixed enum order, looked up by name (a missing one shows a dash). */
export function Behaviors({ d }: { d: DigestLive }) {
  const sessions = new Map(d.behaviors.map((b) => [b.behavior, b.sessions]));
  return (
    <StatBox caption="what intruders did · sessions">
      <table className="lab-table" style={table}>
        <tbody>
          {BEHAVIORS.map((b) => (
            <tr key={b}>
              <th scope="row" style={{ color: 'var(--theme-text)' }}>
                {BEHAVIOR_LABEL[b]} <span className="lab-text-2">{b}</span>
              </th>
              <td className="lab-num">{sessions.has(b) ? fmtInt(sessions.get(b)) : DASH}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </StatBox>
  );
}

export function Cves({ d }: { d: DigestLive }) {
  return (
    <StatBox caption="cves" empty={d.cves.length === 0}>
      <table className="lab-table" style={table}>
        <thead>
          <tr>
            <th scope="col">id</th>
            <th scope="col" className="lab-num">hits</th>
            <th scope="col" className="lab-num">sources</th>
          </tr>
        </thead>
        <tbody>
          {d.cves.map((c) => (
            <tr key={c.id}>
              <th scope="row">
                {CVE.test(c.id) ? (
                  <a href={`https://nvd.nist.gov/vuln/detail/${c.id}`} {...ext}>
                    {c.id}
                  </a>
                ) : (
                  c.id
                )}
              </th>
              <td className="lab-num">{fmtInt(c.hits)}</td>
              <td className="lab-num">{fmtInt(c.sources)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </StatBox>
  );
}

/** sha256 shortened to 12 characters (full in a title), how it arrived, when, and two lookups. */
export function Malware({ d, nowMs }: { d: DigestLive; nowMs: number }) {
  return (
    <StatBox caption="malware pushed" empty={d.malware.length === 0} style={{ gridColumn: '1 / -1' }}>
      <table className="lab-table" style={table}>
        <thead>
          <tr>
            <th scope="col">sha256</th>
            <th scope="col">via</th>
            <th scope="col">first seen</th>
            <th scope="col">
              <span className="sr-only">lookups</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {d.malware.map((m) => {
            const ok = SHA256.test(m.sha256);
            return (
              <tr key={m.sha256}>
                <th scope="row" title={m.sha256} style={{ color: 'var(--theme-text)' }}>
                  {m.sha256.slice(0, 12)}
                </th>
                <td>{m.via}</td>
                <td className="lab-text-2" style={{ whiteSpace: 'nowrap' }}>
                  {fmtAge((nowMs - Date.parse(m.first_seen)) / 1000)}
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  {ok && (
                    <>
                      <a href={`https://www.virustotal.com/gui/file/${m.sha256}`} {...ext}>
                        VirusTotal
                      </a>{' '}
                      <a href={`https://bazaar.abuse.ch/sample/${m.sha256}/`} {...ext}>
                        MalwareBazaar
                      </a>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </StatBox>
  );
}

export function AiAgents({ d }: { d: DigestLive }) {
  return (
    <StatBox caption="ai agents">
      <p style={{ margin: '0 0 0.6rem', display: 'flex', gap: '2rem' }}>
        <span>
          <span className="lab-text-2">suspected</span> {fmtInt(d.ai_agent.suspected)}
        </span>
        <span>
          <span className="lab-text-2">likely</span> {fmtInt(d.ai_agent.likely)}
        </span>
      </p>
      <p className="lab-text-2" style={{ margin: 0 }}>
        Sessions that followed an instruction planted where only an AI agent would act on it. Likely: it also
        answered at machine speed.
      </p>
    </StatBox>
  );
}

/** Hidden while empty (v1 has no IDS on the sensor). */
export function Signatures({ d }: { d: DigestLive }) {
  if (d.signatures.length === 0) return null;
  return (
    <StatBox caption="signatures">
      <table className="lab-table" style={table}>
        <tbody>
          {d.signatures.map((s) => (
            <tr key={s.name}>
              <th scope="row" style={{ color: 'var(--theme-text)', overflowWrap: 'anywhere' }}>
                {s.name}
              </th>
              <td className="lab-num">{fmtInt(s.hits)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </StatBox>
  );
}

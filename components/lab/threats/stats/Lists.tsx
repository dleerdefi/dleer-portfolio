import React from 'react';
import { countryName } from '@/lib/lab/countries';
import { fmtInt } from '@/lib/lab/format';
import type { DigestLive } from '../useThreats';
import { Bar, StatBox } from './StatBox';

const table: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' };

/** Top countries: name, an accent bar scaled to the first, events (and sources on the long list). */
export function TopCountries({ d, count, withSources = false }: { d: DigestLive; count: number; withSources?: boolean }) {
  const rows = d.countries.slice(0, count);
  const max = rows[0]?.events ?? 0;
  return (
    <StatBox caption={count > 5 ? 'countries' : 'top countries'} empty={rows.length === 0}>
      <table className="lab-table" style={table}>
        <thead className="sr-only">
          <tr>
            <th scope="col">country</th>
            <th scope="col">share</th>
            <th scope="col">events</th>
            {withSources && <th scope="col">sources</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.cc}>
              <th scope="row" style={{ color: 'var(--theme-text)', whiteSpace: 'nowrap' }} title={c.cc}>
                {countryName(c.cc)}
              </th>
              <td style={{ width: '45%' }}>
                <Bar value={c.events} max={max} />
              </td>
              <td className="lab-num">{fmtInt(c.events)}</td>
              {withSources && <td className="lab-num lab-text-2">{fmtInt(c.sources)} src</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </StatBox>
  );
}

/** `AS4134 Chinanet`, events, sources; a null name shows only the number. */
export function TopNetworks({ d }: { d: DigestLive }) {
  const rows = d.asns.slice(0, 10);
  return (
    <StatBox caption="top networks" empty={rows.length === 0}>
      <table className="lab-table" style={table}>
        <thead>
          <tr>
            <th scope="col">network</th>
            <th scope="col" className="lab-num">events</th>
            <th scope="col" className="lab-num">sources</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => (
            <tr key={a.asn}>
              <th scope="row" style={{ color: 'var(--theme-text)' }}>
                AS{a.asn}
                {a.name !== null && <span className="lab-text-2"> {a.name}</span>}
              </th>
              <td className="lab-num">{fmtInt(a.events)}</td>
              <td className="lab-num">{fmtInt(a.sources)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </StatBox>
  );
}

/** Usernames and passwords side by side, values exactly as received, in monospace. */
export function Credentials({ d, count }: { d: DigestLive; count: number }) {
  const users = d.credentials.usernames.slice(0, count);
  const pws = d.credentials.passwords.slice(0, count);
  const list = (rows: { value: string; attempts: number }[], label: string) => (
    <table className="lab-table" style={table}>
      <thead>
        <tr>
          <th scope="col">{label}</th>
          <th scope="col" className="lab-num">
            <span className="sr-only">attempts</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 && (
          <tr>
            <td className="lab-text-2">none</td>
          </tr>
        )}
        {rows.map((r) => (
          <tr key={r.value}>
            <td style={{ color: 'var(--theme-text)', overflowWrap: 'anywhere' }}>{r.value}</td>
            <td className="lab-num" style={{ paddingRight: 0 }}>
              {fmtInt(r.attempts)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  return (
    <StatBox caption="credentials tried · seen from 5+ sources" empty={users.length === 0 && pws.length === 0}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', columnGap: '1.5rem' }}>
        {list(users, 'username')}
        {list(pws, 'password')}
      </div>
    </StatBox>
  );
}

/** `root / 123456`, attempts. */
export function TopPairs({ d }: { d: DigestLive }) {
  const rows = d.credentials.pairs;
  return (
    <StatBox caption="top pairs · seen from 5+ sources" empty={rows.length === 0}>
      <table className="lab-table" style={table}>
        <thead>
          <tr>
            <th scope="col">username / password</th>
            <th scope="col" className="lab-num">attempts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={`${p.username}\u0000${p.password}`}>
              <td style={{ color: 'var(--theme-text)', overflowWrap: 'anywhere' }}>
                {p.username} / {p.password}
              </td>
              <td className="lab-num">{fmtInt(p.attempts)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </StatBox>
  );
}

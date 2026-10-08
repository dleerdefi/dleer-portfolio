import React from 'react';
import { fmtInt } from '@/lib/lab/format';
import { categoryVar } from '@/lib/lab/names';
import { CATEGORIES } from '@/lib/lab/types';
import { HourlyBlocks } from '@/components/lab/shared/HourlyBlocks';
import { Swatch } from '@/components/lab/shared/Swatch';
import type { DigestLive } from '../useThreats';
import { KvTable, StatBox } from './StatBox';

/** `ai agents  4 / 2`: suspected / likely. */
export const aiAgents = (d: DigestLive) => `${fmtInt(d.ai_agent.suspected)} / ${fmtInt(d.ai_agent.likely)}`;

/** The 24 hourly totals summed over every category. */
export function hourlyTotals(d: DigestLive): number[] {
  return Array.from({ length: 24 }, (_, i) => CATEGORIES.reduce((a, c) => a + d.hourly.by_category[c][i], 0));
}

/** The tile's summary box: four numbers and one row of hourly bars in the accent. */
export function TileSummary({ d }: { d: DigestLive }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <KvTable
        label="last 24 hours"
        rows={[
          ['events', fmtInt(d.totals.events)],
          ['sources', fmtInt(d.totals.sources)],
          ['countries', fmtInt(d.totals.countries)],
          ['ai agents', aiAgents(d)],
        ]}
      />
      <HourlyBlocks
        caption="events / hour, 24 h"
        showTotals={false}
        barHeight={16}
        rows={[{ key: 'all', color: 'var(--accent-color)', values: hourlyTotals(d) }]}
      />
    </div>
  );
}

/** `last 24 h`: two columns of key/value pairs (THREATS_VIEW.md §4.2). */
export function LastDay({ d }: { d: DigestLive }) {
  return (
    <StatBox caption="last 24 h">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', columnGap: '1.5rem' }}>
        <KvTable
          label="last 24 hours, part 1"
          rows={[
            ['events', fmtInt(d.totals.events)],
            ['countries', fmtInt(d.totals.countries)],
            ['fake logins', fmtInt(d.totals.by_category.intrusion)],
          ]}
        />
        <KvTable
          label="last 24 hours, part 2"
          rows={[
            ['sources', fmtInt(d.totals.sources)],
            ['downloads', fmtInt(d.download_attempts)],
            ['ai agents', aiAgents(d)],
          ]}
        />
      </div>
    </StatBox>
  );
}

/** One row per category, each scaled to its own maximum, with the 24 h total at the end. */
export function HourlyByCategory({ d }: { d: DigestLive }) {
  return (
    <StatBox caption="events / hour by category · -24 h → now · each row its own scale">
      <HourlyBlocks
        barHeight={14}
        rows={CATEGORIES.map((c) => ({
          key: c,
          color: categoryVar(c),
          values: d.hourly.by_category[c],
          total: d.totals.by_category[c],
          label: (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5em' }}>
              <Swatch category={c} />
              {c}
            </span>
          ),
        }))}
      />
    </StatBox>
  );
}

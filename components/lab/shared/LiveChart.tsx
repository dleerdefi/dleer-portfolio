'use client';

import React, { useEffect, useRef, useState } from 'react';
import { domainOf, linePaths, niceTicks, type Domain } from '@/lib/lab/chart';
import { glideSteps } from '@/lib/lab/live';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const AXES = { top: 8, right: 8, bottom: 22, left: 56 };
const BARE = { top: 3, right: 0, bottom: 3, left: 0 };

export interface LivePlotProps {
  values: (number | null)[];
  width: number;
  height: number;
  /** Fixed y range (ratios: 0 to 1); otherwise round ticks around the data. */
  domain?: Domain;
  /** Grid, y ticks and the time labels; small multiples go without. */
  axes?: boolean;
  /** The time labels, oldest to newest, e.g. ['-10 min', '-5 min', 'now']. */
  xLabels?: [string, string, string];
  ariaLabel: string;
  /** Receives the moving group, for the glide (written in requestAnimationFrame, not React). */
  lineRef?: React.Ref<SVGGElement>;
  clipId: string;
}

/**
 * The live chart's SVG at one width: entry i of `points` sits at i / (points − 1) of the plot,
 * so the x axis is time (start + i × step). `null` breaks the line, never drawn as zero.
 */
export function LivePlot({
  values,
  width,
  height,
  domain,
  axes = false,
  xLabels,
  ariaLabel,
  lineRef,
  clipId,
}: LivePlotProps) {
  const m = axes ? AXES : BARE;
  const data = domain ?? domainOf(values);
  const ticks = axes && data && !domain ? niceTicks(data, 3) : [];
  const dom = ticks.length > 1 ? { min: ticks[0], max: ticks[ticks.length - 1] } : data;
  const plotW = Math.max(0, width - m.left - m.right);
  const plotH = Math.max(0, height - m.top - m.bottom);
  const runs = dom && plotW > 0 ? linePaths(values, { width: plotW, height: plotH, domain: dom }) : [];
  const yAt = (v: number) => (dom ? (1 - (v - dom.min) / (dom.max - dom.min || 1)) * plotH : plotH / 2);

  return (
    <svg role="img" aria-label={ariaLabel} width={width} height={height} style={{ display: 'block' }}>
      <defs>
        <clipPath id={clipId}>
          <rect x={0} y={-m.top} width={plotW} height={plotH + m.top + m.bottom} />
        </clipPath>
      </defs>
      <g transform={`translate(${m.left},${m.top})`} fontSize="0.8em" fill="var(--lab-text-2)">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={0} x2={plotW} y1={yAt(t)} y2={yAt(t)} stroke="var(--theme-border)" strokeOpacity={0.6} />
            <text x={-8} y={yAt(t)} dy="0.35em" textAnchor="end">
              {t.toLocaleString('en-US')}
            </text>
          </g>
        ))}
        <g clipPath={`url(#${clipId})`}>
          <g ref={lineRef} transform="translate(0 0)">
            {runs.map((r, i) => (
              <path key={`a${i}`} d={r.area} className="lab-chart-area" />
            ))}
            {runs.map((r, i) => (
              <path key={`l${i}`} d={r.line} className="lab-chart-line" />
            ))}
          </g>
        </g>
        {axes &&
          xLabels?.map((label, i) => (
            <text
              key={label}
              x={(i / 2) * plotW}
              y={plotH + 17}
              textAnchor={i === 0 ? 'start' : i === 1 ? 'middle' : 'end'}
            >
              {label}
            </text>
          ))}
      </g>
    </svg>
  );
}

/**
 * A chart that glides: when a new point arrives (`lastMs` changes) the line is drawn with that
 * point at the right edge, then moves left at one step per `stepS`, so the next point slides in
 * at the edge. With reduced motion it only redraws on each poll.
 */
export function LiveChart({
  lastMs,
  stepS,
  height,
  ...plot
}: Omit<LivePlotProps, 'width' | 'lineRef' | 'clipId'> & {
  lastMs: number;
  stepS: number;
}) {
  const box = useRef<HTMLDivElement>(null);
  const line = useRef<SVGGElement>(null);
  const arrived = useRef<number | null>(null);
  const [width, setWidth] = useState(0);
  const clipId = `live-${React.useId().replace(/:/g, '')}`;
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)', true);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // A new newest point: the glide starts over from the right edge (a resize keeps its place)
  useEffect(() => {
    arrived.current = Date.now();
  }, [lastMs]);

  useEffect(() => {
    const g = line.current;
    if (!g || width === 0) return;
    const m = plot.axes ? AXES : BARE;
    const pxPerStep = Math.max(0, width - m.left - m.right) / Math.max(1, plot.values.length - 1);
    const stepMs = stepS * 1000;
    let frame = 0;
    const draw = () => {
      const steps = glideSteps(Date.now(), arrived.current, stepMs, reduced);
      g.setAttribute('transform', `translate(${(-steps * pxPerStep).toFixed(2)} 0)`);
      if (steps < 1 && !reduced) frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, [lastMs, width, stepS, reduced, plot.axes, plot.values.length]);

  return (
    <div ref={box} className="lab-chart" style={{ width: '100%', height }}>
      {width > 0 && <LivePlot {...plot} width={width} height={height} lineRef={line} clipId={clipId} />}
    </div>
  );
}

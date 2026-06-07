'use client';

import React from 'react';
import type { PerformanceMetrics } from '../lib/types';

interface Props {
  withTrackers: PerformanceMetrics;
  withoutTrackers: PerformanceMetrics;
  consentActive: boolean;
}

export default function PerformanceImpact({ withTrackers, withoutTrackers, consentActive }: Props) {
  const current = consentActive ? withTrackers : withoutTrackers;
  const diff = {
    requests: withTrackers.trackerRequests,
    sizeKb: withTrackers.trackerSizeKb,
    timeMs: withTrackers.totalTimeMs - withoutTrackers.totalTimeMs,
  };

  const level = diff.requests > 10 ? 'critical' : diff.requests > 5 ? 'high' : diff.requests > 0 ? 'moderate' : 'clean';
  const colors: Record<string, { bg: string; text: string; border: string; label: string }> = {
    critical: { bg: 'rgba(239,68,68,0.1)', text: '#f87171', border: 'rgba(239,68,68,0.25)', label: 'CRITICAL' },
    high: { bg: 'rgba(249,115,22,0.1)', text: '#fb923c', border: 'rgba(249,115,22,0.25)', label: 'HIGH' },
    moderate: { bg: 'rgba(245,158,11,0.1)', text: '#fbbf24', border: 'rgba(245,158,11,0.25)', label: 'MODERATE' },
    clean: { bg: 'rgba(16,185,129,0.1)', text: '#34d399', border: 'rgba(16,185,129,0.25)', label: 'CLEAN' },
  };
  const c = colors[level];

  const stats = [
    { label: 'Requests', value: current.totalRequests, suffix: '' },
    { label: 'Tracker Reqs', value: current.trackerRequests, suffix: '', hl: true },
    { label: 'Page Size', value: `${(current.totalSizeKb / 1024).toFixed(1)}`, suffix: 'MB' },
    { label: 'Tracker KB', value: `${current.trackerSizeKb}`, suffix: 'KB' },
    { label: 'First Paint', value: current.firstPaint, suffix: 'ms' },
    { label: 'LCP', value: current.largestContentfulPaint, suffix: 'ms' },
  ];

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <h3 className="section-title">Page Performance Impact</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: c.bg, border: `1px solid ${c.border}`, borderRadius: '10px', marginBottom: '16px' }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.text, boxShadow: `0 0 8px ${c.text}60` }} className="animate-pulse-glow" />
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: c.text, letterSpacing: '0.04em' }}>{c.label} IMPACT</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{diff.requests} trackers add {diff.timeMs}ms &amp; {diff.sizeKb}KB</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: s.hl ? 'var(--accent-rose)' : 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
              {s.value}<span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 2 }}>{s.suffix}</span>
            </div>
          </div>
        ))}
      </div>
      {consentActive && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>LCP Comparison</div>
          {[
            { label: 'No trackers', val: withoutTrackers.largestContentfulPaint, color: '#34d399', pct: (withoutTrackers.largestContentfulPaint / withTrackers.largestContentfulPaint) * 100, grad: 'linear-gradient(90deg,#10b981,#06b6d4)' },
            { label: 'With trackers', val: withTrackers.largestContentfulPaint, color: '#f87171', pct: 100, grad: 'linear-gradient(90deg,#f43f5e,#f97316)' },
          ].map((b) => (
            <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: b.color, width: 70 }}>{b.label}</span>
              <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 3 }}>
                <div style={{ width: `${b.pct}%`, height: '100%', background: b.grad, borderRadius: 3 }} />
              </div>
              <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: b.color, width: 50, textAlign: 'right' as const }}>{b.val}ms</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

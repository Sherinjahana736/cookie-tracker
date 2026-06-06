'use client';

import React from 'react';
import { gdeltEvents } from '../lib/data';

export default function GdeltFeed() {
  const toneColor = (tone: number) => tone < -2 ? '#f87171' : tone < 0 ? '#fbbf24' : '#34d399';
  const themeColors: Record<string, string> = {
    REGULATION: '#818cf8',
    INDUSTRY_SHIFT: '#60a5fa',
    PLATFORM_POLICY: '#34d399',
    MARKET_IMPACT: '#f97316',
    RESEARCH: '#a78bfa',
  };

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 className="section-title" style={{ margin: 0 }}>GDELT Signal Feed</h3>
        <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', padding: '2px 8px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 4 }}>
          SYNTHETIC DATA
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 320, overflowY: 'auto' }}>
        {gdeltEvents.map((e) => (
          <div key={e.id} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: `3px solid ${themeColors[e.theme] || '#64748b'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, flex: 1 }}>{e.title}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{e.date}</span>
              <span style={{ fontSize: 9, padding: '1px 6px', background: `${themeColors[e.theme]}15`, color: themeColors[e.theme], borderRadius: 3, fontWeight: 600 }}>{e.theme}</span>
              <span style={{ fontSize: 10, color: toneColor(e.tone), fontFamily: 'var(--font-mono)' }}>tone: {e.tone > 0 ? '+' : ''}{e.tone}</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>→ {e.trackerCategory}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

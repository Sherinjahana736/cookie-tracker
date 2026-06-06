'use client';

import React, { useMemo } from 'react';
import {
  type WaterfallEntry,
} from '../lib/types';
import { getTypeColor } from '../lib/data';

interface WaterfallChartProps {
  entries: WaterfallEntry[];
  onEntryHover: (entry: WaterfallEntry | null) => void;
  hoveredEntry: string | null;
}

export default function WaterfallChart({ entries, onEntryHover, hoveredEntry }: WaterfallChartProps) {
  const maxTime = useMemo(
    () => Math.max(...entries.map((e) => e.startMs + e.durationMs), 1),
    [entries]
  );

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 className="section-title" style={{ margin: 0 }}>Request Waterfall</h3>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {entries.length} requests · {maxTime}ms total
        </span>
      </div>

      {/* Timeline ruler */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', paddingLeft: '180px' }}>
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
          <span key={pct} style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {Math.round(maxTime * pct)}ms
          </span>
        ))}
      </div>

      <div style={{ maxHeight: '380px', overflowY: 'auto', overflowX: 'hidden' }}>
        {entries.map((entry, i) => {
          const left = (entry.startMs / maxTime) * 100;
          const width = Math.max((entry.durationMs / maxTime) * 100, 1);
          const color = getTypeColor(entry.type);
          const isHovered = hoveredEntry === entry.id;

          return (
            <div
              key={entry.id}
              onMouseEnter={() => onEntryHover(entry)}
              onMouseLeave={() => onEntryHover(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 0',
                borderRadius: '4px',
                cursor: 'pointer',
                background: isHovered ? 'rgba(255,255,255,0.03)' : 'transparent',
                transition: 'background 0.15s',
                animationDelay: `${i * 30}ms`,
              }}
              className="animate-fade-in"
            >
              {/* Label */}
              <div
                style={{
                  width: '172px',
                  flexShrink: 0,
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: isHovered ? 'var(--text-primary)' : 'var(--text-secondary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s',
                }}
                title={entry.label}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: color,
                    marginRight: '6px',
                    flexShrink: 0,
                    boxShadow: `0 0 6px ${color}40`,
                  }}
                />
                {entry.label}
              </div>

              {/* Bar container */}
              <div
                style={{
                  flex: 1,
                  height: '16px',
                  position: 'relative',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '3px',
                }}
              >
                <div
                  className="waterfall-bar"
                  style={{
                    position: 'absolute',
                    left: `${left}%`,
                    width: `${width}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${color}cc, ${color}88)`,
                    borderRadius: '3px',
                    boxShadow: isHovered ? `0 0 8px ${color}40` : 'none',
                    transition: 'box-shadow 0.15s',
                  }}
                />
              </div>

              {/* Size */}
              <span
                style={{
                  width: '50px',
                  textAlign: 'right',
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  flexShrink: 0,
                }}
              >
                {entry.sizeKb}KB
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

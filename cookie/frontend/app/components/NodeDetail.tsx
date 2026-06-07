'use client';

import React from 'react';
import type { TrackerNode } from '../lib/types';
import { getTypeColor, getTypeBadgeClass } from '../lib/data';

interface Props {
  node: TrackerNode;
  onClose: () => void;
}

export default function NodeDetail({ node, onClose }: Props) {
  const color = getTypeColor(node.type);

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0, marginBottom: 4 }}>{node.label}</h3>
          <span className={`badge ${getTypeBadgeClass(node.type)}`}>{node.type}</span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}>×</button>
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>{node.purpose}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
        {[
          { label: 'Domain', value: node.domain },
          { label: 'Group', value: node.group },
          { label: 'Cookies', value: String(node.cookieCount) },
          { label: 'Latency', value: `${node.latencyMs}ms` },
          { label: 'Size', value: `${node.sizeKb}KB` },
          { label: 'Consent', value: node.consentRequired ? 'Required' : 'Not needed' },
        ].map((s) => (
          <div key={s.label} style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 6 }}>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Data Collected</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {node.dataCollected.map((d) => (
            <span key={d} style={{ padding: '2px 8px', fontSize: 10, background: `${color}15`, color: `${color}cc`, border: `1px solid ${color}25`, borderRadius: 4, fontFamily: 'var(--font-mono)' }}>{d}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

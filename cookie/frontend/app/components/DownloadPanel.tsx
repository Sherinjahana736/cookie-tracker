'use client';

import React from 'react';
import { trackerNodes, trackerEdges, downloadJSON, downloadCSV } from '../lib/data';
import type { WaterfallEntry } from '../lib/types';

interface Props {
  waterfall: WaterfallEntry[];
}

export default function DownloadPanel({ waterfall }: Props) {
  const datasets = [
    {
      label: 'Tracker Nodes',
      desc: 'All 17 tracker/node entries',
      format: 'JSON',
      action: () => downloadJSON(trackerNodes, 'cookie_tracker_nodes.json'),
    },
    {
      label: 'Tracker Edges',
      desc: 'Data flow connections',
      format: 'JSON',
      action: () => downloadJSON(trackerEdges, 'cookie_tracker_edges.json'),
    },
    {
      label: 'Waterfall Data',
      desc: 'Request timing waterfall',
      format: 'CSV',
      action: () => downloadCSV(
        waterfall.map((w) => ({ ...w })),
        'cookie_tracker_waterfall.csv'
      ),
    },
    {
      label: 'Full Dataset',
      desc: 'Complete graph + metadata',
      format: 'JSON',
      action: () => downloadJSON({ nodes: trackerNodes, edges: trackerEdges, waterfall }, 'cookie_tracker_full.json'),
    },
  ];

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <h3 className="section-title">Download Sample Data</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {datasets.map((d) => (
          <button
            key={d.label}
            onClick={d.action}
            className="btn-download"
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 600 }}>{d.label}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{d.desc}</div>
            </div>
            <span style={{ fontSize: 9, padding: '2px 6px', background: 'rgba(99,102,241,0.15)', borderRadius: 3, fontFamily: 'var(--font-mono)' }}>{d.format}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

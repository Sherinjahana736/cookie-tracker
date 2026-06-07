'use client';

import React from 'react';

export default function WhyThisMatters() {
  const points = [
    { icon: '🕸️', title: 'One page, 17 requests', desc: 'A single news article triggers tracker calls to Google, Meta, Amazon, Oracle, and more — before you finish reading the headline.' },
    { icon: '🧬', title: 'Data broker chains', desc: 'Your browsing data doesn\'t stay with the publisher. It flows through ad exchanges to data brokers who merge it with offline records, credit data, and location history.' },
    { icon: '⏱️', title: 'Performance tax', desc: 'Trackers add ~700ms to page load and consume 40%+ of transfer bytes. Users on slower connections pay the highest price for surveillance they never opted into.' },
    { icon: '🔄', title: 'Consent theater', desc: 'Toggle consent off above and watch the graph collapse. The infrastructure exists whether or not your "preference" cookie is set.' },
  ];

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <h3 className="section-title">Why This Matters</h3>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.5 }}>
        Distribution &amp; Demand — the core rail of digital advertising — runs on a hidden graph of tracker-to-broker connections that most users never see.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {points.map((p) => (
          <div key={p.title} style={{ display: 'flex', gap: 10, padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{p.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{p.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{p.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

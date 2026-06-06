'use client';

import React from 'react';
import type { ConsentState } from '../lib/types';

interface ConsentToggleProps {
  consent: ConsentState;
  onChange: (consent: ConsentState) => void;
}

const categories = [
  { key: 'necessary' as const, label: 'Necessary', description: 'Required for basic site functionality', locked: true },
  { key: 'analytics' as const, label: 'Analytics', description: 'Usage tracking & heatmaps', locked: false },
  { key: 'marketing' as const, label: 'Marketing', description: 'Ads, retargeting & data brokers', locked: false },
  { key: 'social' as const, label: 'Social', description: 'Social media pixels & sharing', locked: false },
];

export default function ConsentToggle({ consent, onChange }: ConsentToggleProps) {
  const handleToggle = (key: keyof ConsentState) => {
    if (key === 'necessary') return;
    onChange({ ...consent, [key]: !consent[key] });
  };

  const handleAcceptAll = () => {
    onChange({ necessary: true, analytics: true, marketing: true, social: true, thirdParty: true });
  };

  const handleRejectAll = () => {
    onChange({ necessary: true, analytics: false, marketing: false, social: false, thirdParty: false });
  };

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 className="section-title" style={{ margin: 0 }}>Consent Simulation</h3>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={handleAcceptAll}
            style={{
              padding: '4px 10px',
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Accept All
          </button>
          <button
            onClick={handleRejectAll}
            style={{
              padding: '4px 10px',
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              background: 'rgba(244, 63, 94, 0.15)',
              color: '#fb7185',
              border: '1px solid rgba(244, 63, 94, 0.25)',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Reject All
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {categories.map((cat) => (
          <div
            key={cat.key}
            onClick={() => handleToggle(cat.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '8px',
              cursor: cat.locked ? 'not-allowed' : 'pointer',
              opacity: cat.locked ? 0.6 : 1,
              transition: 'background 0.15s',
            }}
          >
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {cat.label}
                {cat.locked && (
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)', marginLeft: '6px' }}>
                    ALWAYS ON
                  </span>
                )}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {cat.description}
              </div>
            </div>
            <div
              className={`toggle-switch ${consent[cat.key] ? 'active' : ''}`}
              style={{ pointerEvents: cat.locked ? 'none' : 'auto' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

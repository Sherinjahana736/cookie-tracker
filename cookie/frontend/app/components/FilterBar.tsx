'use client';

import React from 'react';

interface Props {
  filter: string;
  onFilterChange: (value: string) => void;
  groupBy: 'type' | 'group';
  onGroupByChange: (value: 'type' | 'group') => void;
  selectedCategory: string | null;
  onCategorySelect: (value: string | null) => void;
}

const groups = ['all', 'Google', 'Meta', 'Amazon', 'Oracle', 'Lotame', 'Criteo', 'X/Twitter', 'Hotjar', 'TikTok'];

const legendItems = [
  { label: 'Origin', value: 'origin', color: '#3b82f6' },
  { label: 'Analytics', value: 'analytics', color: '#8b5cf6' },
  { label: 'Tracker', value: 'tracker', color: '#f43f5e' },
  { label: 'Ad Network', value: 'ad-network', color: '#f97316' },
  { label: 'Broker', value: 'broker', color: '#ef4444' },
];

export default function FilterBar({
  filter,
  onFilterChange,
  groupBy,
  onGroupByChange,
  selectedCategory,
  onCategorySelect,
}: Props) {
  return (
    <div
      className="glass-card"
      style={{
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap',
        border: '1px solid var(--border-subtle)',
        background: 'var(--bg-glass)',
      }}
    >
      {/* Dropdown Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Filter</span>
        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          style={{
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 6,
            padding: '5px 10px',
            fontSize: 12,
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          {groups.map((g) => (
            <option key={g} value={g}>{g === 'all' ? 'All Groups' : g}</option>
          ))}
        </select>
      </div>

      {/* Group By Options */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Group By</span>
        <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
          {(['group', 'type'] as const).map((val) => (
            <button
              key={val}
              onClick={() => onGroupByChange(val)}
              style={{
                padding: '5px 12px',
                fontSize: 11,
                fontWeight: 600,
                background: groupBy === val ? 'rgba(139, 92, 246, 0.2)' : 'var(--bg-elevated)',
                color: groupBy === val ? 'var(--text-accent)' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s',
                textTransform: 'capitalize',
              }}
            >
              {val === 'group' ? 'Company' : 'Type'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Interactive Legend Markers */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span
          style={{
            fontSize: 9,
            color: 'var(--text-muted)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginRight: 4,
          }}
        >
          Legend Markers:
        </span>
        {legendItems.map((item) => {
          const isActive = selectedCategory === item.value;
          return (
            <button
              key={item.value}
              onClick={() => onCategorySelect(isActive ? null : item.value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                background: isActive ? `${item.color}25` : 'rgba(255,255,255,0.02)',
                border: '1px solid',
                borderColor: isActive ? item.color : 'var(--border-subtle)',
                borderRadius: '999px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                outline: 'none',
                boxShadow: isActive ? `0 0 10px ${item.color}30` : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: item.color,
                  boxShadow: `0 0 6px ${item.color}bb`,
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

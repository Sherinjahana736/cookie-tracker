'use client';

import React, { useState, useEffect } from 'react';
import { domainGroups as staticDomainGroups, getGroupColor } from '../lib/data';
import { API_ENDPOINTS } from '../lib/api';
import type { DomainGroup } from '../lib/types';

export default function DomainGroupPanel() {
  const [groups, setGroups] = useState<DomainGroup[]>(staticDomainGroups);

  useEffect(() => {
    fetch(API_ENDPOINTS.domainGroups)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        if (data && data.groups) {
          const merged = staticDomainGroups.map((g) => {
            const bg = data.groups.find((x: any) => x.name.toLowerCase() === g.name.toLowerCase());
            if (bg) {
              return {
                ...g,
                trackerCount: bg.trackerCount,
                cookieCount: bg.cookieCount,
                marketShare: bg.marketShare,
              };
            }
            return g;
          });
          setGroups(merged);
        }
      })
      .catch((err) => {
        console.warn('DomainGroupPanel: Failed to fetch from backend, using fallback data.', err);
      });
  }, []);

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <h3 className="section-title">Who Controls the Rail</h3>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.5 }}>
        A handful of companies control the infrastructure that harvests, moves, and monetizes user attention data across the open web.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {groups.map((g) => {
          const color = getGroupColor(g.name) || g.color;
          return (
            <div key={g.name} style={{ padding: '12px', background: `${color}08`, border: `1px solid ${color}20`, borderRadius: 10, transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}40` }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{g.name}</span>
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {g.trackerCount} trackers · {g.cookieCount} cookies
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>{g.revenueModel}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{g.marketShare}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

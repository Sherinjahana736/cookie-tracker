'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import TrackerGraph from './components/TrackerGraph';
import FilterBar from './components/FilterBar';
import DnaBackground from './components/DnaBackground';
import ConsentToggle from './components/ConsentToggle';
import PerformanceImpact from './components/PerformanceImpact';
import WaterfallChart from './components/WaterfallChart';
import WhyThisMatters from './components/WhyThisMatters';
import DomainGroupPanel from './components/DomainGroupPanel';
import NodeDetail from './components/NodeDetail';
import {
  trackerNodes,
  trackerEdges,
  generateWaterfall,
  calculatePerformance,
  getTypeColor,
} from './lib/data';
import type { ConsentState, TrackerNode, TrackerEdge, WaterfallEntry } from './lib/types';
import { API_ENDPOINTS } from './lib/api';

export default function CookieTrackerDashboard() {
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true,
    analytics: true,
    marketing: true,
    social: true,
    thirdParty: true,
  });

  const [filter, setFilter] = useState('all');
  const [groupBy, setGroupBy] = useState<'type' | 'group'>('group');
  const [selectedNode, setSelectedNode] = useState<TrackerNode | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredWaterfall, setHoveredWaterfall] = useState<string | null>(null);
  const [canvasTab, setCanvasTab] = useState<'graph' | 'waterfall'>('graph');

  // Backend integration state
  const [isLive, setIsLive] = useState(false);
  const [backendData, setBackendData] = useState<{ nodes: TrackerNode[]; edges: TrackerEdge[] } | null>(null);
  const [liveWaterfall, setLiveWaterfall] = useState<WaterfallEntry[]>([]);

  // Start with only the origin and one or two isolated nodes (e.g. TikTok Pixel and first-party CDN)
  const [nodes, setNodes] = useState<TrackerNode[]>(() =>
    trackerNodes.filter(n => n.type === 'origin' || n.id === 'tiktok' || n.id === 'fp_cdn')
  );
  const [edges, setEdges] = useState<TrackerEdge[]>(() =>
    trackerEdges.filter(e => 
      (e.source === 'origin' && e.target === 'fp_cdn') ||
      (e.source === 'gtm' && e.target === 'tiktok') ||
      e.target === 'tiktok'
    )
  );

  const consentActive = consent.analytics || consent.marketing || consent.social;

  // 1. Fetch graph data on mount
  useEffect(() => {
    fetch(API_ENDPOINTS.graphData)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch from backend');
        return res.json();
      })
      .then((data) => {
        if (data && data.nodes && data.edges) {
          // Merge live stats into static nodes configuration to maintain detailed descriptions
          const mergedNodes = data.nodes.map((bn: any) => {
            const sn = trackerNodes.find((n) => n.id === bn.id);
            return {
              ...sn,
              ...bn,
            };
          });
          setBackendData({ nodes: mergedNodes, edges: data.edges });
          setIsLive(true);
        }
      })
      .catch((err) => {
        console.warn('CookieTrackerDashboard: API Offline, falling back to mock data.', err);
      });
  }, []);

  // 2. Fetch waterfall dynamically when consent state changes
  useEffect(() => {
    if (!isLive) return;

    fetch(API_ENDPOINTS.waterfall(consentActive))
      .then((res) => res.json())
      .then((data) => {
        if (data && data.entries) {
          const staticEntries = generateWaterfall(consentActive);
          const merged = data.entries.map((be: any) => {
            const se = staticEntries.find((x) => x.id === be.id);
            return {
              domain: se?.domain || be.id,
              initiator: se?.initiator || 'origin',
              ...be,
            };
          });
          setLiveWaterfall(merged);
        }
      })
      .catch((err) => {
        console.warn('CookieTrackerDashboard: Failed to fetch live waterfall.', err);
      });
  }, [isLive, consentActive]);

  const handleSyntheticDemoClick = () => {
    if (isLive && backendData) {
      setNodes(backendData.nodes);
      setEdges(backendData.edges);
    } else {
      setNodes(trackerNodes);
      setEdges(trackerEdges);
    }
  };

  // Filter waterfall entries based on loaded nodes so it populates smoothly on click along with the graph
  const waterfall = useMemo(() => {
    const allEntries = isLive && liveWaterfall.length > 0
      ? liveWaterfall
      : generateWaterfall(consentActive);
    const nodeIds = new Set(nodes.map(n => n.id));
    return allEntries.filter(entry => nodeIds.has(entry.id));
  }, [consentActive, nodes, isLive, liveWaterfall]);

  const waterfallClean = useMemo(() => {
    const allClean = generateWaterfall(false);
    const nodeIds = new Set(nodes.map(n => n.id));
    return allClean.filter(entry => nodeIds.has(entry.id));
  }, [nodes]);

  const perfWith = useMemo(() => calculatePerformance(waterfall), [waterfall]);
  const perfWithout = useMemo(() => calculatePerformance(waterfallClean), [waterfallClean]);

  // Handle node selection from graph
  const handleNodeSelect = (node: TrackerNode | null) => {
    setSelectedNode(node);
    if (node) {
      setSelectedCategory(null); // Clear category selection if clicking node
    }
  };

  // Handle category selection from legend
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    if (category) {
      setSelectedNode(null); // Clear node selection if clicking category marker
    }
  };

  // Calculate stats for Category Detail Profile view
  const categoryStats = useMemo(() => {
    if (!selectedCategory) return null;
    const catNodes = trackerNodes.filter(
      (n) => n.type.toLowerCase() === selectedCategory.toLowerCase()
    );
    const totalCookies = catNodes.reduce((sum, n) => sum + n.cookieCount, 0);
    const avgLatency = catNodes.length
      ? Math.round(catNodes.reduce((sum, n) => sum + n.latencyMs, 0) / catNodes.length)
      : 0;
    const totalSize = catNodes.reduce((sum, n) => sum + n.sizeKb, 0);

    return {
      nodes: catNodes,
      totalCookies,
      avgLatency,
      totalSize,
    };
  }, [selectedCategory]);

  const catColor = selectedCategory ? getTypeColor(selectedCategory as any) : 'var(--text-accent)';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: 'var(--bg-void)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Premium Canvas DNA Background */}
      <DnaBackground />

      {/* Header */}
      <Header 
        onSyntheticDemoClick={handleSyntheticDemoClick}
        isLive={isLive}
      />

      {/* Multi-Column Workspace Grid */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        {/* Left Sidebar: Consent Toggle + Page Performance Impact */}
        <div
          style={{
            width: '360px',
            borderRight: '1px solid var(--border-subtle)',
            background: 'rgba(9, 7, 18, 0.4)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            padding: '20px',
            overflowY: 'auto',
            flexShrink: 0,
          }}
        >
          <ConsentToggle consent={consent} onChange={setConsent} />
          <PerformanceImpact
            withTrackers={perfWith}
            withoutTrackers={perfWithout}
            consentActive={consentActive}
          />
        </div>

        {/* Center Canvas: Tabbed View (Graph or Waterfall) */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            padding: '20px',
          }}
        >
          {/* Tab Controller and Title */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '4px',
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '4px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <button
                onClick={() => setCanvasTab('graph')}
                style={{
                  padding: '8px 16px',
                  fontSize: '11px',
                  fontWeight: 700,
                  background: canvasTab === 'graph' ? 'rgba(139, 92, 246, 0.18)' : 'transparent',
                  color: canvasTab === 'graph' ? '#fff' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: canvasTab === 'graph' ? '0 0 12px rgba(139, 92, 246, 0.15)' : 'none',
                }}
              >
                <span>🛰️</span> Tracker Graph
              </button>
              <button
                onClick={() => setCanvasTab('waterfall')}
                style={{
                  padding: '8px 16px',
                  fontSize: '11px',
                  fontWeight: 700,
                  background: canvasTab === 'waterfall' ? 'rgba(139, 92, 246, 0.18)' : 'transparent',
                  color: canvasTab === 'waterfall' ? '#fff' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: canvasTab === 'waterfall' ? '0 0 12px rgba(139, 92, 246, 0.15)' : 'none',
                }}
              >
                <span>⚡</span> Request Waterfall
              </button>
            </div>
          </div>

          {/* Filter Bar overlay inside Center Canvas (only for Tracker Graph) */}
          {canvasTab === 'graph' && (
            <div
              style={{
                marginBottom: '16px',
                zIndex: 10,
              }}
            >
              <FilterBar
                filter={filter}
                onFilterChange={setFilter}
                groupBy={groupBy}
                onGroupByChange={setGroupBy}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
              />
            </div>
          )}

          {/* Active Canvas Panel */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {canvasTab === 'graph' ? (
              <div style={{ flex: 1, width: '100%', height: '100%', position: 'relative' }}>
                <TrackerGraph
                  nodes={nodes}
                  edges={edges}
                  consent={consent}
                  filter={filter}
                  groupBy={groupBy}
                  onNodeSelect={handleNodeSelect}
                  selectedNodeId={selectedNode?.id || null}
                  selectedCategory={selectedCategory}
                />
              </div>
            ) : (
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <WaterfallChart
                  entries={waterfall}
                  onEntryHover={(entry) => setHoveredWaterfall(entry ? entry.id : null)}
                  hoveredEntry={hoveredWaterfall}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Selected Entity Profile details OR static cards (Why This Matters, Who Controls the Rail) */}
        <div
          style={{
            width: '380px',
            borderLeft: '1px solid var(--border-subtle)',
            background: 'rgba(9, 7, 18, 0.4)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            padding: '20px',
            overflowY: 'auto',
            flexShrink: 0,
          }}
        >
          {/* Show Selected Node Details if available */}
          {selectedNode && (
            <NodeDetail node={selectedNode} onClose={() => handleNodeSelect(null)} />
          )}

          {/* Show Selected Category Profile if available */}
          {selectedCategory && categoryStats && (
            <div className="glass-card" style={{ padding: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 16,
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      margin: 0,
                      marginBottom: 4,
                    }}
                  >
                    Category Profile: {selectedCategory}
                  </h3>
                  <span
                    className="badge badge-tracker"
                    style={{ background: `${catColor}20`, color: catColor, borderColor: `${catColor}40` }}
                  >
                    Category Marker
                  </span>
                </div>
                <button
                  onClick={() => handleCategorySelect(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: 18,
                  }}
                >
                  ×
                </button>
              </div>

              <p
                style={{
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  marginBottom: 16,
                }}
              >
                Summary details for all node connections tagged under the{' '}
                <strong>{selectedCategory}</strong> structural classification.
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                {[
                  { label: 'Category', value: selectedCategory },
                  { label: 'Total Trackers', value: String(categoryStats.nodes.length) },
                  { label: 'Total Cookies', value: String(categoryStats.totalCookies) },
                  { label: 'Avg Latency', value: `${categoryStats.avgLatency}ms` },
                  { label: 'Cumulative Weight', value: `${categoryStats.totalSize}KB` },
                ].map((s) => (
                  <div
                    key={s.label}
                    style={{
                      padding: '8px 10px',
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: 6,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 9,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)',
                        marginTop: 2,
                      }}
                    >
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div
                  style={{
                    fontSize: 10,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: 8,
                  }}
                >
                  Active Identifiers
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {categoryStats.nodes.map((node) => (
                    <div
                      key={node.id}
                      onClick={() => handleNodeSelect(node)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '6px 10px',
                        background: 'rgba(255,255,255,0.01)',
                        border: '1px solid rgba(255,255,255,0.03)',
                        borderRadius: 6,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-glow)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.03)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
                      }}
                    >
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{node.label}</span>
                      <span
                        style={{
                          fontSize: 10,
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {node.domain}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Static Information Cards */}
          <WhyThisMatters />
          <DomainGroupPanel />
        </div>
      </div>
    </div>
  );
}
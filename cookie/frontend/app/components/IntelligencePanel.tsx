'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConsentToggle from './ConsentToggle';
import PerformanceImpact from './PerformanceImpact';
import WaterfallChart from './WaterfallChart';
import WhyThisMatters from './WhyThisMatters';
import DomainGroupPanel from './DomainGroupPanel';
import GdeltFeed from './GdeltFeed';
import DownloadPanel from './DownloadPanel';
import NodeDetail from './NodeDetail';
import type { TrackerNode, WaterfallEntry, ConsentState, PerformanceMetrics } from '../lib/types';
import { getTypeColor, trackerNodes } from '../lib/data';

interface IntelligencePanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNode: TrackerNode | null;
  onNodeSelect: (node: TrackerNode | null) => void;
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  consent: ConsentState;
  onConsentChange: (consent: ConsentState) => void;
  waterfall: WaterfallEntry[];
  perfWith: PerformanceMetrics;
  perfWithout: PerformanceMetrics;
  consentActive: boolean;
  hoveredWaterfall: string | null;
  setHoveredWaterfall: (id: string | null) => void;
}

type TabId = 'profile' | 'performance' | 'consent' | 'signals';

export default function IntelligencePanel({
  isOpen,
  onClose,
  selectedNode,
  onNodeSelect,
  selectedCategory,
  onCategorySelect,
  consent,
  onConsentChange,
  waterfall,
  perfWith,
  perfWithout,
  consentActive,
  hoveredWaterfall,
  setHoveredWaterfall,
}: IntelligencePanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('profile');

  // Automatically switch to 'profile' tab if a node or category is selected
  useEffect(() => {
    if (selectedNode || selectedCategory) {
      setActiveTab('profile');
    }
  }, [selectedNode, selectedCategory]);

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'profile', label: 'Entity Profile', icon: '👤' },
    { id: 'performance', label: 'Performance', icon: '⚡' },
    { id: 'consent', label: 'Consent', icon: '🔒' },
    { id: 'signals', label: 'Signals', icon: '📡' },
  ];

  // Helper to compute dynamic metrics for selected category
  const categoryStats = React.useMemo(() => {
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile overlays */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: '#000',
              zIndex: 90,
            }}
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '460px',
              height: '100vh',
              background: 'var(--bg-glass)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderLeft: '1px solid var(--border-subtle)',
              boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.4)',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '20px 24px 14px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(9, 7, 18, 0.4)',
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    margin: 0,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Intelligence Panel
                </h2>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Distribution & Demand Analytics
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '18px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                ×
              </button>
            </div>

            {/* Tab Bar */}
            <div
              style={{
                display: 'flex',
                background: 'rgba(0, 0, 0, 0.15)',
                borderBottom: '1px solid var(--border-subtle)',
                padding: '0 8px',
              }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: '12px 6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    background: 'transparent',
                    border: 'none',
                    borderBottom: activeTab === tab.id ? '2px solid var(--accent-indigo)' : '2px solid transparent',
                    color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <span style={{ fontSize: '13px' }}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              {activeTab === 'profile' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {selectedNode ? (
                    <NodeDetail node={selectedNode} onClose={() => onNodeSelect(null)} />
                  ) : selectedCategory ? (
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
                          onClick={() => onCategorySelect(null)}
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
                          { label: 'Total Trackers', value: String(categoryStats?.nodes.length || 0) },
                          { label: 'Total Cookies', value: String(categoryStats?.totalCookies || 0) },
                          { label: 'Avg Latency', value: `${categoryStats?.avgLatency || 0}ms` },
                          { label: 'Cumulative Weight', value: `${categoryStats?.totalSize || 0}KB` },
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
                          {categoryStats?.nodes.map((node) => (
                            <div
                              key={node.id}
                              onClick={() => onNodeSelect(node)}
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
                  ) : (
                    <div
                      style={{
                        padding: '40px 20px',
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '260px',
                        border: '1px dashed var(--border-subtle)',
                        borderRadius: '16px',
                        background: 'rgba(255, 255, 255, 0.01)',
                      }}
                    >
                      <span style={{ fontSize: '32px', marginBottom: '16px', filter: 'grayscale(0.3)' }}>🕸️</span>
                      <h4
                        style={{
                          fontSize: '14px',
                          color: 'var(--text-primary)',
                          margin: '0 0 6px 0',
                          fontWeight: 600,
                        }}
                      >
                        No Entity Selected
                      </h4>
                      <p style={{ fontSize: '11px', lineHeight: 1.5, margin: 0, maxWidth: '280px' }}>
                        Click on any node in the full-screen graph, or click a category legend marker in the Filter
                        Bar to slide over detailed profiles.
                      </p>
                    </div>
                  )}

                  <DownloadPanel waterfall={waterfall} />
                </div>
              )}

              {activeTab === 'performance' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <PerformanceImpact
                    withTrackers={perfWith}
                    withoutTrackers={perfWithout}
                    consentActive={consentActive}
                  />
                  <WaterfallChart
                    entries={waterfall}
                    onEntryHover={(entry) => setHoveredWaterfall(entry ? entry.id : null)}
                    hoveredEntry={hoveredWaterfall}
                  />
                </div>
              )}

              {activeTab === 'consent' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <ConsentToggle consent={consent} onChange={onConsentChange} />
                  <WhyThisMatters />
                </div>
              )}

              {activeTab === 'signals' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <GdeltFeed />
                  <DomainGroupPanel />
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

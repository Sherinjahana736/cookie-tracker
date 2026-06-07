'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onToggleOverview?: () => void;
  onSyntheticDemoClick?: () => void;
  isLive?: boolean;
}

export default function Header({ onToggleOverview, onSyntheticDemoClick, isLive }: HeaderProps) {
  const [showMetaModal, setShowMetaModal] = useState(false);

  const tickerItems = [
    '17 TRACKERS FIRED FROM ONE PAGE LOAD',
    'GOOGLE CONTROLS 28.6% OF DIGITAL AD MARKET',
    'AVERAGE NEWS SITE: 42 THIRD-PARTY REQUESTS',
    'DATA FLOWS TO 2 BROKER ENDPOINTS PER SESSION',
    'TRACKERS ADD ~700ms TO PAGE LOAD TIME',
    'CORE RAIL: DISTRIBUTION & DEMAND',
  ];

  const metadata = {
    architect: 'Jahana Sherin K.J.',
    program: 'Batch 2 Interns',
    stack: [
      { name: 'Next.js', category: 'Frontend' },
      { name: 'FastAPI', category: 'Backend' },
      { name: 'Tailwind CSS', category: 'Styling' },
      { name: 'TypeScript', category: 'Language' },
      { name: 'React Flow / D3.js', category: 'Visualization' },
    ],
    project: 'INFOCREON',
    rail: 'Cinematic Rail / Distribution & Demand',
  };

  return (
    <header
      style={{
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-deep)',
        position: 'relative',
        zIndex: 50,
      }}
    >
      {/* Ticker */}
      <div
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          padding: '6px 0',
          background: 'rgba(139, 92, 246, 0.03)',
        }}
      >
        <div className="ticker-wrap">
          <div className="ticker-content">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span
                key={i}
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {item}
                <span style={{ margin: '0 16px', color: 'var(--accent-indigo)', opacity: 0.4 }}>◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div style={{ padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="gradient-text">INFOCREON</span>
              <span style={{ 
                fontSize: 8, 
                fontWeight: 700, 
                padding: '2px 6px', 
                background: isLive ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)', 
                color: isLive ? '#10b981' : '#ef4444', 
                border: isLive ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)', 
                borderRadius: 4, 
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}>
                <motion.span 
                  animate={isLive ? { opacity: [0.4, 1, 0.4] } : {}}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  style={{ 
                    width: 5, 
                    height: 5, 
                    borderRadius: '50%', 
                    background: isLive ? '#10b981' : '#ef4444',
                    boxShadow: isLive ? '0 0 6px #10b981' : 'none',
                  }} 
                />
                {isLive ? 'LIVE' : 'DEMO'}
              </span>
            </h1>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0, marginTop: 2 }}>
              Real Rails Intelligence Library · <span style={{ color: 'var(--text-accent)' }}>Distribution &amp; Demand</span>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onToggleOverview && (
            <button
              onClick={onToggleOverview}
              style={{
                fontSize: 11,
                padding: '4px 12px',
                background: 'rgba(139, 92, 246, 0.1)',
                color: 'var(--text-accent)',
                border: '1px solid var(--border-glow)',
                borderRadius: 6,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.18)';
                e.currentTarget.style.borderColor = 'var(--border-accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                e.currentTarget.style.borderColor = 'var(--border-glow)';
              }}
            >
              <span>📊</span> Analytics Control
            </button>
          )}

          <button
            onClick={onSyntheticDemoClick}
            style={{
              fontSize: 10,
              padding: '4px 12px',
              background: isLive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(139, 92, 246, 0.15)',
              color: '#fff',
              border: isLive ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid var(--border-accent)',
              borderRadius: 4,
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              boxShadow: isLive ? '0 0 12px rgba(16, 185, 129, 0.2)' : '0 0 12px rgba(139, 92, 246, 0.2)',
              transition: 'all 0.2s ease-in-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isLive ? 'rgba(16, 185, 129, 0.3)' : 'var(--gradient-main)';
              e.currentTarget.style.boxShadow = isLive ? '0 0 20px rgba(16, 185, 129, 0.5)' : '0 0 20px rgba(139, 92, 246, 0.5)';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isLive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(139, 92, 246, 0.15)';
              e.currentTarget.style.boxShadow = isLive ? '0 0 12px rgba(16, 185, 129, 0.2)' : '0 0 12px rgba(139, 92, 246, 0.2)';
              e.currentTarget.style.borderColor = isLive ? 'rgba(16, 185, 129, 0.5)' : 'var(--border-accent)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            {isLive ? 'LIVE ANALYSIS' : 'SYNTHETIC DEMO'}
          </button>

          {/* Minimalist Info (i) Button */}
          <button
            onClick={() => setShowMetaModal(true)}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-accent)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 'bold',
              fontFamily: 'serif',
              transition: 'all 0.2s',
            }}
            title="Developer Info"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.15)';
              e.currentTarget.style.borderColor = 'var(--border-accent)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            i
          </button>
        </div>
      </div>

      {/* Developer Metadata Modal */}
      <AnimatePresence>
        {showMetaModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMetaModal(false)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: '#000',
              }}
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="glass-card"
              style={{
                position: 'relative',
                width: '90%',
                maxWidth: '460px',
                padding: '30px',
                background: 'rgba(15, 12, 27, 0.85)',
                border: '1px solid var(--border-accent)',
                boxShadow: '0 10px 40px rgba(139, 92, 246, 0.15)',
                zIndex: 10,
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowMetaModal(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
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

              {/* Title */}
              <div style={{ marginBottom: '20px' }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--accent-violet)',
                  }}
                >
                  Project Intelligence Core
                </span>
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: 800,
                    margin: '4px 0 0',
                    color: '#fff',
                  }}
                >
                  System Metadata
                </h3>
              </div>

              {/* Architect Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '12px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', alignSelf: 'center' }}>Architect</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{metadata.architect}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '12px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', alignSelf: 'center' }}>Intern cohort</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>{metadata.program}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '12px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', alignSelf: 'center' }}>Project Rail</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>{metadata.rail}</span>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>Technology Stack</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {metadata.stack.map((tech) => (
                      <div
                        key={tech.name}
                        style={{
                          background: 'rgba(139, 92, 246, 0.08)',
                          border: '1px solid rgba(139, 92, 246, 0.18)',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                        }}
                      >
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff' }}>{tech.name}</span>
                        <span style={{ fontSize: '8px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{tech.category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer CTA */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowMetaModal(false)}
                  style={{
                    background: 'var(--gradient-main)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 18px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.25)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.25)';
                  }}
                >
                  Acknowledge
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}

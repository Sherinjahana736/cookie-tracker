'use client';

import React, { useMemo, useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  type Node,
  type Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import type { TrackerNode, TrackerEdge, ConsentState } from '../lib/types';
import { getTypeColor, getGroupColor } from '../lib/data';

interface TrackerGraphProps {
  nodes: TrackerNode[];
  edges: TrackerEdge[];
  consent: ConsentState;
  filter: string;
  groupBy: 'type' | 'group';
  onNodeSelect: (node: TrackerNode | null) => void;
  selectedNodeId: string | null;
  selectedCategory: string | null;
}

function layoutNodes(
  trackerNodes: TrackerNode[],
  groupBy: 'type' | 'group',
  selectedCategory: string | null,
  selectedNodeId: string | null
): Node[] {
  // Radial layout with grouping
  const groups = new Map<string, TrackerNode[]>();

  trackerNodes.forEach((n) => {
    const key = groupBy === 'group' ? n.group : n.type;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(n);
  });

  const flowNodes: Node[] = [];
  const groupEntries = Array.from(groups.entries());
  const centerX = 500;
  const centerY = 350;

  groupEntries.forEach(([groupName, members], groupIdx) => {
    const groupAngle = (groupIdx / groupEntries.length) * 2 * Math.PI - Math.PI / 2;
    const groupRadius = members.length === 1 && members[0].type === 'origin' ? 0 : 280;

    const groupCenterX = centerX + Math.cos(groupAngle) * groupRadius;
    const groupCenterY = centerY + Math.sin(groupAngle) * groupRadius;

    members.forEach((node, memberIdx) => {
      let x: number, y: number;

      if (node.type === 'origin') {
        x = centerX;
        y = centerY;
      } else if (members.length === 1) {
        x = groupCenterX;
        y = groupCenterY;
      } else {
        const memberAngle = (memberIdx / members.length) * 2 * Math.PI;
        const memberRadius = 70 + members.length * 15;
        x = groupCenterX + Math.cos(memberAngle) * memberRadius;
        y = groupCenterY + Math.sin(memberAngle) * memberRadius;
      }

      const color = groupBy === 'group' ? getGroupColor(node.group) : getTypeColor(node.type);
      const isOrigin = node.type === 'origin';

      // Highlight logic
      const isSelectedNode = selectedNodeId === node.id;
      const isCategoryMatch = selectedCategory
        ? node.type.toLowerCase() === selectedCategory.toLowerCase()
        : false;
      const isHighlighted = selectedCategory
        ? (isCategoryMatch || isOrigin)
        : true;

      const opacity = isHighlighted ? 1 : 0.15;
      const scale = isSelectedNode ? 'scale(1.1)' : 'scale(1)';

      flowNodes.push({
        id: node.id,
        position: { x, y },
        data: {
          label: (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <span style={{
                fontSize: isOrigin ? '13px' : '11px',
                fontWeight: 600,
                color: '#fff',
                textShadow: '0 1px 3px rgba(0,0,0,0.5)',
              }}>
                {node.label}
              </span>
              {!isOrigin && (
                <span style={{
                  fontSize: '9px',
                  color: 'rgba(255,255,255,0.6)',
                  fontFamily: 'var(--font-mono)',
                }}>
                  {node.cookieCount} cookies · {node.latencyMs}ms
                </span>
              )}
            </div>
          ),
        },
        style: {
          background: isSelectedNode ? `${color}40` : `${color}15`,
          border: isSelectedNode
            ? `2px solid ${color}`
            : isCategoryMatch
            ? `2px solid ${color}cc`
            : `1.5px solid ${color}60`,
          borderRadius: isOrigin ? '50%' : '12px',
          padding: isOrigin ? '20px' : '10px 14px',
          color: '#fff',
          boxShadow: isSelectedNode
            ? `0 0 24px ${color}60, inset 0 1px 0 ${color}30`
            : isCategoryMatch
            ? `0 0 16px ${color}40`
            : `0 0 12px ${color}10`,
          backdropFilter: 'blur(8px)',
          minWidth: isOrigin ? '120px' : undefined,
          textAlign: 'center' as const,
          opacity: opacity,
          transform: scale,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      });
    });
  });

  return flowNodes;
}

function TrackerGraphInner({
  nodes: trackerNodes,
  edges: trackerEdges,
  consent,
  filter,
  groupBy,
  onNodeSelect,
  selectedNodeId,
  selectedCategory,
}: TrackerGraphProps) {
  const { fitView } = useReactFlow();

  // Filter nodes based on consent
  const visibleNodes = useMemo(() => {
    return trackerNodes.filter((n) => {
      if (n.type === 'origin' || n.type === 'first-party' || n.type === 'cdn') return true;
      if (!consent.analytics && n.type === 'analytics') return false;
      if (!consent.marketing && (n.type === 'ad-network' || n.type === 'broker' || n.type === 'tracker')) return false;
      if (!consent.social && n.type === 'social') return false;
      if (filter !== 'all' && n.group !== filter) return false;
      return true;
    });
  }, [trackerNodes, consent, filter]);

  const flowNodes = useMemo(
    () => layoutNodes(visibleNodes, groupBy, selectedCategory, selectedNodeId),
    [visibleNodes, groupBy, selectedCategory, selectedNodeId]
  );

  // Auto-center and fit view when nodes update/load
  useEffect(() => {
    if (flowNodes.length > 0) {
      const timer = setTimeout(() => {
        fitView({ padding: 0.15, duration: 600 });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [flowNodes, fitView]);

  const flowEdges: Edge[] = useMemo(() => {
    const visibleIds = new Set(visibleNodes.map((n) => n.id));
    return trackerEdges
      .filter((e) => visibleIds.has(e.source) && visibleIds.has(e.target))
      .map((e) => {
        const sourceNode = trackerNodes.find((n) => n.id === e.source);
        const targetNode = trackerNodes.find((n) => n.id === e.target);
        const color = sourceNode ? getTypeColor(sourceNode.type) : '#64748b';

        // Highlighting edges linked to selected category
        const isSourceCategory = selectedCategory
          ? sourceNode?.type.toLowerCase() === selectedCategory.toLowerCase()
          : false;
        const isTargetCategory = selectedCategory
          ? targetNode?.type.toLowerCase() === selectedCategory.toLowerCase()
          : false;
        const isEdgeHighlighted = selectedCategory
          ? (isSourceCategory || isTargetCategory)
          : true;

        const opacity = isEdgeHighlighted ? 'a0' : '15';

        return {
          id: `${e.source}-${e.target}`,
          source: e.source,
          target: e.target,
          animated: isEdgeHighlighted,
          style: {
            stroke: `${color}${opacity}`,
            strokeWidth: isEdgeHighlighted ? 1.8 : 0.8,
            transition: 'stroke 0.3s, stroke-width 0.3s',
          },
          labelStyle: { fontSize: '9px', fill: '#64748b' },
        };
      });
  }, [trackerEdges, visibleNodes, trackerNodes, selectedCategory]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const trackerNode = trackerNodes.find((n) => n.id === node.id);
      onNodeSelect(trackerNode || null);
    },
    [trackerNodes, onNodeSelect]
  );

  return (
    <div style={{ height: '100%', overflow: 'hidden', width: '100%' }}>
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodeClick={onNodeClick}
        onPaneClick={() => onNodeSelect(null)}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.2}
        maxZoom={1.8}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="rgba(167, 139, 250, 0.04)" gap={24} size={1} />
        <Controls position="bottom-right" style={{ display: 'flex', flexDirection: 'row', bottom: 16, right: 16 }} />
        <MiniMap
          position="bottom-left"
          nodeColor={(n) => {
            const tracker = trackerNodes.find((t) => t.id === n.id);
            return tracker ? getTypeColor(tracker.type) : '#64748b';
          }}
          maskColor="rgba(5, 4, 9, 0.85)"
          style={{
            borderRadius: '8px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            bottom: 16,
            left: 16,
          }}
        />
      </ReactFlow>
    </div>
  );
}

export default function TrackerGraph(props: TrackerGraphProps) {
  return (
    <ReactFlowProvider>
      <TrackerGraphInner {...props} />
    </ReactFlowProvider>
  );
}

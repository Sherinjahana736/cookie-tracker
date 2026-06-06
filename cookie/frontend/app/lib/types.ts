// ── Core Domain Types ──

export interface TrackerNode {
  id: string;
  label: string;
  type: 'origin' | 'first-party' | 'tracker' | 'analytics' | 'ad-network' | 'broker' | 'cdn' | 'social';
  domain: string;
  group: string;
  cookieCount: number;
  dataCollected: string[];
  purpose: string;
  blocked?: boolean;
  latencyMs: number;
  sizeKb: number;
  initiator?: string;
  consentRequired: boolean;
}

export interface TrackerEdge {
  source: string;
  target: string;
  dataFlow: string;
  encrypted: boolean;
  crossOrigin: boolean;
}

export interface WaterfallEntry {
  id: string;
  label: string;
  domain: string;
  type: TrackerNode['type'];
  startMs: number;
  durationMs: number;
  sizeKb: number;
  status: number;
  method: 'GET' | 'POST' | 'CONNECT';
  initiator: string;
  blocked?: boolean;
}

export interface DomainGroup {
  name: string;
  color: string;
  trackerCount: number;
  cookieCount: number;
  dataTypes: string[];
  revenueModel: string;
  marketShare: string;
}

export interface PerformanceMetrics {
  totalRequests: number;
  trackerRequests: number;
  totalSizeKb: number;
  trackerSizeKb: number;
  totalTimeMs: number;
  trackerTimeMs: number;
  domContentLoaded: number;
  firstPaint: number;
  largestContentfulPaint: number;
  trackerPercentage: number;
}

export interface GdeltEvent {
  id: string;
  date: string;
  title: string;
  sourceUrl: string;
  tone: number;
  relevance: number;
  theme: string;
  trackerCategory: string;
}

export interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  social: boolean;
  thirdParty: boolean;
}

export interface FilterState {
  domain: string;
  type: string;
  group: string;
  search: string;
}

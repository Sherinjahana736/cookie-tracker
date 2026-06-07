import type {
  TrackerNode,
  TrackerEdge,
  WaterfallEntry,
  DomainGroup,
  PerformanceMetrics,
  GdeltEvent,
} from './types';

// ── Synthetic Tracker Nodes ──
// Simulates all third-party requests triggered by a single page load on a news portal

export const trackerNodes: TrackerNode[] = [
  // Origin
  {
    id: 'origin',
    label: 'news-portal.com',
    type: 'origin',
    domain: 'news-portal.com',
    group: 'Publisher',
    cookieCount: 2,
    dataCollected: ['session_id', 'preferences'],
    purpose: 'Main news website — the page you visited.',
    latencyMs: 45,
    sizeKb: 312,
    consentRequired: false,
  },
  // First-party
  {
    id: 'fp_cdn',
    label: 'CDN Assets',
    type: 'cdn',
    domain: 'cdn.news-portal.com',
    group: 'Publisher',
    cookieCount: 0,
    dataCollected: [],
    purpose: 'Serves static assets (images, CSS, JS) for the news site.',
    latencyMs: 12,
    sizeKb: 890,
    initiator: 'origin',
    consentRequired: false,
  },
  {
    id: 'fp_api',
    label: 'Content API',
    type: 'first-party',
    domain: 'api.news-portal.com',
    group: 'Publisher',
    cookieCount: 1,
    dataCollected: ['session_token'],
    purpose: 'Fetches article content and personalization data.',
    latencyMs: 85,
    sizeKb: 44,
    initiator: 'origin',
    consentRequired: false,
  },

  // Google Ecosystem
  {
    id: 'ga4',
    label: 'Google Analytics 4',
    type: 'analytics',
    domain: 'analytics.google.com',
    group: 'Google',
    cookieCount: 4,
    dataCollected: ['page_views', 'scroll_depth', 'click_events', 'user_id', 'demographics'],
    purpose: 'Tracks user behavior for site analytics and audience segmentation.',
    latencyMs: 120,
    sizeKb: 78,
    initiator: 'origin',
    consentRequired: true,
  },
  {
    id: 'gtm',
    label: 'Google Tag Manager',
    type: 'tracker',
    domain: 'googletagmanager.com',
    group: 'Google',
    cookieCount: 2,
    dataCollected: ['tag_firing', 'consent_state', 'custom_events'],
    purpose: 'Orchestrates all other tracking scripts on the page.',
    latencyMs: 95,
    sizeKb: 112,
    initiator: 'origin',
    consentRequired: true,
  },
  {
    id: 'gads',
    label: 'Google Ads',
    type: 'ad-network',
    domain: 'googlesyndication.com',
    group: 'Google',
    cookieCount: 6,
    dataCollected: ['ad_clicks', 'conversion_data', 'audience_segments', 'remarketing_lists'],
    purpose: 'Serves targeted ads and tracks conversions across the Google ad network.',
    latencyMs: 210,
    sizeKb: 156,
    initiator: 'gtm',
    consentRequired: true,
  },
  {
    id: 'g_dcm',
    label: 'DoubleClick',
    type: 'ad-network',
    domain: 'doubleclick.net',
    group: 'Google',
    cookieCount: 8,
    dataCollected: ['impression_data', 'frequency_cap', 'cross_site_id', 'bid_requests'],
    purpose: 'Cross-site ad serving and user profiling across publisher network.',
    latencyMs: 180,
    sizeKb: 42,
    initiator: 'gads',
    consentRequired: true,
  },

  // Meta / Facebook
  {
    id: 'fb_pixel',
    label: 'Meta Pixel',
    type: 'tracker',
    domain: 'connect.facebook.net',
    group: 'Meta',
    cookieCount: 5,
    dataCollected: ['page_view', 'add_to_cart', 'purchase', 'custom_audiences', 'fb_user_id'],
    purpose: 'Tracks user actions for Facebook ad targeting and conversion measurement.',
    latencyMs: 165,
    sizeKb: 88,
    initiator: 'origin',
    consentRequired: true,
  },
  {
    id: 'fb_audience',
    label: 'Audience Network',
    type: 'ad-network',
    domain: 'an.facebook.com',
    group: 'Meta',
    cookieCount: 3,
    dataCollected: ['audience_segments', 'lookalike_data', 'interest_categories'],
    purpose: 'Extends Facebook ad targeting to third-party apps and websites.',
    latencyMs: 190,
    sizeKb: 34,
    initiator: 'fb_pixel',
    consentRequired: true,
  },

  // Amazon
  {
    id: 'amzn_ads',
    label: 'Amazon Ads',
    type: 'ad-network',
    domain: 'amazon-adsystem.com',
    group: 'Amazon',
    cookieCount: 4,
    dataCollected: ['purchase_intent', 'product_views', 'shopping_behavior', 'demographic_data'],
    purpose: 'Serves product-targeted ads based on Amazon shopping data.',
    latencyMs: 145,
    sizeKb: 62,
    initiator: 'gtm',
    consentRequired: true,
  },

  // Data Brokers
  {
    id: 'oracle_data',
    label: 'Oracle Data Cloud',
    type: 'broker',
    domain: 'bluekai.com',
    group: 'Oracle',
    cookieCount: 7,
    dataCollected: ['offline_purchases', 'credit_data', 'demographic_profile', 'location_history'],
    purpose: 'Aggregates offline and online data for cross-platform audience targeting.',
    latencyMs: 230,
    sizeKb: 28,
    initiator: 'g_dcm',
    consentRequired: true,
  },
  {
    id: 'lotame',
    label: 'Lotame DMP',
    type: 'broker',
    domain: 'crwdcntrl.net',
    group: 'Lotame',
    cookieCount: 5,
    dataCollected: ['behavioral_segments', 'interest_graph', 'device_graph'],
    purpose: 'Data management platform that builds audience profiles for resale.',
    latencyMs: 195,
    sizeKb: 22,
    initiator: 'gads',
    consentRequired: true,
  },

  // Social & Misc
  {
    id: 'twitter_pixel',
    label: 'X/Twitter Pixel',
    type: 'social',
    domain: 'analytics.twitter.com',
    group: 'X/Twitter',
    cookieCount: 3,
    dataCollected: ['page_view', 'tweet_engagement', 'conversion_events'],
    purpose: 'Tracks user actions for Twitter ad campaigns.',
    latencyMs: 140,
    sizeKb: 46,
    initiator: 'gtm',
    consentRequired: true,
  },
  {
    id: 'hotjar',
    label: 'Hotjar',
    type: 'analytics',
    domain: 'hotjar.com',
    group: 'Hotjar',
    cookieCount: 3,
    dataCollected: ['heatmaps', 'session_recordings', 'form_analytics', 'click_maps'],
    purpose: 'Records user sessions and generates heatmaps for UX analysis.',
    latencyMs: 175,
    sizeKb: 94,
    initiator: 'gtm',
    consentRequired: true,
  },
  {
    id: 'criteo',
    label: 'Criteo Retargeting',
    type: 'ad-network',
    domain: 'criteo.com',
    group: 'Criteo',
    cookieCount: 6,
    dataCollected: ['product_views', 'cart_data', 'retargeting_segments', 'bid_data'],
    purpose: 'Dynamic retargeting — follows users across sites with product ads they viewed.',
    latencyMs: 200,
    sizeKb: 38,
    initiator: 'gtm',
    consentRequired: true,
  },
  {
    id: 'tiktok',
    label: 'TikTok Pixel',
    type: 'social',
    domain: 'analytics.tiktok.com',
    group: 'TikTok',
    cookieCount: 3,
    dataCollected: ['page_view', 'video_engagement', 'purchase_events'],
    purpose: 'Tracks user actions for TikTok ad campaign optimization.',
    latencyMs: 155,
    sizeKb: 52,
    initiator: 'gtm',
    consentRequired: true,
  },
];

// ── Edges ──
export const trackerEdges: TrackerEdge[] = [
  // Origin → First-party
  { source: 'origin', target: 'fp_cdn', dataFlow: 'Static assets', encrypted: true, crossOrigin: false },
  { source: 'origin', target: 'fp_api', dataFlow: 'Content & auth', encrypted: true, crossOrigin: false },

  // Origin → Trackers (direct)
  { source: 'origin', target: 'ga4', dataFlow: 'Analytics events', encrypted: true, crossOrigin: true },
  { source: 'origin', target: 'gtm', dataFlow: 'Tag configuration', encrypted: true, crossOrigin: true },
  { source: 'origin', target: 'fb_pixel', dataFlow: 'Pixel events', encrypted: true, crossOrigin: true },

  // GTM orchestrates others
  { source: 'gtm', target: 'gads', dataFlow: 'Ad conversion data', encrypted: true, crossOrigin: true },
  { source: 'gtm', target: 'amzn_ads', dataFlow: 'Shopping intent', encrypted: true, crossOrigin: true },
  { source: 'gtm', target: 'twitter_pixel', dataFlow: 'Social events', encrypted: true, crossOrigin: true },
  { source: 'gtm', target: 'hotjar', dataFlow: 'Session data', encrypted: true, crossOrigin: true },
  { source: 'gtm', target: 'criteo', dataFlow: 'Retargeting events', encrypted: true, crossOrigin: true },
  { source: 'gtm', target: 'tiktok', dataFlow: 'Engagement events', encrypted: true, crossOrigin: true },

  // Google internal chain
  { source: 'gads', target: 'g_dcm', dataFlow: 'Bid requests + user ID', encrypted: true, crossOrigin: true },

  // Meta internal chain
  { source: 'fb_pixel', target: 'fb_audience', dataFlow: 'Audience segments', encrypted: true, crossOrigin: true },

  // Data broker connections
  { source: 'g_dcm', target: 'oracle_data', dataFlow: 'Cross-device ID graph', encrypted: true, crossOrigin: true },
  { source: 'gads', target: 'lotame', dataFlow: 'Behavioral segments', encrypted: true, crossOrigin: true },
  { source: 'criteo', target: 'lotame', dataFlow: 'Product interest data', encrypted: true, crossOrigin: true },
];

// ── Domain Groups ──
export const domainGroups: DomainGroup[] = [
  {
    name: 'Google',
    color: '#60a5fa',
    trackerCount: 4,
    cookieCount: 20,
    dataTypes: ['Analytics', 'Ads', 'Conversions', 'Remarketing', 'Audience'],
    revenueModel: 'Ad auctions (real-time bidding)',
    marketShare: '28.6% of digital ad market',
  },
  {
    name: 'Meta',
    color: '#818cf8',
    trackerCount: 2,
    cookieCount: 8,
    dataTypes: ['Social Graph', 'Purchase Events', 'Custom Audiences'],
    revenueModel: 'Targeted social advertising',
    marketShare: '20.1% of digital ad market',
  },
  {
    name: 'Amazon',
    color: '#f59e0b',
    trackerCount: 1,
    cookieCount: 4,
    dataTypes: ['Shopping Behavior', 'Purchase Intent'],
    revenueModel: 'Product-targeted display ads',
    marketShare: '12.4% of digital ad market',
  },
  {
    name: 'Oracle',
    color: '#f97316',
    trackerCount: 1,
    cookieCount: 7,
    dataTypes: ['Offline Data', 'Credit Scores', 'Demographics'],
    revenueModel: 'Data licensing & audience resale',
    marketShare: 'Largest third-party data provider',
  },
  {
    name: 'Lotame',
    color: '#fb7185',
    trackerCount: 1,
    cookieCount: 5,
    dataTypes: ['Behavioral Segments', 'Interest Graph'],
    revenueModel: 'DMP licensing & segment sales',
    marketShare: '~3% of DMP market',
  },
  {
    name: 'Criteo',
    color: '#e879f9',
    trackerCount: 1,
    cookieCount: 6,
    dataTypes: ['Product Views', 'Cart Data', 'Retargeting'],
    revenueModel: 'Dynamic retargeting CPC',
    marketShare: '~5% of retargeting market',
  },
];

// ── Waterfall Data ──
export function generateWaterfall(consent: boolean): WaterfallEntry[] {
  const entries: WaterfallEntry[] = [
    { id: 'origin', label: 'news-portal.com', domain: 'news-portal.com', type: 'origin', startMs: 0, durationMs: 45, sizeKb: 312, status: 200, method: 'GET', initiator: 'browser' },
    { id: 'fp_cdn', label: 'cdn.news-portal.com/assets', domain: 'cdn.news-portal.com', type: 'cdn', startMs: 50, durationMs: 12, sizeKb: 890, status: 200, method: 'GET', initiator: 'origin' },
    { id: 'fp_api', label: 'api.news-portal.com/v2/articles', domain: 'api.news-portal.com', type: 'first-party', startMs: 55, durationMs: 85, sizeKb: 44, status: 200, method: 'GET', initiator: 'origin' },
  ];

  if (consent) {
    entries.push(
      { id: 'gtm', label: 'googletagmanager.com/gtm.js', domain: 'googletagmanager.com', type: 'tracker', startMs: 95, durationMs: 95, sizeKb: 112, status: 200, method: 'GET', initiator: 'origin' },
      { id: 'ga4', label: 'analytics.google.com/collect', domain: 'analytics.google.com', type: 'analytics', startMs: 100, durationMs: 120, sizeKb: 78, status: 204, method: 'POST', initiator: 'origin' },
      { id: 'fb_pixel', label: 'connect.facebook.net/fbevents.js', domain: 'connect.facebook.net', type: 'tracker', startMs: 140, durationMs: 165, sizeKb: 88, status: 200, method: 'GET', initiator: 'origin' },
      { id: 'hotjar', label: 'hotjar.com/hj-script.js', domain: 'hotjar.com', type: 'analytics', startMs: 200, durationMs: 175, sizeKb: 94, status: 200, method: 'GET', initiator: 'gtm' },
      { id: 'gads', label: 'googlesyndication.com/tag/js', domain: 'googlesyndication.com', type: 'ad-network', startMs: 210, durationMs: 210, sizeKb: 156, status: 200, method: 'GET', initiator: 'gtm' },
      { id: 'twitter_pixel', label: 'analytics.twitter.com/i/adsct', domain: 'analytics.twitter.com', type: 'social', startMs: 220, durationMs: 140, sizeKb: 46, status: 204, method: 'POST', initiator: 'gtm' },
      { id: 'tiktok', label: 'analytics.tiktok.com/pixel.js', domain: 'analytics.tiktok.com', type: 'social', startMs: 230, durationMs: 155, sizeKb: 52, status: 200, method: 'GET', initiator: 'gtm' },
      { id: 'criteo', label: 'criteo.com/js/ld/ld.js', domain: 'criteo.com', type: 'ad-network', startMs: 250, durationMs: 200, sizeKb: 38, status: 200, method: 'GET', initiator: 'gtm' },
      { id: 'amzn_ads', label: 'amazon-adsystem.com/aax2', domain: 'amazon-adsystem.com', type: 'ad-network', startMs: 260, durationMs: 145, sizeKb: 62, status: 200, method: 'GET', initiator: 'gtm' },
      { id: 'fb_audience', label: 'an.facebook.com/signals', domain: 'an.facebook.com', type: 'ad-network', startMs: 310, durationMs: 190, sizeKb: 34, status: 204, method: 'POST', initiator: 'fb_pixel' },
      { id: 'g_dcm', label: 'doubleclick.net/gampad/ads', domain: 'doubleclick.net', type: 'ad-network', startMs: 430, durationMs: 180, sizeKb: 42, status: 200, method: 'GET', initiator: 'gads' },
      { id: 'oracle_data', label: 'bluekai.com/tags', domain: 'bluekai.com', type: 'broker', startMs: 620, durationMs: 230, sizeKb: 28, status: 204, method: 'POST', initiator: 'g_dcm' },
      { id: 'lotame', label: 'crwdcntrl.net/5/c=12345', domain: 'crwdcntrl.net', type: 'broker', startMs: 450, durationMs: 195, sizeKb: 22, status: 204, method: 'POST', initiator: 'gads' },
    );
  }

  return entries;
}

// ── Performance Calculator ──
export function calculatePerformance(waterfall: WaterfallEntry[]): PerformanceMetrics {
  const trackerEntries = waterfall.filter(
    (e) => e.type !== 'origin' && e.type !== 'first-party' && e.type !== 'cdn'
  );
  const allEntries = waterfall;

  const totalSizeKb = allEntries.reduce((sum, e) => sum + e.sizeKb, 0);
  const trackerSizeKb = trackerEntries.reduce((sum, e) => sum + e.sizeKb, 0);

  const totalTimeMs = Math.max(...allEntries.map((e) => e.startMs + e.durationMs));
  const trackerTimeMs = trackerEntries.length
    ? Math.max(...trackerEntries.map((e) => e.startMs + e.durationMs)) -
      Math.min(...trackerEntries.map((e) => e.startMs))
    : 0;

  return {
    totalRequests: allEntries.length,
    trackerRequests: trackerEntries.length,
    totalSizeKb,
    trackerSizeKb,
    totalTimeMs,
    trackerTimeMs,
    domContentLoaded: trackerEntries.length > 0 ? 420 : 140,
    firstPaint: trackerEntries.length > 0 ? 280 : 95,
    largestContentfulPaint: trackerEntries.length > 0 ? 1850 : 620,
    trackerPercentage: Math.round((trackerEntries.length / allEntries.length) * 100),
  };
}

// ── GDELT Synthetic Events ──
// Well-labeled synthetic data based on real GDELT event themes
export const gdeltEvents: GdeltEvent[] = [
  {
    id: 'gdelt_001',
    date: '2026-05-03',
    title: 'EU Regulators Fine Meta €1.2B Over Cross-Border Data Transfers',
    sourceUrl: 'https://gdelt.example.com/event/eu-meta-fine',
    tone: -4.2,
    relevance: 0.95,
    theme: 'REGULATION',
    trackerCategory: 'Meta Pixel / Audience Network',
  },
  {
    id: 'gdelt_002',
    date: '2026-05-02',
    title: 'Google Delays Third-Party Cookie Deprecation to 2027',
    sourceUrl: 'https://gdelt.example.com/event/google-cookie-delay',
    tone: -2.1,
    relevance: 0.98,
    theme: 'INDUSTRY_SHIFT',
    trackerCategory: 'Google Ads / DoubleClick',
  },
  {
    id: 'gdelt_003',
    date: '2026-04-29',
    title: 'Apple Expands App Tracking Transparency to Safari Extensions',
    sourceUrl: 'https://gdelt.example.com/event/apple-att-safari',
    tone: 1.8,
    relevance: 0.87,
    theme: 'PLATFORM_POLICY',
    trackerCategory: 'Cross-platform trackers',
  },
  {
    id: 'gdelt_004',
    date: '2026-04-27',
    title: 'US Federal Privacy Bill Gains Bipartisan Support in Senate',
    sourceUrl: 'https://gdelt.example.com/event/us-privacy-bill',
    tone: 0.5,
    relevance: 0.82,
    theme: 'REGULATION',
    trackerCategory: 'Data brokers / Oracle Data Cloud',
  },
  {
    id: 'gdelt_005',
    date: '2026-04-25',
    title: 'TikTok Fined Under GDPR for Inadequate Age Verification Tracking',
    sourceUrl: 'https://gdelt.example.com/event/tiktok-gdpr',
    tone: -3.6,
    relevance: 0.79,
    theme: 'REGULATION',
    trackerCategory: 'TikTok Pixel',
  },
  {
    id: 'gdelt_006',
    date: '2026-04-22',
    title: 'Criteo Reports 40% Revenue Drop as Retargeting Faces Cookie Limits',
    sourceUrl: 'https://gdelt.example.com/event/criteo-revenue',
    tone: -5.1,
    relevance: 0.91,
    theme: 'MARKET_IMPACT',
    trackerCategory: 'Criteo Retargeting',
  },
  {
    id: 'gdelt_007',
    date: '2026-04-20',
    title: 'IAB Publishes New Standards for Consent Management Platforms',
    sourceUrl: 'https://gdelt.example.com/event/iab-consent',
    tone: 2.3,
    relevance: 0.74,
    theme: 'INDUSTRY_SHIFT',
    trackerCategory: 'All consent-dependent trackers',
  },
  {
    id: 'gdelt_008',
    date: '2026-04-18',
    title: 'Study: Average News Site Fires 42 Trackers Per Page Load',
    sourceUrl: 'https://gdelt.example.com/event/tracker-study',
    tone: -3.8,
    relevance: 0.96,
    theme: 'RESEARCH',
    trackerCategory: 'All tracker categories',
  },
];

// ── Download Helpers ──
export function downloadJSON(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadCSV(rows: Record<string, unknown>[], filename: string): void {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map((row) =>
      headers.map((h) => {
        const val = row[h];
        const str = Array.isArray(val) ? val.join('; ') : String(val ?? '');
        return `"${str.replace(/"/g, '""')}"`;
      }).join(',')
    ),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Color Helpers ──
export function getTypeColor(type: TrackerNode['type']): string {
  const colors: Record<string, string> = {
    origin: '#3b82f6',
    'first-party': '#06b6d4',
    cdn: '#10b981',
    analytics: '#8b5cf6',
    tracker: '#f43f5e',
    'ad-network': '#f97316',
    broker: '#ef4444',
    social: '#ec4899',
  };
  return colors[type] || '#64748b';
}

export function getGroupColor(group: string): string {
  const colors: Record<string, string> = {
    Publisher: '#06b6d4',
    Google: '#60a5fa',
    Meta: '#818cf8',
    Amazon: '#f59e0b',
    Oracle: '#f97316',
    Lotame: '#fb7185',
    Criteo: '#e879f9',
    'X/Twitter': '#94a3b8',
    Hotjar: '#34d399',
    TikTok: '#f472b6',
  };
  return colors[group] || '#64748b';
}

export function getTypeBadgeClass(type: TrackerNode['type']): string {
  const classes: Record<string, string> = {
    origin: 'badge-first-party',
    'first-party': 'badge-first-party',
    cdn: 'badge-cdn',
    analytics: 'badge-analytics',
    tracker: 'badge-tracker',
    'ad-network': 'badge-tracker',
    broker: 'badge-broker',
    social: 'badge-analytics',
  };
  return classes[type] || 'badge-first-party';
}

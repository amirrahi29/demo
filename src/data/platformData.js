export const COLORS = {
  teal: '#2d9d78',
  blue: '#1473e6',
  purple: '#6e49cb',
  orange: '#e68619',
  red: '#e34850',
  green: '#2d9d78',
};

export const homeKpis = [
  { label: 'Records ingested', value: '2.4M', link: 'Ingestion', path: '/ingestion', trend: '+8.4%', trendUp: true, sub: 'Batch + streaming today', meta: 'Last updated: 05/20/2026, 5:13 PM' },
  { label: 'Transform jobs', value: '156', link: 'Transformation', path: '/transformation', trend: '+14%', trendUp: true, sub: '97.2% success rate', meta: 'Last updated: 05/20/2026, 5:13 PM' },
  { label: 'Schema compliance', value: '94.8%', link: 'Standardization', path: '/standardization', trend: '+2.1%', trendUp: true, sub: '1,248 standardized fields', meta: 'Last updated: 05/20/2026, 5:13 PM' },
  { label: 'Pipeline health', value: '98.1%', link: 'Monitoring', path: '/monitoring', trend: '+0.5%', trendUp: true, sub: 'End-to-end pipeline score', meta: 'Last updated: 05/20/2026, 5:13 PM' },
];

export const workspaceConfig = {
  userName: 'Anurag',
  heroStats: { jobsRunning: 12, ingestionSuccess: '98.4%', transformSuccess: '97.2%', standardizationScore: '94.8%' },
};

export const recentSources = [
  { name: 'Salesforce CRM Batch Ingestion', time: '2h ago', status: 'Active' },
  { name: 'HTTP Streaming API', time: 'Live', status: 'Active' },
  { name: 'S3 Daily Batch Export', time: '6h ago', status: 'Active' },
  { name: 'Adobe Analytics Web SDK', time: 'Live', status: 'Active' },
  { name: 'Marketo Webhook Stream', time: '1h ago', status: 'Failed' },
  { name: 'Snowflake Warehouse Sync', time: '3h ago', status: 'Active' },
  { name: 'Kafka Event Hub Connector', time: 'Live', status: 'Active' },
];

export const recentDatasets = [
  { name: 'Customer 360 Enriched Dataset', time: '1h ago', records: '1.2M' },
  { name: 'Event Deduplication Output', time: '3h ago', records: '890K' },
  { name: 'Loyalty Join Transform', time: '6h ago', records: '450K' },
  { name: 'Cart Aggregation Pipeline', time: '1d ago', records: '320K' },
  { name: 'Identity Resolution Output', time: '2d ago', records: '2.1M' },
];

export const recentProfiles = [
  { name: 'Email E.164 Standardization', time: '30m ago', count: '380K' },
  { name: 'XDM Profile Schema Mapping', time: '4h ago', count: '82 rules' },
  { name: 'Phone Format Validation', time: '8h ago', count: '99.2%' },
  { name: 'Currency ISO Field Map', time: '1d ago', count: '64 fields' },
  { name: 'Address Geocoding Standard', time: '2d ago', count: 'Draft' },
];

export const recentAudiences = [
  { name: 'Ingestion Latency Alert', time: '2h ago', size: 'Warning' },
  { name: 'Transform Job Failed', time: '5h ago', size: 'Critical' },
  { name: 'Schema Violation Batch', time: '1d ago', size: '342 issues' },
  { name: 'Mapping Rule Updated', time: '1d ago', size: 'Info' },
  { name: 'Pipeline SLA Met', time: '3d ago', size: 'Success' },
  { name: 'Duplicate Record Spike', time: '4h ago', size: 'Warning' },
  { name: 'Standardization Complete', time: '6h ago', size: 'Success' },
];

export const audienceBrowseList = [
  { name: 'High Value Customers', size: '124K', time: '2h ago', status: 'Active' },
  { name: 'Cart Abandoners — 7 Day', size: '89K', time: '4h ago', status: 'Active' },
  { name: 'Email Subscribers', size: '456K', time: '6h ago', status: 'Active' },
  { name: 'Product Viewers — Mobile', size: '234K', time: '8h ago', status: 'Active' },
  { name: 'Churn Risk — Predictive', size: '67K', time: '1d ago', status: 'Active' },
  { name: 'Loyalty Tier Gold', size: '52K', time: '1d ago', status: 'Active' },
  { name: 'New User Onboarding', size: '178K', time: '2d ago', status: 'Paused' },
  { name: 'Cross-sell Prospects', size: '93K', time: '2d ago', status: 'Active' },
  { name: 'Re-engagement Campaign', size: '41K', time: '3d ago', status: 'Active' },
  { name: 'Partner Audience Import', size: '312K', time: '3d ago', status: 'Active' },
];

export const quickStats = [
  { label: 'Ingestion success', value: '98.4%', icon: '📥' },
  { label: 'Transform success', value: '97.2%', icon: '⚙️' },
  { label: 'Standardization score', value: '94.8%', icon: '📐' },
  { label: 'Active pipelines', value: '12', icon: '🔗' },
];

export const monitoringMetrics = {
  datalake: {
    received: '2.4M', ingested: '2.38M', failed: '1.2K', deleted: '840', updated: '156K',
    processingRate: [
      { hour: '12 AM', rate: 1200 }, { hour: '4 AM', rate: 980 }, { hour: '8 AM', rate: 3400 },
      { hour: '12 PM', rate: 5200 }, { hour: '4 PM', rate: 4800 }, { hour: '8 PM', rate: 2900 },
    ],
    recordsDeleted: [
      { hour: '12 AM', count: 12 }, { hour: '4 AM', count: 8 }, { hour: '8 AM', count: 45 },
      { hour: '12 PM', count: 120 }, { hour: '4 PM', count: 89 }, { hour: '8 PM', count: 56 },
    ],
  },
  identities: {
    received: '890K', ingested: '887K', successRate: '99.7%',
    trend: [
      { day: 'Mon', count: 120000 }, { day: 'Tue', count: 145000 }, { day: 'Wed', count: 132000 },
      { day: 'Thu', count: 158000 }, { day: 'Fri', count: 142000 }, { day: 'Sat', count: 98000 },
    ],
  },
  profiles: {
    received: '1.2M', created: '845K', updated: '312K', successRate: '99.2%',
    trend: [
      { day: 'Mon', created: 42000, updated: 18000 }, { day: 'Tue', created: 51000, updated: 22000 },
      { day: 'Wed', created: 48000, updated: 19000 }, { day: 'Thu', created: 55000, updated: 24000 },
      { day: 'Fri', created: 49000, updated: 21000 },
    ],
  },
  destinations: {
    streamingRate: '97.8%', batchFailed: '3',
    connectors: [
      { name: 'Google Ads', success: '98.2%', volume: '124K' },
      { name: 'Facebook CAPI', success: '96.5%', volume: '89K' },
      { name: 'Salesforce MC', success: '99.1%', volume: '56K' },
      { name: 'Azure Blob', success: '100%', volume: '210K' },
    ],
  },
};

export const profileAiScores = [
  { range: '0–20', count: 45 }, { range: '21–40', count: 120 }, { range: '41–60', count: 380 },
  { range: '61–80', count: 520 }, { range: '81–100', count: 385 },
];

export const audienceOverlap = [
  { policy: 'Default Timebased', overlap: '34%', profiles: '492K' },
  { policy: 'Email Priority', overlap: '28%', profiles: '410K' },
  { policy: 'Device First', overlap: '41%', profiles: '598K' },
  { policy: 'Last Touch', overlap: '22%', profiles: '318K' },
];

export const audienceOverlapReport = [
  { audience: 'High Value Customers', overlap: '67%', shared: '8.3K' },
  { audience: 'Email Subscribers', overlap: '45%', shared: '20.3K' },
  { audience: 'Cart Abandoners', overlap: '52%', shared: '4.5K' },
  { audience: 'Product Viewers', overlap: '38%', shared: '8.8K' },
];

export const aiScoringSummary = [
  { label: 'Avg propensity score', value: '62.4', change: '+3.2' },
  { label: 'High intent profiles', value: '385', change: '+18' },
  { label: 'At-risk profiles', value: '92', change: '-5' },
  { label: 'Model accuracy', value: '94.1%', change: '+0.8' },
];

export const audienceKpis = [
  { label: 'Total audiences', value: '82', trend: '+6', trendUp: true },
  { label: 'Total qualified profiles', value: '892K', trend: '+4.2%', trendUp: true },
  { label: 'Streaming audiences', value: '34', trend: '+2', trendUp: true },
  { label: 'Batch audiences', value: '48', trend: '0', trendUp: null },
];

export const audienceTrend = [
  { month: 'Jan', count: 58 }, { month: 'Feb', count: 62 }, { month: 'Mar', count: 71 },
  { month: 'Apr', count: 78 }, { month: 'May', count: 82 },
];

export const audienceByType = [
  { type: 'Segmentation', value: 42 }, { type: 'Lookalike', value: 18 },
  { type: 'Predictive', value: 12 }, { type: 'Imported', value: 10 },
];

export const namespaceOverlapData = {
  ecid: { email: 124, phone: 89, loyaltyid: 156 },
  email: { ecid: 124, phone: 210, crmid123: 98 },
  crmid123: { loyaltyid: 340, email: 98, ecid: 67 },
};

export const monitoringBatchJobs = [
  { name: 'CRM Batch Ingestion', status: 'Success', records: '1.2M', duration: '45m', time: '05/20/2026 8:00 AM' },
  { name: 'S3 Daily Export Load', status: 'Running', records: '890K', duration: '—', time: '05/20/2026 10:30 AM' },
  { name: 'Identity Graph Refresh', status: 'Success', records: '450K', duration: '22m', time: '05/19/2026 11:00 PM' },
  { name: 'Event Stream Backfill', status: 'Failed', records: '0', duration: '12m', time: '05/19/2026 6:00 PM' },
  { name: 'Loyalty Data Sync', status: 'Success', records: '320K', duration: '18m', time: '05/19/2026 2:00 AM' },
  { name: 'Partner File Import', status: 'Success', records: '156K', duration: '8m', time: '05/18/2026 11:00 PM' },
  { name: 'Warehouse ETL Job', status: 'Running', records: '780K', duration: '—', time: '05/20/2026 9:15 AM' },
  { name: 'Schema Validation Batch', status: 'Success', records: '2.1M', duration: '34m', time: '05/18/2026 6:00 AM' },
];

export const monitoringStreaming = [
  { hour: '12 AM', events: 1200, latency: 45 },
  { hour: '4 AM', events: 980, latency: 42 },
  { hour: '8 AM', events: 5400, latency: 38 },
  { hour: '12 PM', events: 8200, latency: 35 },
  { hour: '4 PM', events: 7600, latency: 36 },
  { hour: '8 PM', events: 4100, latency: 40 },
];

export const monitoringEdge = [
  { region: 'US East', events: '1.2M', latency: '12ms', status: 'Healthy' },
  { region: 'EU West', events: '890K', latency: '18ms', status: 'Healthy' },
  { region: 'APAC', events: '456K', latency: '24ms', status: 'Healthy' },
  { region: 'US West', events: '678K', latency: '14ms', status: 'Degraded' },
];

export const identityNamespaces = [
  { name: 'ecid', symbol: 'ECID', count: '420K', type: 'Standard' },
  { name: 'email', symbol: 'Email', count: '380K', type: 'Standard' },
  { name: 'crmid123', symbol: 'CRM ID', count: '680K', type: 'Custom' },
  { name: 'loyaltyid', symbol: 'Loyalty ID', count: '670K', type: 'Custom' },
  { name: 'phone', symbol: 'Phone', count: '290K', type: 'Standard' },
  { name: 'userid', symbol: 'User ID', count: '250K', type: 'Custom' },
  { name: 'gaid', symbol: 'GAID', count: '180K', type: 'Standard' },
  { name: 'partnerid', symbol: 'Partner ID', count: '145K', type: 'Custom' },
  { name: 'syid', symbol: 'Sync ID', count: '98K', type: 'Custom' },
  { name: 'email_lc_sha256', symbol: 'Email Hash', count: '312K', type: 'Standard' },
];

export const profileBrowseList = [
  { id: 'PRF-001', namespace: 'ecid', identities: 3, updated: '2h ago' },
  { id: 'PRF-002', namespace: 'email', identities: 2, updated: '4h ago' },
  { id: 'PRF-003', namespace: 'crmid123', identities: 5, updated: '6h ago' },
  { id: 'PRF-004', namespace: 'loyaltyid', identities: 1, updated: '1d ago' },
  { id: 'PRF-005', namespace: 'phone', identities: 2, updated: '1d ago' },
  { id: 'PRF-006', namespace: 'userid', identities: 4, updated: '2d ago' },
  { id: 'PRF-007', namespace: 'syid', identities: 2, updated: '2d ago' },
  { id: 'PRF-008', namespace: 'email_lc_sha256', identities: 1, updated: '3d ago' },
  { id: 'PRF-009', namespace: 'gaid', identities: 2, updated: '3d ago' },
  { id: 'PRF-010', namespace: 'partnerid', identities: 3, updated: '4d ago' },
  { id: 'PRF-011', namespace: 'ecid', identities: 6, updated: '5d ago' },
  { id: 'PRF-012', namespace: 'crmid', identities: 2, updated: '5d ago' },
];

export const mergePolicies = [
  { name: 'Default Timebased', priority: 1, status: 'Active', profiles: '1.45K' },
  { name: 'Email Priority', priority: 2, status: 'Active', profiles: '892K' },
  { name: 'Device First', priority: 3, status: 'Active', profiles: '654K' },
  { name: 'Last Touch', priority: 4, status: 'Active', profiles: '318K' },
  { name: 'CRM Source Wins', priority: 5, status: 'Active', profiles: '245K' },
  { name: 'Streaming Real-time', priority: 6, status: 'Paused', profiles: '128K' },
];

export const audienceFeeds = [
  { name: 'Google Ads Feed', destination: 'Google Ads', status: 'Active', lastSync: '30m ago' },
  { name: 'Facebook CAPI Feed', destination: 'Meta', status: 'Active', lastSync: '1h ago' },
  { name: 'SFMC Export', destination: 'Salesforce', status: 'Active', lastSync: '2h ago' },
  { name: 'Azure Blob Landing', destination: 'Azure', status: 'Active', lastSync: '45m ago' },
  { name: 'Snowflake Share', destination: 'Snowflake', status: 'Active', lastSync: '3h ago' },
  { name: 'Amazon S3 Publish', destination: 'AWS', status: 'Paused', lastSync: '1d ago' },
  { name: 'LinkedIn Matched Audiences', destination: 'LinkedIn', status: 'Active', lastSync: '5h ago' },
];

export const audienceJobs = [
  { name: 'High Value Customers eval', status: 'Success', time: '05/20/2026 6:00 AM' },
  { name: 'Cart Abandoners refresh', status: 'Success', time: '05/20/2026 4:00 AM' },
  { name: 'Email Subscribers export', status: 'Running', time: '05/20/2026 10:45 AM' },
  { name: 'Churn Risk build', status: 'Failed', time: '05/19/2026 11:00 PM' },
  { name: 'Loyalty Tier segmentation', status: 'Success', time: '05/19/2026 8:00 PM' },
  { name: 'Cross-sell model refresh', status: 'Success', time: '05/19/2026 2:00 PM' },
  { name: 'Partner import validation', status: 'Running', time: '05/20/2026 11:20 AM' },
  { name: 'Re-engagement batch export', status: 'Success', time: '05/18/2026 6:00 AM' },
];

export const tealiumSources = [
  { name: 'CRM Batch Ingestion', volume: '489k', icon: '📋', trend: '+12%', sparkline: [3, 5, 4, 7, 6, 8, 9] },
  { name: 'Mobile SDK Stream (Android)', volume: '645k', icon: '📱', trend: '+8%', sparkline: [6, 7, 8, 7, 9, 10, 11] },
  { name: 'Mobile SDK Stream (iOS)', volume: '512k', icon: '📱', trend: '+5%', sparkline: [5, 5, 6, 6, 7, 7, 8] },
  { name: 'Partner Portal Feed', volume: '234k', icon: '🎓', trend: '+15%', sparkline: [2, 3, 4, 5, 6, 7, 8] },
  { name: 'Identity Cookie Match', volume: '189k', icon: '🔍', trend: '-2%', sparkline: [8, 7, 7, 6, 6, 5, 5] },
  { name: 'Web Tag Collector (4)', volume: '876k', icon: '🏷️', trend: '+22%', sparkline: [4, 6, 8, 9, 11, 12, 14] },
  { name: 'Omnichannel File Import', volume: '321k', icon: '📁', trend: '+3%', sparkline: [4, 4, 5, 5, 5, 6, 6] },
  { name: 'Salesforce CRM Connector', volume: '156k', icon: '☁️', trend: '+9%', sparkline: [3, 4, 4, 5, 6, 6, 7] },
];

export const unionSchemaData = {
  kpis: [
    { label: 'Schema classes', value: '82' },
    { label: 'Mixins', value: '156' },
    { label: 'Profile records', value: '1.45K' },
    { label: 'Identity namespaces', value: '24' },
  ],
  fields: [
    { name: 'person.name.firstName', type: 'String', source: 'Profile', status: 'Active' },
    { name: 'person.name.lastName', type: 'String', source: 'Profile', status: 'Active' },
    { name: 'personalEmail.address', type: 'String', source: 'Profile', status: 'Active' },
    { name: 'homePhone.number', type: 'String', source: 'Profile', status: 'Active' },
    { name: 'loyalty.pointsBalance', type: 'Integer', source: 'Loyalty Mixin', status: 'Active' },
    { name: 'commerce.purchases.value', type: 'Number', source: 'Experience Event', status: 'Active' },
    { name: 'identityMap.ecid', type: 'Identity', source: 'Identity', status: 'Active' },
    { name: 'segmentMembership.status', type: 'String', source: 'Audience', status: 'Active' },
  ],
};

export const computedAttributes = [
  { name: 'totalPurchases', type: 'Aggregation', status: 'Active', lastRun: '2h ago', profiles: '1.45K' },
  { name: 'lastVisitDays', type: 'Counter', status: 'Active', lastRun: '4h ago', profiles: '1.42K' },
  { name: 'loyaltyTier', type: 'Lookup', status: 'Active', lastRun: '1d ago', profiles: '892K' },
  { name: 'avgOrderValue', type: 'Aggregation', status: 'Active', lastRun: '3h ago', profiles: '1.38K' },
  { name: 'lifetimeValue', type: 'Formula', status: 'Active', lastRun: '6h ago', profiles: '1.45K' },
  { name: 'churnRiskScore', type: 'ML Score', status: 'Active', lastRun: '12h ago', profiles: '654K' },
  { name: 'preferredChannel', type: 'Most Recent', status: 'Paused', lastRun: '2d ago', profiles: '980K' },
];

export const identityGraphSamples = [
  { graphId: 'G-1001', size: 2, namespaces: 'ecid + email', lastUpdated: '12m ago', status: 'Active' },
  { graphId: 'G-1002', size: 3, namespaces: 'ecid + crmid123 + phone', lastUpdated: '28m ago', status: 'Active' },
  { graphId: 'G-1003', size: 2, namespaces: 'loyaltyid + email', lastUpdated: '1h ago', status: 'Active' },
  { graphId: 'G-1004', size: 5, namespaces: 'ecid + email + crmid123 + loyaltyid + phone', lastUpdated: '2h ago', status: 'Active' },
  { graphId: 'G-1005', size: 2, namespaces: 'userid + ecid', lastUpdated: '4h ago', status: 'Active' },
  { graphId: 'G-1006', size: 4, namespaces: 'email + phone + crmid + syid', lastUpdated: '6h ago', status: 'Merged' },
];

export const identityGraphTrend = [
  { day: 'Mon', graphs: 720 }, { day: 'Tue', graphs: 728 }, { day: 'Wed', graphs: 735 },
  { day: 'Thu', graphs: 742 }, { day: 'Fri', graphs: 748 }, { day: 'Sat', graphs: 750 },
];

export const monitoringAudienceJobs = [
  { name: 'Schema validation batch', status: 'Failed', time: '05/20/2026 10:18 AM' },
  { name: 'Email format standardization', status: 'Success', time: '05/20/2026 9:45 AM' },
  { name: 'Phone E.164 mapping run', status: 'Success', time: '05/20/2026 8:30 AM' },
  { name: 'Field mapping sync', status: 'Success', time: '05/19/2026 6:00 AM' },
  { name: 'Quality rule evaluation', status: 'Running', time: '05/20/2026 11:05 AM' },
  { name: 'Canonical schema audit', status: 'Success', time: '05/19/2026 11:00 PM' },
  { name: 'Legacy CRM field map', status: 'Failed', time: '05/19/2026 3:00 PM' },
  { name: 'Currency ISO validation', status: 'Success', time: '05/18/2026 4:00 PM' },
];

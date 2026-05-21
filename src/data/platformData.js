export const COLORS = {
  teal: '#2d9d78',
  blue: '#1473e6',
  purple: '#6e49cb',
  orange: '#e68619',
  red: '#e34850',
  green: '#2d9d78',
};

export const homeKpis = [
  { label: 'Total schemas', value: '82', link: 'Schemas', trend: '+4.2%', trendUp: true, meta: 'Last updated: 05/20/2026, 5:13 PM GMT+5:30' },
  { label: 'Total datasets', value: '1.45K', link: 'Datasets', trend: '+12.8%', trendUp: true, meta: 'Last updated: 05/20/2026, 5:13 PM GMT+5:30' },
  { label: 'Total profiles', value: '1.45K', link: 'Profiles', trend: '+2.1%', trendUp: true, sub: 'Based on merge policy: Default Timebased', meta: 'Last updated: 05/20/2026, 5:13 PM GMT+5:30' },
  { label: 'Total audiences', value: '82', link: 'Audiences', trend: '-1.3%', trendUp: false, sub: 'Next evaluation: May 22, 2026 6:00 AM', meta: 'Last updated: 05/20/2026, 5:13 PM GMT+5:30' },
];

export const recentSources = [
  { name: 'Salesforce CRM Connector', time: '2h ago', status: 'Active' },
  { name: 'ACC_AEP_Sujith', time: '5h ago', status: 'Active' },
  { name: 'Adobe Analytics Web SDK', time: '1d ago', status: 'Active' },
  { name: 'S3 Batch Ingestion', time: '1d ago', status: 'Paused' },
  { name: 'HTTP Streaming API', time: '2d ago', status: 'Active' },
];

export const recentDatasets = [
  { name: 'Customer Profile Dataset', time: '1h ago', records: '1.2M' },
  { name: 'Event Experience Events', time: '3h ago', records: '890K' },
  { name: 'Identity Graph Export', time: '6h ago', records: '450K' },
  { name: 'Loyalty Transactions', time: '1d ago', records: '320K' },
  { name: 'Web Behavioral Data', time: '2d ago', records: '2.1M' },
];

export const recentProfiles = [
  { name: 'Unified Customer Profile', time: '30m ago', count: '1.45K' },
  { name: 'B2B Account Profile', time: '4h ago', count: '892' },
  { name: 'Loyalty Member Profile', time: '8h ago', count: '654' },
  { name: 'Anonymous Visitor Profile', time: '1d ago', count: '421' },
  { name: 'Partner Sandbox Profile', time: '2d ago', count: '198' },
];

export const recentAudiences = [
  { name: 'High Value Customers Q2', time: '2h ago', size: '12.4K' },
  { name: 'Cart Abandoners 7-Day', time: '5h ago', size: '8.7K' },
  { name: 'Email Subscribers Active', time: '1d ago', size: '45.2K' },
  { name: 'Product Viewers 30-Day', time: '1d ago', size: '23.1K' },
  { name: 'Churn Risk Segment', time: '3d ago', size: '3.8K' },
];

export const quickStats = [
  { label: 'Ingestion rate', value: '98.4%', icon: '📥' },
  { label: 'Active connectors', value: '24', icon: '🔌' },
  { label: 'Jobs running', value: '7', icon: '⚙️' },
  { label: 'Alerts', value: '2', icon: '🔔' },
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

export const tealiumSources = [
  { name: 'Conference Attendees', volume: '489k', icon: '📋', trend: '+12%' },
  { name: 'Digital Velocity (Android)', volume: '645k', icon: '📱', trend: '+8%' },
  { name: 'Digital Velocity (iOS)', volume: '512k', icon: '📱', trend: '+5%' },
  { name: 'Education Portal', volume: '234k', icon: '🎓', trend: '+15%' },
  { name: 'Google Cookie Match', volume: '189k', icon: '🔍', trend: '-2%' },
  { name: 'iQ Tag Management (4)', volume: '876k', icon: '🏷️', trend: '+22%' },
  { name: 'Omnichannel File Import', volume: '321k', icon: '📁', trend: '+3%' },
  { name: 'Tealium SFDC', volume: '156k', icon: '☁️', trend: '+9%' },
];

/** Dropdown-driven datasets — selection changes update metrics & charts */

export const sandboxes = [
  {
    id: 'va7',
    label: 'EXLservice Partner Sandbox (VA7)',
    env: 'AEP Partner Shared Sandbox Cinco',
    badge: 'Dev',
    org: 'EXLservice Partner',
  },
  {
    id: 'stage',
    label: 'Staging Sandbox (NLD2)',
    env: 'Staging Environment — EMEA',
    badge: 'Stage',
    org: 'Codex Copilot Staging',
  },
  {
    id: 'prod',
    label: 'Production (VA6)',
    env: 'Production Org — Americas',
    badge: 'Prod',
    org: 'Codex Copilot Production',
  },
];

export const mergePolicyProfiles = {
  default: {
    label: 'Default Timebased',
    exportDate: '04/19/2026, 5:30 AM',
    totalProfiles: '1.45K',
    profileCount1Plus: [
      { name: 'loyaltyid', value: 999 }, { name: 'crmid123', value: 850 }, { name: 'email', value: 720 },
      { name: 'phone', value: 650 }, { name: 'ecid', value: 580 }, { name: 'userid', value: 420 },
    ],
    profileCount1: [
      { name: 'crmid123', value: 340 }, { name: 'loyaltyid', value: 310 }, { name: 'ecid', value: 280 },
      { name: 'email', value: 180 }, { name: 'phone', value: 150 },
    ],
    audienceOverlap: [
      { policy: 'Default Timebased', overlap: '34%', profiles: '492K' },
      { policy: 'Email Priority', overlap: '28%', profiles: '410K' },
      { policy: 'Device First', overlap: '41%', profiles: '598K' },
    ],
    profileAiScores: [
      { range: '0–20', count: 45 }, { range: '21–40', count: 120 }, { range: '41–60', count: 380 },
      { range: '61–80', count: 520 }, { range: '81–100', count: 385 },
    ],
    aiScoringSummary: [
      { label: 'Avg propensity score', value: '62.4', change: '+3.2' },
      { label: 'High intent profiles', value: '385', change: '+18' },
      { label: 'At-risk profiles', value: '92', change: '-5' },
      { label: 'Model accuracy', value: '94.1%', change: '+0.8' },
    ],
  },
  email: {
    label: 'Email Priority',
    exportDate: '05/18/2026, 11:00 PM',
    totalProfiles: '892K',
    profileCount1Plus: [
      { name: 'email', value: 820 }, { name: 'email_lc_sha256', value: 640 }, { name: 'ecid', value: 510 },
      { name: 'loyaltyid', value: 480 }, { name: 'phone', value: 390 },
    ],
    profileCount1: [
      { name: 'email', value: 420 }, { name: 'email_lc_sha256', value: 280 }, { name: 'ecid', value: 190 },
      { name: 'phone', value: 120 },
    ],
    audienceOverlap: [
      { policy: 'Email Priority', overlap: '52%', profiles: '464K' },
      { policy: 'Default Timebased', overlap: '28%', profiles: '250K' },
      { policy: 'Last Touch', overlap: '19%', profiles: '169K' },
    ],
    profileAiScores: [
      { range: '0–20', count: 28 }, { range: '21–40', count: 95 }, { range: '41–60', count: 310 },
      { range: '61–80', count: 280 }, { range: '81–100', count: 179 },
    ],
    aiScoringSummary: [
      { label: 'Avg propensity score', value: '58.1', change: '+1.4' },
      { label: 'High intent profiles', value: '179', change: '+9' },
      { label: 'At-risk profiles', value: '124', change: '+12' },
      { label: 'Model accuracy', value: '92.8%', change: '+0.3' },
    ],
  },
  device: {
    label: 'Device First',
    exportDate: '05/20/2026, 2:15 AM',
    totalProfiles: '654K',
    profileCount1Plus: [
      { name: 'ecid', value: 720 }, { name: 'syid', value: 580 }, { name: 'crmid123', value: 490 },
      { name: 'userid', value: 410 }, { name: 'phone', value: 320 },
    ],
    profileCount1: [
      { name: 'ecid', value: 380 }, { name: 'syid', value: 290 }, { name: 'userid', value: 210 },
      { name: 'crmid123', value: 160 },
    ],
    audienceOverlap: [
      { policy: 'Device First', overlap: '48%', profiles: '314K' },
      { policy: 'Default Timebased', overlap: '41%', profiles: '268K' },
      { policy: 'Email Priority', overlap: '22%', profiles: '144K' },
    ],
    profileAiScores: [
      { range: '0–20', count: 62 }, { range: '21–40', count: 148 }, { range: '41–60', count: 220 },
      { range: '61–80', count: 145 }, { range: '81–100', count: 79 },
    ],
    aiScoringSummary: [
      { label: 'Avg propensity score', value: '54.7', change: '-1.2' },
      { label: 'High intent profiles', value: '79', change: '-4' },
      { label: 'At-risk profiles', value: '156', change: '+22' },
      { label: 'Model accuracy', value: '91.5%', change: '-0.5' },
    ],
  },
};

export const profileTrendRanges = {
  '7d': {
    label: 'Last 7 days',
    xKey: 'day',
    data: [
      { day: 'Mon', count: 1410 }, { day: 'Tue', count: 1420 }, { day: 'Wed', count: 1425 },
      { day: 'Thu', count: 1432 }, { day: 'Fri', count: 1438 }, { day: 'Sat', count: 1442 },
      { day: 'Sun', count: 1450 },
    ],
  },
  '30d': {
    label: 'Last 30 days',
    xKey: 'week',
    data: [
      { week: 'W1', count: 1320 }, { week: 'W2', count: 1350 }, { week: 'W3', count: 1380 },
      { week: 'W4', count: 1410 }, { week: 'W5', count: 1450 },
    ],
  },
  '12m': {
    label: 'Last 12 months',
    xKey: 'month',
    data: [
      { month: 'Jun', count: 980 }, { month: 'Jul', count: 1050 }, { month: 'Aug', count: 1120 },
      { month: 'Sep', count: 1180 }, { month: 'Oct', count: 1240 }, { month: 'Nov', count: 1280 },
      { month: 'Dec', count: 1320 }, { month: 'Jan', count: 1360 }, { month: 'Feb', count: 1390 },
      { month: 'Mar', count: 1400 }, { month: 'Apr', count: 1425 }, { month: 'May', count: 1450 },
    ],
  },
};

export const monitoringTimeRanges = {
  '24h': {
    label: 'Last 24 hours',
    badge: { rate: 'Peak 5.2K/hr', deleted: 'Total 330' },
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
  },
  '7d': {
    label: 'Last 7 days',
    badge: { rate: 'Peak 6.1K/hr', deleted: 'Total 2.1K' },
    datalake: {
      received: '14.8M', ingested: '14.6M', failed: '8.4K', deleted: '2.1K', updated: '980K',
      processingRate: [
        { hour: 'Mon', rate: 4100 }, { hour: 'Tue', rate: 4800 }, { hour: 'Wed', rate: 5200 },
        { hour: 'Thu', rate: 6100 }, { hour: 'Fri', rate: 5400 }, { hour: 'Sat', rate: 3200 },
        { hour: 'Sun', rate: 2900 },
      ],
      recordsDeleted: [
        { hour: 'Mon', count: 280 }, { hour: 'Tue', count: 310 }, { hour: 'Wed', count: 420 },
        { hour: 'Thu', count: 390 }, { hour: 'Fri', count: 350 }, { hour: 'Sat', count: 180 },
        { hour: 'Sun', count: 170 },
      ],
    },
    identities: {
      received: '5.2M', ingested: '5.18M', successRate: '99.5%',
      trend: [
        { day: 'Mon', count: 720000 }, { day: 'Tue', count: 810000 }, { day: 'Wed', count: 780000 },
        { day: 'Thu', count: 890000 }, { day: 'Fri', count: 820000 }, { day: 'Sat', count: 540000 },
        { day: 'Sun', count: 490000 },
      ],
    },
    profiles: {
      received: '7.8M', created: '5.1M', updated: '2.4M', successRate: '98.9%',
      trend: [
        { day: 'Mon', created: 280000, updated: 120000 }, { day: 'Tue', created: 310000, updated: 140000 },
        { day: 'Wed', created: 290000, updated: 130000 }, { day: 'Thu', created: 340000, updated: 160000 },
        { day: 'Fri', created: 300000, updated: 145000 }, { day: 'Sat', created: 180000, updated: 90000 },
        { day: 'Sun', created: 160000, updated: 85000 },
      ],
    },
    destinations: {
      streamingRate: '96.2%', batchFailed: '7',
      connectors: [
        { name: 'Google Ads', success: '97.8%', volume: '820K' },
        { name: 'Facebook CAPI', success: '95.2%', volume: '610K' },
        { name: 'Salesforce MC', success: '98.4%', volume: '380K' },
        { name: 'Azure Blob', success: '99.6%', volume: '1.2M' },
      ],
    },
  },
  '30d': {
    label: 'Last 30 days',
    badge: { rate: 'Peak 7.4K/hr', deleted: 'Total 9.8K' },
    datalake: {
      received: '62.4M', ingested: '61.8M', failed: '42K', deleted: '9.8K', updated: '4.2M',
      processingRate: [
        { hour: 'W1', rate: 3800 }, { hour: 'W2', rate: 4500 }, { hour: 'W3', rate: 5200 },
        { hour: 'W4', rate: 7400 },
      ],
      recordsDeleted: [
        { hour: 'W1', count: 1800 }, { hour: 'W2', count: 2200 }, { hour: 'W3', count: 2600 },
        { hour: 'W4', count: 3200 },
      ],
    },
    identities: {
      received: '22.1M', ingested: '22.0M', successRate: '99.4%',
      trend: [
        { day: 'W1', count: 4800000 }, { day: 'W2', count: 5200000 },
        { day: 'W3', count: 5600000 }, { day: 'W4', count: 6500000 },
      ],
    },
    profiles: {
      received: '31.2M', created: '21.4M', updated: '9.1M', successRate: '98.6%',
      trend: [
        { day: 'W1', created: 4800000, updated: 1900000 }, { day: 'W2', created: 5200000, updated: 2100000 },
        { day: 'W3', created: 5600000, updated: 2300000 }, { day: 'W4', created: 5900000, updated: 2800000 },
      ],
    },
    destinations: {
      streamingRate: '95.1%', batchFailed: '12',
      connectors: [
        { name: 'Google Ads', success: '96.4%', volume: '3.2M' },
        { name: 'Facebook CAPI', success: '94.1%', volume: '2.4M' },
        { name: 'Salesforce MC', success: '97.8%', volume: '1.6M' },
        { name: 'Azure Blob', success: '99.2%', volume: '4.8M' },
      ],
    },
  },
};

export const monitoringDataTypes = {
  all: { label: 'All pipelines', cards: ['datalake', 'identities', 'profiles', 'audiences', 'destinations'] },
  datalake: { label: 'Batch ingestion', cards: ['datalake'] },
  identities: { label: 'Identity resolution', cards: ['identities'] },
  profiles: { label: 'Profile fragments', cards: ['profiles'] },
  audiences: { label: 'Validation jobs', cards: ['audiences'] },
  destinations: { label: 'Landing zones', cards: ['destinations'] },
};

export const identityNamespacesList = ['ecid', 'email', 'crmid123', 'loyaltyid', 'phone', 'crmid', 'userid'];

export const identitySimulationResults = {
  'ecid|email': { overlap: 124, overlapRate: '8.2%', uniqueProfiles: 1381, confidence: 'High' },
  'ecid|phone': { overlap: 89, overlapRate: '6.1%', uniqueProfiles: 1520, confidence: 'High' },
  'ecid|loyaltyid': { overlap: 156, overlapRate: '10.4%', uniqueProfiles: 1290, confidence: 'Medium' },
  'ecid|crmid123': { overlap: 67, overlapRate: '4.5%', uniqueProfiles: 1610, confidence: 'High' },
  'email|phone': { overlap: 210, overlapRate: '14.8%', uniqueProfiles: 1180, confidence: 'High' },
  'email|loyaltyid': { overlap: 98, overlapRate: '7.0%', uniqueProfiles: 1420, confidence: 'Medium' },
  'email|crmid123': { overlap: 98, overlapRate: '6.9%', uniqueProfiles: 1440, confidence: 'High' },
  'phone|loyaltyid': { overlap: 72, overlapRate: '5.2%', uniqueProfiles: 1560, confidence: 'Medium' },
  'crmid123|loyaltyid': { overlap: 340, overlapRate: '22.6%', uniqueProfiles: 890, confidence: 'High' },
  'crmid|email': { overlap: 45, overlapRate: '3.1%', uniqueProfiles: 1680, confidence: 'Low' },
  'userid|ecid': { overlap: 112, overlapRate: '7.8%', uniqueProfiles: 1350, confidence: 'Medium' },
};

export const getSimulationResult = (nsA, nsB) => {
  if (nsA === nsB) {
    return { overlap: 0, overlapRate: '0%', uniqueProfiles: 1505, confidence: 'N/A' };
  }
  const key = `${nsA}|${nsB}`;
  const reverse = `${nsB}|${nsA}`;
  return identitySimulationResults[key] || identitySimulationResults[reverse] || {
    overlap: 67, overlapRate: '4.5%', uniqueProfiles: 1438, confidence: 'Medium',
  };
};

export const tealiumProducts = {
  all: {
    label: 'All Pipelines',
    summary: { success: '98.4%', events: '2.4M', connectors: 19, jobs: 12 },
    flow: {
      sources: '24 Sources',
      received: '432.4k',
      transformed: '423.8k',
      standardized: '410.2k',
      published: '402.1k',
      inspected: { green: 342, yellow: 22, red: '2.3k' },
      actions: '59.7M / 62.3M',
      connectors: '19 · 18 active',
    },
    sourceFilter: () => true,
  },
  eventstream: {
    label: 'Streaming Ingestion',
    summary: { success: '99.1%', events: '1.8M', connectors: 12, jobs: 4 },
    flow: {
      sources: '12 Sources',
      received: '312.8k',
      transformed: '307.4k',
      standardized: '298.1k',
      published: '291.6k',
      inspected: { green: 298, yellow: 12, red: '1.1k' },
      actions: '42.1M / 43.8M',
      connectors: '12 · 11 active',
    },
    sourceFilter: (s) => /SDK|Tag|Cookie|Stream/i.test(s.name),
  },
  audiencestream: {
    label: 'Transform Jobs',
    summary: { success: '97.2%', events: '890K', connectors: 8, jobs: 6 },
    flow: {
      sources: '8 Pipelines',
      received: '156.2k',
      transformed: '151.8k',
      standardized: '148.4k',
      published: '145.2k',
      inspected: { green: 148, yellow: 6, red: '890' },
      actions: '12.4M / 13.1M',
      connectors: '8 · 8 active',
    },
    sourceFilter: (s) => /CRM|Omnichannel|Batch|Salesforce/i.test(s.name),
  },
  dataaccess: {
    label: 'Standardization',
    summary: { success: '94.8%', events: '640K', connectors: 6, jobs: 2 },
    flow: {
      sources: '6 Rulesets',
      received: '98.4k',
      transformed: '96.1k',
      standardized: '93.8k',
      published: '92.4k',
      inspected: { green: 94, yellow: 3, red: '210' },
      actions: '5.2M / 5.4M',
      connectors: '6 · 6 active',
    },
    sourceFilter: (s) => /Portal|Import|File/i.test(s.name),
  },
};

export const tealiumTimeRanges = {
  '1h': { label: 'within Last Hour', scale: 1 },
  '24h': { label: 'within Last 24 Hours', scale: 18 },
  '7d': { label: 'within Last 7 Days', scale: 120 },
};

/** Scale volume string like "489k" by factor */
export const scaleVolume = (vol, scale) => {
  if (scale === 1) return vol;
  const match = vol.match(/^([\d.]+)(k|M)?$/i);
  if (!match) return vol;
  const num = parseFloat(match[1]) * scale;
  const suffix = match[2] || '';
  if (num >= 1000 && suffix.toLowerCase() === 'k') return `${(num / 1000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return `${Math.round(num)}${suffix}`;
};

export const scaleFlowNumber = (str, scale) => {
  if (scale === 1) return str;
  const match = str.match(/^([\d.]+)(k|M)?/i);
  if (!match) return str;
  const num = parseFloat(match[1]) * scale;
  const suffix = (match[2] || '').toLowerCase();
  if (num >= 1000 && suffix === 'k') return `${(num / 1000).toFixed(1)}M`;
  return `${num >= 100 ? Math.round(num) : num.toFixed(1)}${suffix || 'k'}`;
};

export const MERGE_POLICY_OPTIONS = Object.entries(mergePolicyProfiles).map(([id, p]) => ({
  id,
  label: p.label,
}));

export const PROFILE_TREND_OPTIONS = Object.entries(profileTrendRanges).map(([id, r]) => ({
  id,
  label: r.label,
}));

export const MONITORING_TIME_OPTIONS = Object.entries(monitoringTimeRanges).map(([id, r]) => ({
  id,
  label: r.label,
}));

export const MONITORING_TYPE_OPTIONS = Object.entries(monitoringDataTypes).map(([id, t]) => ({
  id,
  label: t.label,
}));

export const TEALIUM_PRODUCT_OPTIONS = Object.entries(tealiumProducts).map(([id, p]) => ({
  id,
  label: p.label,
}));

export const TEALIUM_TIME_OPTIONS = Object.entries(tealiumTimeRanges).map(([id, t]) => ({
  id,
  label: t.label,
}));

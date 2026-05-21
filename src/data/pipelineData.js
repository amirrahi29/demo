/** Data pipeline — Ingestion · Transformation · Standardization */

export const pipelineStages = [
  {
    id: 'ingestion',
    label: 'Data Ingestion',
    icon: '📥',
    path: '/ingestion',
    description: 'Collect raw events and batch files from connectors, APIs, and streams.',
    color: '#1473e6',
  },
  {
    id: 'transformation',
    label: 'Data Transformation',
    icon: '⚙️',
    path: '/transformation',
    description: 'Cleanse, enrich, join, and reshape data into analytics-ready datasets.',
    color: '#6e49cb',
  },
  {
    id: 'standardization',
    label: 'Data Standardization',
    icon: '📐',
    path: '/standardization',
    description: 'Apply schemas, field mapping, and quality rules for consistent data models.',
    color: '#2d9d78',
  },
];

export const pipelinePillars = {
  ingestion: {
    title: 'Data Ingestion',
    subtitle: 'Batch and streaming ingestion pipelines — validate, land, and monitor incoming data.',
    kpis: [
      { label: 'Records ingested today', value: '2.4M', trend: '+8.4%', trendUp: true, meta: 'Batch + streaming combined' },
      { label: 'Ingestion success rate', value: '98.4%', trend: '+0.3%', trendUp: true, meta: 'Last 24 hours' },
      { label: 'Active sources', value: '24', trend: '+2', trendUp: true, meta: '6 streaming · 18 batch' },
      { label: 'Failed records', value: '1.2K', trend: '-12%', trendUp: true, meta: 'Quarantined for review' },
    ],
    activities: [
      { name: 'Salesforce CRM Batch', status: 'Running', owner: 'Batch', updated: '489K records · 2h ago' },
      { name: 'HTTP Streaming API', status: 'Active', owner: 'Streaming', updated: '1.2M events · Live' },
      { name: 'S3 Daily Export', status: 'Completed', owner: 'Batch', updated: '320K records · 6h ago' },
      { name: 'Adobe Analytics SDK', status: 'Active', owner: 'Streaming', updated: '890K events · Live' },
      { name: 'Marketo Webhook', status: 'Failed', owner: 'Streaming', updated: '124 errors · 1h ago' },
      { name: 'Snowflake Connector', status: 'Paused', owner: 'Batch', updated: 'Scheduled 11 PM' },
      { name: 'Kafka Event Hub', status: 'Active', owner: 'Streaming', updated: '2.1M events · Live' },
      { name: 'Partner SFTP Feed', status: 'Completed', owner: 'Batch', updated: '78K records · 4h ago' },
    ],
    metrics: [
      { label: 'Avg ingestion latency', value: '18ms' },
      { label: 'Batch jobs today', value: '42' },
      { label: 'Streaming throughput', value: '5.2K/s' },
      { label: 'Duplicate rate', value: '0.4%' },
    ],
  },
  transformation: {
    title: 'Data Transformation',
    subtitle: 'ETL/ELT pipelines — map, aggregate, deduplicate, and publish curated datasets.',
    kpis: [
      { label: 'Transform jobs completed', value: '156', trend: '+14%', trendUp: true, meta: 'Last 24 hours' },
      { label: 'Transform success rate', value: '97.2%', trend: '+0.6%', trendUp: true, meta: 'Across all pipelines' },
      { label: 'Datasets published', value: '1.45K', trend: '+12.8%', trendUp: true, meta: 'Analytics-ready outputs' },
      { label: 'Avg job duration', value: '12m', trend: '-8%', trendUp: true, meta: 'Batch pipelines' },
    ],
    activities: [
      { name: 'Customer 360 Enrichment', status: 'Running', owner: 'ETL', updated: 'Step 3/5 · 45m elapsed' },
      { name: 'Event Deduplication', status: 'Completed', owner: 'Spark', updated: '2.1M rows · 4h ago' },
      { name: 'Loyalty Join Pipeline', status: 'Completed', owner: 'SQL', updated: '890K rows · 6h ago' },
      { name: 'Cart Events Aggregation', status: 'Scheduled', owner: 'ETL', updated: 'Next run 6:00 AM' },
      { name: 'Identity Resolution Job', status: 'Running', owner: 'ML', updated: 'Step 2/4 · 22m elapsed' },
      { name: 'Legacy CSV Normalizer', status: 'Failed', owner: 'Batch', updated: 'Schema mismatch · 2h ago' },
      { name: 'Warehouse Dimension Build', status: 'Completed', owner: 'SQL', updated: '1.1M rows · 3h ago' },
      { name: 'Real-time Enrichment', status: 'Running', owner: 'Spark', updated: 'Live · 5.2K/s' },
    ],
    metrics: [
      { label: 'Rows transformed/day', value: '8.6M' },
      { label: 'Active pipelines', value: '34' },
      { label: 'Data quality fixes', value: '12.4K' },
      { label: 'Join match rate', value: '96.1%' },
    ],
  },
  standardization: {
    title: 'Data Standardization',
    subtitle: 'Schema governance, field mapping, and quality rules for unified data models.',
    kpis: [
      { label: 'Schema compliance', value: '94.8%', trend: '+2.1%', trendUp: true, meta: 'Records matching target schema' },
      { label: 'Standardized fields', value: '1,248', trend: '+36', trendUp: true, meta: 'Across 82 schema classes' },
      { label: 'Mapping rules active', value: '186', trend: '+8', trendUp: true, meta: 'Source → canonical field' },
      { label: 'Quality violations', value: '342', trend: '-18%', trendUp: true, meta: 'Open issues to resolve' },
    ],
    activities: [
      { name: 'XDM Individual Profile', status: 'Active', owner: 'Standard', updated: '82 datasets mapped' },
      { name: 'Email Normalization Rule', status: 'Active', owner: 'Quality', updated: '380K records/day' },
      { name: 'Phone E.164 Formatter', status: 'Active', owner: 'Transform', updated: '99.2% match rate' },
      { name: 'Currency ISO Mapping', status: 'Active', owner: 'Standard', updated: '64 uses' },
      { name: 'Address Geocoding Standard', status: 'Draft', owner: 'Quality', updated: 'Pending review' },
      { name: 'Legacy CRM Field Map', status: 'Failed', owner: 'Mapping', updated: '12 unmapped fields' },
      { name: 'Date Format Normalizer', status: 'Active', owner: 'Quality', updated: 'ISO 8601 · 99.8%' },
      { name: 'Country Code Mapper', status: 'Active', owner: 'Standard', updated: '248 countries' },
    ],
    metrics: [
      { label: 'Canonical schemas', value: '82' },
      { label: 'Validation rules', value: '214' },
      { label: 'Namespace mappings', value: '24' },
      { label: 'Auto-fix rate', value: '87.3%' },
    ],
  },
};

export const pipelineFlowStats = {
  ingested: '2.4M',
  transformed: '2.38M',
  standardized: '2.31M',
  published: '2.28M',
};

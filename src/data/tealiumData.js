/** Tealium Data Supply Chain — aligned with ingestion · transformation · standardization */

export const tealiumNavGroups = [
  {
    id: 'overview',
    label: 'Supply chain',
    items: [
      { to: '/tealium', label: 'Pipeline overview', end: true },
      { to: '/tealium/usage', label: 'Usage & throughput' },
    ],
  },
  {
    id: 'ingestion',
    label: 'Ingestion',
    items: [
      { to: '/tealium/sources', label: 'Ingestion sources' },
      { to: '/tealium/eventstream', label: 'Stream monitoring' },
    ],
  },
  {
    id: 'transformation',
    label: 'Transformation',
    items: [
      { to: '/tealium/audiencestream', label: 'Transform pipelines' },
    ],
  },
  {
    id: 'standardization',
    label: 'Standardization',
    items: [
      { to: '/tealium/dataaccess', label: 'Schema & quality' },
      { to: '/tealium/trace', label: 'Pipeline trace' },
    ],
  },
];

export const supplyChainFlowSteps = [
  { icon: '📥', label: 'Ingestion sources', key: 'sources' },
  { icon: '📊', label: 'Raw records', key: 'received' },
  { icon: '⚙️', label: 'Transformed', key: 'transformed' },
  { icon: '📐', label: 'Standardized', key: 'standardized' },
  { icon: '🚀', label: 'Published', key: 'published' },
];

export const landingZones = [
  { name: 'Raw Event Lake', status: 'Enabled', detail: '53 linked feeds', volume: '200K' },
  { name: 'Transform Staging', status: 'Enabled', detail: '12 partitions', volume: '400K' },
  { name: 'Standardized Store', status: 'Enabled', detail: 'Real-time sync', volume: '350K' },
  { name: 'Analytics Warehouse', status: 'Enabled', detail: 'Batch export', volume: '500K' },
  { name: 'Quarantine Queue', status: 'Enabled', detail: 'Failed records', volume: '1.2K' },
  { name: 'Identity Graph Store', status: 'Enabled', detail: '24 namespaces', volume: '890K' },
];

export const publishConnectors = [
  { name: 'Snowflake Export', success: '88.8k', failed: '24.8k', icon: 'SF' },
  { name: 'S3 Landing Zone', success: '45.2k', failed: '12.1k', icon: 'S3' },
  { name: 'HTTP Webhook', success: '32.5k', failed: '8.4k', icon: 'API' },
  { name: 'Google BigQuery', success: '120.3k', failed: '15.6k', icon: 'BQ' },
  { name: 'Azure Data Lake', success: '18.7k', failed: '2.3k', icon: 'AD' },
  { name: 'Salesforce Sync', success: '56.4k', failed: '3.2k', icon: 'CRM' },
];

export const tealiumSectionConfigs = {
  usage: {
    title: 'Usage & throughput',
    subtitle: 'Pipeline volume, success rates, and resource consumption across all stages.',
    summary: [
      { value: '2.4M', label: 'Records processed' },
      { value: '98.4%', label: 'Pipeline success' },
      { value: '34', label: 'Active pipelines' },
      { value: '4.2TB', label: 'Data volume' },
    ],
    rows: [
      { name: 'Batch ingestion lane', metric: '1.2M records', status: 'Healthy' },
      { name: 'Streaming ingestion lane', metric: '890K events', status: 'Healthy' },
      { name: 'Transform staging', metric: '340K rows', status: 'Healthy' },
      { name: 'Standardization queue', metric: '12K pending', status: 'Degraded' },
      { name: 'Publish connectors', metric: '56K exports', status: 'Healthy' },
      { name: 'Edge processing nodes', metric: '2.4M events', status: 'Healthy' },
      { name: 'API gateway throughput', metric: '18K req/min', status: 'Healthy' },
      { name: 'Batch scheduler', metric: '42 jobs/day', status: 'Healthy' },
    ],
  },
  sources: {
    title: 'Ingestion sources',
    subtitle: 'Connectors and feeds landing raw data into the supply chain.',
    summary: [
      { value: '24', label: 'Active sources' },
      { value: '432K', label: 'Records/hr' },
      { value: '99.1%', label: 'Ingestion uptime' },
      { value: '3', label: 'Open alerts' },
    ],
    useTealiumSources: true,
  },
  eventstream: {
    title: 'Stream monitoring',
    subtitle: 'Real-time ingestion throughput, validation, and latency.',
    summary: [
      { value: '432.4K', label: 'Events received' },
      { value: '428K', label: 'Validated' },
      { value: '2.3K', label: 'Quarantined' },
      { value: '18ms', label: 'Avg latency' },
    ],
    rows: [
      { name: 'HTTP Streaming API', metric: '210K/hr', status: 'Active' },
      { name: 'Mobile SDK Stream', metric: '98K/hr', status: 'Active' },
      { name: 'Webhook Ingestion', metric: '84K/hr', status: 'Active' },
      { name: 'S3 Batch Drop', metric: '40K/hr', status: 'Paused' },
      { name: 'IoT Event Gateway', metric: '12K/hr', status: 'Active' },
      { name: 'Kafka Consumer', metric: '156K/hr', status: 'Active' },
      { name: 'CRM Batch Loader', metric: '67K/hr', status: 'Active' },
      { name: 'Partner API Feed', metric: '23K/hr', status: 'Active' },
    ],
  },
  audiencestream: {
    title: 'Transform pipelines',
    subtitle: 'ETL jobs cleansing, enriching, and reshaping ingested data.',
    summary: [
      { value: '156', label: 'Jobs completed' },
      { value: '8.6M', label: 'Rows transformed' },
      { value: '97.2%', label: 'Success rate' },
      { value: '12m', label: 'Avg duration' },
    ],
    rows: [
      { name: 'Customer 360 Enrichment', metric: '2.1M rows', status: 'Running' },
      { name: 'Event Deduplication', metric: '890K rows', status: 'Completed' },
      { name: 'Loyalty Join Pipeline', metric: '450K rows', status: 'Completed' },
      { name: 'Cart Aggregation', metric: '320K rows', status: 'Scheduled' },
      { name: 'Identity Resolution', metric: '1.2M rows', status: 'Running' },
    ],
  },
  dataaccess: {
    title: 'Schema & quality',
    subtitle: 'Standardization rules, schema compliance, and validation stores.',
    summary: [
      { value: '94.8%', label: 'Schema compliance' },
      { value: '4', label: 'Quality stores' },
      { value: '186', label: 'Mapping rules' },
      { value: '100%', label: 'Store availability' },
    ],
    rows: [
      { name: 'Canonical Schema Registry', metric: '82 schemas', status: 'Enabled' },
      { name: 'Field Mapping Engine', metric: '186 rules', status: 'Enabled' },
      { name: 'Validation Rule Store', metric: '214 rules', status: 'Enabled' },
      { name: 'Quarantine Queue', metric: '342 issues', status: 'Enabled' },
      { name: 'Auto-fix Pipeline', metric: '87.3% rate', status: 'Enabled' },
    ],
  },
  trace: {
    title: 'Pipeline trace',
    subtitle: 'End-to-end lineage from ingestion through publish.',
    summary: [
      { value: '12.4K', label: 'Traces today' },
      { value: '98.2%', label: 'Complete traces' },
      { value: '23', label: 'Errors found' },
      { value: '8ms', label: 'Avg trace time' },
    ],
    rows: [
      { name: 'ingest → validate → land', metric: '4.2K', status: 'OK' },
      { name: 'transform → enrich → join', metric: '2.8K', status: 'OK' },
      { name: 'standardize → map → validate', metric: '3.1K', status: 'OK' },
      { name: 'schema_violation', metric: '23', status: 'Error' },
      { name: 'publish → connector', metric: '156', status: 'OK' },
    ],
  },
};

import GenericSectionPage from '../../components/aep/GenericSectionPage';
import { sectionPageConfigs, renderGenericTable } from '../../data/sectionPages';

const createSectionPage = (configKey, tabFilters = {}) => {
  const config = sectionPageConfigs[configKey];
  if (!config) return null;

  const Page = () => (
    <GenericSectionPage
      title={config.title}
      subtitle={config.subtitle}
      summary={config.summary}
      tabs={config.tabs}
      renderContent={(activeTab) => renderGenericTable(
        config.rows,
        tabFilters[activeTab],
      )}
    />
  );
  return Page;
};

export const WorkflowsPage = createSectionPage('workflows', {
  running: (r) => r.status === 'Running',
  scheduled: (r) => r.status === 'Scheduled',
  completed: (r) => r.status === 'Completed',
});

export const DashboardsPage = createSectionPage('dashboards', {
  mine: (r) => r.owner === 'Anurag' || r.owner === 'Platform Team',
  shared: (r) => r.status === 'Shared',
  templates: () => true,
});

export const PlaybooksPage = createSectionPage('playbooks');
export const SourcesPage = createSectionPage('sources');
export const DestinationsPage = createSectionPage('destinations');
export const SchemasPage = createSectionPage('schemas');
export const PlacesPage = createSectionPage('places');
export const DatasetsPage = createSectionPage('datasets', {
  enabled: (r) => r.status === 'Enabled',
});
export const QueriesPage = createSectionPage('queries');
export const OffersPage = createSectionPage('offers', {
  live: (r) => r.status === 'Live',
});
export const ComponentsPage = createSectionPage('components');
export const AlertsPage = createSectionPage('alerts', {
  resolved: (r) => r.status === 'Resolved',
  active: (r) => r.status === 'Active',
});
export const SandboxesPage = createSectionPage('sandboxes');
export const LicensePage = createSectionPage('license');
export const EncryptionPage = createSectionPage('encryption');
export const ProspectsPage = createSectionPage('prospects');
export const AccountProfilesPage = createSectionPage('accounts-profiles');
export const AccountAudiencesPage = createSectionPage('accounts-audiences');

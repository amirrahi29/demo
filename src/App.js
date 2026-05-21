import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/aep/HomePage';
import { IngestionPage, TransformationPage, StandardizationPage } from './pages/aep/PipelinePages';
import IdentitiesPage from './pages/aep/IdentitiesPage';
import ProfilesPage from './pages/aep/ProfilesPage';
import AudiencesPage from './pages/aep/AudiencesPage';
import MonitoringPage from './pages/aep/MonitoringPage';
import DataSupplyChainPage from './pages/tealium/DataSupplyChainPage';
import TealiumSectionPage from './pages/tealium/TealiumSectionPage';
import {
  WorkflowsPage, DashboardsPage, PlaybooksPage, SourcesPage, DestinationsPage,
  SchemasPage, PlacesPage, DatasetsPage, QueriesPage, OffersPage, ComponentsPage,
  AlertsPage, SandboxesPage, LicensePage, EncryptionPage, ProspectsPage,
  AccountProfilesPage, AccountAudiencesPage,
} from './pages/aep/SectionPages';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/ingestion" element={<IngestionPage />} />
      <Route path="/transformation" element={<TransformationPage />} />
      <Route path="/standardization" element={<StandardizationPage />} />
      <Route path="/workflows" element={<WorkflowsPage />} />
      <Route path="/dashboards" element={<DashboardsPage />} />
      <Route path="/playbooks" element={<PlaybooksPage />} />
      <Route path="/sources" element={<SourcesPage />} />
      <Route path="/destinations" element={<DestinationsPage />} />
      <Route path="/profiles" element={<ProfilesPage />} />
      <Route path="/audiences" element={<AudiencesPage />} />
      <Route path="/identities" element={<IdentitiesPage />} />
      <Route path="/accounts/profiles" element={<AccountProfilesPage />} />
      <Route path="/accounts/audiences" element={<AccountAudiencesPage />} />
      <Route path="/prospects" element={<ProspectsPage />} />
      <Route path="/schemas" element={<SchemasPage />} />
      <Route path="/places" element={<PlacesPage />} />
      <Route path="/datasets" element={<DatasetsPage />} />
      <Route path="/queries" element={<QueriesPage />} />
      <Route path="/monitoring" element={<MonitoringPage />} />
      <Route path="/offers" element={<OffersPage />} />
      <Route path="/components" element={<ComponentsPage />} />
      <Route path="/alerts" element={<AlertsPage />} />
      <Route path="/sandboxes" element={<SandboxesPage />} />
      <Route path="/license" element={<LicensePage />} />
      <Route path="/encryption" element={<EncryptionPage />} />
      <Route path="/tealium" element={<DataSupplyChainPage />} />
      <Route path="/tealium/usage" element={<TealiumSectionPage section="usage" />} />
      <Route path="/tealium/sources" element={<TealiumSectionPage section="sources" />} />
      <Route path="/tealium/eventstream" element={<TealiumSectionPage section="eventstream" />} />
      <Route path="/tealium/audiencestream" element={<TealiumSectionPage section="audiencestream" />} />
      <Route path="/tealium/dataaccess" element={<TealiumSectionPage section="dataaccess" />} />
      <Route path="/tealium/trace" element={<TealiumSectionPage section="trace" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;

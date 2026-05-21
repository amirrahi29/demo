import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/aep/HomePage';
import IdentitiesPage from './pages/aep/IdentitiesPage';
import ProfilesPage from './pages/aep/ProfilesPage';
import AudiencesPage from './pages/aep/AudiencesPage';
import MonitoringPage from './pages/aep/MonitoringPage';
import DataSupplyChainPage from './pages/tealium/DataSupplyChainPage';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/identities" element={<IdentitiesPage />} />
      <Route path="/profiles" element={<ProfilesPage />} />
      <Route path="/audiences" element={<AudiencesPage />} />
      <Route path="/monitoring" element={<MonitoringPage />} />
      <Route path="/tealium" element={<DataSupplyChainPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;

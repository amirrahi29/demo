import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AEPHeader from './AEPHeader';
import AEPSidebar from './AEPSidebar';
import '../../styles/animations.css';
import '../../styles/aep.css';
import '../../styles/responsive.css';

const AEPLayout = ({ children, sidebarVariant = 'default' }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  return (
    <div className="aep-app">
      <AEPHeader
        sidebarOpen={sidebarOpen}
        onMenuToggle={() => setSidebarOpen((prev) => !prev)}
      />
      {sidebarOpen && (
        <button
          type="button"
          className="aep-sidebar-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="aep-shell">
        <AEPSidebar
          variant={sidebarVariant}
          isOpen={sidebarOpen}
          onNavigate={() => setSidebarOpen(false)}
        />
        <main className="aep-main">
          <div key={location.pathname} className="page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AEPLayout;

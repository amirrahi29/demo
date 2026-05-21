import { useState } from 'react';
import AEPLayout from './AEPLayout';
import PageTabs from './PageTabs';

const SectionSummary = ({ items = [] }) => {
  if (!items.length) return null;
  return (
    <div className="ent-section-summary stagger-2">
      {items.map((item, i) => (
        <div key={item.label} className="ent-summary-card" style={{ '--summary-index': i }}>
          <div className="ent-summary-value">{item.value}</div>
          <div className="ent-summary-label">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

const GenericSectionPage = ({ title, subtitle, summary, tabs, renderContent, headerAction }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <AEPLayout>
      <div className="aep-page">
        <div className="aep-page-header-row stagger-1">
          <div>
            <h1 className="aep-page-title">{title}</h1>
            {subtitle && <p className="ent-section-subtitle">{subtitle}</p>}
          </div>
          {headerAction}
        </div>
        <PageTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <SectionSummary items={summary} />
        <div className="aep-tab-content">
          <div className="aep-datalake-section">{renderContent(activeTab)}</div>
        </div>
      </div>
    </AEPLayout>
  );
};

export default GenericSectionPage;

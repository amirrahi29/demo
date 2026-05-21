const PageTabs = ({ tabs, activeTab, onChange, rightContent }) => (
  <div className="aep-tabs" role="tablist">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        type="button"
        role="tab"
        aria-selected={activeTab === tab.id}
        className={`aep-tab${activeTab === tab.id ? ' active' : ''}`}
        onClick={() => onChange(tab.id)}
      >
        {tab.label}
      </button>
    ))}
    {rightContent && <div className="aep-tabs-right">{rightContent}</div>}
  </div>
);

export default PageTabs;

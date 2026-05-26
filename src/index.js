import React from 'react';
import ReactDOM from 'react-dom/client';

import DEF from './DEF';
import Abc from './Abc';
import XYZ from './XYZ';
import App from './App';

/**
 * Available apps / pages.
 * Add a new entry here when you create another top-level page.
 */
export const PAGES = {
  def: {
    id: 'def',
    label: 'Command Center Cockpit',
    component: DEF,
  },
  abc: {
    id: 'abc',
    label: 'ABC Dashboard',
    component: Abc,
  },
  xyz: {
    id: 'xyz',
    label: 'Product Resiliency',
    component: XYZ,
  },
  aep: {
    id: 'aep',
    label: 'Adobe AEP + Tealium (router)',
    component: App,
  },
};

/**
 * Default page when URL has no ?page= param.
 * Options: 'def' | 'abc' | 'xyz' | 'aep'
 */
export const DEFAULT_PAGE = 'xyz';

function resolveActivePage() {
  const fromUrl = new URLSearchParams(window.location.search).get('page');
  if (fromUrl && PAGES[fromUrl]) return fromUrl;
  if (DEFAULT_PAGE && PAGES[DEFAULT_PAGE]) return DEFAULT_PAGE;
  return 'def';
}

export const ACTIVE_PAGE = resolveActivePage();

const ActiveComponent = PAGES[ACTIVE_PAGE].component;

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <ActiveComponent />
    </React.StrictMode>,
  );
}

/**
 * Tab Router – SPA Navigation
 * Manages switching between Board / Tasks / Archive views
 */

const TABS = {
  board:   { hash: '#board',   index: 0 },
  tasks:   { hash: '#tasks',   index: 1 },
  chart:   { hash: '#chart',   index: 2 },
};

let currentTab = 'board';
let onTabChange = null;

export function initTabRouter(callback) {
  onTabChange = callback;

  // Desktop nav pills
  document.querySelectorAll('.nav-pill[data-tab]').forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = pill.dataset.tab;
      if (tab) switchTab(tab);
    });
  });

  // Mobile bottom nav
  document.querySelectorAll('.mobile-nav-item[data-tab]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = item.dataset.tab;
      if (tab) switchTab(tab);
    });
  });

  // Handle initial hash
  const hash = window.location.hash.replace('#', '') || 'board';
  const validTab = TABS[hash] ? hash : 'board';
  switchTab(validTab, false);

  // Handle browser back/forward
  window.addEventListener('hashchange', () => {
    const h = window.location.hash.replace('#', '') || 'board';
    if (TABS[h] && h !== currentTab) {
      switchTab(h, false);
    }
  });
}

function switchTab(tabName, updateHash = true) {
  if (!TABS[tabName]) return;
  const prevTab = currentTab;
  currentTab = tabName;

  if (updateHash) {
    history.pushState(null, '', TABS[tabName].hash);
  }

  // Update nav pill active states (desktop)
  document.querySelectorAll('.nav-pill[data-tab]').forEach(pill => {
    const isActive = pill.dataset.tab === tabName;
    pill.classList.toggle('active', isActive);
    if (isActive) {
      pill.classList.add('font-semibold');
      pill.classList.remove('font-medium');
    } else {
      pill.classList.remove('font-semibold');
      pill.classList.add('font-medium');
    }
  });

  // Update mobile nav active states
  document.querySelectorAll('.mobile-nav-item[data-tab]').forEach(item => {
    const isActive = item.dataset.tab === tabName;
    if (isActive) {
      item.classList.add('bg-brand-50', 'dark:bg-brand-900/30', 'text-brand-600', 'dark:text-brand-400');
      item.classList.remove('text-slate-400');
      const icon = item.querySelector('.material-symbols-outlined');
      if (icon) icon.style.fontVariationSettings = "'FILL' 1";
      const label = item.querySelector('span:last-child');
      if (label) label.classList.replace('font-bold', 'font-black') || label.classList.add('font-black');
    } else {
      item.classList.remove('bg-brand-50', 'dark:bg-brand-900/30', 'text-brand-600', 'dark:text-brand-400');
      item.classList.add('text-slate-400');
      const icon = item.querySelector('.material-symbols-outlined');
      if (icon) icon.style.fontVariationSettings = "'FILL' 0";
      const label = item.querySelector('span:last-child');
      if (label) label.classList.replace('font-black', 'font-bold') || label.classList.add('font-bold');
    }
  });

  // Animate view switch
  const views = document.querySelectorAll('.tab-view');
  views.forEach(view => {
    if (view.dataset.view === tabName) {
      view.classList.remove('hidden');
      // Trigger reflow then animate in
      requestAnimationFrame(() => {
        view.classList.add('tab-view-active');
        view.classList.remove('tab-view-exit');
      });
    } else {
      view.classList.add('tab-view-exit');
      view.classList.remove('tab-view-active');
      // Hide after transition
      setTimeout(() => {
        if (view.dataset.view !== currentTab) {
          view.classList.add('hidden');
        }
      }, 250);
    }
  });

  // Callback
  if (onTabChange) onTabChange(tabName, prevTab);
}

export function getCurrentTab() {
  return currentTab;
}

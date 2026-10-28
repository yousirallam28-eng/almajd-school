const state = {
  currentTeacher: null,
  activeTab: null,
  loadedFeatures: new Set(),
  featurePromises: new Map()
};

export function getAppState() { return state; }
export function setCurrentTeacher(teacher) { state.currentTeacher = teacher || null; }
export function setActiveTab(tabId) { state.activeTab = tabId || null; }
export function markFeatureLoaded(name) { state.loadedFeatures.add(name); }

import { markFeatureLoaded } from '../app/state.js';

export function registerFeature(name, legacyFunctions = []) {
  markFeatureLoaded(name);
  const available = legacyFunctions.filter((name) => typeof window[name] === 'function');
  window.MajdAppFeatureStatus = {
    ...(window.MajdAppFeatureStatus || {}),
    [name]: { loaded: true, legacyFunctions: available }
  };
  return { name, legacyFunctions: available };
}

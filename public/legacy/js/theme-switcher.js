(function () {
  'use strict';
  var preferenceKey = 'almajd-site-appearance';
  var newThemeStylesheetIds = ['wafdeen-redesign','unified-reference-theme','liquid-glass-theme','final-contrast-overrides'];
  var chartAppearanceUpdatePending = false;
  function scheduleChartAppearanceUpdate() {
    if (chartAppearanceUpdatePending || typeof window.updateStudentDataAnalysisAppearance !== 'function') return;
    chartAppearanceUpdatePending = true;
    var update = function () {
      chartAppearanceUpdatePending = false;
      if (typeof window.updateStudentDataAnalysisAppearance === 'function') window.updateStudentDataAnalysisAppearance();
    };
    if (typeof window.requestAnimationFrame === 'function') window.requestAnimationFrame(update);
    else window.setTimeout(update, 0);
  }
  function setAppearance(appearance, savePreference) {
    var useNewAppearance = appearance !== 'old';
    var normalizedAppearance = useNewAppearance ? 'new' : 'old';
    document.documentElement.setAttribute('data-site-appearance', normalizedAppearance);
    newThemeStylesheetIds.forEach(function (id) { var stylesheet = document.getElementById(id); if (stylesheet) stylesheet.disabled = !useNewAppearance; });
    var button = document.getElementById('theme-switcher');
    var currentLabel = document.getElementById('theme-switcher-current');
    var label = useNewAppearance ? 'الشكل الجديد' : 'الشكل القديم';
    if (button) { button.setAttribute('aria-pressed', useNewAppearance ? 'true' : 'false'); button.setAttribute('aria-label', 'تغيير المظهر: ' + label); }
    if (currentLabel) currentLabel.textContent = label;
    if (savePreference) { try { window.localStorage.setItem(preferenceKey, normalizedAppearance); } catch (error) {} }
    if (savePreference) scheduleChartAppearanceUpdate();
  }
  window.toggleSiteAppearance = function () {
    var current = document.documentElement.getAttribute('data-site-appearance');
    setAppearance(current === 'new' ? 'old' : 'new', true);
  };
  var savedAppearance = 'new';
  try { savedAppearance = window.localStorage.getItem(preferenceKey) === 'old' ? 'old' : 'new'; } catch (error) {}
  setAppearance(savedAppearance, false);
})();

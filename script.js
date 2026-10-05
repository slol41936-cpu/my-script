(function () {
  // পূর্বের কোনো ইনস্ট্যান্স থাকলে তা মুছে ফেলা
  const prevPanel = document.getElementById("cyberMatchPanel");
  if (prevPanel) prevPanel.remove();
  const prevCSS = document.getElementById("cyberMatchCSS");
  if (prevCSS) prevCSS.remove();

  // ১. হালকা ও অপ্টিমাইজড সিএসএস
  const style = document.createElement("style");
  style.id = "cyberMatchCSS";
  style.innerHTML = `
    #cyberMatchPanel {
      position: fixed;
      right: 15px;
      bottom: 15px;
      width: 200px;
      z-index: 9999999;
      background: #151821;
      border-radius: 10px;
      border: 1px solid #363c4e;
      box-shadow: 0 4px 15px rgba(0,0,0,0.6);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      user-select: none;
      box-sizing: border-box;
    }
    .cmp-header {
      padding: 6px 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      cursor: move;
      touch-action: none;
      background: rgba(255, 255, 255, 0.02);
    }
    .cmp-title {
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 0.8px;
      color: #00f2fe;
      text-transform: uppercase;
    }
    .cmp-body {
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .cmp-btn-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
    }
    .cmp-btn {
      height: 26px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 10px;
      font-weight: 700;
      border: 1px solid transparent;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cmp-btn-start {
      background: #1b4b3e;
      color: #38ef7d;
      border-color: #38ef7d;
    }
    .cmp-btn-stop {
      background: #501d24;
      color: #ff4e50;
      border-color: #ff4e50;
    }
    .cmp-status-box {
      border: 1px solid rgba(0, 242, 254, 0.25);
      background: rgba(0, 0, 0, 0.3);
      border-radius: 5px;
      padding: 4px;
      text-align: center;
      font-size: 9px;
      font-weight: 700;
      color: #4facfe;
      text-transform: uppercase;
    }
  `;
  document.head.appendChild(style);

  // ২. ইউআই প্যানেল তৈরি
  const panel = document.createElement("div");
  panel.id = "cyberMatchPanel";
  panel.innerHTML = `
    <div class="cmp-header" id="cmpHeader">
      <div class="cmp-title">⚡ AUTO MATCH</div>
      <div style="font-size: 11px; color: #888; cursor: pointer;" id="cmpClose">✕</div>
    </div>
    <div class="cmp-body">
      <div class="cmp-btn-row">
        <button class="cmp-btn cmp-btn-start" id="cmpStart">▶ Start</button>
        <button class="cmp-btn cmp-btn-stop" id="cmpStop">■ Stop</button>
      </div>
      <div class="cmp-status-box" id="cmpStatus">Status: Ready</div>
    </div>
  `;
  document.body.appendChild(panel);

  const startBtn = document.getElementById("cmpStart");
  const stopBtn = document.getElementById("cmpStop");
  const statusEl = document.getElementById("cmpStatus");
  const closeBtn = document.getElementById("cmpClose");

  let isRunning = false;
  let monitorInterval = null;
  let isActionPending = false;

  function setStatus(text, color = "#4facfe") {
    if (!statusEl) return;
    statusEl.innerText = "Status: " + text;
    statusEl.style.color = color;
    statusEl.style.borderColor = color;
  }

  // ৩. অডিও অ্যালার্ট
  const directAudioUrl = "https://github.com/slol41936-cpu/my-script/raw/refs/heads/main/Fahhh-%20sound%20effect%20(HD)%20-%20HighQualitySFX%20(2).mp3";
  const customAudio = new Audio(directAudioUrl);

  function triggerAudio() {
    try {
      customAudio.currentTime = 0;
      const playPromise = customAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          fallbackBeep();
        });
      }
    } catch (e) {
      fallbackBeep();
    }
  }

  function fallbackBeep() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioআপনার সমস্যাটি এবং প্ল্যাটফর্মের আচরণটি সম্পূর্ণ বোধগম্য। 

এখানে দুটি মূল সমস্যা হচ্ছে:
১. **ইউআই (UI) স্বয়ংক্রিয়ভাবে স্ক্রিন থেকে না সরা:** অর্ডার সফল হলে স্ক্রিপ্টটি যে টেক্সটগুলো দিয়ে ডিটেক্ট করছিল, পেজের ফ্রেমওয়ার্ক বা DOM আপডেটের কারণে সেগুলো হয়তো তাত্ক্ষণিক ধরা পড়ছে না, অথবা এলিমেন্ট রিমুভ করার কমান্ডটি ব্লক হচ্ছিল।
২. **অপারেশন স্মুথ না হওয়া ও "Frequent operation":** সার্ভার যাতে একে স্প্যাম বা অতিরিক্ত অটোমেশন না ভাবে, সেজন্য স্ক্রিপ্টকে মানুষের স্বাভাবিক ব্যবহারের মতো আচরণ করতে হবে। 

নিচে সম্পূর্ণ অপ্টিমাইজড কোডটি দেওয়া হলো, যাতে নিচের পরিবর্তনগুলো আনা হয়েছে:
* **অর্ডার কনফার্ম হলেই সাথে সাথে ইউআই গায়েব:** পেজে পেমেন্ট সংক্রান্ত যেকোনো নিশ্চিত মার্কার (যেমন: `Matched`, `Pay ₹`, `Pending payment`, বা কাউন্টডাউন) দেখা মাত্রই প্যানেলটি সঙ্গে সঙ্গে সম্পূর্ণ রিমুভ হয়ে যাবে এবং মিউজিক বেজে উঠবে।
* **স্মুথ এবং নিরাপদ ক্লিক (Human-like Timing):** ২০/২০ হয়ে `No match found` আসার পর সার্ভারের সেশন রিলিজ হতে ১.২ সেকেন্ড অপেক্ষা করে স্বাভাবিক একটি ক্লিক করবে, ফলে `Frequent operation` মেসেজ আসবে না।

```javascript
(function () {
  // পূর্ববর্তী প্যানেল সম্পূর্ণ পরিষ্কার
  const existingPanel = document.getElementById("cyberMatchPanel");
  if (existingPanel) existingPanel.remove();
  const existingCSS = document.getElementById("cyberMatchCSS");
  if (existingCSS) existingCSS.remove();

  // ১. কমপ্যাক্ট সাইবারপাঙ্ক স্টাইল
  const style = document.createElement("style");
  style.id = "cyberMatchCSS";
  style.innerHTML = `
    #cyberMatchPanel {
      position: fixed;
      right: 12px;
      bottom: 12px;
      width: 195px;
      z-index: 9999999;
      background: linear-gradient(180deg, #181b24 0%, #0d0f15 100%);
      border-radius: 10px;
      border: 1px solid #363c4e;
      box-shadow: 0 0 10px rgba(0, 242, 254, 0.2), 0 8px 20px rgba(0, 0, 0, 0.7);
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      user-select: none;
      box-sizing: border-box;
    }
    .cmp-header {
      padding: 6px 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      cursor: move;
      touch-action: none;
      background: rgba(255, 255, 255, 0.02);
    }
    .cmp-title {
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 0.6px;
      color: #00f2fe;
      text-transform: uppercase;
    }
    .cmp-body {
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .cmp-btn-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5px;
    }
    .cmp-btn {
      height: 26px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 10px;
      font-weight: 700;
      border: 1px solid transparent;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cmp-btn-start {
      background: #1b4b3e;
      color: #38ef7d;
      border-color: #38ef7d;
    }
    .cmp-btn-stop {
      background: #501d24;
      color: #ff4e50;
      border-color: #ff4e50;
    }
    .cmp-status-box {
      border: 1px solid rgba(0, 242, 254, 0.25);
      background: rgba(0, 0, 0, 0.4);
      border-radius: 5px;
      padding: 4px;
      text-align: center;
      font-size: 9px;
      font-weight: 700;
      color: #4facfe;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
  `;
  document.head.appendChild(style);

  // ২. প্যানেল এইচটিএমএল
  const panel = document.createElement("div");
  panel.id = "cyberMatchPanel";
  panel.innerHTML = `
    <div class="cmp-header" id="cmpHeader">
      <div class="cmp-title">⚡ AUTO MATCH</div>
      <div style="font-size: 10px; color: #777; cursor: pointer;" id="cmpClose">✕</div>
    </div>
    <div class="cmp-body">
      <div class="cmp-btn-row">
        <button class="cmp-btn cmp-btn-start" id="cmpStart">Start</button>
        <button class="cmp-btn cmp-btn-stop" id="cmpStop">Stop</button>
      </div>
      <div class="cmp-status-box" id="cmpStatus">Status: Ready</div>
    </div>
  `;
  document.body.appendChild(panel);

  const startBtn = document.getElementById("cmpStart");
  const stopBtn = document.getElementById("cmpStop");
  const statusEl = document.getElementById("cmpStatus");
  const closeBtn = document.getElementById("cmpClose");

  let isRunning = false;
  let monitorInterval = null;
  let isClickCoolingDown = false;

  function setStatus(text, color = "#4facfe") {
    if (!statusEl) return;
    statusEl.innerText = "Status: " + text;
    statusEl.style.color = color;
    statusEl.style.borderColor = color;
  }

  // কাস্টম অডিও লিংক
  const audioUrl = "[https://github.com/slol41936-cpu/my-script/raw/refs/heads/main/Fahhh-%20sound%20effect%20(HD)%20-%20HighQualitySFX%20(2).mp3](https://github.com/slol41936-cpu/my-script/raw/refs/heads/main/Fahhh-%20sound%20effect%20(HD)%20-%20HighQualitySFX%20(2).mp3)";
  const customAudio = new Audio(audioUrl);

  function triggerAlarm() {
    customAudio.currentTime = 0;
    customAudio.play().catch(() => {
      // ব্যাকআপ ওয়েব অডিও সিন্থেসাইজার
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        for (let i = 0; i < 4; i++) {
          setTimeout(() => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.value = 880;
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.2);
          }, i * 250);
        }
      } catch (e) {}
    });
  }

  // মানবসদৃশ মসৃণ ক্লিক ফাংশন
  function performClick(element) {
    if (!element) return;
    try {
      const rect = element.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const eventOpts = { bubbles: true, cancelable: true, clientX: x, clientY: y, view: window };
      element.dispatchEvent(new MouseEvent("mousedown", eventOpts));
      element.dispatchEvent(new MouseEvent("mouseup", eventOpts));
      element.dispatchEvent(new MouseEvent("click", eventOpts));
      if (typeof element.click === "function") {
        element.click();
      }
    } catch (e) {}
  }

  function startMonitoring() {
    if (monitorInterval) clearInterval(monitorInterval);

    monitorInterval = setInterval(() => {
      if (!isRunning) return;

      const pageText = document.body ? document.body.innerText : "";
      const currentUrl = window.location.href;

      // ১. অর্ডার কনফার্ম হওয়ার সমস্ত মার্কার চেক
      const isOrderConfirmed = 
        pageText.includes("Matched, pending payment") || 
        pageText.includes("pending payment") ||
        pageText.includes("Redirecting to the payment page") ||
        pageText.includes("Cancel Order") ||
        pageText.includes("Time left to pay") ||
        pageText.includes("Pay ₹") ||
        currentUrl.includes("cashier");

      // অর্ডার পাওয়া গেলে তাত্ক্ষণিক স্টপ, অ্যালার্ম এবং UI তাৎক্ষণিক মুছে ফেলা
      if (isOrderConfirmed && !pageText.includes("Searching available orders") && !pageText.includes("No match found")) {
        isRunning = false;
        clearInterval(monitorInterval);
        triggerAlarm();
        
        // ইউআই সরাসরি স্ক্রিন থেকে সরিয়ে ফেলা
        if (panel) {
          panel.remove();
        }
        return;
      }

      // কুলডাউনে থাকলে অপেক্ষা করবে
      if (isClickCoolingDown) return;

      // ২. 'No match found' পেজ সম্পূর্ণ নিশ্চিত করা
      const isNoMatchPage = pageText.includes("No match found") || pageText.includes("after multiple attempts");

      if (isNoMatchPage) {
        const elements = Array.from(document.querySelectorAll("button, div, span, a"));
        const matchButton = elements.find(el => {
          const txt = (el.textContent || "").trim();
          return txt === "Match Again" && el.offsetParent !== null && !el.closest("#cyberMatchPanel");
        });

        if (matchButton) {
          isClickCoolingDown = true;
          setStatus("Waiting 1.2s...", "#ffbb00");

          // ১.২ সেকেন্ড পর স্মুথভাবে একবার ক্লিক
          setTimeout(() => {
            if (!isRunning) return;
            setStatus("Retrying...", "#38ef7d");
            performClick(matchButton);

            // ৩.৫ সেকেন্ডের জন্য ক্লিক লক যাতে 'Frequent operation' না আসে
            setTimeout(() => {
              isClickCoolingDown = false;
              if (isRunning) setStatus("Scanning...", "#00f2fe");
            }, 3500);
          }, 1200);
          return;
        }
      }

      // সাধারণ স্ক্যানিং স্ট্যাটাস
      if (pageText.includes("Searching available orders") || pageText.includes("Matching")) {
        setStatus("Searching...", "#00f2fe");
      }
    }, 300);
  }

  // বাটন ক্লিক ইভেন্ট
  startBtn.onclick = () => {
    if (isRunning) return;
    isRunning = true;
    isClickCoolingDown = false;
    try {
      customAudio.load();
    } catch (e) {}
    setStatus("Scanning...", "#00f2fe");
    startMonitoring();
  };

  stopBtn.onclick = () => {
    isRunning = false;
    isClickCoolingDown = false;
    if (monitorInterval) clearInterval(monitorInterval);
    setStatus("Stopped", "#ff4e50");
  };

  closeBtn.onclick = () => {
    isRunning = false;
    if (monitorInterval) clearInterval(monitorInterval);
    panel.remove();
  };

  // ড্র্যাগিং সাপোর্ট
  (function initDrag() {
    const header = document.getElementById("cmpHeader");
    let isDragging = false;
    let startX = 0, startY = 0;

    function onStart(e) {
      isDragging = true;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      startX = x - panel.offsetLeft;
      startY = y - panel.offsetTop;
    }
    function onMove(e) {
      if (!isDragging) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      panel.style.left = `${Math.max(5, Math.min(window.innerWidth - 205, x - startX))}px`;
      panel.style.top = `${Math.max(5, Math.min(window.innerHeight - 100, y - startY))}px`;
      panel.style.right = "auto";
      panel.style.bottom = "auto";
    }
    function onEnd() { isDragging = false; }

    header.addEventListener("mousedown", onStart);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onEnd);
    header.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchmove", onMove, { passive: true });
    document.addEventListener("touchend", onEnd);
  })();
})();
  

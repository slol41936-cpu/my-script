(function () {
  const oldUI = document.getElementById("cyberMatchPanel");
  if (oldUI) oldUI.remove();
  const oldCSS = document.getElementById("cyberMatchCSS");
  if (oldCSS) oldCSS.remove();

  const style = document.createElement("style");
  style.id = "cyberMatchCSS";
  style.innerHTML = `
    #cyberMatchPanel {
      position: fixed;
      right: 20px;
      bottom: 20px;
      width: 260px;
      z-index: 9999999;
      background: linear-gradient(180deg, #1d212d 0%, #11141c 100%);
      border-radius: 14px;
      border: 1.5px solid #363c4e;
      box-shadow: 0 0 15px rgba(0, 242, 254, 0.25), 0 15px 35px rgba(0, 0, 0, 0.7);
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      user-select: none;
      box-sizing: border-box;
    }
    .cmp-header {
      padding: 10px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.08));
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      cursor: move;
      touch-action: none;
    }
    .cmp-title {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1px;
      background: linear-gradient(90deg, #00f2fe, #4facfe, #ff0844);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-transform: uppercase;
    }
    .cmp-body {
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .cmp-btn-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .cmp-btn {
      height: 36px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      text-transform: uppercase;
    }
    .cmp-btn-start {
      background: linear-gradient(180deg, #1b4b3e 0%, #0d2821 100%);
      color: #38ef7d;
      border: 1px solid #38ef7d;
      box-shadow: 0 0 10px rgba(56, 239, 125, 0.3);
    }
    .cmp-btn-stop {
      background: linear-gradient(180deg, #501d24 0%, #2b0d12 100%);
      color: #ff4e50;
      border: 1px solid #ff4e50;
      box-shadow: 0 0 10px rgba(255, 78, 80, 0.3);
    }
    .cmp-status-box {
      border: 1px solid rgba(0, 242, 254, 0.25);
      background: rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      color: #4facfe;
      letter-spacing: 0.8px;
      text-transform: uppercase;
    }
  `;
  document.head.appendChild(style);

  const panel = document.createElement("div");
  panel.id = "cyberMatchPanel";
  panel.innerHTML = `
    <div class="cmp-header" id="cmpHeader">
      <div class="cmp-title">⚡ AUTO MATCH AGAIN</div>
      <div style="font-size: 10px; color: #6c7993; cursor: pointer;" id="cmpClose">✕</div>
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

  function setStatus(text, color = "#4facfe") {
    if (!statusEl) return;
    statusEl.innerText = "Status: " + text;
    statusEl.style.color = color;
    statusEl.style.borderColor = color;
  }

  // কাস্টম অডিও
  const soundUrl = "https://raw.githubusercontent.com/slol41936-cpu/my-script/ba67b11cb26ceb4ebdfa793c650e3be88d2cab0d/Fahhh-%20sound%20effect%20(HD)%20-%20HighQualitySFX.mp3";
  const customAudio = new Audio(soundUrl);

  function playAlertSound() {
    customAudio.play().catch(() => {});
  }

  // মোবাইল টাচ ও মাউস ইভেন্ট ফোর্স-ক্লিক ফাংশন
  function triggerRealClick(el) {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const touchObj = new Touch({
      identifier: Date.now(),
      target: el,
      clientX: x,
      clientY: y,
      screenX: x,
      screenY: y,
      pageX: x,
      pageY: y
    });

    el.dispatchEvent(new TouchEvent("touchstart", { bubbles: true, cancelable: true, touches: [touchObj], targetTouches: [touchObj] }));
    el.dispatchEvent(new TouchEvent("touchend", { bubbles: true, cancelable: true, touches: [], targetTouches: [] }));
    el.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, cancelable: true, clientX: x, clientY: y }));
    el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true, clientX: x, clientY: y }));
    el.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, cancelable: true, clientX: x, clientYস্ক্রিনশটে দেখা যাচ্ছে স্ট্যাটাস বক্সে `STATUS: RETRYING...` লেখা উঠে আছে, অর্থাৎ স্ক্রিপ্ট বাটনটি খুঁজে পেয়ে ক্লিক করার চেষ্টা করেছে, কিন্তু পেজে নতুন করে ম্যাচিং শুরু হয়নি। 

### কাজ না করার কারণ:
মোবাইল ভিউ বা এই ধরণের ফ্রেমওয়ার্কে (Vue.js) সাধারণ জাভাস্ক্রিপ্টের `.click()` মেথড অনেক সময় ইভেন্ট ট্রিগার করতে পারে না। সেখানে মোবাইল টাচ ইভেন্ট (`touchstart`, `touchend`) অথবা সরাসরি মাউস ইভেন্ট পাঠাতে হয়। তাছাড়া অনেক সময় মূল ক্লিক ইভেন্টটি বাটন এলিমেন্টের ভেতরের টেক্সটে না থেকে তার প্যারেন্ট (Parent container) ডিভে থাকে।

নিচে ক্লিক করার মেকানিজমটি পুরোপুরি আপডেট করে দেওয়া হলো, যা সাধারণ ক্লিকের পাশাপাশি ফুল টাচ ও মাউস ইভেন্ট সিমুলেট করবে:

```javascript
(function () {
  const oldUI = document.getElementById("cyberMatchPanel");
  if (oldUI) oldUI.remove();
  const oldCSS = document.getElementById("cyberMatchCSS");
  if (oldCSS) oldCSS.remove();

  const style = document.createElement("style");
  style.id = "cyberMatchCSS";
  style.innerHTML = `
    #cyberMatchPanel {
      position: fixed;
      right: 20px;
      bottom: 20px;
      width: 260px;
      z-index: 9999999;
      background: linear-gradient(180deg, #1d212d 0%, #11141c 100%);
      border-radius: 14px;
      border: 1.5px solid #363c4e;
      box-shadow: 0 0 15px rgba(0, 242, 254, 0.25), 0 15px 35px rgba(0, 0, 0, 0.7);
      overflow: hidden;
      font-family: sans-serif;
      user-select: none;
    }
    .cmp-header {
      padding: 10px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      cursor: move;
      touch-action: none;
    }
    .cmp-title {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1px;
      color: #00f2fe;
    }
    .cmp-body {
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .cmp-btn-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .cmp-btn {
      height: 36px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 700;
      border: 1px solid transparent;
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
      border-radius: 8px;
      padding: 8px;
      text-align: center;
      font-size: 11px;
      font-weight: 700;
      color: #4facfe;
    }
  `;
  document.head.appendChild(style);

  const panel = document.createElement("div");
  panel.id = "cyberMatchPanel";
  panel.innerHTML = `
    <div class="cmp-header" id="cmpHeader">
      <div class="cmp-title">⚡ AUTO MATCH AGAIN</div>
      <div style="font-size: 12px; color: #888; cursor: pointer;" id="cmpClose">✕</div>
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

  function setStatus(text, color = "#4facfe") {
    if (!statusEl) return;
    statusEl.innerText = "Status: " + text;
    statusEl.style.color = color;
    statusEl.style.borderColor = color;
  }

  const soundUrl = "[https://raw.githubusercontent.com/slol41936-cpu/my-script/ba67b11cb26ceb4ebdfa793c650e3be88d2cab0d/Fahhh-%20sound%20effect%20(HD)%20-%20HighQualitySFX.mp3](https://raw.githubusercontent.com/slol41936-cpu/my-script/ba67b11cb26ceb4ebdfa793c650e3be88d2cab0d/Fahhh-%20sound%20effect%20(HD)%20-%20HighQualitySFX.mp3)";
  const customAudio = new Audio(soundUrl);

  function playAlertSound() {
    customAudio.play().catch(() => {});
  }

  // মোবাইল টাচ ও মাউস ইভেন্ট ট্রিগার
  function forceClick(target) {
    if (!target) return;
    const events = ["touchstart", "touchend", "mousedown", "mouseup", "click"];
    events.forEach(evtType => {
      const evt = new MouseEvent(evtType, {
        bubbles: true,
        cancelable: true,
        view: window
      });
      target.dispatchEvent(evt);
    });
    if (typeof target.click === "function") {
      target.click();
    }
  }

  function startMonitoring() {
    if (monitorInterval) clearInterval(monitorInterval);

    monitorInterval = setInterval(() => {
      if (!isRunning) return;

      const currentUrl = window.location.href;
      const bodyText = document.body ? document.body.innerText : "";

      // অর্ডার পাওয়ার চেক
      const hasOrderMatched = 
        currentUrl.includes("cashier") || 
        bodyText.includes("Countdown to Expiry") || 
        (bodyText.includes("Paytm") && bodyText.includes("UTR")) ||
        document.querySelector("canvas") || 
        document.querySelector("img[src*='qr'], img[src*='qrcode']");

      if (hasOrderMatched && !bodyText.includes("Searching available orders") && !bodyText.includes("Matching")) {
        isRunning = false;
        clearInterval(monitorInterval);
        setStatus("LOCKED!", "#38ef7d");
        playAlertSound();
        return;
      }

      // বাটন খুঁজে বের করার লজিক
      const allElements = Array.from(document.querySelectorAll("div, button, span, p, a"));
      const matchBtn = allElements.find(el => {
        const text = (el.textContent || "").trim();
        return text === "Match Again" && el.offsetParent !== null && !el.closest("#cyberMatchPanel");
      });

      if (matchBtn) {
        setStatus("Clicking...", "#ffbb00");
        forceClick(matchBtn);
        // যদি বাটন কোনো প্যারেন্ট কন্টেইনারের ভেতর থাকে
        if (matchBtn.parentElement) {
          forceClick(matchBtn.parentElement);
        }
      } else {
        setStatus("Scanning...", "#00f2fe");
      }
    }, 600);
  }

  startBtn.onclick = () => {
    if (isRunning) return;
    isRunning = true;
    customAudio.load();
    setStatus("Scanning...", "#00f2fe");
    startMonitoring();
  };

  stopBtn.onclick = () => {
    isRunning = false;
    if (monitorInterval) clearInterval(monitorInterval);
    setStatus("Stopped", "#ff4e50");
  };

  closeBtn.onclick = () => {
    isRunning = false;
    if (monitorInterval) clearInterval(monitorInterval);
    panel.remove();
  };

  // ড্র্যাগ ফিচার
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
      panel.style.left = `${Math.max(10, Math.min(window.innerWidth - 270, x - startX))}px`;
      panel.style.top = `${Math.max(10, Math.min(window.innerHeight - 150, y - startY))}px`;
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
  

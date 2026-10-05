(function () {
  // পূর্ববর্তী প্যানেল ক্লিনআপ
  const oldUI = document.getElementById("cyberMatchPanel");
  if (oldUI) oldUI.remove();
  const oldCSS = document.getElementById("cyberMatchCSS");
  if (oldCSS) oldCSS.remove();

  // ১. সাইবারপাঙ্ক সিএসএস
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
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      cursor: move;
      touch-action: none;
      background: rgba(255, 255, 255, 0.03);
    }
    .cmp-title {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1px;
      color: #00f2fe;
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
      border: 1px solid transparent;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }
    .cmp-btn-start {
      background: #1b4b3e;
      color: #38ef7d;
      border-color: #38ef7d;
      box-shadow: 0 0 10px rgba(56, 239, 125, 0.2);
    }
    .cmp-btn-stop {
      background: #501d24;
      color: #ff4e50;
      border-color: #ff4e50;
      box-shadow: 0 0 10px rgba(255, 78, 80, 0.2);
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
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  `;
  document.head.appendChild(style);

  // ২. প্যানেল এইচটিএমএল
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

  // ৩. অডিও ইঞ্জিন (এনকোডেড লিঙ্ক + লাইভ বিপ সাউন্ড)
  const soundUrl1 = "https://raw.githubusercontent.com/slol41936-cpu/my-script/ba67b11cb26ceb4ebdfa793c650e3be88d2cab0d/Fahhh-%20sound%20effect%20(HD)%20-%20HighQualitySFX%20(2).mp3";
  const soundUrl2 = "https://raw.githubusercontent.com/slol41936-cpu/my-script/ba67b11cb26ceb4ebdfa793c650e3be88d2cab0d/Fahhh-%20sound%20effect%20(HD)%20-%20HighQualitySFX.mp3";
  
  const customAudio = new Audio(soundUrl1);

  function playAlertSound() {
    // অডিও প্লে করার চেষ্টা
    let played = false;
    try {
      customAudio.currentTime = 0;
      const promise = customAudio.play();
      if (promise !== undefined) {
        promise.then(() => { played = true; }).catch(() => {
          // দ্বিতীয় লিঙ্ক ট্রাই
          const fallbackAudio = new Audio(soundUrl2);
          fallbackAudio.play().catch(() => {});
        });
      }
    } catch (e) {}

    // নিশ্চিত অ্যালার্ম: ব্রাউজারের নিজস্ব সিন্থেসাইজার (কোনো নেটওয়ার্ক ফাইল না লাগলেও ১০০% বাজবে)
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      function beep(freq, delay, dur) {
        setTimeout(() => {
          try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "square"; // স্পষ্ট লাউড সাউন্ড
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + dur);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + dur);
          } catch(err) {}
        }, delay);
      }
      for (let i = 0; i < 6; i++) {
        beep(900, i * 300, 0.2);
        beep(1200, i * 300 + 150, 0.2);
      }
    } catch (e) {}
  }

  // ৪. খাঁটি মোবাইল টাচ ও মাউস ক্লিক
  function forceClick(target) {
    if (!target) return;
    const events = ["touchstart", "touchend", "mousedown", "mouseup", "click"];
    events.forEach(evtType => {
      try {
        const evt = new MouseEvent(evtType, {
          bubbles: true,
          cancelable: true,
          view: window
        });
        target.dispatchEvent(evt);
      } catch (e) {}
    });
    if (typeof target.click === "function") {
      target.click();
    }
  }

  // ৫. হাই-স্পিড চেকার ইঞ্জিন (প্রতি ২০০ মিলিসেকেন্ডে চেক)
  function startMonitoring() {
    if (monitorInterval) clearInterval(monitorInterval);

    monitorInterval = setInterval(() => {
      if (!isRunning) return;

      const currentUrl = window.location.href;
      const bodyText = document.body ? document.body.innerText : "";

      // স্ক্রিনশটের হুবহু ম্যাচিং কন্ডিশন
      const hasOrderMatched = 
        bodyText.includes("Matched, pending payment") || 
        bodyText.includes("We have matched the best order") ||
        bodyText.includes("Redirecting to the payment page") ||
        bodyText.includes("Cancel Order") ||
        (bodyText.includes("Pay ₹") || bodyText.includes("Time left to pay")) ||
        currentUrl.includes("cashier") || 
        document.querySelector("canvas") || 
        document.querySelector("img[src*='qr'], img[src*='qrcode']");

      // অর্ডার পাওয়া মাত্রই তাত্ক্ষণিক স্টপ ও মিউজিক
      if (hasOrderMatched && !bodyText.includes("Searching available orders") && !bodyText.includes("No match found")) {
        isRunning = false;
        clearInterval(monitorInterval);
        setStatus("ORDER MATCHED!", "#38ef7d");
        playAlertSound();
        return;
      }

      // "Match Again" বাটন ক্লিক
      const allElements = Array.from(document.querySelectorAll("div, button, span, p, a"));
      const matchBtn = allElements.find(el => {
        const text = (el.textContent || "").trim();
        return text === "Match Again" && el.offsetParent !== null && !el.closest("#cyberMatchPanel");
      });

      if (matchBtn) {
        setStatus("Clicking...", "#ffbb00");
        forceClick(matchBtn);
        if (matchBtn.parentElement) {
          forceClick(matchBtn.parentElement);
        }
      } else {
        setStatus("Scanning...", "#00f2fe");
      }
    }, 200); // অতি দ্রুত ২০০ms রেসপন্স টাইম
  }

  // বাটন ইভেন্ট
  startBtn.onclick = () => {
    if (isRunning) return;
    isRunning = true;
    
    // ব্রাউজারের অটো-প্লে ব্লকিং ছাড়াতে ইউজার ক্লিকের সময়েই অডিও আনলক
    try {
      customAudio.load();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    } catch(e) {}

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

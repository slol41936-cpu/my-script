(function () {
  const prevPanel = document.getElementById("cyberMatchPanel");
  if (prevPanel) prevPanel.remove();
  const prevCSS = document.getElementById("cyberMatchCSS");
  if (prevCSS) prevCSS.remove();

  const style = document.createElement("style");
  style.id = "cyberMatchCSS";
  style.innerHTML = `
    #cyberMatchPanel {
      position: fixed;
      right: 12px;
      bottom: 12px;
      width: 190px;
      z-index: 9999999;
      background: #0f172a;
      border-radius: 10px;
      border: 1px solid #1e293b;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      user-select: none;
      box-sizing: border-box;
    }
    .cmp-header {
      padding: 6px 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #1e293b;
      cursor: move;
      touch-action: none;
      background: #1e293b;
    }
    .cmp-title {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.5px;
      color: #38bdf8;
      text-transform: uppercase;
    }
    .cmp-body {
      padding: 8px 10px;
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
      background: #059669;
      color: #ffffff;
      border-color: #10b981;
    }
    .cmp-btn-stop {
      background: #dc2626;
      color: #ffffff;
      border-color: #ef4444;
    }
    .cmp-status-box {
      border: 1px solid #334155;
      background: #1e293b;
      border-radius: 5px;
      padding: 4px;
      text-align: center;
      font-size: 9px;
      font-weight: 700;
      color: #38bdf8;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
  `;
  document.head.appendChild(style);

  const panel = document.createElement("div");
  panel.id = "cyberMatchPanel";
  panel.innerHTML = `
    <div class="cmp-header" id="cmpHeader">
      <div class="cmp-title">AUTO MATCH</div>
      <div style="font-size: 11px; color: #94a3b8; cursor: pointer; font-weight: bold;" id="cmpClose">✕</div>
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
  let isActionLocked = false;

  function setStatus(text, color = "#38bdf8") {
    if (!statusEl) return;
    statusEl.innerText = "Status: " + text;
    statusEl.style.color = color;
    statusEl.style.borderColor = color;
  }

  const audioUrl = "https://github.com/slol41936-cpu/my-script/raw/refs/heads/main/Fahhh-%20sound%20effect%20(HD)%20-%20HighQualitySFX%20(2).mp3";
  const customAudio = new Audio(audioUrl);

  function triggerAlarm() {
    try {
      customAudio.currentTime = 0;
      const playPromise = customAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => fallbackBeep());
      }
    } catch (e) {
      fallbackBeep();
    }
  }

  function fallbackBeep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          try {
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
          } catch (err) {}
        }, i * 250);
      }
    } catch (e) {}
  }

  function singleHumanClick(target) {
    if (!target) return;
    try {
      if (typeof target.click === "function") {
        target.click();
      } else {
        const evt = new MouseEvent("click", { bubbles: true, cancelable: true, view: window });
        target.dispatchEvent(evt);
      }
    } catch (e) {}
  }

  function startMonitoring() {
    if (monitorInterval) clearInterval(monitorInterval);

    monitorInterval = setInterval(() => {
      if (!isRunning) return;

      const pageText = document.body ? document.body.innerText : "";
      const currentUrl = window.location.href;

      const isOrderConfirmed = 
        pageText.includes("Matched, pending payment") || 
        pageText.includes("pending payment") ||
        pageText.includes("Redirecting to the payment page") ||
        pageText.includes("Cancel Order") ||
        pageText.includes("Time left to pay") ||
        pageText.includes("Pay ₹") ||
        currentUrl.includes("cashier");

      if (isOrderConfirmed && !pageText.includes("Searching available orders") && !pageText.includes("No match found")) {
        isRunning = false;
        clearInterval(monitorInterval);
        triggerAlarm();
        
        const currentPanel = document.getElementById("cyberMatchPanel");
        if (currentPanel) currentPanel.remove();
        return;
      }

      if (isActionLocked) return;

      const isNoMatchPage = pageText.includes("No match found") || pageText.includes("after multiple attempts");

      if (isNoMatchPage) {
        const elements = Array.from(document.querySelectorAll("button, div, span, a"));
        const matchButton = elements.find(el => {
          const txt = (el.textContent || "").trim();
          return txt === "Match Again" && el.offsetParent !== null && !el.closest("#cyberMatchPanel");
        });

        if (matchButton) {
          isActionLocked = true;
          setStatus("Waiting 1.5s...", "#f59e0b");

          setTimeout(() => {
            if (!isRunning) return;
            setStatus("Retrying...", "#10b981");
            singleHumanClick(matchButton);

            setTimeout(() => {
              isActionLocked = false;
              if (isRunning) setStatus("Scanning...", "#38bdf8");
            }, 3500);
          }, 1500);
          return;
        }
      }

      if (pageText.includes("Searching available orders") || pageText.includes("Matching")) {
        setStatus("Searching...", "#38bdf8");
      }
    }, 400);
  }

  startBtn.onclick = () => {
    if (isRunning) return;
    isRunning = true;
    isActionLocked = false;
    try {
      customAudio.load();
    } catch (e) {}
    setStatus("Scanning...", "#38bdf8");
    startMonitoring();
  };

  stopBtn.onclick = () => {
    isRunning = false;
    isActionLocked = false;
    if (monitorInterval) clearInterval(monitorInterval);
    setStatus("Stopped", "#ef4444");
  };

  closeBtn.onclick = () => {
    isRunning = false;
    if (monitorInterval) clearInterval(monitorInterval);
    panel.remove();
  };

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
      panel.style.left = `${Math.max(5, Math.min(window.innerWidth - 200, x - startX))}px`;
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

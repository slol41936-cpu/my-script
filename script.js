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
      right: 15px;
      bottom: 15px;
      width: 210px;
      z-index: 9999999;
      background: linear-gradient(180deg, #1d212d 0%, #11141c 100%);
      border-radius: 12px;
      border: 1.2px solid #363c4e;
      box-shadow: 0 0 12px rgba(0, 242, 254, 0.25), 0 10px 25px rgba(0, 0, 0, 0.7);
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      user-select: none;
      box-sizing: border-box;
      transition: opacity 0.3s ease, transform 0.3s ease;
    }
    .cmp-header {
      padding: 7px 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      cursor: move;
      touch-action: none;
      background: rgba(255, 255, 255, 0.03);
    }
    .cmp-title {
      font-size: 9.5px;
      font-weight: 800;
      letter-spacing: 0.8px;
      color: #00f2fe;
      text-transform: uppercase;
    }
    .cmp-body {
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .cmp-btn-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
    }
    .cmp-btn {
      height: 28px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 10.5px;
      font-weight: 700;
      border: 1px solid transparent;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 3px;
    }
    .cmp-btn-start {
      background: #1b4b3e;
      color: #38ef7d;
      border-color: #38ef7d;
      box-shadow: 0 0 8px rgba(56, 239, 125, 0.2);
    }
    .cmp-btn-stop {
      background: #501d24;
      color: #ff4e50;
      border-color: #ff4e50;
      box-shadow: 0 0 8px rgba(255, 78, 80, 0.2);
    }
    .cmp-status-box {
      border: 1px solid rgba(0, 242, 254, 0.25);
      background: rgba(0, 0, 0, 0.4);
      border-radius: 6px;
      padding: 5px;
      text-align: center;
      font-size: 9.5px;
      font-weight: 700;
      color: #4facfe;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
  `;
  document.head.appendChild(style);

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

  function setStatus(text, color = "#4facfe") {
    if (!statusEl) return;
    statusEl.innerText = "Status: " + text;
    statusEl.style.color = color;
    statusEl.style.borderColor = color;
  }

  const directAudioUrl = "https://github.com/slol41936-cpu/my-script/raw/refs/heads/main/Fahhh-%20sound%20effect%20(HD)%20-%20HighQualitySFX%20(2).mp3";
  const customAudio = new Audio(directAudioUrl);

  function playAlertSound() {
    customAudio.currentTime = 0;
    const playPromise = customAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        try {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          function beep(freq, delay, dur) {
            setTimeout(() => {
              try {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = "square";
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + dur);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + dur);
              } catch (e) {}
            }, delay);
          }
          for (let i = 0; i < 5; i++) {
            beep(950, i * 250, 0.18);
          }
        } catch (e) {}
      });
    }
  }

  function forceClick(target) {
    if (!target) return;
    const events = ["touchstart", "touchend", "mousedown", "mouseup", "click"];
    events.forEach(evtType => {
      try {
        const evt = new MouseEvent(evtType, { bubbles: true, cancelable: true, view: window });
        target.dispatchEvent(evt);
      } catch (e) {}
    });
    if (typeof target.click === "function") target.click();
  }

  function startMonitoring() {
    if (monitorInterval) clearInterval(monitorInterval);

    monitorInterval = setInterval(() => {
      if (!isRunning) return;

      const currentUrl = window.location.href;
      const bodyText = document.body ? document.body.innerText : "";

      const hasOrderMatched = 
        bodyText.includes("Matched, pending payment") || 
        bodyText.includes("We have matched the best order") ||
        bodyText.includes("Redirecting to the payment page") ||
        bodyText.includes("Cancel Order") ||
        bodyText.includes("Pay ₹") || 
        bodyText.includes("Time left to pay") ||
        currentUrl.includes("cashier");

      // অর্ডার পাওয়ার সাথে সাথে গান বাজবে এবং ইউআই স্ক্রিন থেকে রিমুভ হয়ে যাবে
      if (hasOrderMatched && !bodyText.includes("Searching available orders") && !bodyText.includes("No match found")) {
        isRunning = false;
        clearInterval(monitorInterval);
        playAlertSound();
        panel.style.opacity = "0";
        panel.style.transform = "scale(0.85)";
        setTimeout(() => {
          panel.remove();
        }, 300);
        return;
      }

      const allElements = Array.from(document.querySelectorAll("div, button, span, p, a"));
      const matchBtn = allElements.find(el => {
        const text = (el.textContent || "").trim();
        return text === "Match Again" && el.offsetParent !== null && !el.closest("#cyberMatchPanel");
      });

      if (matchBtn) {
        setStatus("Clicking...", "#ffbb00");
        forceClick(matchBtn);
        if (matchBtn.parentElement) forceClick(matchBtn.parentElement);
      } else {
        setStatus("Scanning...", "#00f2fe");
      }
    }, 200);
  }

  startBtn.onclick = () => {
    if (isRunning) return;
    isRunning = true;
    try {
      customAudio.load();
    } catch (e) {}
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
      panel.style.left = `${Math.max(5, Math.min(window.innerWidth - 220, x - startX))}px`;
      panel.style.top = `${Math.max(5, Math.min(window.innerHeight - 120, y - startY))}px`;
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

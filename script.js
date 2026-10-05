(function () {
  // পূর্ববর্তী প্যানেল ক্লিনআপ
  const oldUI = document.getElementById("cyberMatchPanel");
  if (oldUI) oldUI.remove();
  const oldCSS = document.getElementById("cyberMatchCSS");
  if (oldCSS) oldCSS.remove();

  // ১. সাইবারপাঙ্ক সিএসএস ইনজেকশন
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
      box-shadow: 
        0 0 15px rgba(0, 242, 254, 0.25),
        0 15px 35px rgba(0, 0, 0, 0.7),
        inset 0 1px 1px rgba(255, 255, 255, 0.1);
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
      display: flex;
      align-items: center;
      gap: 6px;
      text-transform: uppercase;
    }

    .cmp-body {
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: radial-gradient(circle at 50% 0%, rgba(79, 172, 254, 0.08), transparent 70%);
    }

    .cmp-btn-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .cmp-btn {
      height: 36px;
      border-radius: 8px;
      border: 1px solid transparent;
      cursor: pointer;
      font-size: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.2s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .cmp-btn-start {
      background: linear-gradient(180deg, #1b4b3e 0%, #0d2821 100%);
      color: #38ef7d;
      border-color: #38ef7d;
      box-shadow: 0 0 10px rgba(56, 239, 125, 0.3), inset 0 1px 1px rgba(255,255,255,0.2);
    }

    .cmp-btn-start:hover {
      filter: brightness(1.2);
      box-shadow: 0 0 15px rgba(56, 239, 125, 0.5);
    }

    .cmp-btn-stop {
      background: linear-gradient(180deg, #501d24 0%, #2b0d12 100%);
      color: #ff4e50;
      border-color: #ff4e50;
      box-shadow: 0 0 10px rgba(255, 78, 80, 0.3), inset 0 1px 1px rgba(255,255,255,0.2);
    }

    .cmp-btn-stop:hover {
      filter: brightness(1.2);
      box-shadow: 0 0 15px rgba(255, 78, 80, 0.5);
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
      box-shadow: inset 0 0 8px rgba(0, 242, 254, 0.1);
      transition: all 0.2s ease;
    }
  `;
  document.head.appendChild(style);

  // ২. প্যানেল এইচটিএমএল
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

  // ৩. GitHub থেকে কাস্টম সাউন্ড বাজানোর ফাংশন (ফলব্যাক অসিলেটর সহ)
  const soundUrl = "https://raw.githubusercontent.com/slol41936-cpu/my-script/ba67b11cb26ceb4ebdfa793c650e3be88d2cab0d/Fahhh-%20sound%20effect%20(HD)%20-%20HighQualitySFX.mp3";
  const customAudio = new Audio(soundUrl);

  function playAlertSound() {
    customAudio.play().catch(() => {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        function beep(freq, delay, dur) {
          setTimeout(() => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + dur);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + dur);
          }, delay);
        }
        for (let i = 0; i < 4; i++) {
          beep(880, i * 300, 0.2);
        }
      } catch (e) {}
    });
  }

  // ৪. চেকার ইঞ্জিন
  function startMonitoring() {
    if (monitorInterval) clearInterval(monitorInterval);

    monitorInterval = setInterval(() => {
      if (!isRunning) return;

      const currentUrl = window.location.href;
      const bodyText = document.body ? document.body.innerText : "";

      // অর্ডার পাওয়ার চেক
      const hasOrderMatched = 
        currentUrl.includes("cashier") || 
        currentUrl.includes("order") || 
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

      // "No match found" এবং "Match Again" বাটন ক্লিক
      const buttons = Array.from(document.querySelectorAll("button, div, span, a"));
      const matchAgainBtn = buttons.find(el => {
        const txt = (el.innerText || "").trim().toLowerCase();
        return (txt === "match again" || txt.includes("match again")) && el.offsetParent !== null;
      });

      if (matchAgainBtn) {
        setStatus("Retrying...", "#ffbb00");
        matchAgainBtn.click();
      } else {
        setStatus("Scanning...", "#00f2fe");
      }
    }, 400);
  }

  // ৫. বাটন ইভেন্ট
  startBtn.onclick = () => {
    if (isRunning) return;
    isRunning = true;
    // ব্রাউজারের অটোপ্লে পারমিশন নিশ্চিত করার জন্য স্টার্ট চাপার সাথে সাথে লোড কল
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

  // ৬. ড্র্যাগিং হ্যান্ডলার
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

    function onEnd() {
      isDragging = false;
    }

    header.addEventListener("mousedown", onStart);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onEnd);
    header.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchmove", onMove, { passive: true });
    document.addEventListener("touchend", onEnd);
  })();
})();
        

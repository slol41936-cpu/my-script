(async function () {
  // পূর্ববর্তী প্যানেল ও স্টাইল ক্লিনআপ
  const prevPanel = document.getElementById("cyberMatchPanel");
  if (prevPanel) prevPanel.remove();
  const prevCSS = document.getElementById("cyberMatchCSS");
  if (prevCSS) prevCSS.remove();

  // ১. অফ-হোয়াইট থিম সিএসএস
  const style = document.createElement("style");
  style.id = "cyberMatchCSS";
  style.innerHTML = `
    #cyberMatchPanel {
      position: fixed;
      right: 12px;
      bottom: 12px;
      width: 195px;
      z-index: 9999999;
      background: linear-gradient(180deg, #fdfdfd 0%, #f4f5f8 100%);
      border-radius: 12px;
      border: 1px solid #dcdfe6;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06);
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
      border-bottom: 1px solid #eaedf1;
      cursor: move;
      touch-action: none;
      background: #fafbfc;
    }
    .cmp-title {
      font-size: 9.5px;
      font-weight: 800;
      letter-spacing: 0.6px;
      color: #1f2937;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 4px;
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
      transition: all 0.15s ease;
    }
    .cmp-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      filter: grayscale(1);
    }
    .cmp-btn-start {
      background: #e8f8f0;
      color: #0f8b44;
      border-color: #b7ebd0;
    }
    .cmp-btn-stop {
      background: #fdeeee;
      color: #d93025;
      border-color: #fad2d2;
    }
    .cmp-status-box {
      border: 1px solid #e2e6ea;
      background: #ffffff;
      border-radius: 6px;
      padding: 4px;
      text-align: center;
      font-size: 9px;
      font-weight: 700;
      color: #d97706;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.02);
    }
  `;
  document.head.appendChild(style);

  // ২. প্যানেল এইচটিএমএল (পেস্ট করলেই দৃশ্যমান হবে)
  const panel = document.createElement("div");
  panel.id = "cyberMatchPanel";
  panel.innerHTML = `
    <div class="cmp-header" id="cmpHeader">
      <div class="cmp-title">⚡ AUTO MATCH</div>
      <div style="font-size: 11px; color: #9ca3af; cursor: pointer; font-weight: bold;" id="cmpClose">✕</div>
    </div>
    <div class="cmp-body">
      <div class="cmp-btn-row">
        <button class="cmp-btn cmp-btn-start" id="cmpStart" disabled>Start</button>
        <button class="cmp-btn cmp-btn-stop" id="cmpStop" disabled>Stop</button>
      </div>
      <div class="cmp-status-box" id="cmpStatus">Checking License...</div>
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
  let isAuthorized = false;

  function setStatus(text, color = "#2563eb") {
    if (!statusEl) return;
    statusEl.innerText = "Status: " + text;
    statusEl.style.color = color;
    statusEl.style.borderColor = color;
  }

  // ৩. ফায়ারবেস ব্যাকগ্রাউন্ড অথ চেকিং
  (async function verifyFirebaseAccess() {
    try {
      if (!window.firebase) {
        await new Promise((resolve) => {
          const s1 = document.createElement("script");
          s1.src = "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js";
          s1.onload = () => {
            const s2 = document.createElement("script");
            s2.src = "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js";
            s2.onload = resolve;
            document.head.appendChild(s2);
          };
          document.head.appendChild(s1);
        });
      }

      const firebaseConfig = {
        apiKey: "AIzaSyByR2NzGNdIPU0994a7dL9E3X6MM3rV1AE",
        authDomain: "my-ar-automation.firebaseapp.com",
        projectId: "my-ar-automation",
        storageBucket: "my-ar-automation.firebasestorage.app",
        messagingSenderId: "443374813761",
        appId: "1:443374813761:web:3f5142f684c6fe26123cc0"
      };

      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }

      const db = firebase.firestore();
      const doc = await db.collection("access").doc("status").get();

      if (doc.exists && doc.data().status === "active") {
        isAuthorized = true;
        startBtn.disabled = false;
        stopBtn.disabled = false;
        setStatus("Ready", "#0f8b44");
      } else {
        setStatus("Access Denied", "#d93025");
      }
    } catch (err) {
      setStatus("Access Denied", "#d93025");
    }
  })();

  // ৪. অডিও অ্যালার্ট ইঞ্জিন
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

  // ৫. সিঙ্গেল ক্লিন ক্লিক
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

  // ৬. স্ক্যানিং লজিক
  function startMonitoring() {
    if (monitorInterval) clearInterval(monitorInterval);

    monitorInterval = setInterval(() => {
      if (!isRunning || !isAuthorized) return;

      const pageText = document.body ? document.body.innerText : "";
      const currentUrl = window.location.href;

      // অর্ডার পাওয়ার মার্কার চেক
      const isOrderConfirmed = 
        pageText.includes("Matched, pending payment") || 
        pageText.includes("pending payment") ||
        pageText.includes("Redirecting to the payment page") ||
        pageText.includes("Cancel Order") ||
        pageText.includes("Time left to pay") ||
        pageText.includes("Pay ₹") ||
        currentUrl.includes("cashier");

      // অর্ডার পেলে অ্যালার্ম এবং UI স্বয়ংক্রিয় রিমুভ
      if (isOrderConfirmed && !pageText.includes("Searching available orders") && !pageText.includes("No match found")) {
        isRunning = false;
        clearInterval(monitorInterval);
        triggerAlarm();
        
        const currentPanel = document.getElementById("cyberMatchPanel");
        if (currentPanel) currentPanel.remove();
        return;
      }

      if (isActionLocked) return;

      // 'No match found' পেজ চেক
      const isNoMatchPage = pageText.includes("No match found") || pageText.includes("after multiple attempts");

      if (isNoMatchPage) {
        const elements = Array.from(document.querySelectorAll("button, div, span, a"));
        const matchButton = elements.find(el => {
          const txt = (el.textContent || "").trim();
          return txt === "Match Again" && el.offsetParent !== null && !el.closest("#cyberMatchPanel");
        });

        if (matchButton) {
          isActionLocked = true;
          setStatus("Waiting 2s...", "#d97706");

          setTimeout(() => {
            if (!isRunning) return;
            setStatus("Retrying...", "#0f8b44");
            singleHumanClick(matchButton);

            setTimeout(() => {
              isActionLocked = false;
              if (isRunning) setStatus("Scanning...", "#2563eb");
            }, 4000);
          }, 2000);
          return;
        }
      }

      if (pageText.includes("Searching available orders") || pageText.includes("Matching")) {
        setStatus("Searching...", "#2563eb");
      }
    }, 400);
  }

  // বাটন ইভেন্ট
  startBtn.onclick = () => {
    if (!isAuthorized) {
      setStatus("Access Denied", "#d93025");
      return;
    }
    if (isRunning) return;
    isRunning = true;
    isActionLocked = false;
    try {
      customAudio.load();
    } catch (e) {}
    setStatus("Scanning...", "#2563eb");
    startMonitoring();
  };

  stopBtn.onclick = () => {
    isRunning = false;
    isActionLocked = false;
    if (monitorInterval) clearInterval(monitorInterval);
    setStatus("Stopped", "#d93025");
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
 

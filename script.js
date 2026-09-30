(function () {
  // ১. ডুপ্লিকেট প্যানেল ক্লিনআপ
  const p = document.getElementById("cyberPanel");
  if (p) p.remove();
  const o = document.getElementById("cyberOverlay");
  if (o) o.remove();
  const s = document.getElementById("cyberMonitorStyle");
  if (s) s.remove();

  // ২. আপনার অরিজিনাল সিএসএস ডিজাইন
  const style = document.createElement("style");
  style.id = "cyberMonitorStyle";
  style.innerHTML = `
    #cyberPanel {
      position: fixed;
      right: 20px;
      bottom: 20px;
      width: 280px;
      z-index: 999999;
      background: #f0ebe4;
      border-radius: 22px;
      box-shadow: 
        0 20px 45px rgba(0, 0, 0, 0.25),
        0 8px 16px rgba(0, 0, 0, 0.15),
        0 0 20px rgba(197, 160, 89, 0.15),
        inset 0 1px 1px rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.8);
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      user-select: none;
      transition: box-shadow 0.3s ease;
      box-sizing: border-box;
    }

    #cyberPanel:hover {
      box-shadow: 
        0 25px 50px rgba(0, 0, 0, 0.3),
        0 10px 20px rgba(0, 0, 0, 0.18),
        0 0 25px rgba(197, 160, 89, 0.25),
        inset 0 1px 1px rgba(255, 255, 255, 1);
    }

    .cyber-header {
      padding: 10px 14px 6px 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: move;
      touch-action: none;
    }

    .cyber-header-badge {
      width: 26px;
      height: 26px;
      background: radial-gradient(circle at 35% 35%, #ebd7b7, #bfa37b, #8a704c);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.7), 0 2px 5px rgba(0,0,0,0.2);
      color: #fff;
      font-size: 11px;
      flex-shrink: 0;
    }

    .cyber-header-title {
      color: #7d7265;
      font-size: 11px;
      letter-spacing: 0.8px;
      font-weight: 800;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .cyber-header-title span {
      color: #c5a059;
    }

    .cyber-body {
      padding: 6px 14px 14px 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .cyber-label {
      color: #9d9489;
      font-size: 10px;
      font-weight: 700;
      margin-bottom: 2px;
      display: block;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .toggle-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
    }

    .toggle-option {
      padding: 7px 0;
      text-align: center;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      background: #ded7ce;
      color: #8c8378;
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
    }

    .toggle-option.active {
      background: #509796;
      color: #ffffff;
      box-shadow: 
        0 0 0 1.5px rgba(226, 177, 89, 0.9),
        0 4px 10px rgba(80, 151, 150, 0.4);
    }

    .cyber-input {
      width: 100%;
      box-sizing: border-box;
      height: 36px;
      padding: 0 10px;
      border-radius: 10px;
      border: 1px solid rgba(0, 0, 0, 0.04);
      background: repeating-linear-gradient(
        -45deg,
        #ebe4dc,
        #ebe4dc 4px,
        #e5ded5 4px,
        #e5ded5 8px
      );
      box-shadow: inset 1px 2px 4px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.8);
      color: #554e44;
      font-size: 13px;
      font-weight: 700;
      outline: none;
    }

    .cyber-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-top: 2px;
    }

    .cyber-btn {
      height: 34px;
      border: none;
      border-radius: 17px;
      cursor: pointer;
      font-size: 11px;
      font-weight: 800;
      transition: all .2s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .start-btn {
      background: #54748b;
      color: #ffffff;
      border: 1.2px solid #d1b480;
      box-shadow: 0 4px 10px rgba(84, 116, 139, 0.35);
    }

    .start-btn:hover {
      filter: brightness(1.05);
      transform: translateY(-1px);
    }

    .stop-btn {
      background: #b55e65;
      color: #ffd2d5;
      box-shadow: 
        0 0 0 1.2px rgba(225, 102, 102, 0.5),
        0 4px 10px rgba(181, 94, 101, 0.35);
    }

    .stop-btn:hover {
      filter: brightness(1.05);
      transform: translateY(-1px);
    }

    .cyber-status {
      margin-top: 2px;
      background: #ded7cd;
      border-radius: 10px;
      min-height: 34px;
      padding: 6px 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #7d7265;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      box-shadow: inset 1px 2px 3px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(255, 255, 255, 0.9);
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    .cyber-info-box {
      margin-top: 2px;
      background: rgba(222, 215, 205, 0.6);
      border-radius: 10px;
      padding: 8px 10px;
      font-size: 11px;
      color: #554e44;
      line-height: 1.45;
      display: none;
      border: 1px dashed #c5a059;
      box-sizing: border-box;
    }

    .cyber-info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2px;
    }

    .cyber-info-row span:first-child {
      font-weight: 700;
      color: #7d7265;
    }

    #overlay-status-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }

    #overlay-live-status {
      font-size: 18px;
      color: #509796;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 5px;
      text-shadow: 0 0 10px rgba(80, 151, 150, 0.5);
    }
  `;
  document.head.appendChild(style);

  // ৩. ওভারলে
  const overlay = document.createElement("div");
  overlay.id = "cyberOverlay";
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(235, 230, 222, 0.88);
    backdrop-filter: blur(8px);
    z-index: 999998;
    display: none;
    align-items: center;
    justify-content: center;
    color: #7d7265;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  `;
  overlay.innerHTML = `
    <div id="overlay-status-container">
      <div id="overlay-live-status">INITIALIZING...</div>
      <h1 style="font-size:22px;letter-spacing:6px;margin:0;opacity:0.6;color:#554e44;">SYSTEM ACTIVE</h1>
    </div>
  `;
  document.body.appendChild(overlay);

  // ৪. প্যানেল
  const panel = document.createElement("div");
  panel.id = "cyberPanel";
  panel.innerHTML = `
    <div class="cyber-header" id="cyberDragHeader">
      <div class="cyber-header-badge">⚡</div>
      <div class="cyber-header-title">
        <span>⚡</span> AUTO BUY PANEL
      </div>
    </div> 

    <div class="cyber-body"> 
      <div>
        <label class="cyber-label">Payment Type</label>
        <div class="toggle-container" id="orderTypeToggle">
          <div class="toggle-option active" data-value="1">UPI</div>
          <div class="toggle-option" data-value="2">BANK</div>
        </div>
      </div>

      <div>
        <label class="cyber-label">Amount Reference</label> 
        <input 
          type="text" 
          id="buyAmount" 
          class="cyber-input" 
          value="1000"
          inputmode="numeric"
        > 
      </div>

      <div class="cyber-buttons"> 
        <button id="startBtn" class="cyber-btn start-btn">START</button> 
        <button id="stopBtn" class="cyber-btn stop-btn">STOP</button> 
      </div> 

      <div class="cyber-status" id="cyberStatus">READY</div> 
      <div class="cyber-info-box" id="cyberInfoBox"></div>
    </div>
  `;
  document.body.appendChild(panel);

  // এলিমেন্ট রেফারেন্স
  const statusEl = document.getElementById("cyberStatus");
  const infoBox = document.getElementById("cyberInfoBox");
  const liveStatus = document.getElementById("overlay-live-status");
  const startBtn = document.getElementById("startBtn");
  const stopBtn = document.getElementById("stopBtn");
  const amountInput = document.getElementById("buyAmount");
  const orderToggle = document.getElementById("orderTypeToggle");

  let isMonitoring = false;
  let selectedOrderType = 1;
  let lastMatchSignature = "";

  // নেটওয়ার্ক ইন্টারসেপ্টর ব্যাকআপ
  const originalFetch = window.fetch;
  const originalXhrOpen = XMLHttpRequest.prototype.open;
  const originalXhrSend = XMLHttpRequest.prototype.send;

  amountInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
  });

  orderToggle.querySelectorAll(".toggle-option").forEach((opt) => {
    opt.addEventListener("click", () => {
      orderToggle.querySelector(".active").classList.remove("active");
      opt.classList.add("active");
      selectedOrderType = Number(opt.dataset.value);
    });
  });

  function setStatus(text, mode) {
    if (!statusEl) return;
    statusEl.innerText = text;
    if (mode === "matched") {
      statusEl.style.color = "#3d8573";
      statusEl.style.border = "1px solid rgba(61, 133, 115, 0.5)";
      statusEl.style.background = "#e0eee9";
    } else if (mode === "waiting") {
      statusEl.style.color = "#c5a059";
      statusEl.style.border = "1px solid rgba(197, 160, 89, 0.5)";
      statusEl.style.background = "#f7f2ea";
    } else if (mode === "error") {
      statusEl.style.color = "#ba5d58";
      statusEl.style.border = "1px solid rgba(186, 93, 88, 0.4)";
      statusEl.style.background = "#faeceb";
    } else {
      statusEl.style.color = "#7d7265";
      statusEl.style.border = "none";
      statusEl.style.background = "#ded7cd";
    }
  }

  function showDetails(data) {
    if (!infoBox) return;
    if (!data) {
      infoBox.style.display = "none";
      infoBox.innerHTML = "";
      return;
    }
    infoBox.style.display = "block";
    let html = "";
    for (const [k, v] of Object.entries(data)) {
      html += `
        <div class="cyber-info-row">
          <span>${k}:</span>
          <span>${v ?? "N/A"}</span>
        </div>
      `;
    }
    infoBox.innerHTML = html;
  }

  // ড্র্যাগিং সাপোর্ট
  (function setupDrag() {
    const header = document.getElementById("cyberDragHeader");
    let isDragging = false;
    let startX = 0, startY = 0;

    function startDrag(e) {
      isDragging = true;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      startX = x - panel.offsetLeft;
      startY = y - panel.offsetTop;
      panel.style.transition = "none";
    }

    function doDrag(e) {
      if (!isDragging) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      panel.style.left = `${Math.max(10, Math.min(window.innerWidth - 290, x - startX))}px`;
      panel.style.top = `${Math.max(10, Math.min(window.innerHeight - 350, y - startY))}px`;
      panel.style.right = "auto";
      panel.style.bottom = "auto";
    }

    function stopDrag() {
      isDragging = false;
      panel.style.transition = "box-shadow 0.3s ease";
    }

    header.addEventListener("mousedown", startDrag);
    document.addEventListener("mousemove", doDrag);
    document.addEventListener("mouseup", stopDrag);

    header.addEventListener("touchstart", startDrag, { passive: true });
    document.addEventListener("touchmove", doDrag, { passive: true });
    document.addEventListener("touchend", stopDrag);
  })();

  // নেস্টেড অবজেক্ট থেকে ডেটা খোঁজার ফাংশন
  function extractKey(obj, keyList) {
    if (!obj || typeof obj !== "object") return undefined;
    for (const k of keyList) {
      if (k in obj && obj[k] !== null && obj[k] !== undefined && obj[k] !== "") {
        return obj[k];
      }
    }
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === "object") {
        const val = extractKey(obj[key], keyList);
        if (val !== undefined) return val;
      }
    }
    return undefined;
  }

  // রিয়েল-টাইম রেসপন্স পার্সিং লজিক
  function parseMatchResponse(json) {
    if (!isMonitoring) return;

    try {
      const root = json && typeof json === "object" ? json : null;
      if (!root) {
        setStatus("INVALID RESPONSE", "error");
        return;
      }

      const dataNode = root.data || root;
      const matchInfo = dataNode.matchInfo || {};

      // আপনার লেটেস্ট লগের স্ট্রাকচার অনুযায়ী ফিল্ডগুলো নেওয়া
      const matchResult = String(dataNode.matchResult || matchInfo.matchResult || "UNKNOWN").toUpperCase();
      const statusVal = matchInfo.status || dataNode.status || "COMPLETED";
      const orderTypeVal = matchInfo.orderType ?? dataNode.orderType ?? selectedOrderType;
      const minAmt = matchInfo.minAmount ?? dataNode.minAmount ?? "1000";
      const maxAmt = matchInfo.maxAmount ?? dataNode.maxAmount ?? "2000";
      const bankVal = matchInfo.buyBankCode || dataNode.buyBankCode || "paytm";
      const lastMatch = matchInfo.lastMatchResult || dataNode.lastMatchResult || "NOT_MATCHED";

      // HTML থেকে নয়, সরাসরি রেসপন্স থেকে KYC ID নেওয়া
      let rawKyc = matchInfo.buyerKycId || dataNode.buyerKycId || extractKey(root, ["buyerKycId", "buyerKycld"]);
      const kycVal = rawKyc !== undefined && rawKyc !== null && String(rawKyc).trim() !== "" ? String(rawKyc) : "5844647";

      // ডুপ্লিকেট প্রতিরোধ
      const currentSignature = `${kycVal}_${minAmt}_${maxAmt}_${matchResult}`;

      console.log(`[Auto Buy Monitor] Match Result: ${matchResult} | Buyer KYC: ${kycVal}`);

      if (matchResult === "MATCHED") {
        if (currentSignature === lastMatchSignature) return;
        lastMatchSignature = currentSignature;

        setStatus("MATCH FOUND", "matched");
        showDetails({
          "Amount": minAmt === maxAmt ? `₹${minAmt}` : `₹${minAmt} - ₹${maxAmt}`,
          "Order Type": orderTypeVal === 1 ? "OTP-UPI" : "BANK",
          "Buyer KYC": kycVal,
          "Bank": bankVal,
          "Status": statusVal
        });
      } else {
        lastMatchSignature = currentSignature;
        setStatus("WAITING FOR MATCH", "waiting");
        showDetails({
          "Range": `₹${minAmt} - ₹${maxAmt}`,
          "Order Type": orderTypeVal === 1 ? "OTP-UPI" : "BANK",
          "Buyer KYC": kycVal,
          "Bank": bankVal,
          "Last Match": lastMatch,
          "Status": statusVal
        });
      }
    } catch (e) {
      console.error("[Auto Buy Monitor] Parsing error:", e);
      setStatus("INVALID JSON", "error");
    }
  }

  // নেটওয়ার্ক স্নিফিং (Fetch এবং XHR ইন্টারসেপ্ট)
  window.fetch = async function (...args) {
    const res = await originalFetch.apply(this, args);
    try {
      const url = typeof args[0] === "string" ? args[0] : (args[0] && args[0].url) || "";
      if (isMonitoring && url.includes("/ar-wallet/smartRangeBuy/match/start")) {
        const cloned = res.clone();
        cloned.json().then((json) => {
          parseMatchResponse(json);
        }).catch(() => {
          if (isMonitoring) setStatus("INVALID JSON", "error");
        });
      }
    } catch (err) {}
    return res;
  };

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this._monitoredUrl = url;
    return originalXhrOpen.apply(this, [method, url, ...rest]);
  };

  XMLHttpRequest.prototype.send = function (...args) {
    this.addEventListener("load", function () {
      try {
        if (isMonitoring && this._monitoredUrl && String(this._monitoredUrl).includes("/ar-wallet/smartRangeBuy/match/start")) {
          let json = null;
          if (this.responseType === "" || this.responseType === "text") {
            json = JSON.parse(this.responseText);
          } else if (this.responseType === "json") {
            json = this.response;
          }
          if (json) parseMatchResponse(json);
        }
      } catch (err) {}
    });
    return originalXhrSend.apply(this, args);
  };

  // স্টার্ট ও স্টপ বাটন কন্ট্রোল
  startBtn.addEventListener("click", () => {
    if (isMonitoring) return;
    isMonitoring = true;
    lastMatchSignature = "";

    showDetails(null);
    overlay.style.display = "flex";
    liveStatus.innerText = "INITIALIZING...";

    setTimeout(() => {
      liveStatus.innerText = "SYSTEM ACTIVE";
      setTimeout(() => {
        overlay.style.display = "none";
        setStatus("SYSTEM ACTIVE");
        setTimeout(() => {
          if (isMonitoring && statusEl.innerText === "SYSTEM ACTIVE") {
            setStatus("MONITORING...");
          }
        }, 700);
      }, 450);
    }, 400);

    console.log("[Auto Buy Monitor] Started. Waiting for match request...");
  });

  stopBtn.addEventListener("click", () => {
    isMonitoring = false;
    lastMatchSignature = "";
    overlay.style.display = "none";
    setStatus("STOPPED");
    showDetails(null);
    console.log("[Auto Buy Monitor] Stopped.");
  });

  console.log("[Auto Buy Monitor] Loaded successfully. Ready to monitor.");
})();
        

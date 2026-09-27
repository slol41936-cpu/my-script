(function () {
  // ১. ডুপ্লিকেট প্যানেল ও ওভারলে ক্লিনআপ
  const existingPanel = document.getElementById("cyberPanel");
  if (existingPanel) existingPanel.remove();
  const existingOverlay = document.getElementById("cyberOverlay");
  if (existingOverlay) existingOverlay.remove();
  const existingStyle = document.getElementById("cyberMonitorStyle");
  if (existingStyle) existingStyle.remove();

  // ২. সিএসএস ইনজেকশন (অরিজিনাল বেইজ/সফট সাইবার ডিজাইন)
  const styleEl = document.createElement("style");
  styleEl.id = "cyberMonitorStyle";
  styleEl.innerHTML = `
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
      background: rgba(222, 215, 205, 0.5);
      border-radius: 10px;
      padding: 8px 10px;
      font-size: 10px;
      color: #554e44;
      line-height: 1.4;
      display: none;
      border: 1px dashed #c5a059;
      word-break: break-all;
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
  document.head.appendChild(styleEl);

  // ৩. ওভারলে তৈরি
  const overlayEl = document.createElement("div");
  overlayEl.id = "cyberOverlay";
  overlayEl.style.cssText = `
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
  overlayEl.innerHTML = `
    <div id="overlay-status-container">
      <div id="overlay-live-status">INITIALIZING...</div>
      <h1 style="font-size:22px;letter-spacing:6px;margin:0;opacity:0.6;color:#554e44;">SYSTEM ACTIVE</h1>
    </div>
  `;
  document.body.appendChild(overlayEl);

  // ৪. মনিটর প্যানেল তৈরি
  const panelEl = document.createElement("div");
  panelEl.id = "cyberPanel";
  panelEl.innerHTML = `
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
        <label class="cyber-label">Amount</label> 
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
  document.body.appendChild(panelEl);

  // ৫. রেফারেন্স ও স্টেট ভ্যারিয়েবল
  const statusEl = document.getElementById("cyberStatus");
  const infoBoxEl = document.getElementById("cyberInfoBox");
  const liveStatusEl = document.getElementById("overlay-live-status");
  const startBtn = document.getElementById("startBtn");
  const stopBtn = document.getElementById("stopBtn");
  const amountInput = document.getElementById("buyAmount");
  const orderToggle = document.getElementById("orderTypeToggle");

  let isMonitoring = false;
  let selectedOrderType = 1;
  let lastProcessedMatchKey = "";

  // Original Network APIs Backup
  const nativeFetch = window.fetch;
  const nativeXhrOpen = XMLHttpRequest.prototype.open;
  const nativeXhrSend = XMLHttpRequest.prototype.send;

  // ইনপুট ভ্যালিডেশন (শুধু সংখ্যা)
  amountInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
  });

  // টগল হ্যান্ডলার
  orderToggle.querySelectorAll(".toggle-option").forEach((opt) => {
    opt.addEventListener("click", () => {
      orderToggle.querySelector(".active").classList.remove("active");
      opt.classList.add("active");
      selectedOrderType = Number(opt.dataset.value);
      console.log(`[Auto Buy Monitor] Filter mode changed to: ${selectedOrderType === 1 ? "UPI" : "BANK"}`);
    });
  });

  // স্ট্যাটাস বক্স আপডেট ফাংশন
  function setStatus(text, variant) {
    if (!statusEl) return;
    statusEl.innerText = text;
    if (variant === "matched") {
      statusEl.style.color = "#3d8573";
      statusEl.style.border = "1px solid rgba(61, 133, 115, 0.5)";
      statusEl.style.background = "#e0eee9";
    } else if (variant === "waiting") {
      statusEl.style.color = "#c5a059";
      statusEl.style.border = "1px solid rgba(197, 160, 89, 0.5)";
      statusEl.style.background = "#f7f2ea";
    } else if (variant === "error") {
      statusEl.style.color = "#ba5d58";
      statusEl.style.border = "1px solid rgba(186, 93, 88, 0.4)";
      statusEl.style.background = "#faeceb";
    } else {
      statusEl.style.color = "#7d7265";
      statusEl.style.border = "none";
      statusEl.style.background = "#ded7cd";
    }
  }

  // ডিটেইলস কার্ড রেন্ডার
  function renderDetails(details) {
    if (!infoBoxEl) return;
    if (!details) {
      infoBoxEl.style.display = "none";
      infoBoxEl.innerHTML = "";
      return;
    }

    infoBoxEl.style.display = "block";
    let rowsHtml = "";
    for (const [k, v] of Object.entries(details)) {
      rowsHtml += `
        <div class="cyber-info-row">
          <span>${k}:</span>
          <span>${v ?? "N/A"}</span>
        </div>
      `;
    }
    infoBoxEl.innerHTML = rowsHtml;
  }

  // ড্রেগ হ্যান্ডলার (মাউস এবং টাচ সাপোর্টেড)
  (function initDraggable() {
    const header = document.getElementById("cyberDragHeader");
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    function onPointerDown(e) {
      isDragging = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      startX = clientX - panelEl.offsetLeft;
      startY = clientY - panelEl.offsetTop;
      panelEl.style.transition = "none";
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const nextX = clientX - startX;
      const nextY = clientY - startY;

      panelEl.style.left = `${Math.max(10, Math.min(window.innerWidth - 290, nextX))}px`;
      panelEl.style.top = `${Math.max(10, Math.min(window.innerHeight - 350, nextY))}px`;
      panelEl.style.right = "auto";
      panelEl.style.bottom = "auto";
    }

    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;
      panelEl.style.transition = "box-shadow 0.3s ease";
    }

    header.addEventListener("mousedown", onPointerDown);
    document.addEventListener("mousemove", onPointerMove);
    document.addEventListener("mouseup", onPointerUp);

    header.addEventListener("touchstart", onPointerDown, { passive: true });
    document.addEventListener("touchmove", onPointerMove, { passive: true });
    document.addEventListener("touchend", onPointerUp);
  })();

  // রিকার্সিভ ডেটা ফাইন্ডার (যেকোনো নেস্টেড লেভেল থেকে প্যারামিটার রিড করবে)
  function findDeepValue(obj, keys) {
    if (!obj || typeof obj !== "object") return undefined;
    for (const key of keys) {
      if (key in obj && obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
        return obj[key];
      }
    }
    for (const prop of Object.keys(obj)) {
      if (typeof obj[prop] === "object") {
        const nested = findDeepValue(obj[prop], keys);
        if (nested !== undefined) return nested;
      }
    }
    return undefined;
  }

  // ম্যাচিং রেসপন্স ইন্টারসেপ্ট ও প্রসেসিং
  function processMatchResponse(json) {
    if (!isMonitoring) return;

    try {
      console.log("[Auto Buy Monitor] Match endpoint detected. Parsing response...");
      const root = json && typeof json === "object" ? json : null;
      if (!root) {
        setStatus("INVALID RESPONSE", "error");
        return;
      }

      const dataNode = root.data || root;

      // ১. ফিল্ড এক্সট্রাকশন (matchInfo অগ্রাধিকার পাবে)
      const matchInfo = dataNode.matchInfo || {};
      const matchResult = matchInfo.matchResult || dataNode.matchResult || matchInfo.status || dataNode.status || "UNKNOWN";
      const statusVal = matchInfo.status || dataNode.status || "COMPLETED";
      const orderTypeVal = matchInfo.orderType ?? dataNode.orderType ?? selectedOrderType;
      const minAmt = matchInfo.minAmount ?? dataNode.minAmount ?? "N/A";
      const maxAmt = matchInfo.maxAmount ?? dataNode.maxAmount ?? "N/A";
      const bankCode = matchInfo.buyBankCode || dataNode.buyBankCode || findDeepValue(root, ["buyBankCode", "bankCode"]) || "N/A";
      const lastMatch = matchInfo.lastMatchResult || dataNode.lastMatchResult || "NOT_MATCHED";

      // Buyer KYC ID এক্সট্রাকশন (DOM থেকে নয়, শুধুই রেসপন্স অবজেক্ট থেকে)
      let rawKyc = matchInfo.buyerKycId || dataNode.buyerKycId || findDeepValue(root, ["buyerKycId", "buyerKycld", "kycId", "buyerId"]);
      const buyerKyc = rawKyc !== undefined && rawKyc !== null && String(rawKyc).trim() !== "" ? String(rawKyc) : "KYC ID NOT AVAILABLE";

      // ২. ডুপ্লিকেট সনাক্তকরণ কি (Duplicate Prevention)
      const uniqueKey = `${buyerKyc}_${orderTypeVal}_${minAmt}_${maxAmt}_${matchResult}`;

      console.log(`[Auto Buy Monitor] Match Result: ${matchResult}`);
      console.log(`[Auto Buy Monitor] Buyer KYC: ${buyerKyc}`);

      // ৩. স্টেটাস ডিসপ্লে হ্যান্ডলিং
      if (String(matchResult).toUpperCase() === "MATCHED") {
        if (uniqueKey === lastProcessedMatchKey) {
          return; // একই অর্ডারের জন্য বারবার নোটিফিকেশন দেবে না
        }
        lastProcessedMatchKey = uniqueKey;

        setStatus("MATCH FOUND", "matched");
        renderDetails({
          "Amount": minAmt === maxAmt ? `₹${minAmt}` : `₹${minAmt} - ₹${maxAmt}`,
          "Order Type": orderTypeVal,
          "Buyer KYC": buyerKyc,
          "Bank": bankCode,
          "Status": statusVal
        });
      } else {
        lastProcessedMatchKey = uniqueKey;
        setStatus("WAITING FOR MATCH", "waiting");
        renderDetails({
          "Range": `₹${minAmt} - ₹${maxAmt}`,
          "Order Type": orderTypeVal,
          "Buyer KYC": buyerKyc,
          "Bank": bankCode,
          "Last Match": lastMatch,
          "Status": statusVal
        });
      }
    } catch (err) {
      console.error("[Auto Buy Monitor] Parse Error:", err);
      setStatus("INVALID JSON", "error");
    }
  }

  // ৬. নেটওয়ার্ক প্যাচিং (Fetch + XMLHttpRequest Interception)
  function startNetworkSniffer() {
    // Monkeypatch window.fetch
    window.fetch = async function (...args) {
      const response = await nativeFetch.apply(this, args);
      try {
        const url = typeof args[0] === "string" ? args[0] : (args[0] && args[0].url) || "";
        if (isMonitoring && url.includes("/ar-wallet/smartRangeBuy/match/start")) {
          const clone = response.clone();
          clone.json().then((json) => {
            processMatchResponse(json);
          }).catch(() => {
            if (isMonitoring) setStatus("INVALID JSON", "error");
          });
        }
      } catch (e) {
        // সাইটের স্বাভাবিক কার্যক্রম যাতে বিঘ্নিত না হয়
      }
      return response;
    };

    // Monkeypatch XMLHttpRequest
    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
      this._monitorUrl = url;
      return nativeXhrOpen.apply(this, [method, url, ...rest]);
    };

    XMLHttpRequest.prototype.send = function (...args) {
      this.addEventListener("load", function () {
        try {
          if (isMonitoring && this._monitorUrl && String(this._monitorUrl).includes("/ar-wallet/smartRangeBuy/match/start")) {
            let parsed = null;
            if (this.responseType === "" || this.responseType === "text") {
              parsed = JSON.parse(this.responseText);
            } else if (this.responseType === "json") {
              parsed = this.response;
            }
            if (parsed) {
              processMatchResponse(parsed);
            }
          }
        } catch (e) {
          // সাইলেন্ট হ্যান্ডলিং
        }
      });
      return nativeXhrSend.apply(this, args);
    };
  }

  function stopNetworkSniffer() {
    // অরিজিনাল মেথড রিস্টোর
    window.fetch = nativeFetch;
    XMLHttpRequest.prototype.open = nativeXhrOpen;
    XMLHttpRequest.prototype.send = nativeXhrSend;
  }

  // নেটওয়ার্ক স্নিফার আরম্ভ
  startNetworkSniffer();

  // ৭. কন্ট্রোল বাটন ইভেন্ট হ্যান্ডলার্স
  startBtn.addEventListener("click", () => {
    if (isMonitoring) return;
    isMonitoring = true;
    lastProcessedMatchKey = "";

    renderDetails(null);
    overlayEl.style.display = "flex";
    liveStatusEl.innerText = "INITIALIZING...";

    setTimeout(() => {
      liveStatusEl.innerText = "SYSTEM ACTIVE";
      setTimeout(() => {
        overlayEl.style.display = "none";
        setStatus("SYSTEM ACTIVE");
        setTimeout(() => {
          if (isMonitoring && statusEl.innerText === "SYSTEM ACTIVE") {
            setStatus("MONITORING...");
          }
        }, 800);
      }, 500);
    }, 400);

    console.log("[Auto Buy Monitor] Started. Actively listening to network responses...");
  });

  stopBtn.addEventListener("click", () => {
    isMonitoring = false;
    lastProcessedMatchKey = "";
    overlayEl.style.display = "none";
    setStatus("STOPPED");
    renderDetails(null);
    console.log("[Auto Buy Monitor] Stopped.");
  });

  console.log("[Auto Buy Monitor] Initialized in Read-Only mode. Ready.");
})();
        

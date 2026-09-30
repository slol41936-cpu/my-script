(async function () {
  // ১. ডুপ্লিকেট এলিমেন্ট ক্লিনআপ
  const oldPanel = document.getElementById("cyberPanel");
  if (oldPanel) oldPanel.remove();
  const oldOverlay = document.getElementById("cyberOverlay");
  if (oldOverlay) oldOverlay.remove();
  const oldStyle = document.getElementById("cyberStyle");
  if (oldStyle) oldStyle.remove();

  // ২. আপনার অরিজিনাল বেইজ ডিজাইন সিএসএস
  const styleEl = document.createElement("style");
  styleEl.id = "cyberStyle";
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
      color: #ba5d58;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      box-shadow: inset 1px 2px 3px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(255, 255, 255, 0.9);
      transition: all 0.3s ease;
      box-sizing: border-box;
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

  // ৩. ওভারলে
  let overlayEl = document.createElement("div");
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

  // ৪. প্যানেল এইচটিএমএল
  let panelEl = document.createElement("div");
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
          oninput="this.value=this.value.replace(/[^0-9]/g,'')"
        > 
      </div>

      <div class="cyber-buttons"> 
        <button id="startBtn" class="cyber-btn start-btn">START</button> 
        <button id="stopBtn" class="cyber-btn stop-btn">STOP</button> 
      </div> 

      <div class="cyber-status" id="cyberStatus">Ready</div> 
    </div>
  `;
  document.body.appendChild(panelEl);

  const statusEl = document.getElementById("cyberStatus");
  const liveStatusEl = document.getElementById("overlay-live-status");
  const startBtn = document.getElementById("startBtn");
  const stopBtn = document.getElementById("stopBtn");
  const amountInput = document.getElementById("buyAmount");
  const orderToggle = document.getElementById("orderTypeToggle");

  let isRunning = false;
  let selectedOrderType = 1;

  orderToggle.querySelectorAll(".toggle-option").forEach((opt) => {
    opt.onclick = () => {
      orderToggle.querySelector(".active").classList.remove("active");
      opt.classList.add("active");
      selectedOrderType = Number(opt.dataset.value);
    };
  });

  function logStatus(msg) {
    console.log("[AutoBuy]", msg);
    if (!statusEl) return;
    statusEl.innerText = msg;
    const isErr = /error|stopped|failed|denied|🔴/i.test(msg);
    const isOk = /success|matched|locked|🟢/i.test(msg);
    statusEl.style.color = isErr ? "#ba5d58" : isOk ? "#3d8573" : "#7d7265";
    statusEl.style.border = isErr
      ? "1px solid rgba(186, 93, 88, 0.4)"
      : isOk
      ? "1px solid rgba(61, 133, 115, 0.4)"
      : "none";
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ৫. টোকেন ও সেশন এক্সট্রাক্ট
  let authToken = "";
  try {
    const rawToken = localStorage.getItem("token");
    if (rawToken) {
      try {
        authToken = JSON.parse(rawToken)?.value || rawToken;
      } catch {
        authToken = rawToken;
      }
    }
  } catch (e) {}

  if (!authToken) {
    logStatus("Token not found. Please log in.");
    return;
  }

  const deviceCode = localStorage.getItem("arb_device_code") || crypto.randomUUID().replace(/-/g, "");
  localStorage.setItem("arb_device_code", deviceCode);

  // লগের সাথে শতভাগ মেলানো রিকোয়েস্ট হেডার
  const apiHeaders = {
    accept: "application/json, text/plain, */*",
    "content-type": "application/json",
    authorization: "Bearer " + authToken,
    deviceId: "undefined",
    deviceType: "3",
    page: "Arb",
    language: "1",
    memberId: "22801760",
    deviceCode: deviceCode
  };

  // ৬. ড্র্যাগ হ্যান্ডলার
  (function initDraggable() {
    const header = document.getElementById("cyberDragHeader");
    let isDragging = false;
    let startX = 0, startY = 0;

    function onStart(e) {
      isDragging = true;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      startX = x - panelEl.offsetLeft;
      startY = y - panelEl.offsetTop;
      panelEl.style.transition = "none";
    }

    function onMove(e) {
      if (!isDragging) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      panelEl.style.left = `${Math.max(10, Math.min(window.innerWidth - 290, x - startX))}px`;
      panelEl.style.top = `${Math.max(10, Math.min(window.innerHeight - 320, y - startY))}px`;
      panelEl.style.right = "auto";
      panelEl.style.bottom = "auto";
    }

    function onEnd() {
      isDragging = false;
      panelEl.style.transition = "box-shadow 0.3s ease";
    }

    header.addEventListener("mousedown", onStart);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onEnd);
    header.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchmove", onMove, { passive: true });
    document.addEventListener("touchend", onEnd);
  })();

  // ৭. আসল অটো-ম্যাচ ও লক এক্সিকিউটর (Auto-Buy Engine)
  async function runAutoBuyEngine(targetAmount, orderType) {
    const baseUrl = "https://apiweb.payapiar.com";
    
    // আপনার লগে প্রাপ্ত সঠিক ব্যাংক ও কেওয়াইসি প্যারামিটার
    const bankCode = orderType === 1 ? "paytm" : "moneyView";
    const kycId = orderType === 1 ? "5844647" : "5265767";

    // সার্ভারের নতুন রেঞ্জ স্লট সেটআপ (১২১৪ এরর প্রতিরোধ করতে)
    let minAmt = targetAmount;
    let maxAmt = targetAmount <= 1000 ? 2000 : targetAmount * 2;

    while (isRunning) {
      try {
        logStatus(`Scanning ₹${targetAmount}...`);

        // ধাপ ১: ম্যাচিং পুলে রিকোয়েস্ট পাঠানো
        const startRes = await fetch(`${baseUrl}/ar-wallet/smartRangeBuy/match/start`, {
          method: "POST",
          headers: apiHeaders,
          body: JSON.stringify({
            minAmount: minAmt,
            maxAmount: maxAmt,
            orderType: orderType,
            buyBankCode: bankCode,
            buyerKycId: kycId
          })
        });

        const startData = await startRes.json();

        if (startData?.code === "1") {
          // ধাপ ২: ম্যাচ রেজাল্ট চেক ও লক করা
          let checks = 0;
          while (isRunning && checks < 8) {
            checks++;
            const listRes = await fetch(`${baseUrl}/ar-wallet/smartRangeBuy/scene/list`, {
              method: "POST",
              headers: apiHeaders,
              body: JSON.stringify({ orderType: orderType })
            });

            const listData = await listRes.json();
            const resData = listData?.data;

            // যদি অর্ডার ম্যাচ হয়ে যায়
            if (
              resData?.matchResult === "MATCHED" || 
              resData?.status === "COMPLETED" || 
              resData?.pendingOrder
            ) {
              const matchedOrder = 
                resData?.pendingOrder?.platformOrder || 
                resData?.lastMatchResult?.platformOrder;

              logStatus("🟢 ORDER MATCHED! LOCKING...");

              // স্বয়ংক্রিয়ভাবে ক্যাশিয়ার/পেমেন্ট পেজে প্রবেশ
              if (matchedOrder) {
                location.href = `${location.origin}/#/order/cashier?platformOrder=${matchedOrder}`;
              } else {
                location.reload();
              }
              return;
            }

            logStatus(`Matching... (${checks})`);
            await sleep(250);
          }
        } else {
          // যদি রেঞ্জ অ্যাডজাস্টমেন্ট লাগে
          logStatus(startData?.msg || "Retrying...");
        }

        await sleep(150);
      } catch (err) {
        logStatus("Network Sync Error");
        await sleep(400);
      }
    }
  }

  // বাটন ইভেন্ট
  startBtn.onclick = () => {
    if (isRunning) return;
    const amountVal = Number(amountInput.value);
    if (!amountVal) {
      logStatus("Enter amount");
      return;
    }

    isRunning = true;
    overlayEl.style.display = "flex";
    liveStatusEl.innerText = "INITIALIZING...";

    setTimeout(() => {
      liveStatusEl.innerText = "SYSTEM ACTIVE";
      setTimeout(() => {
        overlayEl.style.display = "none";
        logStatus(`🟢 Running | ₹${amountVal}`);
        runAutoBuyEngine(amountVal, selectedOrderType);
      }, 400);
    }, 400);
  };

  stopBtn.onclick = () => {
    isRunning = false;
    overlayEl.style.display = "none";
    logStatus("🔴 Stopped");
  };

  logStatus("Ready");
})();
        

(async function () {
  // ১. ডুপ্লিকেট প্যানেল ও ওভারলে ক্লিনআপ
  const oldPanel = document.getElementById("cyberPanel");
  if (oldPanel) oldPanel.remove();
  const oldOverlay = document.getElementById("cyberOverlay");
  if (oldOverlay) oldOverlay.remove();
  const oldStyle = document.getElementById("cyberStyle");
  if (oldStyle) oldStyle.remove();

  // ২. সিএসএস ইনজেকশন (অরিজিনাল বেইজ সাইবার ডিজাইন)
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
      font-size: 20px;
      color: #509796;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 5px;
      text-shadow: 0 0 12px rgba(80, 151, 150, 0.6);
      font-weight: 800;
      text-align: center;
      padding: 0 20px;
    }
  `;
  document.head.appendChild(styleEl);

  // ৩. ব্লার ওভারলে (ডিফল্ট বন্ধ থাকবে)
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

  // ৪. প্যানেল এইচটিএমএল সরাসরি রেন্ডার
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
        <label class="cyber-label">Exact Amount</label> 
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

      <div class="cyber-status" id="cyberStatus">Checking Access...</div> 
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
  let isPremiumUser = false;
  let isAccessGranted = false;
  let syncInterval = null;

  orderToggle.querySelectorAll(".toggle-option").forEach((opt) => {
    opt.onclick = () => {
      orderToggle.querySelector(".active").classList.remove("active");
      opt.classList.add("active");
      selectedOrderType = Number(opt.dataset.value);
    };
  });

  function logStatus(msg) {
    console.log("[AutoBuy]", msg);
    const isErr = /error|stopped|failed|denied|ignored|⚠️|🔴/i.test(msg);
    const isOk = /success|matched|locked|🟢/i.test(msg);

    if (statusEl) {
      statusEl.innerText = msg;
      statusEl.style.color = isErr ? "#ba5d58" : isOk ? "#3d8573" : "#7d7265";
      statusEl.style.border = isErr
        ? "1px solid rgba(186, 93, 88, 0.4)"
        : isOk
        ? "1px solid rgba(61, 133, 115, 0.4)"
        : "none";
    }

    if (liveStatusEl) {
      liveStatusEl.innerText = msg;
      liveStatusEl.style.color = isErr ? "#ba5d58" : isOk ? "#3d8573" : "#509796";
      liveStatusEl.style.textShadow = isErr 
        ? "0 0 12px rgba(186, 93, 88, 0.6)" 
        : isOk 
        ? "0 0 12px rgba(61, 133, 115, 0.6)" 
        : "0 0 12px rgba(80, 151, 150, 0.6)";
    }
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ড্র্যাগ কন্ট্রোল
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

  // ৫. ফায়ারবেস স্ক্রিপ্ট লোডার ও মেম্বার ভ্যালিডেশন
  async function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async function initFirebaseAndAuth() {
    try {
      if (!window.firebase) {
        await loadScript("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
        await loadScript("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js");
      }

      if (!firebase.apps.length) {
        firebase.initializeApp({
          apiKey: "AIzaSyByR2NzGNdIPU0994a7dL9E3X6MM3rV1AE",
          authDomain: "my-ar-automation.firebaseapp.com",
          projectId: "my-ar-automation",
          storageBucket: "my-ar-automation.firebasestorage.app",
          messagingSenderId: "443374813761",
          appId: "1:443374813761:web:3f5142f684c6fe26123cc0"
        });
      }

      const localData = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const memberId = localData?.value?.memberId || localData?.value?.memberld || localData?.memberId;
      if (!memberId) {
        logStatus("User not found");
        return;
      }

      const snapshot = await firebase.firestore().collection("members")
        .where("walletUserId", "==", String(memberId))
        .where("active", "==", true)
        .limit(1)
        .get();

      if (snapshot.empty) {
        logStatus("Access denied");
        startBtn.disabled = true;
        startBtn.style.opacity = "0.5";
        return;
      }

      const docData = snapshot.docs[0].data();
      isAccessGranted = true;
      isPremiumUser = docData.is_premium === true;
      logStatus("Ready");

      // ব্যালেন্স সিঙ্ক
      syncBalance();
      if (!syncInterval) syncInterval = setInterval(syncBalance, 15000);

    } catch (e) {
      console.error(e);
      logStatus("Firebase Error");
    }
  }

  // ব্যালেন্স সিঙ্ক ফাংশন
  async function syncBalance() {
    try {
      const localData = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const memberId = localData?.value?.memberId || localData?.value?.memberld;
      const currentBal = localData?.balance ?? localData?.value?.balance;
      if (!memberId || currentBal === undefined || currentBal === null) return;

      const db = firebase.firestore();
      const snap = await db.collection("members").where("walletUserId", "==", String(memberId)).limit(1).get();
      if (snap.empty) return;

      const doc = snap.docs[0];
      const prevBal = Number(doc.data().balance ?? 0);
      const newBal = Number(currentBal);
      if (prevBal === newBal) return;

      const diff = newBal - prevBal;
      await db.collection("transactions").add({
        walletUserId: String(memberId),
        previousBalance: prevBal,
        updatedBalance: newBal,
        amount: Math.abs(diff),
        type: diff > 0 ? "credit" : "debit",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      await db.collection("members").doc(doc.id).update({
        balance: newBal,
        balanceUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (e) {}
  }

  // ব্যাকগ্রাউন্ডে সিকিউরিটি চেক কল
  initFirebaseAndAuth();

  // লোকাল টোকেন ও হেডার প্রস্তুতি
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

  const deviceCode = localStorage.getItem("arb_device_code") || crypto.randomUUID().replace(/-/g, "");
  localStorage.setItem("arb_device_code", deviceCode);

  const localUserInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const dynMemberId = String(localUserInfo?.value?.memberId || localUserInfo?.value?.memberld || "22801760");

  const apiHeaders = {
    accept: "application/json, text/plain, */*",
    "content-type": "application/json",
    authorization: "Bearer " + authToken,
    deviceId: "undefined",
    deviceType: "3",
    page: "Arb",
    language: "1",
    memberId: dynMemberId,
    deviceCode: deviceCode
  };

  // স্ট্রিক্ট অ্যামাউন্ট রিডার
  function getActualMatchedAmount(dataObj) {
    if (!dataObj || typeof dataObj !== "object") return null;
    const targetVal = 
      dataObj.buyResult?.amount || 
      dataObj.buyResult?.buyAmount || 
      dataObj.pendingOrder?.amount || 
      dataObj.pendingOrder?.buyAmount || 
      dataObj.lastMatchResult?.amount || 
      dataObj.amount;

    if (targetVal !== undefined && targetVal !== null && targetVal !== "") {
      const parsed = Math.round(parseFloat(targetVal));
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return null;
  }

  // ক্যানসেল হ্যান্ডলার
  async function forceCancelOrder(baseUrl, orderNo, orderType) {
    try {
      if (orderNo) {
        await fetch(`${baseUrl}/ar-wallet/buyCenter/cancelBuyOrder`, {
          method: "POST",
          headers: apiHeaders,
          body: JSON.stringify({ buyOrderNo: orderNo })
        });
      }
      await fetch(`${baseUrl}/ar-wallet/smartRangeBuy/match/cancel`, {
        method: "POST",
        headers: apiHeaders,
        body: JSON.stringify({ orderType: orderType })
      });
    } catch (e) {}
  }

  // অটো-বাই ইঞ্জিন
  async function runAutoBuyEngine(targetAmount, orderType) {
    const baseUrl = "https://apiweb.payapiar.com";
    const bankCode = orderType === 1 ? "paytm" : "moneyView";
    const kycId = orderType === 1 ? "5844647" : "5265767";

    const minAmt = targetAmount;
    const maxAmt = targetAmount;

    while (isRunning) {
      try {
        logStatus(`Scanning ₹${targetAmount}...`);

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

        if (startData?.code === "1214") {
          await sleep(500);
        } else if (startData?.code === "1083") {
          logStatus("Rate limited. Pausing 2s...");
          await sleep(2000);
          continue;
        }

        if (startData?.code === "1") {
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

            if (listData?.code === "1083") {
              await sleep(1500);
              continue;
            }

            if (
              resData?.matchResult === "MATCHED" || 
              resData?.status === "COMPLETED" || 
              resData?.buyResult || 
              resData?.pendingOrder
            ) {
              const matchedAmount = getActualMatchedAmount(resData);
              const buyOrderNo = resData?.buyResult?.buyOrderNo || resData?.pendingOrder?.buyOrderNo;
              const platformOrder = resData?.buyResult?.platformOrder || resData?.pendingOrder?.platformOrder;

              // ফিল্টারিং: অন্য অ্যামাউন্ট হলে ক্যানসেল
              if (matchedAmount && matchedAmount !== targetAmount) {
                logStatus(`⚠️ Ignored ₹${matchedAmount} (Not ₹${targetAmount})`);
                await forceCancelOrder(baseUrl, buyOrderNo, orderType);
                await sleep(600);
                break;
              }

              // সঠিক অ্যামাউন্ট হলে ক্যাশিয়ারে নেওয়া
              if (matchedAmount === targetAmount) {
                logStatus(`🟢 LOCKED EXACT ₹${targetAmount}!`);
                const finalOrder = platformOrder || buyOrderNo;
                if (finalOrder) {
                  location.href = `${location.origin}/#/order/cashier?platformOrder=${finalOrder}`;
                } else {
                  location.reload();
                }
                return;
              }

              if (!matchedAmount) {
                logStatus("⚠️ Checking Amount...");
                await sleep(300);
              }
            }

            logStatus(`Matching (${checks})...`);
            await sleep(280);
          }
        } else {
          logStatus(startData?.msg || "Retrying...");
        }

        await sleep(350);
      } catch (err) {
        logStatus("Network Sync Error");
        await sleep(600);
      }
    }
  }

  // বাটন কন্ট্রোল
  startBtn.onclick = () => {
    if (!isAccessGranted) {
      logStatus("Access denied");
      return;
    }
    if (isRunning) return;
    const amountVal = Number(amountInput.value);
    if (!amountVal) {
      logStatus("Enter amount");
      return;
    }

    isRunning = true;
    overlayEl.style.display = "flex";
    logStatus("INITIALIZING...");

    setTimeout(() => {
      logStatus(`🟢 Targe

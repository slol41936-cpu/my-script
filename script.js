(async function () {
  // ===== সেটিংস =====
  const API = "https://apiweb.apiarbpay.com/ar-wallet/";
  const BANK_CODE = "moneyView";   // যে বাউন্ড ব্যাংক দিয়ে কিনবেন (bankCode)
  const LOOP_DELAY = 250;          // ms, প্রতিটি match/start এর মাঝে বিরতি (১৫০ এর নিচে নামাবেন না)
  const ERROR_DELAY = 800;         // ms, error হলে অপেক্ষা
  const MAX_ERRORS = 8;            // পরপর এতবার error হলে নিজে থেমে যাবে
  const AUTO_RELOAD = true;        // ম্যাচ হলে পেজ রিলোড করে পেমেন্ট পেজে নিয়ে যাবে

  // ===== স্টাইল =====
  if (!document.getElementById("cyberStyle")) {
    const st = document.createElement("style");
    st.id = "cyberStyle";
    st.innerHTML = `
    #cyberPanel{position:fixed;right:20px;bottom:20px;width:280px;z-index:999999;background:#f0ebe4;border-radius:22px;
      box-shadow:0 20px 45px rgba(0,0,0,.25),0 8px 16px rgba(0,0,0,.15),inset 0 1px 1px rgba(255,255,255,.9);
      border:1px solid rgba(255,255,255,.8);overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;user-select:none;touch-action:none}
    .cyber-header{padding:10px 14px 4px;display:flex;align-items:center;gap:8px;cursor:move}
    .cyber-header-badge{width:26px;height:26px;background:radial-gradient(circle at 35% 35%,#ebd7b7,#bfa37b,#8a704c);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px}
    .cyber-header-title{color:#7d7265;font-size:11px;letter-spacing:.8px;font-weight:800;text-transform:uppercase}
    .cyber-body{padding:8px 14px 14px;display:flex;flex-direction:column;gap:8px}
    .cyber-label{color:#9d9489;font-size:10px;font-weight:700;margin-bottom:2px;display:block;text-transform:uppercase;letter-spacing:.5px}
    .toggle-container{display:grid;grid-template-columns:1.2fr 1fr;gap:6px}
    .toggle-option{padding:7px 0;text-align:center;border-radius:10px;font-size:11px;font-weight:700;cursor:pointer;background:#ded7ce;color:#8c8378}
    .toggle-option.active{background:#509796;color:#fff;box-shadow:0 0 0 1.5px rgba(226,177,89,.9),0 4px 10px rgba(80,151,150,.4)}
    .range-row{display:grid;grid-template-columns:1fr 1fr;gap:6px}
    .cyber-input{width:100%;box-sizing:border-box;height:36px;padding:0 10px;border-radius:10px;border:1px solid rgba(0,0,0,.04);background:#ebe4dc;color:#554e44;font-size:13px;font-weight:700;outline:none}
    .cyber-buttons{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .cyber-btn{height:34px;border:none;border-radius:17px;cursor:pointer;font-size:11px;font-weight:800;text-transform:uppercase}
    .start-btn{background:#54748b;color:#fff;border:1.2px solid #d1b480}
    .stop-btn{background:#b55e65;color:#ffd2d5}
    .cyber-status{background:#ded7cd;border-radius:10px;min-height:34px;display:flex;align-items:center;justify-content:center;text-align:center;color:#ba5d58;font-size:11px;font-weight:700;text-transform:uppercase;padding:4px}
    #overlay-status-container{display:flex;flex-direction:column;align-items:center;gap:15px}
    #overlay-live-status{font-size:18px;color:#509796;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:5px;text-align:center;padding:0 10px}
    `;
    document.head.appendChild(st);
  }

  // ===== ওভারলে =====
  let overlay = document.getElementById("cyberOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "cyberOverlay";
    overlay.style.cssText =
      "position:fixed;inset:0;background:rgba(235,230,222,.88);backdrop-filter:blur(8px);z-index:999998;display:none;align-items:center;justify-content:center;color:#7d7265;font-family:Arial,sans-serif;";
    overlay.innerHTML = `<div id="overlay-status-container">
      <div id="overlay-live-status">INITIALIZING...</div>
      <h1 style="font-size:22px;letter-spacing:6px;margin:0;opacity:.6;color:#554e44;">SYSTEM ACTIVE</h1></div>`;
    document.body.appendChild(overlay);
  }
  const liveStatus = document.getElementById("overlay-live-status");

  // ===== প্যানেল =====
  let panel = document.getElementById("cyberPanel");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "cyberPanel";
    panel.innerHTML = `
      <div class="cyber-header"><div class="cyber-header-badge">⚡</div><div class="cyber-header-title">⚡ SMART RANGE BUY</div></div>
      <div class="cyber-body">
        <div><label class="cyber-label">Payment Type</label>
          <div class="toggle-container" id="orderTypeToggle">
            <div class="toggle-option active" data-value="1">UPI</div>
            <div class="toggle-option" data-value="2">BANK</div>
          </div></div>
        <div><label class="cyber-label">Amount Range (Min - Max)</label>
          <div class="range-row">
            <input type="text" inputmode="numeric" id="minAmount" class="cyber-input" value="1000">
            <input type="text" inputmode="numeric" id="maxAmount" class="cyber-input" value="1499">
          </div></div>
        <div class="cyber-buttons">
          <button id="startBtn" class="cyber-btn start-btn">START</button>
          <button id="stopBtn" class="cyber-btn stop-btn">STOP</button>
        </div>
        <div class="cyber-status" id="cyberStatus">Ready</div>
      </div>`;
    document.body.appendChild(panel);
  }
  const statusEl = document.getElementById("cyberStatus");
  const startBtn = document.getElementById("startBtn");
  const stopBtn = document.getElementById("stopBtn");
  const minEl = document.getElementById("minAmount");
  const maxEl = document.getElementById("maxAmount");
  const toggleEl = document.getElementById("orderTypeToggle");

  [minEl, maxEl].forEach((el) =>
    el.addEventListener("input", () => (el.value = el.value.replace(/[^0-9]/g, "")))
  );

  let running = false;
  let orderType = 1;
  let isPremium = false;
  let balanceTimer = null;

  toggleEl.querySelectorAll(".toggle-option").forEach((el) => {
    el.onclick = () => {
      toggleEl.querySelector(".active").classList.remove("active");
      el.classList.add("active");
      orderType = Number(el.dataset.value);
    };
  });

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function setStatus(msg) {
    console.log(msg);
    const bad = /denied|not found|Error|Stopped|🔴/i.test(msg);
    const good = /SUCCESS|MATCHED|🟢/i.test(msg);
    if (statusEl) {
      statusEl.innerText = msg;
      statusEl.style.color = bad ? "#ba5d58" : good ? "#3d8573" : "#7d7265";
    }
    if (liveStatus) {
      liveStatus.innerText = msg;
      liveStatus.style.color = bad ? "#ba5d58" : "#3d8573";
    }
  }

  function loadScript(src) {
    return new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = res;
      s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  // ===== Firebase =====
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

  // ===== ইউজার তথ্য =====
  function getUserInfo() {
    try {
      return JSON.parse(localStorage.getItem("userInfo"));
    } catch {
      return null;
    }
  }
  function getMemberId() {
    const u = getUserInfo();
    return u?.value?.memberId || u?.value?.memberld || "";
  }

  async function checkAccess() {
    try {
      const id = getMemberId();
      if (!id) return { allowed: false, isPremium: false };
      const snap = await firebase
        .firestore()
        .collection("members")
        .where("walletUserId", "==", String(id))
        .where("active", "==", true)
        .limit(1)
        .get();
      if (snap.empty) return { allowed: false, isPremium: false };
      return { allowed: true, isPremium: snap.docs[0].data().is_premium === true };
    } catch (e) {
      console.log(e);
      return { allowed: false, isPremium: false };
    }
  }

  async function syncBalance() {
    try {
      const u = getUserInfo();
      const id = getMemberId();
      const bal = u?.balance ?? u?.value?.balance;
      if (!id || bal === undefined || bal === null) return;
      const db = firebase.firestore();
      const snap = await db.collection("members").where("walletUserId", "==", String(id)).limit(1).get();
      if (snap.empty) return;
      const doc = snap.docs[0];
      const oldBal = Number(doc.data().balance ?? 0);
      const newBal = Number(bal);
      if (oldBal === newBal) return;
      const diff = newBal - oldBal;
      await db.collection("transactions").add({
        walletUserId: String(id),
        previousBalance: oldBal,
        updatedBalance: newBal,
        amount: Math.abs(diff),
        type: diff > 0 ? "credit" : "debit",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      await db.collection("members").doc(doc.id).update({
        balance: newBal,
        balanceUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (e) {
      console.error("Balance sync error:", e);
    }
  }

  const access = await checkAccess();
  isPremium = access.isPremium;
  if (!balanceTimer) {
    syncBalance();
    balanceTimer = setInterval(syncBalance, 15000);
  }
  if (!access.allowed) {
    setStatus("Access denied");
    return;
  }

  function updateStartState() {
    const blocked = !isPremium && Number(minEl.value) < 1000;
    startBtn.disabled = blocked;
    startBtn.style.opacity = blocked ? "0.5" : "1";
    startBtn.style.cursor = blocked ? "not-allowed" : "pointer";
  }
  if (!isPremium) minEl.value = "1000";
  minEl.addEventListener("input", updateStartState);
  updateStartState();

  // ===== টোকেন ও হেডার =====
  let token = null;
  const rawToken = localStorage.getItem("token");
  if (rawToken) {
    try {
      token = JSON.parse(rawToken)?.value || rawToken;
    } catch {
      token = rawToken;
    }
  }
  if (!token && window.token?.value) token = window.token.value;
  if (!token) {
    setStatus("Token not found");
    return;
  }

  const deviceCode = localStorage.getItem("arb_device_code") || crypto.randomUUID().replace(/-/g, "");
  localStorage.setItem("arb_device_code", deviceCode);

  const headers = {
    accept: "application/json, text/plain, */*",
    "content-type": "application/json",
    authorization: "Bearer " + token,
    deviceId: "undefined",
    deviceType: "3",
    page: "Arb",
    language: "1",
    memberId: String(getMemberId()),
    deviceCode: deviceCode
  };

  async function post(endpoint, body) {
    const res = await fetch(API + endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });
    return res.json();
  }

  // বাউন্ড ব্যাংক থেকে buyerKycId (id) খুঁজে বের করে
  async function getKycId(min, max, type) {
    const r = await post("kycCenter/getBanks/bankListAndBoundListForQuick", {
      sourceType: 2,
      type: type,
      minAmount: min,
      maxAmount: max
    });
    const bound = r?.data?.boundBanks || [];
    const hit = bound.find((b) => b.bankCode === BANK_CODE);
    if (!hit) {
      throw new Error(
        "Bank not found: " + BANK_CODE + " (available: " + bound.map((b) => b.bankCode).join(", ") + ")"
      );
    }
    return hit.id;
  }

  function findOrder(obj, depth) {
    if (!obj || typeof obj !== "object" || depth > 5) return null;
    if (obj.platformOrder) return obj.platformOrder;
    for (const k of Object.keys(obj)) {
      const v = findOrder(obj[k], depth + 1);
      if (v) return v;
    }
    return null;
  }

  function alarm() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [0, 0.3, 0.6].forEach((t) => {
        const o = ctx.createOscillator();
        o.connect(ctx.destination);
        o.frequency.value = 880;
        o.start(ctx.currentTime + t);
        o.stop(ctx.currentTime + t + 0.2);
      });
    } catch {}
    try {
      navigator.vibrate && navigator.vibrate([300, 150, 300, 150, 300]);
    } catch {}
  }

  // সার্ভার অর্ডার ম্যাচ করলে true
  function isMatched(d) {
    if (!d) return false;
    if (d.matchResult && d.matchResult !== "NOT_MATCHED") return true;
    if (d.buyResult || d.pendingOrder) return true;
    return false;
  }

  // ===== মূল লুপ =====
  async function mainLoop(min, max, type, kycId) {
    let tries = 0;
    let errors = 0;
    while (running) {
      try {
        const r = await post("smartRangeBuy/match/start", {
          maxAmount: max,
          minAmount: min,
          orderType: type,
          buyBankCode: BANK_CODE,
          buyerKycId: kycId
        });
        tries++;

        if (r.code !== "1") {
          errors++;
          setStatus("Error " + r.code + ": " + (r.msg || ""));
          if (errors >= MAX_ERRORS) {
            running = false;
            overlay.style.display = "none";
            setStatus("Error: too many failures, stopped");
            return;
          }
          await sleep(ERROR_DELAY);
          continue;
        }
        errors = 0;

        const d = r.data || {};
        if (isMatched(d)) {
          running = false;
          console.log("MATCH RESPONSE:", JSON.stringify(r));
          const order = findOrder(d, 0);
          alarm();
          setStatus("🟢 MATCHED " + (order || "") + " | result: " + d.matchResult);
          overlay.style.display = "none";
          if (AUTO_RELOAD) {
            await sleep(1000);
            location.reload();
          }
          return;
        }

        setStatus("Searching ₹" + min + "-" + max + " | #" + tries + " " + (d.matchInfo?.status || ""));
        await sleep(LOOP_DELAY);
      } catch (e) {
        console.error(e);
        errors++;
        setStatus("Error. Retrying...");
        if (errors >= MAX_ERRORS) {
          running = false;
          overlay.style.display = "none";
          setStatus("Error: network failures, stopped");
          return;
        }
        await sleep(ERROR_DELAY);
      }
    }
  }

  startBtn.onclick = async () => {
    if (running) return;
    const min = Number(minEl.value);
    const max = Number(maxEl.value);
    if (!min || !max) return setStatus("Enter amount range");
    if (min > max) return setStatus("Error: min is greater than max");
    if (!isPremium && min < 1000) return setStatus("Minimum order value is 1000");

    running = true;
    overlay.style.display = "flex";
    setStatus("🟢 Preparing...");
    try {
      const kycId = await getKycId(min, max, orderType);
      if (!running) return;
      setStatus("🟢 Running | ₹" + min + "-" + max);
      mainLoop(min, max, orderType, kycId);
    } catch (e) {
      running = false;
      overlay.style.display = "none";
      setStatus(String(e.message || e));
    }
  };

  stopBtn.onclick = () => {
    running = false;
    overlay.style.display = "none";
    setStatus("🔴 Stopped");
  };

  // ===== ড্র্যাগ (মাউস + টাচ) =====
  (function () {
    const header = panel.querySelector(".cyber-header");
    let drag = false, ox = 0, oy = 0;
    const start = (x, y) => {
      drag = true;
      ox = x - panel.offsetLeft;
      oy = y - panel.offsetTop;
    };
    const move = (x, y) => {
      if (!drag) return;
      panel.style.left = x - ox + "px";
      panel.style.top = y - oy + "px";
      panel.style.right = "auto";
      panel.style.bottom = "auto";
    };
    header.addEventListener("mousedown", (e) => start(e.clientX, e.clientY));
    document.addEventListener("mousemove", (e) => move(e.clientX, e.clientY));
    document.addEventListener("mouseup", () => (drag = false));
    header.addEventListener("touchstart", (e) => start(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    document.addEventListener("touchmove", (e) => move(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    document.addEventListener("touchend", () => (drag = false));
  })();
})();

(async function () {
  // Google Fonts Import
  if (!document.getElementById("cyberFontImports")) {
    const fontLink = document.createElement("link");
    fontLink.id = "cyberFontImports";
    fontLink.rel = "stylesheet";
    fontLink.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@600;700&display=swap";
    document.head.appendChild(fontLink);
  }

  // Inject Custom Futuristic HUD CSS
  const v = document.createElement("style");
  v.innerHTML = `
    #cyberPanel {
        position: fixed;
        right: 20px;
        bottom: 20px;
        width: 380px;
        padding: 20px;
        z-index: 999999;
        background: rgba(14, 26, 54, 0.45);
        border-radius: 24px;
        border: 1.5px solid rgba(0, 240, 255, 0.4);
        box-shadow: 0 0 35px rgba(0, 240, 255, 0.2), inset 0 0 25px rgba(112, 0, 255, 0.25);
        backdrop-filter: blur(16px);
        font-family: 'Orbitron', sans-serif;
        clip-path: polygon(
            0% 20px, 20px 0%, 
            calc(100% - 20px) 0%, 100% 20px, 
            100% calc(100% - 20px), calc(100% - 20px) 100%, 
            20px 100%, 0% calc(100% - 20px)
        );
        box-sizing: border-box;
    }

    .cyber-header {
        text-align: center;
        margin-bottom: 20px;
        cursor: move;
        user-select: none;
    }

    .panel-title {
        color: #bce6ff;
        font-size: 16px;
        letter-spacing: 2px;
        font-weight: 800;
        text-transform: uppercase;
        text-shadow: 0 0 10px #00f0ff, 0 0 20px #00a2ff;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

    .crystal-icon {
        width: 10px;
        height: 10px;
        background: #c084fc;
        transform: rotate(45deg);
        box-shadow: 0 0 12px #c084fc, 0 0 20px #00f0ff;
    }

    .cyber-label {
        font-size: 11px;
        color: #79a2cf;
        letter-spacing: 2px;
        margin-bottom: 8px;
        text-transform: uppercase;
        font-weight: 700;
        display: block;
        text-shadow: 0 0 5px rgba(0, 240, 255, 0.3);
    }

    .payment-grid {
        display: flex;
        gap: 10px;
        margin-bottom: 18px;
    }

    .futuristic-btn {
        flex: 1;
        padding: 10px;
        background: rgba(8, 20, 42, 0.6);
        border-radius: 10px;
        cursor: pointer;
        font-family: 'Orbitron', sans-serif;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 1.5px;
        transition: all 0.3s ease;
        border: 1.5px solid rgba(0, 240, 255, 0.2);
        color: #79a2cf;
        text-align: center;
    }

    .futuristic-btn.active[data-value="1"] {
        border: 1.5px solid #00f0ff;
        color: #ffffff;
        box-shadow: 0 0 15px rgba(0, 240, 255, 0.4), inset 0 0 10px rgba(0, 240, 255, 0.2);
        background: rgba(0, 240, 255, 0.15);
    }

    .futuristic-btn.active[data-value="2"] {
        border: 1.5px solid #00ffaa;
        color: #00ffaa;
        box-shadow: 0 0 15px rgba(0, 255, 170, 0.3), inset 0 0 10px rgba(0, 255, 170, 0.15);
        background: rgba(0, 255, 170, 0.15);
    }

    .amount-box {
        margin-bottom: 18px;
    }

    .input-wrapper {
        position: relative;
        background: rgba(5, 12, 28, 0.7);
        border: 1.5px solid #38bdf8;
        border-radius: 10px;
        padding: 2px 12px;
        box-shadow: 0 0 15px rgba(56, 189, 248, 0.25);
        display: flex;
        align-items: center;
    }

    .input-wrapper input {
        width: 100%;
        height: 38px;
        background: transparent;
        border: none;
        outline: none;
        color: #38bdf8;
        font-family: 'Orbitron', sans-serif;
        font-size: 16px;
        letter-spacing: 2px;
        font-weight: 700;
        text-shadow: 0 0 8px rgba(56, 189, 248, 0.6);
    }

    .action-grid {
        display: flex;
        gap: 10px;
        margin-bottom: 16px;
    }

    .action-btn {
        flex: 1;
        height: 42px;
        border-radius: 10px;
        cursor: pointer;
        font-family: 'Orbitron', sans-serif;
        font-weight: 900;
        font-size: 13px;
        letter-spacing: 1.5px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        border: none;
    }

    .btn-start {
        background: rgba(0, 162, 255, 0.15);
        border: 1.5px solid #00f0ff;
        color: #00f0ff;
        box-shadow: 0 0 20px rgba(0, 240, 255, 0.3), inset 0 0 12px rgba(0, 240, 255, 0.2);
    }

    .btn-start:hover:not(:disabled) {
        background: #00f0ff;
        color: #03050a;
        box-shadow: 0 0 25px #00f0ff;
    }

    .btn-stop {
        background: rgba(236, 72, 153, 0.15);
        border: 1.5px solid #ec4899;
        color: #ec4899;
        box-shadow: 0 0 20px rgba(236, 72, 153, 0.3), inset 0 0 12px rgba(236, 72, 153, 0.2);
    }

    .btn-stop:hover {
        background: #ec4899;
        color: #ffffff;
        box-shadow: 0 0 25px #ec4899;
    }

    .status-box {
        background: rgba(0, 240, 255, 0.05);
        border: 1.5px solid #00f0ff;
        border-radius: 10px;
        padding: 10px;
        text-align: center;
        color: #00f0ff;
        font-weight: 800;
        font-size: 11px;
        letter-spacing: 2px;
        text-shadow: 0 0 8px #00f0ff;
        box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
        transition: all 0.3s ease;
        text-transform: uppercase;
        min-height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #overlay-status-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
    }

    #overlay-live-status {
        font-size: 18px;
        color: #00ff95;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        margin-bottom: 5px;
        text-shadow: 0 0 10px #00ff95aa;
    }
  `;
  document.head.appendChild(v);

  let v2 = document.getElementById("cyberOverlay");
  if (!v2) {
    v2 = document.createElement("div");
    v2.id = "cyberOverlay";
    v2.style.cssText = `
            position:fixed;
            inset:0;
            background:rgba(0,0,0,0.85);
            backdrop-filter:blur(12px);
            z-index:999998;
            display:none;
            align-items:center;
            justify-content:center;
            color:#00f7ff;
            font-family:'Orbitron',sans-serif;
            text-shadow:0 0 10px #00f7ff;
        `;
    v2.innerHTML = `
        <div id="overlay-status-container">
            <div id="overlay-live-status">INITIALIZING...</div>
            <h1 style="font-size:24px;letter-spacing:8px;margin:0;opacity:0.6;">SYSTEM ACTIVE</h1>
        </div>`;
    document.body.appendChild(v2);
  }
  const v3 = document.getElementById("overlay-live-status");

  let v4 = document.getElementById("cyberPanel");
  if (!v4) {
    v4 = document.createElement("div");
    v4.id = "cyberPanel";
    v4.innerHTML = `
        <div class="cyber-header">
          <div class="panel-title">
            <span class="crystal-icon"></span>
            AUTO BUY PANEL
            <span class="crystal-icon"></span>
          </div>
        </div>

        <div class="cyber-label">Payment Type</div>
        <div class="payment-grid" id="orderTypeToggle">
          <div class="futuristic-btn active" data-value="1">UPI</div>
          <div class="futuristic-btn" data-value="2">BANK</div>
        </div>

        <div class="amount-box">
          <div class="cyber-label">Amount</div>
          <div class="input-wrapper">
            <input 
              type="text" 
              id="buyAmount" 
              value="1000"
              min="1" 
              oninput="this.value=this.value.replace(/[^0-9]/g,'')"
            >
          </div>
        </div>

        <div class="action-grid">
          <button id="startBtn" class="action-btn btn-start">START</button>
          <button id="stopBtn" class="action-btn btn-stop">STOP</button>
        </div>

        <div class="status-box" id="cyberStatus">
          Ready
        </div>`;
    document.body.appendChild(v4);
  }

  const v5 = document.getElementById("cyberStatus");
  const v6 = document.getElementById("startBtn");
  const v7 = document.getElementById("stopBtn");
  const v8 = document.getElementById("buyAmount");
  const v9 = document.getElementById("orderTypeToggle");
  let v10 = false;
  let vLN1 = 1;
  let v11 = false;

  v9.querySelectorAll(".futuristic-btn").forEach(p => {
    p.onclick = () => {
      v9.querySelector(".active").classList.remove("active");
      p.classList.add("active");
      vLN1 = Number(p.dataset.value);
      console.log("Selected Order Type:", vLN1 === 1 ? "UPI" : "BANK");
    };
  });

  function f(p2) {
    console.log(p2);
    if (v5) {
      v5.innerText = p2;
      const v12 = /denied|not found|Error|Stopped|🔴/i.test(p2);
      const v13 = /SUCCESS|🟢/i.test(p2);

      if (v12) {
        v5.style.color = "#ef4444";
        v5.style.borderColor = "#ef4444";
        v5.style.boxShadow = "0 0 15px rgba(239, 68, 68, 0.25), inset 0 0 15px rgba(239, 68, 68, 0.2)";
        v5.style.background = "rgba(239, 68, 68, 0.1)";
      } else if (v13) {
        v5.style.color = "#00ffaa";
        v5.style.borderColor = "#00ffaa";
        v5.style.boxShadow = "0 0 15px rgba(0, 255, 170, 0.25), inset 0 0 15px rgba(0, 255, 170, 0.2)";
        v5.style.background = "rgba(0, 255, 170, 0.1)";
      } else {
        v5.style.color = "#00f0ff";
        v5.style.borderColor = "#00f0ff";
        v5.style.boxShadow = "0 0 15px rgba(0, 240, 255, 0.2)";
        v5.style.background = "rgba(0, 240, 255, 0.05)";
      }
    }
    if (v3) {
      v3.innerText = p2;
      const v14 = /denied|not found|Error|Stopped|🔴/i.test(p2);
      v3.style.color = v14 ? "#ef4444" : "#00ffaa";
      v3.style.textShadow = v14 ? "0 0 10px #ef4444aa" : "0 0 10px #00ffaaaa";
    }
  }

  async function f2(p3) {
    return new Promise((p4, p5) => {
      const v15 = document.createElement("script");
      v15.src = p3;
      v15.onload = p4;
      v15.onerror = p5;
      document.head.appendChild(v15);
    });
  }

  if (!window.firebase) {
    await f2("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
    await f2("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js");
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

  let v16 = null;
  function f3(p6) {
    return new Promise(p7 => setTimeout(p7, p6));
  }

  let v17 = null;
  try {
    const v18 = await f8();
    const v19 = v18.allowed;
    v11 = v18.isPremium;
    f7();

    if (!v19) {
      f("Access Denied");
      return;
    }

    function f4() {
      const vNumber = Number(v8.value);
      if (!v11) {
        if (vNumber < 1000) {
          v6.disabled = true;
          v6.style.opacity = "0.5";
          v6.style.cursor = "not-allowed";
        } else {
          v6.disabled = false;
          v6.style.opacity = "1";
          v6.style.cursor = "pointer";
        }
      } else {
        v6.disabled = false;
        v6.style.opacity = "1";
        v6.style.cursor = "pointer";
      }
    }

    if (!v11) {
      v8.value = "1000";
    }

    v8.addEventListener("input", f4);
    f4();

    const v20 = localStorage.getItem("token");
    if (v20) {
      try {
        v17 = JSON.parse(v20)?.value || v20;
      } catch {
        v17 = v20;
      }
    }

    if (!v17 && window.token?.value) {
      v17 = window.token.value;
    }
  } catch (e) {
    console.log(e);
  }

  if (!v17) {
    f("Token Not Found");
    return;
  }

  const v21 = localStorage.getItem("arb_device_code") || crypto.randomUUID().replace(/-/g, "");
  localStorage.setItem("arb_device_code", v21);

  const vO = {
    accept: "application/json, text/plain, */*",
    "content-type": "application/json",
    authorization: "Bearer " + v17,
    deviceId: "undefined",
    deviceType: "3",
    page: "Arb",
    deviceCode: v21
  };

  v6.onclick = () => {
    if (v10) {
      return;
    }
    const vNumber2 = Number(v8.value);
    if (!vNumber2) {
      f("Enter amount");
      return;
    }

    if (!v11 && vNumber2 < 1000) {
      f("Minimum order value is 1000");
      return;
    }

    v10 = true;
    v2.style.display = "flex";
    f("🟢 Running | Amount ₹" + vNumber2);
    f5(vNumber2, vLN1);
  };

  v7.onclick = () => {
    v10 = false;
    v2.style.display = "none";
    f("🔴 Stopped");
  };

  (function () {
    const v22 = v4.querySelector(".cyber-header");
    let v23 = false;
    let vLN0 = 0;
    let vLN02 = 0;

    v22.addEventListener("mousedown", p8 => {
      v23 = true;
      vLN0 = p8.clientX - v4.offsetLeft;
      vLN02 = p8.clientY - v4.offsetTop;
    });

    document.addEventListener("mouseup", () => {
      v23 = false;
    });

    document.addEventListener("mousemove", p9 => {
      if (!v23) {
        return;
      }
      v4.style.left = p9.clientX - vLN0 + "px";
      v4.style.top = p9.clientY - vLN02 + "px";
      v4.style.right = "auto";
      v4.style.bottom = "auto";
    });
  })();

  async function f5(p10, p11) {
    while (v10) {
      try {
        const v24 = p11 === 1 ? "UPI" : "BANK";
        f("Checking " + v24 + " orders for ₹" + p10 + "...");

        const v25 = await fetch("https://apiweb.apiarbpay.com/ar-wallet/buyCenter/buyList", {
          method: "POST",
          headers: vO,
          body: JSON.stringify({
            orderType: p11,
            pageNo: 1
          })
        });

        const v26 = await v25.json();
        const v27 = v26?.data?.list || [];

        if (!v27.length) {
          f("No orders found...");
          await f3(300);
          continue;
        }

        const v28 = v27.filter(p12 => Number(p12.amount) === p10);
        if (!v28.length) {
          f("Waiting for order ₹" + p10);
          await f3(300);
          continue;
        }

        for (const v29 of v28) {
          if (!v10) {
            break;
          }
          f("Trying ₹" + v29.amount);

          const vO2 = {
            amount: v29.amount,
            platformOrder: v29.platformOrder,
            payType: v29.payType,
            orderType: v29.orderType
          };

          try {
            const v30 = await fetch("https://apiweb.apiarbpay.com/ar-wallet/buyCenter/beforeBuy", {
              method: "POST",
              headers: vO,
              body: JSON.stringify(vO2)
            });

            const v31 = await v30.json();
            if (v31.code !== "1") {
              continue;
            }

            const v32 = await fetch("https://apiweb.apiarbpay.com/ar-wallet/buyCenter/buy", {
              method: "POST",
              headers: vO,
              body: JSON.stringify({
                amount: v29.amount,
                platformOrder: v29.platformOrder,
                payType: v29.payType,
                orderType: v29.orderType,
                buyBankCode: "moneyView",
                buyerKycId: ""
              })
            });

            const v33 = await v32.json();
            if (v33.code === "1" || v33.msg === "Success") {
              f("SUCCESS ₹" + v29.amount);
              location.reload();
              return;
            }
          } catch (e2) {
            console.error(e2);
          }
        }
        await f3(300);
      } catch (e3) {
        console.error(e3);
        f("Error. Retrying...");
        await f3(500);
      }
    }
  }

  async function f6() {
    try {
      const v34 = JSON.parse(localStorage.getItem("userInfo"));
      const v35 = v34?.value?.memberId || v34?.value?.memberld;
      const v36 = v34?.balance ?? v34?.value?.balance;

      if (!v35 || v36 === undefined || v36 === null) {
        return;
      }

      const v37 = firebase.firestore();
      const v38 = await v37.collection("members").where("walletUserId", "==", String(v35)).limit(1).get();

      if (v38.empty) {
        return;
      }

      const v39 = v38.docs[0];
      const v40 = v37.collection("members").doc(v39.id);
      const v41 = v39.data();

      const vNumber3 = Number(v41.balance ?? 0);
      const vNumber4 = Number(v36);

      if (vNumber3 === vNumber4) {
        return;
      }

      const v42 = vNumber4 - vNumber3;

      await v37.collection("transactions").add({
        walletUserId: String(v35),
        previousBalance: vNumber3,
        updatedBalance: vNumber4,
        amount: Math.abs(v42),
        type: v42 > 0 ? "credit" : "debit",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      await v40.update({
        balance: vNumber4,
        balanceUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (e4) {
      console.error("Balance sync error:", e4);
    }
  }

  function f7() {
    if (v16) {
      return;
    }
    f6();
    v16 = setInterval(f6, 15000);
  }

  async function f8() {
    try {
      const v43 = JSON.parse(localStorage.getItem("userInfo"));
      const v44 = v43?.value?.memberId || v43?.value?.memberld;

      if (!v44) {
        return {
          allowed: false,
          isPremium: false
        };
      }

      const v45 = await firebase.firestore().collection("members").where("walletUserId", "==", String(v44)).where("active", "==", true).limit(1).get();

      if (v45.empty) {
        return {
          allowed: false,
          isPremium: false
        };
      }

      const v46 = v45.docs[0].data();
      return {
        allowed: true,
        isPremium: v46.is_premium === true
      };
    } catch {
      return {
        allowed: false,
        isPremium: false
      };
    }
  }
})();
      

(async function () {
  const v = document.createElement("style");
  v.innerHTML = `
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
        transition: box-shadow 0.3s ease, transform 0.3s ease;
    }

    #cyberPanel:hover {
        box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.3),
            0 10px 20px rgba(0, 0, 0, 0.18),
            0 0 25px rgba(197, 160, 89, 0.25),
            inset 0 1px 1px rgba(255, 255, 255, 1);
    }

    .cyber-header {
        padding: 10px 14px 4px 14px;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: move;
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
        padding: 8px 14px 14px 14px;
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
        grid-template-columns: 1.2fr 1fr;
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
        height: 34px;
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
  document.head.appendChild(v);

  let v2 = document.getElementById("cyberOverlay");
  if (!v2) {
    v2 = document.createElement("div");
    v2.id = "cyberOverlay";
    v2.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(235, 230, 222, 0.88);
        backdrop-filter:blur(8px);
        z-index:999998;
        display:none;
        align-items:center;
        justify-content:center;
        color:#7d7265;
        font-family:Arial,sans-serif;
    `;
    v2.innerHTML = `
        <div id="overlay-status-container">
            <div id="overlay-live-status">INITIALIZING...</div>
            <h1 style="font-size:22px;letter-spacing:6px;margin:0;opacity:0.6;color:#554e44;">SYSTEM ACTIVE</h1>
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
                    min="1" 
                    oninput="this.value=this.value.replace(/[^0-9]/g,'')"
                > 
            </div>
    
            <div class="cyber-buttons"> 
                <button id="startBtn" class="cyber-btn start-btn">START</button> 
                <button id="stopBtn" class="cyber-btn stop-btn">STOP</button> 
            </div> 
    
            <div class="cyber-status" id="cyberStatus">Ready</div> 
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

  v9.querySelectorAll(".toggle-option").forEach(p => {
    p.onclick = () => {
      v9.querySelector(".active").classList.remove("active");
      p.classList.add("active");
      vLN1 = Number(p.dataset.value);
    };
  });

  function f(p2) {
    console.log(p2);
    if (v5) {
      v5.innerText = p2;
      const v12 = /denied|not found|Error|Stopped|🔴/i.test(p2);
      const v13 = /SUCCESS|🟢/i.test(p2);
      if (v12) {
        v5.style.color = "#ba5d58";
        v5.style.border = "1px solid rgba(186, 93, 88, 0.3)";
      } else if (v13) {
        v5.style.color = "#3d8573";
        v5.style.border = "1px solid rgba(61, 133, 115, 0.4)";
      } else {
        v5.style.color = "#7d7265";
        v5.style.border = "none";
      }
    }
    if (v3) {
      v3.innerText = p2;
      const v14 = /denied|not found|Error|Stopped|🔴/i.test(p2);
      v3.style.color = v14 ? "#ba5d58" : "#3d8573";
      v3.style.textShadow = v14 ? "0 0 10px rgba(186, 93, 88, 0.4)" : "0 0 10px rgba(61, 133, 115, 0.4)";
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
  let dynamicMemberId = "22801760"; // লগ থেকে[span_20](start_span)[span_20](end_span)

  try {
    const v18 = await f8();
    const v19 = v18.allowed;
    v11 = v18.isPremium;
    f7();
    if (!v19) {
      f("Access denied");
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

    const localInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const foundId = localInfo?.value?.memberId || localInfo?.value?.memberld || localInfo?.memberId;
    if (foundId) {
      dynamicMemberId = String(foundId);
    }
  } catch (e) {
    console.log(e);
  }

  if (!v17) {
    f("Token not found");
    return;
  }

  const v21 = localStorage.getItem("arb_device_code") || crypto.randomUUID().replace(/-/g, "");
  localStorage.setItem("arb_device_code", v21);

  // নতুন আপডেটেড হেডার কনফিগারেশন[span_21](start_span)[span_21](end_span)
  const vO = {
    accept: "application/json, text/plain, */*",
    "content-type": "application/json",
    authorization: "Bearer " + v17,
    deviceId: "undefined",
    deviceType: "3",
    page: "Arb",
    language: "1",
    memberId: dynamicMemberId,
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
    f("🟢 Matching | ₹" + vNumber2);
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

  // আসল smartRangeBuy ইঞ্জিন[span_22](start_span)[span_22](end_span)
  async function f5(p10, p11) {
    // এপিআই বেস ইউআরএল[span_23](start_span)[span_23](end_span)
    const baseUrl = "https://apiweb.payapiar.com";

    while (v10) {
      try {
        f("Matching ₹" + p10 + " via Engine...");

        // ১. স্টার্ট ম্যাচিং কল (নতুন API)[span_24](start_span)[span_24](end_span)
        const startRes = await fetch(baseUrl + "/ar-wallet/smartRangeBuy/match/start", {
          method: "POST",
          headers: vO,
          body: JSON.stringify({
            minAmount: p10,
            maxAmount: p10,
            orderType: p11,
            buyBankCode: "moneyView",
            buyerKycId: 5265767
          })
        });

        const startData = await startRes.json();

        // যদি অলরেডি কোনো অর্ডার ম্যাচ হয়ে থাকে বা পেন্ডিং থাকে[span_25](start_span)[span_25](end_span)
        if (startData?.code === "1") {
          const matchInfo = startData?.data;
          
          // ২. ম্যাচিং রেজাল্ট চেক করার দৃশ্যমান লুপ[span_26](start_span)[span_26](end_span)
          let checkCount = 0;
          while (v10 && checkCount < 10) {
            checkCount++;
            const listRes = await fetch(baseUrl + "/ar-wallet/smartRangeBuy/scene/list", {
              method: "POST",
              headers: vO,
              body: JSON.stringify({
                orderType: p11
              })
            });

            const listData = await listRes.json();
            const resData = listData?.data;

            // যদি অর্ডার ম্যাচ হয়ে যায়[span_27](start_span)[span_27](end_span)[span_28](start_span)[span_28](end_span)!
            if (resData?.matchResult === "MATCHED" || resData?.status === "COMPLETED" || resData?.pendingOrder) {
              const matchedOrder = resData?.pendingOrder?.platformOrder || resData?.lastMatchResult?.platformOrder;
              f("🟢 SUCCESS! ORDER LOCKED");
              
              // ক্যাশিয়ার পেজে রিডাইরেক্ট[span_29](start_span)[span_29](end_span)[span_30](start_span)[span_30](end_span)
              if (matchedOrder) {
                location.href = location.origin + "/#/order/cashier?platformOrder=" + matchedOrder;
              } else {
                location.reload();
              }
              return;
            }

            f("Searching best order (" + checkCount + ")...");
            await f3(300);
          }
        } else {
          f(startData?.msg || "Retrying...");
        }

        await f3(200);
      } catch (e3) {
        console.error(e3);
        f("Engine Sync Error. Retrying...");
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
                       

(async function () {
  const v = document.createElement("style");
  v.innerHTML = `
    #cyberPanel {
        position: fixed;
        right: 15px;
        bottom: 20px;
        width: 290px;
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
        grid-template-columns: 1fr 1.3fr 1fr;
        gap: 4px;
    }

    .toggle-option {
        padding: 7px 0;
        text-align: center;
        border-radius: 8px;
        font-size: 10px;
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

    .stop-btn {
        background: #b55e65;
        color: #ffd2d5;
        box-shadow: 
            0 0 0 1.2px rgba(225, 102, 102, 0.5),
            0 4px 10px rgba(181, 94, 101, 0.35);
    }

    .cyber-status {
        margin-top: 2px;
        background: #ded7cd;
        border-radius: 10px;
        height: 34px;
        padding: 0 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: #ba5d58;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.4px;
        text-transform: uppercase;
        box-shadow: inset 1px 2px 3px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(255, 255, 255, 0.9);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
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
                    <div class="toggle-option" data-value="1">UPI</div>
                    <div class="toggle-option active" data-value="3">OTP-UPI</div>
                    <div class="toggle-option" data-value="2">BANK</div>
                </div>
            </div>

            <div>
                <label class="cyber-label">Target Amount</label> 
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
  let vLN1 = 3; // ডিফল্ট OTP-UPI মোড

  v9.querySelectorAll(".toggle-option").forEach(p => {
    p.onclick = () => {
      v9.querySelector(".active").classList.remove("active");
      p.classList.add("active");
      vLN1 = Number(p.dataset.value);
    };
  });

  function f(p2) {
    if (v5) {
      v5.innerText = p2;
      const v12 = /denied|not found|Error|Stopped|🔴|someone else|failed/i.test(p2);
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
      const v14 = /denied|not found|Error|Stopped|🔴|someone else|failed/i.test(p2);
      v3.style.color = v14 ? "#ba5d58" : "#3d8573";
      v3.style.textShadow = v14 ? "0 0 10px rgba(186, 93, 88, 0.4)" : "0 0 10px rgba(61, 133, 115, 0.4)";
    }
  }

  function f3(p6) {
    return new Promise(p7 => setTimeout(p7, p6));
  }

  let v17 = null;
  try {
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
    f("Token not found");
    return;
  }

  const v21 = localStorage.getItem("arb_device_code") || crypto.randomUUID().replace(/-/g, "");
  localStorage.setItem("arb_device_code", v21);

  // ডাইনামিক কারেন্ট হোস্ট হ্যান্ডলিং
  const currentHost = window.location.origin;
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
    if (v10) return;
    const vNumber2 = Number(v8.value);
    if (!vNumber2) {
      f("Enter amount");
      return;
    }
    v10 = true;
    v2.style.display = "flex";
    f("🟢 Sniping | Target ₹" + vNumber2);
    f5(vNumber2, vLN1);
  };

  v7.onclick = () => {
    v10 = false;
    v2.style.display = "none";
    f("🔴 Stopped");
  };

  (function () {
    const v22 = v4.querySelector(".cyber-header");
    let v23 = false, vLN0 = 0, vLN02 = 0;
    v22.addEventListener("mousedown", p8 => {
      v23 = true;
      vLN0 = p8.clientX - v4.offsetLeft;
      vLN02 = p8.clientY - v4.offsetTop;
    });
    document.addEventListener("mouseup", () => { v23 = false; });
    document.addEventListener("mousemove", p9 => {
      if (!v23) return;
      v4.style.left = p9.clientX - vLN0 + "px";
      v4.style.top = p9.clientY - vLN02 + "px";
      v4.style.right = "auto";
      v4.style.bottom = "auto";
    });
  })();

  // ----------------- ডাইনামিক নোড বায়িং ফাংশন -----------------
  async function f5(p10, p11) {
    while (v10) {
      try {
        const typeNames = { 1: "UPI", 2: "BANK", 3: "OTP-UPI" };
        const modeLabel = typeNames[p11] || "ORDER";

        // মূল API কল
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
          f("Scanning " + modeLabel + "...");
          await f3(80);
          continue;
        }

        // নিখুঁত রেঞ্জ ম্যাচিং (যেমন: ১০০০-২০০০ এর ভেতর চেক)
        const v28 = v27.filter(p12 => {
          const directAmt = Math.round(Number(p12.amount));
          const minA = Math.round(Number(p12.minimumAmount || p12.amount));
          const maxA = Math.round(Number(p12.maximumAmount || p12.amount));
          return directAmt === p10 || (p10 >= minA && p10 <= maxA);
        });

        if (!v28.length) {
          f("Waiting for ₹" + p10);
          await f3(80);
          continue;
        }

        for (const v29 of v28) {
          if (!v10) break;
          const orderTargetAmt = Number(v29.amount || p10);
          f("⚡ Buying ₹" + orderTargetAmt);

          const vO2 = {
            amount: orderTargetAmt,
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

            if (v31.code === "1") {
              const v32 = await fetch("https://apiweb.apiarbpay.com/ar-wallet/buyCenter/buy", {
                method: "POST",
                headers: vO,
                body: JSON.stringify({
                  amount: orderTargetAmt,
                  platformOrder: v29.platformOrder,
                  payType: v29.payType,
                  orderType: v29.orderType,
                  buyBankCode: "moneyView",
                  buyerKycId: ""
                })
              });
              const v33 = await v32.json();

              if (v33.code === "1" || v33.msg === "Success") {
                f("SUCCESS ₹" + orderTargetAmt);
                v10 = false;
                
                // সফল হলে সরাসরি কিউআর/অর্ডার ডিটেইলস পেজে রিডাইরেক্ট
                const redirectUrl = v33?.data?.payUrl || v33?.data?.url;
                if (redirectUrl) {
                  window.location.href = redirectUrl;
                } else {
                  window.location.href = currentHost + "/#/order";
                }
                return;
              } else {
                f(v33.msg || "Buy Failed");
              }
            } else {
              f(v31.msg || "Order Taken");
            }
          } catch (e2) {
            console.error("Order error:", e2);
          }
        }
        await f3(60);
      } catch (e3) {
        f("Retrying...");
        await f3(180);
      }
    }
  }
})();

(async function () {
  const v = document.createElement("style");
  v.innerHTML = "\n    #cyberPanel{ \n        position:fixed; \n        right:20px; \n        bottom:20px; \n        width:280px; \n        z-index:999999; \n        background:rgba(10, 15, 31, 0.9); \n        border:1px solid #00f7ff33; \n        border-radius:16px; \n        backdrop-filter:blur(16px); \n        box-shadow: \n            0 8px 32px rgba(0, 0, 0, 0.4),\n            0 0 15px #00f7ff22; \n        overflow:hidden; \n        font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; \n    } \n    \n    .cyber-header{ \n        padding:10px 15px; \n        background:linear-gradient(90deg,#00f7ff15,#7a00ff15); \n        color:#00f7ff; \n        font-size: 11px;\n        letter-spacing: 1px;\n        font-weight:bold; \n        text-align:center; \n        cursor:move; \n        border-bottom:1px solid #00f7ff22; \n        user-select:none;\n        text-transform: uppercase;\n    } \n    \n    .cyber-body{ \n        padding:15px; \n    } \n    \n    .cyber-label{ \n        color:#8defff; \n        font-size:10px; \n        margin-bottom:6px; \n        display:block; \n        text-transform: uppercase;\n        letter-spacing: 0.5px;\n        opacity: 0.8;\n    } \n    \n    .cyber-input{ \n        width:100%; \n        box-sizing:border-box; \n        padding:8px 12px; \n        background:rgba(17, 24, 39, 0.5); \n        border:1px solid #00f7ff33; \n        border-radius:10px; \n        color:#fff; \n        font-size:14px; \n        outline:none; \n        transition: all 0.3s ease;\n    } \n    \n    .cyber-input:focus{ \n        border-color: #00f7ff88;\n        box-shadow:0 0 12px #00f7ff33; \n    } \n    \n    .cyber-buttons{ \n        display:flex; \n        gap:10px; \n        margin-top:12px; \n    } \n    \n    .cyber-btn{ \n        flex:1; \n        border:none; \n        padding:8px; \n        border-radius:8px; \n        cursor:pointer; \n        font-size: 11px;\n        font-weight:bold; \n        transition:all .2s ease; \n        text-transform: uppercase;\n        letter-spacing: 0.5px;\n    } \n    \n    .start-btn{ \n        background:#00f7ff; \n        color:#000; \n    } \n    \n    .start-btn:hover{ \n        transform:translateY(-1px); \n        box-shadow:0 0 12px #00f7ff88; \n    } \n    \n    .stop-btn{ \n        background:rgba(255, 45, 85, 0.2); \n        color:#ff2d55; \n        border: 1px solid #ff2d5544;\n    } \n    \n    .stop-btn:hover{ \n        background:rgba(255, 45, 85, 0.3); \n        transform:translateY(-1px); \n        box-shadow:0 0 12px #ff2d5533; \n    } \n    \n    .cyber-status{ \n        margin-top:12px; \n        background:rgba(17, 24, 39, 0.6); \n        border-radius:10px; \n        padding:8px 12px; \n        display: flex;\n        align-items: center;\n        justify-content: center;\n        text-align:center; \n        color:#00ff95; \n        font-size:11px; \n        border:1px solid #00ff9533; \n        min-height: 36px;\n        box-shadow: inset 0 0 5px #00ff9511;\n        text-transform: uppercase;\n        letter-spacing: 0.3px;\n        transition: all 0.3s ease;\n    } \n\n    /* Toggle Switch Styles */\n    .toggle-container {\n        display: flex;\n        background: #111827;\n        border: 1px solid #00f7ff33;\n        border-radius: 10px;\n        margin-bottom: 12px;\n        padding: 3px;\n        gap: 3px;\n    }\n\n    .toggle-option {\n        flex: 1;\n        padding: 6px;\n        text-align: center;\n        color: #8defff;\n        font-size: 11px;\n        font-weight: bold;\n        cursor: pointer;\n        border-radius: 6px;\n        transition: .3s;\n        user-select: none;\n    }\n\n    .toggle-option.active {\n        background: #00f7ff;\n        color: #000;\n        box-shadow: 0 0 8px #00f7ff66;\n    }\n\n    #overlay-status-container {\n        display: flex;\n        flex-direction: column;\n        align-items: center;\n        gap: 15px;\n    }\n\n    #overlay-live-status {\n        font-size: 18px;\n        color: #00ff95;\n        text-transform: uppercase;\n        letter-spacing: 1.5px;\n        margin-bottom: 5px;\n        text-shadow: 0 0 10px #00ff95aa;\n    }\n    ";
  document.head.appendChild(v);
  let v2 = document.getElementById("cyberOverlay");
  if (!v2) {
    v2 = document.createElement("div");
    v2.id = "cyberOverlay";
    v2.style.cssText = "\n            position:fixed;\n            inset:0;\n            background:rgba(0,0,0,0.85);\n            backdrop-filter:blur(12px);\n            z-index:999998;\n            display:none;\n            align-items:center;\n            justify-content:center;\n            color:#00f7ff;\n            font-family:Arial,sans-serif;\n            text-shadow:0 0 10px #00f7ff;\n        ";
    v2.innerHTML = "\n        <div id=\"overlay-status-container\">\n            <div id=\"overlay-live-status\">INITIALIZING...</div>\n            <h1 style=\"font-size:24px;letter-spacing:8px;margin:0;opacity:0.6;\">SYSTEM ACTIVE</h1>\n        </div>";
    document.body.appendChild(v2);
  }
  const v3 = document.getElementById("overlay-live-status");
  let v4 = document.getElementById("cyberPanel");
  if (!v4) {
    v4 = document.createElement("div");
    v4.id = "cyberPanel";
    v4.innerHTML = "\n        <div class=\"cyber-header\"> \n            ⚡ AUTO BUY PANEL \n        </div> \n    \n        <div class=\"cyber-body\"> \n            \n            <label class=\"cyber-label\"> \n                Payment Type \n            </label>\n            <div class=\"toggle-container\" id=\"orderTypeToggle\">\n                <div class=\"toggle-option active\" data-value=\"1\">UPI</div>\n                <div class=\"toggle-option\" data-value=\"2\">BANK</div>\n            </div>\n\n            <label class=\"cyber-label\"> \n                Amount \n            </label> \n    \n            <input \n                type=\"text\" \n                id=\"buyAmount\" \n                class=\"cyber-input\" \n                value=\"1000\"\n                min=\"1\" \n                oninput=\"this.value=this.value.replace(/[^0-9]/g,'')\"\n            > \n    \n            <div class=\"cyber-buttons\"> \n                <button \n                    id=\"startBtn\" \n                    class=\"cyber-btn start-btn\" \n                > \n                    START \n                </button> \n    \n                <button \n                    id=\"stopBtn\" \n                    class=\"cyber-btn stop-btn\" \n                > \n                    STOP \n                </button> \n            </div> \n    \n            <div \n                class=\"cyber-status\" \n                id=\"cyberStatus\" \n            > \n                Ready \n            </div> \n    \n        </div>";
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
        v5.style.color = "#ff2d55";
        v5.style.borderColor = "#ff2d5544";
        v5.style.boxShadow = "inset 0 0 5px #ff2d5511";
      } else if (v13) {
        v5.style.color = "#00ff95";
        v5.style.borderColor = "#00ff9544";
        v5.style.boxShadow = "inset 0 0 5px #00ff9511";
      } else {
        v5.style.color = "#00f7ff";
        v5.style.borderColor = "#00f7ff33";
        v5.style.boxShadow = "inset 0 0 5px #00f7ff11";
      }
    }
    if (v3) {
      v3.innerText = p2;
      const v14 = /denied|not found|Error|Stopped|🔴/i.test(p2);
      v3.style.color = v14 ? "#ff2d55" : "#00ff95";
      v3.style.textShadow = v14 ? "0 0 10px #ff2d55aa" : "0 0 10px #00ff95aa";
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
  } catch (e) {
    console.log(e);
  }
  if (!v17) {
    f("Token not found");
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

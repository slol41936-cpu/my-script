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
      const v11 = /denied|not found|Error|Stopped|🔴/i.test(p2);
      const v12 = /SUCCESS|🟢/i.test(p2);
      if (v11) {
        v5.style.color = "#ff2d55";
        v5.style.borderColor = "#ff2d5544";
        v5.style.boxShadow = "inset 0 0 5px #ff2d5511";
      } else if (v12) {
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
      const v13 = /denied|not found|Error|Stopped|🔴/i.test(p2);
      v3.style.color = v13 ? "#ff2d55" : "#00ff95";
      v3.style.textShadow = v13 ? "0 0 10px #ff2d55aa" : "0 0 10px #00ff95aa";
    }
  }
  async function f2(p3) {
    return new Promise((p4, p5) => {
      const v14 = document.createElement("script");
      v14.src = p3;
      v14.onload = p4;
      v14.onerror = p5;
      document.head.appendChild(v14);
    });
  }
  if (!window.firebase) {
    await f2("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
    await f2("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js");
  }
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: "AIzaSyByR2NzGNdIPU0994a7dL9E3X6MM3rV1AE",
      projectId: "my-ar-automation"
    });
  }
  let v15 = null;
  function f3(p6) {
    return new Promise(p7 => setTimeout(p7, p6));
  }
  let v16 = null;
  try {
    const v17 = await f7();
    f6();
    if (!v17) {
      f("Access denied");
      return;
    }
    const v18 = localStorage.getItem("token");
    if (v18) {
      try {
        v16 = JSON.parse(v18)?.value || v18;
      } catch {
        v16 = v18;
      }
    }
    if (!v16 && window.token?.value) {
      v16 = window.token.value;
    }
  } catch (e) {
    console.log(e);
  }
  if (!v16) {
    f("Token not found");
    return;
  }
  const v19 = localStorage.getItem("arb_device_code") || crypto.randomUUID().replace(/-/g, "");
  localStorage.setItem("arb_device_code", v19);
  const vO = {
    accept: "application/json, text/plain, */*",
    "content-type": "application/json",
    authorization: "Bearer " + v16,
    deviceId: "undefined",
    deviceType: "3",
    page: "Arb",
    deviceCode: v19
  };
  v6.onclick = () => {
    if (v10) {
      return;
    }
    const vNumber = Number(v8.value);
    if (!vNumber) {
      alert("Enter amount");
      return;
    }
    v10 = true;
    v2.style.display = "flex";
    f("🟢 Running | Amount ₹" + vNumber);
    f4(vNumber, vLN1);
  };
  v7.onclick = () => {
    v10 = false;
    v2.style.display = "none";
    f("🔴 Stopped");
  };
  (function () {
    const v20 = v4.querySelector(".cyber-header");
    let v21 = false;
    let vLN0 = 0;
    let vLN02 = 0;
    v20.addEventListener("mousedown", p8 => {
      v21 = true;
      vLN0 = p8.clientX - v4.offsetLeft;
      vLN02 = p8.clientY - v4.offsetTop;
    });
    document.addEventListener("mouseup", () => {
      v21 = false;
    });
    document.addEventListener("mousemove", p9 => {
      if (!v21) {
        return;
      }
      v4.style.left = p9.clientX - vLN0 + "px";
      v4.style.top = p9.clientY - vLN02 + "px";
      v4.style.right = "auto";
      v4.style.bottom = "auto";
    });
  })();
  async function f4(p10, p11) {
    while (v10) {
      try {
        const v22 = p11 === 1 ? "UPI" : "BANK";
        f("Checking " + v22 + " orders for ₹" + p10 + "...");
        const v23 = await fetch("https://apiweb.arbpay.me/ar-wallet/buyCenter/buyList", {
          method: "POST",
          headers: vO,
          body: JSON.stringify({
            orderType: p11,
            pageNo: 1
          })
        });
        const v24 = await v23.json();
        const v25 = v24?.data?.list || [];
        if (!v25.length) {
          f("No orders found...");
          await f3(1000);
          continue;
        }
        const v26 = v25.filter(p12 => Number(p12.amount) === p10);
        if (!v26.length) {
          f("Waiting for order ₹" + p10);
          await f3(1000);
          continue;
        }
        for (const v27 of v26) {
          if (!v10) {
            break;
          }
          f("Trying ₹" + v27.amount);
          const vO2 = {
            amount: v27.amount,
            platformOrder: v27.platformOrder,
            payType: v27.payType,
            orderType: v27.orderType
          };
          try {
            const v28 = await fetch("https://apiweb.arbpay.me/ar-wallet/buyCenter/beforeBuy", {
              method: "POST",
              headers: vO,
              body: JSON.stringify(vO2)
            });
            const v29 = await v28.json();
            if (v29.code !== "1") {
              continue;
            }
            const v30 = await fetch("https://apiweb.arbpay.me/ar-wallet/buyCenter/buy", {
              method: "POST",
              headers: vO,
              body: JSON.stringify({
                amount: v27.amount,
                platformOrder: v27.platformOrder,
                payType: v27.payType,
                orderType: v27.orderType,
                buyBankCode: "moneyView",
                buyerKycId: ""
              })
            });
            const v31 = await v30.json();
            if (v31.code === "1" || v31.msg === "Success") {
              f("SUCCESS ₹" + v27.amount);
              location.reload();
              return;
            }
          } catch (e2) {
            console.error(e2);
          }
        }
        await f3(500);
      } catch (e3) {
        console.error(e3);
        f("Error. Retrying...");
        await f3(2000);
      }
    }
  }
  async function f5() {
    try {
      const v32 = JSON.parse(localStorage.getItem("userInfo"));
      const v33 = v32?.value?.memberId || v32?.value?.memberld;
      const v34 = v32?.balance ?? v32?.value?.balance;
      if (!v33 || v34 === undefined || v34 === null) {
        return;
      }
      const v35 = firebase.firestore();
      const v36 = await v35.collection("members").where("walletUserId", "==", String(v33)).limit(1).get();
      if (v36.empty) {
        return;
      }
      const v37 = v36.docs[0];
      const v38 = v35.collection("members").doc(v37.id);
      const v39 = v37.data();
      const vNumber2 = Number(v39.balance ?? 0);
      const vNumber3 = Number(v34);
      if (vNumber2 === vNumber3) {
        return;
      }
      const v40 = vNumber3 - vNumber2;
      await v35.collection("transactions").add({
        walletUserId: String(v33),
        previousBalance: vNumber2,
        updatedBalance: vNumber3,
        amount: Math.abs(v40),
        type: v40 > 0 ? "credit" : "debit",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      await v38.update({
        balance: vNumber3,
        balanceUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (e4) {
      console.error("Balance sync error:", e4);
    }
  }
  function f6() {
    if (v15) {
      return;
    }
    f5();
    v15 = setInterval(f5, 15000);
  }
  async function f7() {
    try {
      const v41 = JSON.parse(localStorage.getItem("userInfo"));
      const v42 = v41?.value?.memberId || v41?.value?.memberld;
      if (!v42) {
        return false;
      }
      const v43 = await firebase.firestore().collection("members").where("walletUserId", "==", String(v42)).where("active", "==", true).limit(1).get();
      return !v43.empty;
    } catch {
      return false;
    }
  }
})();
        

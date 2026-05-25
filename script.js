(async function () {
  let v = null;
  let v2 = false;
  let v3 = null;
  let v4 = null;
  let v5 = false;
  let v6 = null;
  const vLSAmountfilterpanel = "amount-filter-panel";
  const vLSXbuyListlist = "x-buyList-list";
  let v7 = false;
  const v8 = new Audio("https://raw.githubusercontent.com/slol41936-cpu/my-script/main/Fahhh-%20sound%20effect%20(HD)%20-%20HighQualitySFX.mp3");

  function f() {
    v8.currentTime = 0;
    v8.play().catch(() => {});
    setTimeout(() => {
      v8.pause();
      v8.currentTime = 0;
    }, 3000);
  }
  function f2(p) {
    return new Promise((p2, p3) => {
      const v9 = document.createElement("script");
      v9.src = p;
      v9.onload = p2;
      v9.onerror = p3;
      document.head.appendChild(v9);
    });
  }
  if (!window.firebase) {
    await f2("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
    await f2("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js");
  }
  
  // এখানে আপনার দেওয়া নতুন ফায়ারবেস আইডি বসানো হয়েছে, লজিক একদম সেম আছে
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: "AIzaSyByR2NzGNdIPU0994a7dL9E3X6MM3rV1AE",
      projectId: "my-ar-automation"
    });
  }
  
  async function f3() {
    try {
      const v10 = JSON.parse(localStorage.getItem("userInfo"));
      const v11 = v10?.value?.memberId || v10?.value?.memberld;
      const v12 = v10?.balance ?? v10?.value?.balance;
      if (!v11 || v12 === undefined || v12 === null) {
        return;
      }
      const v13 = firebase.firestore();
      const v14 = await v13.collection("members").where("walletUserId", "==", String(v11)).limit(1).get();
      if (v14.empty) {
        return;
      }
      const v15 = v14.docs[0];
      const v16 = v13.collection("members").doc(v15.id);
      const v17 = v15.data();
      const vNumber = Number(v17.balance ?? 0);
      const vNumber2 = Number(v12);
      if (vNumber === vNumber2) {
        return;
      }
      const v18 = vNumber2 - vNumber;
      const v19 = v18 > 0 ? "credit" : "debit";
      const v20 = Math.abs(v18);
      await v13.collection("transactions").add({
        walletUserId: String(v11),
        previousBalance: vNumber,
        updatedBalance: vNumber2,
        amount: v20,
        type: v19,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      await v16.update({
        balance: vNumber2,
        balanceUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (e) {
      console.error("Balance sync error:", e);
    }
  }
  function f4() {
    if (v6) {
      return;
    }
    f3();
    v6 = setInterval(f3, 15000);
  }
  async function f5() {
    try {
      const v21 = JSON.parse(localStorage.getItem("userInfo"));
      const v22 = v21?.value?.memberId || v21?.value?.memberld;
      if (!v22) {
        return false;
      }
      const v23 = await firebase.firestore().collection("members").where("walletUserId", "==", String(v22)).where("active", "==", true).limit(1).get();
      return !v23.empty;
    } catch {
      return false;
    }
  }
  function f6() {
    return document.querySelector("." + vLSXbuyListlist) !== null;
  }
  function f7() {
    v28.style.display = f6() ? "block" : "none";
  }
  function f8() {
    if (!f6()) {
      f15(true);
      f7();
      return;
    }
    const v24 = v31.value.trim();
    document.querySelectorAll("." + vLSXbuyListlist + " *").forEach(p4 => {
      if (p4.closest("." + vLSAmountfilterpanel)) {
        return;
      }
      if (p4.innerText?.includes("₹")) {
        p4.style.display = p4.innerText.includes("₹" + v24) && !p4.innerText.includes("₹" + v24 + "0") ? "" : "none";
      }
    });
  }
  function f9(p5) {
    const v25 = p5.getBoundingClientRect();
    return v25.width > 0 && v25.height > 0 && v25.top < window.innerHeight && v25.bottom > 0;
  }
  function f10() {
    if (v3) {
      return;
    }
    v3 = setInterval(() => {
      const v26 = document.querySelector(".item.active");
      if (v26) {
        v26.click();
      }
    }, 500);
  }
  function f11() {
    if (v4) {
      return;
    }
    v4 = setInterval(() => {
      document.querySelectorAll("div.x-row.x-row-middle button").forEach(p6 => {
        if (f9(p6)) {
          p6.click();
        }
      });
    }, 50);
  }
  function f12() {
    clearInterval(v3);
    clearInterval(v4);
    v3 = null;
    v4 = null;
  }
  function f13() {
    if (v5) {
      return;
    }
    v5 = true;
    let vLN0 = 0;
    const vSetInterval = setInterval(() => {
      const v27 = document.querySelector("div.x-row.x-row-between.bgfreo");
      if (v27) {
        v27.click();
        clearInterval(vSetInterval);
      } else if (++vLN0 >= 10) {
        clearInterval(vSetInterval);
      }
    }, 200);
  }
  function f14() {
    if (!v7 || v2) {
      return;
    }
    if (!f6()) {
      return;
    }
    v2 = true;
    v5 = false;
    f8();
    v = new MutationObserver(f8);
    v.observe(document.body, {
      childList: true,
      subtree: true
    });
    v35.textContent = "Active";
    v30.style.background = "#22c55e";
    f10();
    f11();
  }
  function f15(p7 = false) {
    if (!v2) {
      return;
    }
    v2 = false;
    f12();
    if (v) {
      v.disconnect();
    }
    f13();
    if (p7) {
      f();
    }
    v35.textContent = "Stopped";
    v30.style.background = "#ef4444";
  }
  const v28 = document.createElement("div");
  v28.className = vLSAmountfilterpanel;
  v28.style.cssText = "\n        position: fixed;\n        bottom: 24px;\n        right: 24px;\n        background: #fff;\n        border-radius: 12px;\n        padding: 14px;\n        width: 220px;\n        font-family: system-ui;\n        box-shadow: 0 12px 28px rgba(0,0,0,.15);\n        z-index: 999999;\n        display: none;\n    ";
  const v29 = document.createElement("div");
  v29.textContent = "AR Wallet";
  v29.style.cssText = "display:flex;justify-content:space-between;font-weight:600;margin-bottom:8px";
  const v30 = document.createElement("span");
  v30.style.cssText = "width:10px;height:10px;border-radius:50%;background:#ef4444";
  v29.appendChild(v30);
  const v31 = document.createElement("input");
  v31.type = "number";
  v31.value = "1000";
  v31.style.cssText = "\n        width:100%;\n        padding:8px;\n        margin-bottom:10px;\n        border:1px solid #d1d5db;\n        border-radius:6px;\n        background:#fff;\n        color:#111;\n        font-size:14px;\n    ";
  const v32 = document.createElement("div");
  v32.style.cssText = "display:flex;gap:8px";
  const v33 = document.createElement("button");
  v33.textContent = "Start";
  v33.style.cssText = "flex:1;background:#22c55e;color:#fff;border:none;padding:8px;border-radius:8px";
  const v34 = document.createElement("button");
  v34.textContent = "Stop";
  v34.style.cssText = "flex:1;background:#ef4444;color:#fff;border:none;padding:8px;border-radius:8px";
  const v35 = document.createElement("div");
  v35.style.cssText = "margin-top:10px;font-size:12px;text-align:center";
  v7 = await f5();
  f4();
  v35.textContent = v7 ? "Stopped" : "Access denied";
  v33.onclick = f14;
  v34.onclick = () => f15(false);
  v32.append(v33, v34);
  v28.append(v29, v31, v32, v35);
  document.body.appendChild(v28);
  new MutationObserver(f7).observe(document.body, {
    childList: true,
    subtree: true
  });
  f7();
})();

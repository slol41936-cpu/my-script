(async function () {
    "use strict";

    /* =========================================================
       AUTO MATCH MONITOR
       READ-ONLY / MANUAL PAYMENT
       ========================================================= */

    /* ---------- STYLE ---------- */

    if (!document.getElementById("matchMonitorStyle")) {
        const style = document.createElement("style");
        style.id = "matchMonitorStyle";

        style.textContent = `
        #matchMonitorPanel {
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 300px;
            z-index: 999999;
            background: #f0ebe4;
            border-radius: 22px;
            box-shadow:
                0 20px 45px rgba(0,0,0,.25),
                0 8px 16px rgba(0,0,0,.15),
                0 0 20px rgba(197,160,89,.15),
                inset 0 1px 1px rgba(255,255,255,.9);
            border: 1px solid rgba(255,255,255,.8);
            overflow: hidden;
            font-family:
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                Roboto,
                sans-serif;
            user-select: none;
        }

        .mm-header {
            padding: 12px 14px 8px;
            display: flex;
            align-items: center;
            gap: 9px;
            cursor: move;
        }

        .mm-badge {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background:
                radial-gradient(
                    circle at 35% 35%,
                    #ebd7b7,
                    #bfa37b,
                    #8a704c
                );
            color: white;
            font-size: 12px;
            box-shadow:
                inset 0 1px 2px rgba(255,255,255,.7),
                0 2px 5px rgba(0,0,0,.2);
        }

        .mm-title {
            color: #7d7265;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: .8px;
        }

        .mm-subtitle {
            color: #aaa095;
            font-size: 8px;
            margin-top: 2px;
        }

        .mm-body {
            padding: 8px 14px 14px;
        }

        .mm-label {
            display: block;
            color: #9d9489;
            font-size: 10px;
            font-weight: 700;
            margin: 7px 0 4px;
            text-transform: uppercase;
            letter-spacing: .5px;
        }

        .mm-toggle {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px;
        }

        .mm-option {
            padding: 8px 0;
            text-align: center;
            border-radius: 10px;
            background: #ded7ce;
            color: #8c8378;
            font-size: 11px;
            font-weight: 700;
            cursor: pointer;
        }

        .mm-option.active {
            background: #509796;
            color: white;
            box-shadow:
                0 0 0 1.5px rgba(226,177,89,.9),
                0 4px 10px rgba(80,151,150,.35);
        }

        .mm-input {
            width: 100%;
            height: 36px;
            box-sizing: border-box;
            border: 1px solid rgba(0,0,0,.04);
            border-radius: 10px;
            padding: 0 10px;
            outline: none;
            background: #ebe4dc;
            color: #554e44;
            font-size: 13px;
            font-weight: 700;
        }

        .mm-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 7px;
        }

        .mm-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-top: 12px;
        }

        .mm-btn {
            height: 35px;
            border: none;
            border-radius: 18px;
            font-size: 11px;
            font-weight: 800;
            cursor: pointer;
        }

        .mm-start {
            background: #54748b;
            color: white;
            border: 1px solid #d1b480;
        }

        .mm-stop {
            background: #b55e65;
            color: #ffd2d5;
        }

        .mm-btn:disabled {
            opacity: .45;
            cursor: not-allowed;
        }

        .mm-status {
            margin-top: 10px;
            min-height: 42px;
            border-radius: 10px;
            background: #ded7cd;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 0 8px;
            color: #7d7265;
            font-size: 10px;
            font-weight: 700;
            line-height: 15px;
        }

        .mm-result {
            display: none;
            margin-top: 8px;
            padding: 10px;
            border-radius: 10px;
            background: #dfece5;
            color: #3d8573;
            font-size: 10px;
            line-height: 17px;
            font-weight: 700;
        }

        .mm-result.show {
            display: block;
        }

        .mm-note {
            margin-top: 8px;
            text-align: center;
            color: #a59c91;
            font-size: 8px;
        }
        `;

        document.head.appendChild(style);
    }

    /* ---------- REMOVE OLD PANEL ---------- */

    document.getElementById("cyberPanel")?.remove();
    document.getElementById("cyberOverlay")?.remove();
    document.getElementById("matchMonitorPanel")?.remove();

    /* ---------- PANEL ---------- */

    const panel = document.createElement("div");
    panel.id = "matchMonitorPanel";

    panel.innerHTML = `
        <div class="mm-header" id="mmDrag">
            <div class="mm-badge">⚡</div>
            <div>
                <div class="mm-title">ORDER MATCH MONITOR</div>
                <div class="mm-subtitle">READ-ONLY • MANUAL PAYMENT</div>
            </div>
        </div>

        <div class="mm-body">

            <label class="mm-label">Payment Type</label>

            <div class="mm-toggle" id="mmType">
                <div class="mm-option active" data-type="1">
                    UPI
                </div>
                <div class="mm-option" data-type="2">
                    BANK
                </div>
            </div>

            <label class="mm-label">Amount Range</label>

            <div class="mm-row">
                <input
                    id="mmMin"
                    class="mm-input"
                    type="number"
                    min="1"
                    value="1000"
                    placeholder="Min"
                >

                <input
                    id="mmMax"
                    class="mm-input"
                    type="number"
                    min="1"
                    value="2000"
                    placeholder="Max"
                >
            </div>

            <label class="mm-label">Payment Route Code</label>

            <input
                id="mmBankCode"
                class="mm-input"
                type="text"
                value="paytm"
                placeholder="Example: paytm"
            >

            <div class="mm-buttons">
                <button id="mmStart" class="mm-btn mm-start">
                    START
                </button>

                <button id="mmStop" class="mm-btn mm-stop">
                    STOP
                </button>
            </div>

            <div id="mmStatus" class="mm-status">
                Ready
            </div>

            <div id="mmResult" class="mm-result"></div>

            <div class="mm-note">
                Match detected only. Payment must be completed manually.
            </div>

        </div>
    `;

    document.body.appendChild(panel);

    const typeBox = document.getElementById("mmType");
    const minInput = document.getElementById("mmMin");
    const maxInput = document.getElementById("mmMax");
    const bankCodeInput = document.getElementById("mmBankCode");
    const startButton = document.getElementById("mmStart");
    const stopButton = document.getElementById("mmStop");
    const statusBox = document.getElementById("mmStatus");
    const resultBox = document.getElementById("mmResult");

    /* ---------- STATE ---------- */

    let selectedOrderType = 1;
    let running = false;
    let busy = false;

    /* ---------- STATUS ---------- */

    function setStatus(message, type = "normal") {
        statusBox.textContent = message;

        if (type === "success") {
            statusBox.style.color = "#3d8573";
            statusBox.style.border =
                "1px solid rgba(61,133,115,.4)";
        } else if (type === "error") {
            statusBox.style.color = "#ba5d58";
            statusBox.style.border =
                "1px solid rgba(186,93,88,.3)";
        } else {
            statusBox.style.color = "#7d7265";
            statusBox.style.border = "none";
        }
    }

    function showResult(data) {
        const info = data?.data || {};
        const matchInfo = info?.matchInfo || {};

        const amount =
            matchInfo.amount ??
            info.amount ??
            "Unknown";

        const orderType =
            matchInfo.orderType ??
            info.orderType ??
            selectedOrderType;

        const platformOrder =
            matchInfo.platformOrder ??
            info.platformOrder ??
            "";

        resultBox.innerHTML = `
            🟢 ORDER MATCHED<br>
            Amount: ₹${amount}<br>
            Type: ${Number(orderType) === 1 ? "UPI" : "BANK"}
            ${
                platformOrder
                    ? `<br>Order: ${String(platformOrder)}`
                    : ""
            }
            <br><br>
            ⚠️ Manual payment required
        `;

        resultBox.classList.add("show");
    }

    /* ---------- TOGGLE ---------- */

    typeBox.querySelectorAll(".mm-option").forEach(option => {
        option.addEventListener("click", () => {

            if (running) {
                setStatus(
                    "Stop monitoring before changing payment type.",
                    "error"
                );
                return;
            }

            typeBox
                .querySelectorAll(".mm-option")
                .forEach(x => x.classList.remove("active"));

            option.classList.add("active");

            selectedOrderType =
                Number(option.dataset.type);

            resultBox.classList.remove("show");

            setStatus(
                selectedOrderType === 1
                    ? "UPI selected"
                    : "BANK selected"
            );
        });
    });

    /* ---------- AUTH ---------- */

    function getToken() {
        let token = null;

        try {
            const raw =
                localStorage.getItem("token");

            if (raw) {
                try {
                    token =
                        JSON.parse(raw)?.value ||
                        raw;
                } catch {
                    token = raw;
                }
            }
        } catch {}

        if (!token && window.token?.value) {
            token = window.token.value;
        }

        return token;
    }

    function getBuyerKycId() {
        try {
            const raw =
                localStorage.getItem("userInfo");

            if (!raw) return "";

            const info = JSON.parse(raw);

            return (
                info?.value?.buyerKycId ||
                info?.value?.buyerKycld ||
                info?.buyerKycId ||
                info?.buyerKycld ||
                ""
            );
        } catch {
            return "";
        }
    }

    /* ---------- API ---------- */

    async function checkMatch() {

        const minAmount =
            Number(minInput.value);

        const maxAmount =
            Number(maxInput.value);

        const bankCode =
            bankCodeInput.value.trim();

        const token = getToken();
        const buyerKycId = getBuyerKycId();

        if (!token) {
            setStatus(
                "Token not found. Please login first.",
                "error"
            );
            return null;
        }

        if (!minAmount || !maxAmount) {
            setStatus(
                "Enter minimum and maximum amount.",
                "error"
            );
            return null;
        }

        if (minAmount > maxAmount) {
            setStatus(
                "Minimum cannot be greater than maximum.",
                "error"
            );
            return null;
        }

        if (!buyerKycId) {
            setStatus(
                "Buyer KYC ID not found on this page.",
                "error"
            );
            return null;
        }

        const headers = {
            "accept":
                "application/json, text/plain, */*",

            "content-type":
                "application/json",

            "authorization":
                "Bearer " + token
        };

        const payload = {
            maxAmount: maxAmount,
            minAmount: minAmount,
            orderType: selectedOrderType,
            buyBankCode: bankCode,
            buyerKycId: buyerKycId
        };

        try {

            setStatus(
                `Checking ₹${minAmount} - ₹${maxAmount}...`
            );

            const response = await fetch(
                "https://apiweb.arbpay.me/ar-wallet/smartRangeBuy/match/start",
                {
                    method: "POST",
                    headers,
                    body: JSON.stringify(payload)
                }
            );

            const data =
                await response.json();

            console.log(
                "[MATCH MONITOR] Response:",
                data
            );

            if (!response.ok) {
                setStatus(
                    `HTTP Error ${response.status}`,
                    "error"
                );
                return data;
            }

            const matchResult =
                data?.data?.matchResult;

            if (matchResult === "MATCHED") {

                running = false;

                startButton.disabled = false;

                setStatus(
                    "🟢 ORDER MATCHED",
                    "success"
                );

                showResult(data);

                return data;
            }

            if (
                matchResult === "NOT_MATCHED"
            ) {

                setStatus(
                    `No match yet • ₹${minAmount}-₹${maxAmount}`
                );

                return data;
            }

            setStatus(
                data?.msg ||
                "No match result received."
            );

            return data;

        } catch (error) {

            console.error(
                "[MATCH MONITOR] Error:",
                error
            );

            setStatus(
                "Connection error. Retrying...",
                "error"
            );

            return null;
        }
    }

    /* ---------- MONITOR LOOP ---------- */

    async function monitor() {

        if (busy || !running) {
            return;
        }

        busy = true;

        try {

            const result =
                await checkMatch();

            const matchResult =
                result?.data?.matchResult;

            if (
                matchResult === "MATCHED"
            ) {
                running = false;
                return;
            }

        } finally {

            busy = false;
        }

        if (running) {
            setTimeout(
                monitor,
                1000
            );
        }
    }

    /* ---------- START ---------- */

    startButton.addEventListener(
        "click",
        () => {

            if (running) {
                return;
            }

            resultBox.classList.remove(
                "show"
            );

            running = true;

            startButton.disabled = true;

            setStatus(
                "🟢 Monitoring started..."
            );

            monitor();
        }
    );

    /* ---------- STOP ---------- */

    stopButton.addEventListener(
        "click",
        () => {

            running = false;
            busy = false;

            startButton.disabled = false;

            setStatus(
                "🔴 Monitoring stopped.",
                "error"
            );
        }
    );

    /* ---------- DRAG ---------- */

    const dragHandle =
        document.getElementById("mmDrag");

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    dragHandle.addEventListener(
        "mousedown",
        event => {

            dragging = true;

            offsetX =
                event.clientX -
                panel.offsetLeft;

            offsetY =
                event.clientY -
                panel.offsetTop;
        }
    );

    document.addEventListener(
        "mouseup",
        () => {
            dragging = false;
        }
    );

    document.addEventListener(
        "mousemove",
        event => {

            if (!dragging) {
                return;
            }

            panel.style.left =
                event.clientX -
                offsetX +
                "px";

            panel.style.top =
                event.clientY -
                offsetY +
                "px";

            panel.style.right = "auto";
            panel.style.bottom = "auto";
        }
    );

    /* ---------- READY ---------- */

    console.log(
        "[MATCH MONITOR] Ready"
    );

    setStatus(
        "Ready • Select range and press START."
    );

})();

(async () => {
    // Remove old panel
    document.getElementById("orderMatchMonitor")?.remove();

    const panel = document.createElement("div");
    panel.id = "orderMatchMonitor";

    panel.innerHTML = `
        <div style="
            position:fixed;
            right:15px;
            bottom:15px;
            width:320px;
            z-index:999999;
            background:#f0ebe4;
            color:#554e44;
            border-radius:22px;
            padding:16px;
            font-family:Arial,sans-serif;
            box-shadow:0 20px 45px rgba(0,0,0,.30);
        ">

            <div style="
                font-size:15px;
                font-weight:800;
                margin-bottom:3px;
            ">
                ⚡ ORDER MATCH MONITOR
            </div>

            <div style="
                font-size:10px;
                color:#9d9489;
                margin-bottom:14px;
            ">
                READ-ONLY • MANUAL PAYMENT
            </div>

            <div id="ommStatus" style="
                background:#ded7cd;
                border-radius:10px;
                padding:11px;
                text-align:center;
                font-size:12px;
                font-weight:700;
            ">
                🟡 WAITING...
            </div>

            <div id="ommInfo" style="
                margin-top:12px;
                background:#e7e0d7;
                border-radius:12px;
                padding:12px;
                font-size:12px;
                line-height:1.8;
            ">
                No match information yet.
            </div>

            <button id="ommStop" style="
                width:100%;
                height:36px;
                margin-top:12px;
                border:0;
                border-radius:18px;
                background:#b55e65;
                color:white;
                font-weight:800;
            ">
                STOP MONITOR
            </button>
        </div>
    `;

    document.body.appendChild(panel);

    const status = document.getElementById("ommStatus");
    const info = document.getElementById("ommInfo");
    const stop = document.getElementById("ommStop");

    let running = true;

    function updateStatus(text, matched = false) {
        status.textContent = text;

        if (matched) {
            status.style.background = "#cfe6dc";
            status.style.color = "#23745e";
        } else {
            status.style.background = "#ded7cd";
            status.style.color = "#7d7265";
        }
    }

    function processMatchResponse(response) {
        if (!response) return;

        const data = response?.data || {};
        const matchInfo = data?.matchInfo || {};

        const result =
            data?.matchResult ||
            matchInfo?.matchResult ||
            "";

        const amount =
            matchInfo?.amount ??
            data?.amount ??
            data?.payTime ??
            "-";

        const minAmount =
            data?.minAmount ??
            matchInfo?.minAmount ??
            "-";

        const maxAmount =
            data?.maxAmount ??
            matchInfo?.maxAmount ??
            "-";

        const orderType =
            data?.orderType ??
            matchInfo?.orderType ??
            "-";

        const statusValue =
            matchInfo?.status ??
            data?.status ??
            "-";

        const buyerKycId =
            matchInfo?.buyerKycId ??
            data?.buyerKycId ??
            "";

        const buyBankCode =
            matchInfo?.buyBankCode ??
            data?.buyBankCode ??
            "-";

        console.log("MATCH RESPONSE:", response);

        // MATCHED
        if (String(result).toUpperCase() === "MATCHED") {

            updateStatus("🟢 ORDER MATCHED", true);

            info.innerHTML = `
                <b>Amount:</b> ₹${amount}<br>
                <b>Order Type:</b> ${orderType}<br>
                <b>Buyer KYC ID:</b> ${buyerKycId || "Not returned"}<br>
                <b>Payment Route:</b> ${buyBankCode}<br>
                <b>Status:</b> ${statusValue}<br>
                <b>Match:</b> ${result}
                <hr style="border:0;border-top:1px solid #ccc;">
                <b style="color:#b55e65;">
                    ⚠️ MATCH FOUND<br>
                    Complete payment manually.
                </b>
            `;

            try {
                navigator.vibrate?.([300,150,300,150,500]);
            } catch {}

            alert(
                "🟢 ORDER MATCHED!\n\n" +
                "Amount: ₹" + amount +
                "\n\nPayment must be completed manually."
            );

            return;
        }

        // NOT MATCHED
        updateStatus(
            "🟡 " + (result || "NOT MATCHED")
        );

        info.innerHTML = `
            <b>Amount Range:</b> ₹${minAmount} - ₹${maxAmount}<br>
            <b>Order Type:</b> ${orderType}<br>
            <b>Buyer KYC ID:</b> ${buyerKycId || "Not returned"}<br>
            <b>Payment Route:</b> ${buyBankCode}<br>
            <b>Status:</b> ${statusValue}<br>
            <b>Match Result:</b> ${result || "-"}
        `;
    }

    // Save original fetch
    const originalFetch = window.fetch;

    // Monitor fetch
    window.fetch = async function (...args) {

        const response =
            await originalFetch.apply(this, args);

        if (!running) {
            return response;
        }

        try {

            const url =
                typeof args[0] === "string"
                    ? args[0]
                    : args[0]?.url || "";

            // Only monitor current matching endpoint
            if (
                url.includes(
                    "/ar-wallet/smartRangeBuy/match/start"
                )
            ) {

                const clonedResponse =
                    response.clone();

                clonedResponse
                    .json()
                    .then(data => {
                        processMatchResponse(data);
                    })
                    .catch(err => {
                        console.log(
                            "Response parse error:",
                            err
                        );
                    });
            }

        } catch (err) {
            console.log(
                "Monitor error:",
                err
            );
        }

        return response;
    };

    stop.onclick = () => {

        running = false;

        // Restore original fetch
        window.fetch = originalFetch;

        updateStatus("🔴 MONITOR STOPPED");

        info.innerHTML = `
            Monitoring stopped.
        `;

        stop.remove();
    };

    updateStatus("🟢 MONITORING...");

    console.log(
        "ORDER MATCH MONITOR ACTIVE"
    );

})();

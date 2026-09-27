(async function () {
    "use strict";

    /* =========================================================
       ORDER MATCH MONITOR
       READ ONLY
       NO BUY
       NO PAYMENT
       NO beforeBuy
       ========================================================= */

    // ---------------------------------------------------------
    // 1. Remove previous monitor
    // ---------------------------------------------------------

    document.getElementById("orderMatchMonitor")?.remove();

    // ---------------------------------------------------------
    // 2. UI
    // ---------------------------------------------------------

    const panel = document.createElement("div");

    panel.id = "orderMatchMonitor";

    panel.innerHTML = `
        <div id="ommBox">

            <div id="ommHeader">
                <div id="ommIcon">⚡</div>

                <div>
                    <div id="ommTitle">
                        ORDER MATCH MONITOR
                    </div>

                    <div id="ommSub">
                        READ-ONLY • MANUAL PAYMENT
                    </div>
                </div>

                <button id="ommClose">×</button>
            </div>


            <div id="ommStatus">
                🟡 WAITING FOR MATCH...
            </div>


            <div class="ommSection">

                <div class="ommLabel">
                    MATCH INFORMATION
                </div>

                <div class="ommInfo">

                    <div class="ommRow">
                        <span>Result</span>
                        <b id="ommResult">—</b>
                    </div>

                    <div class="ommRow">
                        <span>Amount</span>
                        <b id="ommAmount">—</b>
                    </div>

                    <div class="ommRow">
                        <span>Amount Range</span>
                        <b id="ommRange">—</b>
                    </div>

                    <div class="ommRow">
                        <span>Order Type</span>
                        <b id="ommOrderType">—</b>
                    </div>

                    <div class="ommRow">
                        <span>Buyer KYC ID</span>
                        <b id="ommKyc">—</b>
                    </div>

                    <div class="ommRow">
                        <span>Payment Route</span>
                        <b id="ommRoute">—</b>
                    </div>

                    <div class="ommRow">
                        <span>Status</span>
                        <b id="ommMatchStatus">—</b>
                    </div>

                </div>

            </div>


            <div class="ommNotice" id="ommNotice">
                Waiting for the site's matching response...
            </div>


            <div id="ommButtons">

                <button id="ommClear">
                    CLEAR
                </button>

                <button id="ommStop">
                    STOP
                </button>

            </div>


            <div id="ommFooter">
                Monitor only • Payment must be completed manually
            </div>

        </div>
    `;

    document.body.appendChild(panel);


    // ---------------------------------------------------------
    // 3. CSS
    // ---------------------------------------------------------

    const style = document.createElement("style");

    style.id = "ommStyle";

    style.textContent = `

        #orderMatchMonitor {
            position:fixed;
            right:18px;
            bottom:18px;
            z-index:2147483647;
            font-family:
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                Roboto,
                Arial,
                sans-serif;
            user-select:none;
        }

        #ommBox {
            width:320px;
            background:#f0ebe4;
            color:#554e44;
            border-radius:22px;
            padding:15px;
            box-sizing:border-box;

            box-shadow:
                0 22px 50px rgba(0,0,0,.30),
                0 8px 20px rgba(0,0,0,.15),
                inset 0 1px 1px rgba(255,255,255,.9);

            border:1px solid rgba(255,255,255,.8);
        }

        #ommHeader {
            display:flex;
            align-items:center;
            gap:9px;
            margin-bottom:12px;
        }

        #ommIcon {
            width:32px;
            height:32px;
            border-radius:50%;

            display:flex;
            align-items:center;
            justify-content:center;

            background:
                radial-gradient(
                    circle at 35% 35%,
                    #ebd7b7,
                    #bfa37b,
                    #8a704c
                );

            color:white;
            font-size:14px;

            box-shadow:
                inset 0 1px 2px rgba(255,255,255,.7),
                0 3px 7px rgba(0,0,0,.2);
        }

        #ommTitle {
            font-size:13px;
            font-weight:800;
            letter-spacing:.5px;
        }

        #ommSub {
            font-size:9px;
            color:#9d9489;
            margin-top:2px;
            letter-spacing:.4px;
        }

        #ommClose {
            margin-left:auto;
            width:27px;
            height:27px;
            border:0;
            border-radius:50%;
            background:transparent;
            color:#8c8378;
            font-size:

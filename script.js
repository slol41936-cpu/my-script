(function () {
    // ============================================================
    //  AR Wallet PRO — Advanced Edition
    //  fixes: missed-order skip, faster polling, no repeat-click
    // ============================================================

    /* ---------- CONFIG (সহজে বদলাও) ---------- */
    const POLL_MS          = 180;   // মূল poll speed (ms) — কম = দ্রুত
    const CLICK_COOLDOWN_MS = 900;  // একটা click-এর পরে অপেক্ষা
    const PAYMENT_WAIT_MS  = 1400;  // payment page check delay
    const TAB_SWITCH_MS    = 35;    // Default↔Large switch gap
    const SOUND_LIMIT_MS   = 4000;  // sound কতক্ষণ চলবে
    /* ----------------------------------------- */

    const TARGET_CLASS = 'x-buyList-list';
    const PANEL_CLASS  = 'arw-panel-v2';

    const allowedMembers = [
        "21248739","22801760","24541398","23631188",
        "26019413","21114464","29021111","29780075",
    ];

    /* ---------- AUTH ---------- */
    let isAllowedUser = false;
    try {
        const ui  = JSON.parse(localStorage.getItem("userInfo"));
        const mid = ui?.value?.memberld || ui?.value?.memberId;
        if (mid && allowedMembers.includes(String(mid))) isAllowedUser = true;
    } catch (_) {}

    /* ---------- STATE ---------- */
    let running              = false;
    let pollTimer            = null;
    let observer             = null;
    let soundPlayed          = false;
    let lastClickedAmount    = null;   // ← শেষ যে amount-এ click হয়েছে
    let lastClickedTime      = 0;      // ← সেই click-এর সময়
    let missedOrderAmount    = null;   // ← miss হলে সেই amount skip করতে
    let skipUntil            = 0;      // ← কতক্ষণ skip করব

    /* ---------- SOUND ---------- */
    const sound = new Audio(
        "https://raw.githubusercontent.com/slol41936-cpu/my-script/main/Fahhh-%20sound%20effect%20(HD)%20-%20HighQualitySFX.mp3"
    );
    sound.loop   = false;
    sound.volume = 1;

    function playSound() {
        if (soundPlayed) return;
        sound.currentTime = 0;
        sound.play().catch(() => {});
        soundPlayed = true;
        setTimeout(() => { sound.pause(); sound.currentTime = 0; }, SOUND_LIMIT_MS);
    }

    /* ---------- DIALOG SUPPRESSION ---------- */
    window.alert   = () => true;
    window.confirm = () => true;

    /* ---------- HELPERS ---------- */
    function getTargetAmount() { return amountInput.value.trim(); }

    function isPaymentPage() {
        const t = document.body.innerText;
        return t.includes("Select Method Payment")
            || t.includes("Please select payment account")
            || t.includes("Choose UPI")
            || t.includes("Submit UTR");
    }

    function isFailedPage() {
        const t = document.body.innerText.toLowerCase();
        return t.includes("someone else")
            || t.includes("bought by")
            || t.includes("already taken")
            || t.includes("failed");
    }

    function isCrashPage() {
        return document.body.innerText.includes("contact customer service");
    }

    /* ============================================================
       CORE — অর্ডার খোঁজা ও click
       returns: 'clicked' | 'not_found' | 'all_skipped'
    ============================================================ */
    function tryBuy() {
        if (!running) return 'not_found';

        const list = document.querySelector(`.${TARGET_CLASS}`);
        if (!list) return 'not_found';

        const target   = getTargetAmount();
        const now      = Date.now();
        const orders   = Array.from(list.children);

        // ── প্রতিটা অর্ডার scan করো ──
        for (const order of orders) {
            const text = order.innerText;
            if (!text || !text.includes('₹')) continue;

            const amtMatch = text.replace(/,/g, '').match(/₹\s*(\d+)/);
            if (!amtMatch) continue;
            const orderAmt = amtMatch[1];

            if (orderAmt !== target) continue;  // amount মিলছে না — পরের টায় যাও

            // ── আগের click-এর cooldown চলছে কিনা দেখো ──
            if (now - lastClickedTime < CLICK_COOLDOWN_MS) return 'cooldown';

            // ── miss হওয়া অর্ডার skip window চলছে কিনা ──
            if (orderAmt === missedOrderAmount && now < skipUntil) {
                // এই অর্ডারটা skip — পরের order নেই তাই 'all_skipped'
                return 'all_skipped';
            }

            // ── Buy button খোঁজো ──
            const btn = order.querySelector('button, .van-button');
            if (!btn) continue;

            // ── CLICK! ──
            btn.click();
            lastClickedAmount = orderAmt;
            lastClickedTime   = now;
            missedOrderAmount  = null;   // নতুন click — পুরনো skip সরাও
            skipUntil          = 0;

            statusMsg.textContent = `⚡ Clicked ₹${orderAmt}`;

            // PAYMENT PAGE চেক
            setTimeout(() => {
                if (isPaymentPage()) {
                    playSound();
                    stopBot();
                    statusMsg.textContent = `✅ Order Placed ₹${orderAmt}`;
                } else if (isFailedPage()) {
                    // ── MISS হয়েছে → skip করো, পরের অর্ডারে যাও ──
                    missedOrderAmount = orderAmt;
                    skipUntil         = Date.now() + 3000; // 3 সেকেন্ড skip
                    soundPlayed       = false;
                    statusMsg.textContent = `⚠️ Missed ₹${orderAmt} — skipping`;
                    restartPoll();
                } else {
                    // unknown state — চালিয়ে যাও
                    soundPlayed = false;
                    restartPoll();
                }
            }, PAYMENT_WAIT_MS);

            return 'clicked';
        }

        return 'not_found';
    }

    /* ---------- TAB SWITCHER (Default ↔ Large) ---------- */
    function switchTabs() {
        const allEls     = document.querySelectorAll('div, span, .van-tab');
        let defaultTab = null, largeTab = null;
        allEls.forEach(el => {
            const t = el.innerText?.trim();
            if (t === 'Default') defaultTab = el;
            if (t === 'Large')   largeTab   = el;
        });
        if (defaultTab) {
            defaultTab.click();
            setTimeout(() => { if (largeTab) largeTab.click(); }, TAB_SWITCH_MS);
        }
    }

    /* ---------- MAIN POLL LOOP ---------- */
    function poll() {
        if (!running) return;

        // crash check
        if (isCrashPage()) { location.reload(); return; }

        // payment page check (race condition guard)
        if (isPaymentPage()) { playSound(); stopBot(); return; }

        const result = tryBuy();

        if (result === 'clicked' || result === 'cooldown') {
            // click হয়েছে — PAYMENT_WAIT_MS পরে আবার শুরু হবে callback থেকে
            return;
        }

        // অর্ডার পাওয়া যায়নি বা skip — tab switch + আবার poll
        if (result === 'not_found' || result === 'all_skipped') {
            switchTabs();
        }

        // পরের poll schedule
        pollTimer = setTimeout(poll, POLL_MS);
    }

    function restartPoll() {
        if (pollTimer) clearTimeout(pollTimer);
        pollTimer = setTimeout(poll, POLL_MS);
    }

    /* ---------- MutationObserver (DOM change হলে তাৎক্ষণিক চেক) ---------- */
    function attachObserver() {
        if (observer) observer.disconnect();
        observer = new MutationObserver(() => {
            if (!running) return;
            if (isPaymentPage()) { playSound(); stopBot(); return; }
            // poll running থাকলে extra trigger দরকার নেই
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    /* ---------- START / STOP ---------- */
    function startBot() {
        if (!isAllowedUser || running) return;
        running           = true;
        soundPlayed       = false;
        missedOrderAmount = null;
        skipUntil         = 0;
        lastClickedTime   = 0;
        statusDot.style.background = '#22c55e';
        statusMsg.textContent = '🟢 Running...';
        attachObserver();
        poll();
    }

    function stopBot() {
        if (!running) return;
        running = false;
        if (pollTimer) clearTimeout(pollTimer);
        if (observer)  observer.disconnect();
        statusDot.style.background = '#ef4444';
        if (!statusMsg.textContent.startsWith('✅')) {
            statusMsg.textContent = '🔴 Stopped';
        }
    }

    /* ============================================================
       UI PANEL
    ============================================================ */
    const panel = document.createElement('div');
    panel.className = PANEL_CLASS;
    panel.style.cssText = `
        position: fixed; bottom: 20px; right: 16px;
        background: #fff; border-radius: 14px;
        padding: 14px 16px; width: 210px;
        font-family: system-ui, sans-serif;
        box-shadow: 0 8px 32px rgba(0,0,0,0.18);
        z-index: 999999; user-select: none;
    `;

    panel.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
            <span style="font-weight:800;font-size:15px;color:#111;">AR Wallet PRO</span>
            <span id="sDot2" style="width:10px;height:10px;border-radius:50%;background:#ef4444;transition:background .3s;"></span>
        </div>

        <input type="number" id="amtInp2" value="1000"
            style="width:100%;padding:8px;margin-bottom:10px;border:1.5px solid #d1d5db;
                   border-radius:8px;font-size:15px;text-align:center;font-weight:700;
                   outline:none;box-sizing:border-box;">

        <div style="display:flex;gap:8px;margin-bottom:10px;">
            <button id="sBtn2"
                style="flex:1;background:#22c55e;color:#fff;border:none;border-radius:8px;
                       padding:10px 0;font-size:14px;font-weight:700;cursor:pointer;">Start</button>
            <button id="tBtn2"
                style="flex:1;background:#ef4444;color:#fff;border:none;border-radius:8px;
                       padding:10px 0;font-size:14px;font-weight:700;cursor:pointer;">Stop</button>
        </div>

        <div id="sMsg2" style="text-align:center;font-size:11.5px;font-weight:600;
                               color:#6b7280;min-height:16px;">
            ${isAllowedUser ? '🟢 Ready' : '🔴 Access Denied'}
        </div>
    `;

    document.body.appendChild(panel);

    const amountInput = panel.querySelector('#amtInp2');
    const statusDot   = panel.querySelector('#sDot2');
    const statusMsg   = panel.querySelector('#sMsg2');

    panel.querySelector('#sBtn2').onclick = startBot;
    panel.querySelector('#tBtn2').onclick = stopBot;

    /* panel visibility */
    setInterval(() => {
        const list = document.querySelector(`.${TARGET_CLASS}`);
        panel.style.display = list ? 'block' : 'none';
    }, 800);

})();

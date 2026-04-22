(function () {
    let observer = null;
    let running = false;
    let refreshInterval = null;

    const PANEL_CLASS = 'amount-filter-panel';
    const TARGET_CLASS = 'x-buyList-list';

    // ১. আপনার আইডিগুলো
    const allowedMembers = [
        "21248739",
        "22801760"
    ]; 
    
    let isAllowedUser = false;

    try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const memberId = userInfo?.value?.memberld || userInfo?.value?.memberId;
        if (memberId && allowedMembers.includes(String(memberId))) {
            isAllowedUser = true;
        }
    } catch (e) {}

    // ২. অটো পপ-আপ রিমুভাল (যাতে কোনো অ্যালার্ট কাজ না থামায়)
    window.alert = function() { return true; };
    window.confirm = function() { return true; };

    function isTargetAvailable() {
        return document.querySelector(`.${TARGET_CLASS}`) !== null;
    }

    function updatePanelVisibility() {
        panel.style.display = isTargetAvailable() ? 'block' : 'none';
    }

    function getAllowedAmount() {
        return amountInput.value.trim();
    }

    function filterAmount() {
        if (!isTargetAvailable()) return;

        const allowed = getAllowedAmount();
        const orders = document.querySelectorAll(`.${TARGET_CLASS} > *`);

        orders.forEach(order => {
            if (order.closest(`.${PANEL_CLASS}`)) return;

            const text = order.innerText;
            if (text && text.includes('₹')) {
                const numbers = text.replace(/,/g, '').match(/\d+/g);
                const orderAmount = numbers ? numbers[0] : null;

                // নিখুঁত অ্যামাউন্ট চেক (বড় অ্যামাউন্ট সমস্যা সমাধান)
                if (orderAmount === allowed) {
                    order.style.display = '';
                    const buyBtn = order.querySelector('button') || order.querySelector('.van-button');
                    if (buyBtn && running) {
                        buyBtn.click();
                        stopFilter();
                    }
                } else {
                    order.style.display = 'none';
                }
            }
        });
    }

    // ৩. রিফ্রেশ লজিক (১ সেকেন্ড রেট)
    function startRefresh() {
        refreshInterval = setInterval(() => {
            if (!running) return;

            // ব্লক মেসেজ আসলে অটো রিলোড লজিক
            if (document.body.innerText.includes("contact customer service")) {
                location.reload();
                return;
            }

            const bankTab = Array.from(document.querySelectorAll('.van-tab, .van-tab__text')).find(el => el.innerText.includes('BANK'));
            if (bankTab) bankTab.click();

            setTimeout(() => {
                const largeTab = Array.from(document.querySelectorAll('div, span, p')).find(el => el.innerText && el.innerText.trim() === 'Large');
                if (largeTab) largeTab.click();
            }, 250); // ট্যাব সুইচের মাঝে গ্যাপ কমানো হয়েছে

        }, 1000); // আপনার অনুরোধ অনুযায়ী ১ সেকেন্ড করে দেওয়া হলো
    }

    function startFilter() {
        if (!isAllowedUser || running) return;
        running = true;
        filterAmount();
        startRefresh(); 

        observer = new MutationObserver(() => {
            filterAmount();
        });

        observer.observe(document.body, { childList: true, subtree: true });
        statusText.textContent = 'Mode: 1s Active';
        statusDot.style.background = '#22c55e';
    }

    function stopFilter() {
        if (!running) return;
        running = false;
        if (observer) observer.disconnect();
        if (refreshInterval) clearInterval(refreshInterval);
        statusText.textContent = 'Stopped';
        statusDot.style.background = '#ef4444';
    }

    const panel = document.createElement('div');
    panel.className = PANEL_CLASS;
    panel.style.cssText = `position: fixed; bottom: 24px; right: 24px; background: #ffffff; border-radius: 12px; padding: 14px; width: 220px; font-family: system-ui; box-shadow: 0 12px 28px rgba(0,0,0,0.15); z-index: 999999; display: none;`;

    panel.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; font-weight: 600; font-size: 14px;">
            AR Wallet Safe <span id="sDot" style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444;"></span>
        </div>
        <input type="number" id="amtInp" value="1000" style="width: 100%; padding: 6px 8px; margin-bottom: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; text-align: center; font-weight: bold;">
        <div style="display: flex; gap: 8px;">
            <button id="sBtn" style="flex: 1; background: #22c55e; color: #fff; border: none; border-radius: 8px; padding: 8px 0; font-size: 13px; cursor: pointer; font-weight: bold;">Start</button>
            <button id="tBtn" style="flex: 1; background: #ef4444; color: #fff; border: none; border-radius: 8px; padding: 8px 0; font-size: 13px; cursor: pointer; font-weight: bold;">Stop</button>
        </div>
        <div id="sTxt" style="margin-top: 10px; font-size: 12px; text-align: center; color: #6b7280;">Ready</div>
    `;

    document.body.appendChild(panel);
    const amountInput = panel.querySelector('#amtInp');
    const statusDot = panel.querySelector('#sDot');
    const statusText = panel.querySelector('#sTxt');
    panel.querySelector('#sBtn').onclick = startFilter;
    panel.querySelector('#tBtn').onclick = stopFilter;

    setInterval(updatePanelVisibility, 1000);
})();

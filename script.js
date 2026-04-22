(function () {
    let observer = null;
    let running = false;
    let refreshInterval = null;

    const PANEL_CLASS = 'amount-filter-panel';
    const TARGET_CLASS = 'x-buyList-list';

    const allowedMembers ="21248739" 
    
    let isAllowedUser = false;

    try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const memberId = userInfo?.value?.memberld || userInfo?.value?.memberId;
        if (memberId && allowedMembers.includes(String(memberId))) {
            isAllowedUser = true;
        }
    } catch (e) {}

    const sound = new Audio("https://actions.google.com/sounds/v1/alarms/phone_alerts_and_rings.ogg");
    sound.loop = true;
    sound.volume = 1;

    function playAutoStopSound() {
        sound.currentTime = 0;
        sound.play().catch(() => {});
        setTimeout(() => {
            sound.pause();
            sound.currentTime = 0;
        }, 2000);
    }

    function isTargetAvailable() {
        return document.querySelector(`.${TARGET_CLASS}`) !== null;
    }

    function updatePanelVisibility() {
        panel.style.display = isTargetAvailable() ? 'block' : 'none';
    }

    function getAllowedAmount() {
        return amountInput.value.trim();
    }

    // শুধুমাত্র এই লজিকটি আপডেট করা হয়েছে বড় অ্যামাউন্ট আটকানোর জন্য
    function filterAmount() {
        if (!isTargetAvailable()) {
            stopFilter(true);
            updatePanelVisibility();
            return;
        }

        const allowed = getAllowedAmount();

        document.querySelectorAll(`.${TARGET_CLASS} > *`).forEach(order => {
            if (order.closest(`.${PANEL_CLASS}`)) return;

            const text = order.innerText;
            if (text && text.includes('₹')) {
                // নম্বরগুলো আলাদা করা যাতে ১১০০ বা ১০০০৫ এর মতো বড় সংখ্যা না ধরে
                const numbers = text.replace(/,/g, '').match(/\d+/g);
                const orderAmount = numbers ? numbers[0] : null;

                // একদম নিখুঁত ম্যাচ চেক
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

    function startRefresh() {
        refreshInterval = setInterval(() => {
            if (!running) return;

            const bankTab = Array.from(document.querySelectorAll('.van-tab, .van-tab__text')).find(el => el.innerText.includes('BANK'));
            if (bankTab) bankTab.click();

            const largeTab = Array.from(document.querySelectorAll('div, span, p')).find(el => el.innerText && el.innerText.trim() === 'Large');
            if (largeTab) largeTab.click();

        }, 700);
    }

    function startFilter() {
        if (!isAllowedUser || running) return;
        if (!isTargetAvailable()) {
            updatePanelVisibility();
            return;
        }

        running = true;
        filterAmount();
        startRefresh(); 

        observer = new MutationObserver(() => {
            updatePanelVisibility();
            filterAmount();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        statusText.textContent = 'Large Mode: Active';
        statusDot.style.background = '#22c55e';
    }

    function stopFilter(isAuto = false) {
        if (!running) return;
        running = false;

        if (observer) observer.disconnect();
        if (refreshInterval) clearInterval(refreshInterval);

        const target = document.querySelector(`.${TARGET_CLASS}`);
        if (target) {
            target.querySelectorAll('*').forEach(el => {
                if (el.closest(`.${PANEL_CLASS}`)) return;
                el.style.display = '';
            });
        }

        statusText.textContent = 'Stopped';
        statusDot.style.background = '#ef4444';

        if (isAuto) playAutoStopSound();
    }

    const panel = document.createElement('div');
    panel.className = PANEL_CLASS;
    panel.style.cssText = `position: fixed; bottom: 24px; right: 24px; background: #ffffff; border-radius: 12px; padding: 14px; width: 220px; font-family: system-ui; box-shadow: 0 12px 28px rgba(0,0,0,0.15); z-index: 999999; display: none;`;

    const header = document.createElement('div');
    header.style.cssText = `display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; font-weight: 600; font-size: 14px;`;
    header.textContent = 'AR Wallet Large';

    const statusDot = document.createElement('span');
    statusDot.style.cssText = `width: 10px; height: 10px; border-radius: 50%; background: #ef4444;`;
    header.appendChild(statusDot);

    const amountInput = document.createElement('input');
    amountInput.type = 'number';
    amountInput.value = '1000';
    amountInput.style.cssText = `width: 100%; padding: 6px 8px; margin-bottom: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; text-align: center;`;

    const btnWrap = document.createElement('div');
    btnWrap.style.cssText = `display: flex; gap: 8px;`;

    const startBtn = document.createElement('button');
    startBtn.textContent = 'Start';
    startBtn.style.cssText = `flex: 1; background: #22c55e; color: #fff; border: none; border-radius: 8px; padding: 8px 0; font-size: 13px; cursor: pointer;`;

    const stopBtn = document.createElement('button');
    stopBtn.textContent = 'Stop';
    stopBtn.style.cssText = `flex: 1; background: #ef4444; color: #fff; border: none; border-radius: 8px; padding: 8px 0; font-size: 13px; cursor: pointer;`;

    const statusText = document.createElement('div');
    statusText.style.cssText = `margin-top: 10px; font-size: 12px; text-align: center; color: #6b7280;`;

    if (!isAllowedUser) {
        startBtn.disabled = true;
        stopBtn.disabled = true;
        statusText.textContent = 'Not Allowed';
    } else {
        statusText.textContent = 'Stopped';
    }

    startBtn.onclick = startFilter;
    stopBtn.onclick = () => stopFilter(false);

    btnWrap.appendChild(startBtn);
    btnWrap.appendChild(stopBtn);
    panel.appendChild(header);
    panel.appendChild(amountInput);
    panel.appendChild(btnWrap);
    panel.appendChild(statusText);
    document.body.appendChild(panel);

    const globalObserver = new MutationObserver(updatePanelVisibility);
    globalObserver.observe(document.body, { childList: true, subtree: true });

    updatePanelVisibility();
})();
            

(function () {
    let grabInterval = null;
    let observer = null;
    let running = false;
    let currentTab = 'Default'; // ট্যাব সুইচ ট্র্যাক করার জন্য

    const PANEL_CLASS = 'amount-filter-panel';
    const TARGET_CLASS = 'x-buyList-list';

    // ১. মেম্বার আইডি চেক (আপনার অরিজিনাল লজিক)
    const allowedMembers = ["22801760"];
    let isAllowedUser = false;

    try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const memberId = userInfo?.value?.memberld || userInfo?.value?.memberId;
        if (memberId && allowedMembers.includes(String(memberId))) {
            isAllowedUser = true;
        }
    } catch (e) {}

    // ২. সাউন্ড সিস্টেম
    const successSound = new Audio("https://www.myinstants.com/media/sounds/funny-notification-sound.mp3");
    const stopAlarm = new Audio("https://actions.google.com/sounds/v1/alarms/phone_alerts_and_rings.ogg");

    function playAutoStopSound() {
        stopAlarm.currentTime = 0;
        stopAlarm.play().catch(() => {});
        setTimeout(() => { stopAlarm.pause(); stopAlarm.currentTime = 0; }, 2000);
    }

    function isTargetAvailable() {
        return document.querySelector(`.${TARGET_CLASS}`) !== null;
    }

    function updatePanelVisibility() {
        panel.style.display = isTargetAvailable() ? 'block' : 'none';
    }

    // ৩. অটো রিফ্রেশ ও অটো বাই লজিক
    function startFilter() {
        if (!isAllowedUser || running) return;
        if (!isTargetAvailable()) return;

        running = true;
        statusText.textContent = 'Turbo Active';
        statusDot.style.background = '#22c55e';

        const allowed = amountInput.value.trim();

        grabInterval = setInterval(() => {
            // A. ব্যাংক ট্যাব নিশ্চিত করা এবং Default/Large সুইচ করা
            const tabs = document.querySelectorAll('.van-tab, .van-tab__text, div, span');
            const bankTab = Array.from(tabs).find(el => el.innerText && el.innerText.includes('BANK'));
            if (bankTab) bankTab.click();

            const nextTabName = (currentTab === 'Default') ? 'Large' : 'Default';
            const targetTab = Array.from(document.querySelectorAll('div, span, p')).find(el => el.innerText && el.innerText.trim() === nextTabName);
            
            if (targetTab) {
                targetTab.click();
                currentTab = nextTabName;
            }

            // B. অর্ডার ফিল্টার এবং অটো বাই
            const orders = document.querySelectorAll(`.${TARGET_CLASS} > *`);
            orders.forEach(order => {
                const text = order.innerText;

                // নিখুঁত ১০০০ টাকা ফিল্টার
                if ((text.includes(`₹${allowed}`) || text.includes(`₹ ${allowed}`)) && 
                    !text.includes(`₹${allowed}0`) && !text.includes('110')) {
                    
                    const buyBtn = order.querySelector('button') || order.querySelector('.van-button') || order.querySelector('[class*="buy"]');
                    if (buyBtn) {
                        stopFilter();
                        panel.style.display = 'none';
                        successSound.play();
                        
                        // সরাসরি ক্লিক
                        buyBtn.click();
                        buyBtn.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                    }
                } else {
                    order.remove(); // ১০০০ না হলে ডিলিট (স্ক্রিন ক্লিন রাখতে)
                }
            });
        }, 600); // ০.৬ সেকেন্ড পর পর রিফ্রেশ

        // রিয়েল টাইম মনিটর
        observer = new MutationObserver(() => {
            if (!isTargetAvailable()) stopFilter(true);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function stopFilter(isAuto = false) {
        if (!running) return;
        running = false;
        clearInterval(grabInterval);
        if (observer) observer.disconnect();

        statusText.textContent = 'Stopped';
        statusDot.style.background = '#ef4444';
        if (isAuto) playAutoStopSound();
    }

    // ৪. প্যানেল ডিজাইন (আপনার অরিজিনাল স্টাইল)
    const panel = document.createElement('div');
    panel.className = PANEL_CLASS;
    panel.style.cssText = `position: fixed; bottom: 24px; right: 24px; background: #ffffff; border-radius: 12px; padding: 14px; width: 220px; font-family: system-ui; box-shadow: 0 12px 28px rgba(0,0,0,0.15); z-index: 999999; display: none;`;

    const header = document.createElement('div');
    header.style.cssText = `display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; font-weight: 600; font-size: 14px;`;
    header.textContent = 'AR Wallet Turbo';

    const statusDot = document.createElement('span');
    statusDot.style.cssText = `width: 10px; height: 10px; border-radius: 50%; background: #ef4444;`;
    header.appendChild(statusDot);

    const amountInput = document.createElement('input');
    amountInput.type = 'number';
    amountInput.value = '1000';
    amountInput.style.cssText = `width: 100%; padding: 6px 8px; margin-bottom: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; text-align: center; font-weight: bold;`;

    const btnWrap = document.createElement('div');
    btnWrap.style.cssText = `display: flex; gap: 8px;`;

    const startBtn = document.createElement('button');
    startBtn.textContent = 'Start';
    startBtn.style.cssText = `flex: 1; background: #22c55e; color: #fff; border: none; border-radius: 8px; padding: 8px 0; font-size: 13px; cursor: pointer; font-weight: bold;`;

    const stopBtn = document.createElement('button');
    stopBtn.textContent = 'Stop';
    stopBtn.style.cssText = `flex: 1; background: #ef4444; color: #fff; border: none; border-radius: 8px; padding: 8px 0; font-size: 13px; cursor: pointer; font-weight: bold;`;

    const statusText = document.createElement('div');
    statusText.style.cssText = `margin-top: 10px; font-size: 12px; text-align: center; color: #6b7280;`;

    if (!isAllowedUser) {
        startBtn.disabled = true;
        stopBtn.disabled = true;
        startBtn.style.opacity = '0.5';
        statusText.textContent = 'Not Allowed. Member ID Error';
    } else {
        statusText.textContent = 'Ready to Grab';
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

    // গ্লোবাল অবজারভার প্যানেল দেখানোর জন্য
    setInterval(updatePanelVisibility, 1000);
})();
            

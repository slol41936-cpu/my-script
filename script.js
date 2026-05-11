(function () {
    let observer = null;
    let running = false;
    let refreshInterval = null;
    let soundPlayedForThisOrder = false;

    const PANEL_CLASS = 'amount-filter-panel';
    const TARGET_CLASS = 'x-buyList-list';

    const allowedMembers = [
        "21248739", "22801760", "24541398", "23631188", "26019413", "21114464", "29021111", "29780075",
    ]; 
    
    let isAllowedUser = false;
    try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const memberId = userInfo?.value?.memberld || userInfo?.value?.memberId;
        if (memberId && allowedMembers.includes(String(memberId))) {
            isAllowedUser = true;
        }
    } catch (e) {}

    const sound = new Audio("https://raw.githubusercontent.com/slol41936-cpu/my-script/main/Fahhh-%20sound%20effect%20(HD)%20-%20HighQualitySFX.mp3");
    sound.loop = false;
    sound.volume = 1;

    // ভিজ্যুয়াল হাইডিং CSS (ট্যাব পাল্টানো চোখে লাগবে না)
    const style = document.createElement('style');
    style.innerHTML = `.hiding-tabs .van-tabs__content, .hiding-tabs .${TARGET_CLASS} { opacity: 0.98 !important; }`;
    document.head.appendChild(style);

    function playNotificationSound() {
        if (!soundPlayedForThisOrder) {
            soundPlayedForThisOrder = true;
            sound.currentTime = 0;
            sound.play().catch(() => {});
            setTimeout(() => {
                sound.pause();
                sound.currentTime = 0;
            }, 4000); 
        }
    }

    function checkFailure() {
        const pageText = document.body.innerText.toLowerCase();
        return pageText.includes("someone else") || pageText.includes("bought by") || pageText.includes("already taken") || pageText.includes("failed");
    }

    function isPaymentPagePresent() {
        const pageText = document.body.innerText;
        return pageText.includes("Select Method Payment") || pageText.includes("Submit UTR") || pageText.includes("Bank card number");
    }

    // আপনার চাহিদা মতো ব্যাঙ্ক রিফ্রেশ লজিক
    function forceBankRefresh() {
        const tabs = Array.from(document.querySelectorAll('div, span, p, .van-tab'));
        const bankTab = tabs.find(el => el.innerText && el.innerText.trim() === 'Bank');
        if (bankTab) {
            bankTab.click(); // মিস হলে একবার ব্যাঙ্ক রিফ্রেশ করবে
        }
    }

    function filterAndHide() {
        const list = document.querySelector(`.${TARGET_CLASS}`);
        if (!list || !running) return false;

        const allowed = amountInput.value.trim();
        const orders = Array.from(list.children);

        let foundTarget = false;
        orders.forEach(order => {
            const text = order.innerText;
            if (text && text.includes('₹')) {
                const amount = text.replace(/,/g, '').match(/\d+/g)?.[0];
                if (amount === allowed) {
                    order.style.display = "block";
                    foundTarget = true;
                    const btn = order.querySelector('button') || order.querySelector('.van-button');
                    
                    if (btn && running && !checkFailure()) {
                        btn.click();
                        if (refreshInterval) clearInterval(refreshInterval);
                        refreshInterval = null;
                        
                        setTimeout(() => {
                            if (isPaymentPagePresent()) {
                                playNotificationSound();
                                stopFilter();
                            } else if (checkFailure()) {
                                // অর্ডার মিস হলে এখানে ব্যাঙ্ক রিফ্রেশ করবে
                                forceBankRefresh(); 
                                soundPlayedForThisOrder = false;
                                setTimeout(startRefresh, 300); // সামান্য গ্যাপ দিয়ে আবার শুরু
                            } else {
                                startRefresh();
                            }
                        }, 800);
                    }
                } else {
                    order.style.display = "none";
                }
            }
        });
        return foundTarget;
    }

    function startRefresh() {
        if (refreshInterval) clearInterval(refreshInterval);
        document.body.classList.add('hiding-tabs'); 

        refreshInterval = setInterval(() => {
            if (!running) return;

            if (isPaymentPagePresent()) {
                playNotificationSound();
                stopFilter();
                return;
            }

            if (checkFailure()) {
                forceBankRefresh(); // এরর মেসেজ থাকলেও ব্যাঙ্ক রিফ্রেশ করবে
            }

            const tabs = Array.from(document.querySelectorAll('.van-tab, span, div'));
            const defTab = tabs.find(el => el.innerText?.trim() === 'Default');
            const largeTab = tabs.find(el => el.innerText?.trim() === 'Large');

            if (!filterAndHide()) {
                if (defTab) {
                    defTab.click();
                    setTimeout(() => {
                        if (largeTab) largeTab.click();
                    }, 20); 
                }
            }
        }, 400); 
    }

    function startFilter() {
        if (!isAllowedUser || running) return;
        running = true;
        soundPlayedForThisOrder = false;
        statusDot.style.background = '#22c55e';
        startRefresh();
        
        observer = new MutationObserver(() => {
            if (running) {
                if (isPaymentPagePresent()) {
                    playNotificationSound();
                    stopFilter();
                } else {
                    filterAndHide();
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function stopFilter() {
        running = false;
        document.body.classList.remove('hiding-tabs');
        if (observer) observer.disconnect();
        if (refreshInterval) clearInterval(refreshInterval);
        statusDot.style.background = '#ef4444';
        const list = document.querySelector(`.${TARGET_CLASS}`);
        if (list) Array.from(list.children).forEach(o => o.style.display = "block");
    }

    const panel = document.createElement('div');
    panel.style.cssText = `position: fixed; bottom: 24px; right: 24px; background: #ffffff; border-radius: 12px; padding: 14px; width: 200px; font-family: system-ui; box-shadow: 0 12px 28px rgba(0,0,0,0.15); z-index: 999999;`;
    panel.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <span style="font-weight: 700; font-size: 15px; color: #374151;">AR Wallet</span>
            <span id="sDot" style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444;"></span>
        </div>
        <input type="number" id="amtInp" value="1000" style="width: 100%; padding: 8px; margin-bottom: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; text-align: center; font-weight: bold; outline: none;">
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
            <button id="sBtn" style="flex: 1; background: #22c55e; color: #fff; border: none; border-radius: 8px; padding: 10px 0; font-size: 14px; cursor: pointer; font-weight: bold;">Start</button>
            <button id="tBtn" style="flex: 1; background: #ef4444; color: #fff; border: none; border-radius: 8px; padding: 10px 0; font-size: 14px; cursor: pointer; font-weight: bold;">Stop</button>
        </div>
        <div id="auth" style="text-align: center; font-size: 12px; font-weight: 600; color: ${isAllowedUser ? '#22c55e' : '#ef4444'};">${isAllowedUser ? 'Active' : 'Access Denied'}</div>
    `;
    document.body.appendChild(panel);
    const amountInput = panel.querySelector('#amtInp');
    const statusDot = panel.querySelector('#sDot');
    panel.querySelector('#sBtn').onclick = startFilter;
    panel.querySelector('#tBtn').onclick = stopFilter;

    setInterval(() => {
        const list = document.querySelector(`.${TARGET_CLASS}`);
        panel.style.display = list ? 'block' : 'none';
    }, 1000);
})();

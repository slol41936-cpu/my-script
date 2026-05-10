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

    function playNotificationSound() {
        if (!soundPlayedForThisOrder) {
            sound.currentTime = 0;
            sound.play().catch(() => {});
            soundPlayedForThisOrder = true;
            setTimeout(() => {
                sound.pause();
                sound.currentTime = 0;
            }, 4000); 
        }
    }

    window.alert = function() { return true; };
    window.confirm = function() { return true; };

    function getAllowedAmount() {
        return amountInput.value.trim();
    }

    function checkFailure() {
        const pageText = document.body.innerText.toLowerCase();
        // মিস হওয়ার সব ধরণের মেসেজ চেক করবে
        return pageText.includes("someone else") || 
               pageText.includes("bought by") || 
               pageText.includes("already taken") || 
               pageText.includes("failed") ||
               pageText.includes("order was bought");
    }

    function isPaymentPagePresent() {
        const pageText = document.body.innerText;
        // পেমেন্ট পেজ আসলে স্টপ হবে
        return pageText.includes("Select Method Payment") || 
               pageText.includes("Please select payment account") || 
               pageText.includes("Choose UPI") || 
               pageText.includes("Submit UTR");
    }

    function filterAndHideOrders() {
        const list = document.querySelector(`.${TARGET_CLASS}`);
        if (!list || !running) return false;

        const allowed = getAllowedAmount();
        const orders = list.children;

        for (let i = 0, len = orders.length; i < len; i++) {
            const order = orders[i];
            const text = order.innerText;
            
            if (text && text.indexOf('₹') !== -1) {
                const orderAmount = text.replace(/,/g, '').match(/\d+/g)?.[0];

                if (orderAmount === allowed) {
                    order.style.display = "block";
                    const buyBtn = order.querySelector('button') || order.querySelector('.van-button');
                    
                    if (buyBtn && running) {
                        buyBtn.click(); 
                        
                        if (refreshInterval) clearInterval(refreshInterval);
                        refreshInterval = null;

                        // অর্ডার মিস হলে ১ সেকেন্ডের মধ্যে অটো-রিস্টার্ট হবে
                        setTimeout(() => {
                            if (isPaymentPagePresent()) {
                                playNotificationSound(); 
                                stopFilter(); 
                            } else if (checkFailure()) {
                                // অর্ডার মিস হয়েছে, তাই নিজে থেকেই আবার খোঁজা শুরু করবে
                                soundPlayedForThisOrder = false;
                                startRefresh(); 
                            } else {
                                // অন্য যেকোনো কারণে আটকে গেলে আবার শুরু করবে
                                if (running) startRefresh();
                            }
                        }, 1000); 
                        return true; 
                    }
                } else {
                    order.style.display = "none";
                }
            }
        }
        return false;
    }

    function startRefresh() {
        soundPlayedForThisOrder = false;
        if (refreshInterval) clearInterval(refreshInterval);
        
        refreshInterval = setInterval(() => {
            if (!running) return;

            // পেমেন্ট পেজ বা মিস হওয়া মেসেজ রিয়েল টাইমে চেক করবে
            if (isPaymentPagePresent()) {
                playNotificationSound();
                stopFilter();
                return;
            }

            if (checkFailure()) {
                // পপ-আপ মেসেজ থাকলে লিস্ট রিফ্রেশ করার চেষ্টা করবে
                const refreshBtn = document.querySelector('.van-button--default');
                if (refreshBtn) refreshBtn.click();
            }

            const tabs = Array.from(document.querySelectorAll('div, span, p, .van-tab'));
            const defaultTab = tabs.find(el => el.innerText && el.innerText.trim() === 'Default');
            const largeTab = tabs.find(el => el.innerText && el.innerText.trim() === 'Large');

            const found = filterAndHideOrders();
            
            if (!found) {
                if (defaultTab) {
                    defaultTab.click();
                    setTimeout(() => {
                        if (largeTab) largeTab.click();
                        requestAnimationFrame(filterAndHideOrders);
                    }, 30); 
                }
            }
            requestAnimationFrame(filterAndHideOrders);

        }, 450); 
    }

    function startFilter() {
        if (!isAllowedUser || running) return;
        running = true;
        soundPlayedForThisOrder = false;
        statusDot.style.background = '#22c55e';
        filterAndHideOrders();
        startRefresh(); 

        observer = new MutationObserver(() => {
            if (running) {
                if (isPaymentPagePresent()) {
                    playNotificationSound();
                    stopFilter();
                } else if (checkFailure()) {
                    // স্ক্রিনে কোনো এরর বা মিস মেসেজ আসলে অটোমেটিক রিস্টার্ট
                    if (!refreshInterval) startRefresh();
                } else {
                    filterAndHideOrders();
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function stopFilter() {
        if (!running) return;
        running = false;
        if (observer) observer.disconnect();
        if (refreshInterval) clearInterval(refreshInterval);
        refreshInterval = null;
        statusDot.style.background = '#ef4444';
        
        const list = document.querySelector(`.${TARGET_CLASS}`);
        if (list) {
            Array.from(list.children).forEach(order => order.style.display = "block");
        }
    }

    const panel = document.createElement('div');
    panel.className = PANEL_CLASS;
    panel.style.cssText = `position: fixed; bottom: 24px; right: 24px; background: #ffffff; border-radius: 12px; padding: 14px; width: 200px; font-family: system-ui; box-shadow: 0 12px 28px rgba(0,0,0,0.15); z-index: 999999;`;

    panel.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <span style="font-weight: 700; font-size: 15px; color: #374151;">AR Wallet PRO v2</span>
            <span id="sDot" style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444;"></span>
        </div>
        <input type="number" id="amtInp" value="1000" style="width: 100%; padding: 8px; margin-bottom: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; text-align: center; font-weight: bold; outline: none;">
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
            <button id="sBtn" style="flex: 1; background: ${isAllowedUser ? '#22c55e' : '#9ca3af'}; color: #fff; border: none; border-radius: 8px; padding: 10px 0; font-size: 14px; cursor: pointer; font-weight: bold;">Start</button>
            <button id="tBtn" style="flex: 1; background: #ef4444; color: #fff; border: none; border-radius: 8px; padding: 10px 0; font-size: 14px; cursor: pointer; font-weight: bold;">Stop</button>
        </div>
        <div id="authStatus" style="text-align: center; font-size: 12px; font-weight: 600; color: ${isAllowedUser ? '#22c55e' : '#ef4444'};">
            ${isAllowedUser ? 'Active' : 'Access Denied'}
        </div>
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

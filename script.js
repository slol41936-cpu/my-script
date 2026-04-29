(function () {
    let observer = null;
    let running = false;
    let refreshInterval = null;
    let soundPlayedForThisOrder = false;

    const PANEL_CLASS = 'amount-filter-panel';
    const TARGET_CLASS = 'x-buyList-list';

    const allowedMembers = [
        "21248739",
        "22801760",
        "24541398",
        "23631188",
        "26019413",
        "21114464",
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
            }, 4000); // মিউজিক একটু বেশিক্ষণ বাজবে যাতে বুঝতে সুবিধা হয়
        }
    }

    window.alert = function() { return true; };
    window.confirm = function() { return true; };

    function getAllowedAmount() {
        return amountInput.value.trim();
    }

    // অর্ডার ফেল হয়েছে কি না চেক
    function checkFailure() {
        const pageText = document.body.innerText.toLowerCase();
        return pageText.includes("someone else") || pageText.includes("bought by") || pageText.includes("already taken") || pageText.includes("failed");
    }

    // পেমেন্ট পেজ এসেছে কি না চেক (সাউন্ড বাজার আসল জায়গা)
    function isPaymentPagePresent() {
        const pageText = document.body.innerText;
        return pageText.includes("Select Method Payment") || 
               pageText.includes("Please select payment account") || 
               pageText.includes("Choose UPI") || 
               pageText.includes("Submit UTR");
    }

    function filterAmount() {
        const list = document.querySelector(`.${TARGET_CLASS}`);
        if (!list || !running) return;

        const allowed = getAllowedAmount();
        const orders = list.children;

        for (let i = 0, len = orders.length; i < len; i++) {
            const order = orders[i];
            const text = order.innerText;
            
            if (text && text.indexOf('₹') !== -1) {
                const orderAmount = text.replace(/,/g, '').match(/\d+/g)?.[0];

                if (orderAmount === allowed) {
                    const buyBtn = order.querySelector('button') || order.querySelector('.van-button');
                    
                    if (buyBtn && running) {
                        buyBtn.click(); // শুধু ক্লিক করবে
                        
                        if (refreshInterval) clearInterval(refreshInterval);
                        refreshInterval = null;

                        // ২.২ সেকেন্ড পর চেক করবে পেমেন্ট পেজ আসলো কি না
                        setTimeout(() => {
                            if (isPaymentPagePresent()) {
                                playNotificationSound(); // পেমেন্ট পেজ পেলেই মিউজিক বাজবে
                                stopFilter(); 
                            } else if (checkFailure()) {
                                soundPlayedForThisOrder = false;
                                if (running) startRefresh(); 
                            } else {
                                if (running) startRefresh(); 
                            }
                        }, 2200);
                        return; 
                    }
                }
            }
        }
    }

    function startRefresh() {
        soundPlayedForThisOrder = false;
        if (refreshInterval) clearInterval(refreshInterval);
        
        refreshInterval = setInterval(() => {
            if (!running) return;

            if (isPaymentPagePresent()) {
                playNotificationSound();
                stopFilter();
                return;
            }

            if (document.body.innerText.includes("contact customer service")) {
                location.reload();
                return;
            }

            const currentTab = document.querySelector('.van-tab--active') || 
                               Array.from(document.querySelectorAll('.van-tab')).find(el => el.innerText.includes('BANK'));
            if (currentTab) currentTab.click();

            setTimeout(() => {
                const largeTab = Array.from(document.querySelectorAll('div, span, p')).find(el => el.innerText && el.innerText.trim() === 'Large');
                if (largeTab) {
                    largeTab.click();
                    filterAmount();
                }
                requestAnimationFrame(filterAmount);
            }, 120); 

        }, 1200); 
    }

    function startFilter() {
        if (!isAllowedUser || running) return;
        running = true;
        soundPlayedForThisOrder = false;
        statusDot.style.background = '#22c55e';
        filterAmount();
        startRefresh(); 

        observer = new MutationObserver(() => {
            if (running) {
                if (isPaymentPagePresent()) {
                    playNotificationSound();
                    stopFilter();
                } else {
                    filterAmount();
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
    }

    const panel = document.createElement('div');
    panel.className = PANEL_CLASS;
    panel.style.cssText = `position: fixed; bottom: 24px; right: 24px; background: #ffffff; border-radius: 12px; padding: 14px; width: 200px; font-family: system-ui; box-shadow: 0 12px 28px rgba(0,0,0,0.15); z-index: 999999;`;

    panel.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <span style="font-weight: 700; font-size: 15px; color: #374151;">AR Wallet</span>
            <span id="sDot" style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444;"></span>
        </div>
        <input type="number" id="amtInp" value="1000" style="width: 100%; padding: 8px; margin-bottom: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; text-align: center; font-weight: bold; outline: none;">
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
            <button id="sBtn" style="flex: 1; background: ${isAllowedUser ? '#22c55e' : '#9ca3af'}; color: #fff; border: none; border-radius: 8px; padding: 10px 0; font-size: 14px; cursor: ${isAllowedUser ? 'pointer' : 'not-allowed'}; font-weight: bold;">Start</button>
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

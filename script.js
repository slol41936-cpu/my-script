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

    // সাউন্ড সেটআপ
    const sound = new Audio("https://raw.githubusercontent.com/slol41936-cpu/my-script/main/Fahhh-%20sound%20effect%20(HD)%20-%20HighQualitySFX.mp3");
    sound.loop = false;
    sound.volume = 1;

    function playNotificationSound() {
        sound.currentTime = 0;
        sound.play().catch(() => {});
        setTimeout(() => {
            sound.pause();
            sound.currentTime = 0;
        }, 3000);
    }

    // ২. অটো পপ-আপ রিমুভাল
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

    // নতুন লজিক: অর্ডার অন্য কেউ নিয়ে নিলে আবার রিফ্রেশ শুরু করা
    function checkRetryCondition() {
        const pageText = document.body.innerText;
        // যদি অর্ডার কেউ নিয়ে নেয় বা ইরর দেখায়
        if (pageText.includes("someone else") || pageText.includes("bought by") || pageText.includes("already taken")) {
            if (!refreshInterval && running) {
                startRefresh(); // আবার রিফ্রেশ শুরু করবে
            }
            return true;
        }
        return false;
    }

    function filterAmount() {
        const list = document.querySelector(`.${TARGET_CLASS}`);
        if (!list || !running) return;

        // যদি অন্য কেউ নিয়ে নেয় এমন মেসেজ থাকে, তাহলে থামা যাবে না
        checkRetryCondition();

        const allowed = getAllowedAmount();
        const orders = list.children;

        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            const text = order.innerText;
            
            if (text && text.includes('₹')) {
                const numbers = text.replace(/,/g, '').match(/\d+/g);
                const orderAmount = numbers ? numbers[0] : null;

                if (orderAmount === allowed) {
                    order.style.display = '';
                    const buyBtn = order.querySelector('button') || order.querySelector('.van-button');
                    
                    if (buyBtn && running) {
                        playNotificationSound();
                        buyBtn.click();
                        
                        // পেমেন্ট পেজে না যাওয়া পর্যন্ত রিফ্রেশ ইন্টারভাল সাময়িকভাবে থামবে
                        if (refreshInterval) clearInterval(refreshInterval);
                        refreshInterval = null;

                        // ২.৫ সেকেন্ড পর চেক করবে অর্ডার মিস হয়েছে কি না
                        setTimeout(() => {
                            if (checkRetryCondition()) {
                                // অর্ডার মিস হয়েছে, রিফ্রেশ অটো শুরু হবে (উপরের checkRetryCondition থেকে)
                            } else {
                                // যদি পেমেন্ট পেজ (UTR পেজ) চলে আসে, তবেই পুরোপুরি স্টপ হবে
                                if (document.body.innerText.includes("Submit UTR") || document.body.innerText.includes("Copy Account")) {
                                    stopFilter();
                                }
                            }
                        }, 2500);
                        return; 
                    }
                } else {
                    order.style.display = 'none';
                }
            }
        }
    }

    function startRefresh() {
        if (refreshInterval) clearInterval(refreshInterval);
        
        refreshInterval = setInterval(() => {
            if (!running) return;

            // যদি অলরেডি পেমেন্ট পেজে চলে যান, তবে বন্ধ হবে
            if (document.body.innerText.includes("Submit UTR")) {
                stopFilter();
                return;
            }

            if (document.body.innerText.includes("contact customer service")) {
                location.reload();
                return;
            }

            const bankTab = Array.from(document.querySelectorAll('.van-tab, .van-tab__text')).find(el => el.innerText.includes('BANK'));
            if (bankTab) bankTab.click();

            setTimeout(() => {
                const largeTab = Array.from(document.querySelectorAll('div, span, p')).find(el => el.innerText && el.innerText.trim() === 'Large');
                if (largeTab) largeTab.click();
                
                requestAnimationFrame(filterAmount);
            }, 150); 

        }, 1000); 
    }

    function startFilter() {
        if (!isAllowedUser || running) return;
        running = true;
        
        statusText.textContent = 'Mode: Non-Stop Active';
        statusDot.style.background = '#22c55e';

        filterAmount();
        startRefresh(); 

        observer = new MutationObserver(() => {
            filterAmount();
        });

        observer.observe(document.body, { 
            childList: true, 
            subtree: true
        });
    }

    function stopFilter() {
        if (!running) return;
        running = false;
        if (observer) observer.disconnect();
        if (refreshInterval) clearInterval(refreshInterval);
        refreshInterval = null;
        statusText.textContent = 'Stopped';
        statusDot.style.background = '#ef4444';
    }

    const panel = document.createElement('div');
    panel.className = PANEL_CLASS;
    panel.style.cssText = `position: fixed; bottom: 24px; right: 24px; background: #ffffff; border-radius: 12px; padding: 14px; width: 220px; font-family: system-ui; box-shadow: 0 12px 28px rgba(0,0,0,0.15); z-index: 999999; display: none;`;

    panel.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; font-weight: 600; font-size: 14px;">
            AR Wallet Ultra <span id="sDot" style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444;"></span>
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

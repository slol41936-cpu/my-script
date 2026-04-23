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

    window.alert = function() { return true; };
    window.confirm = function() { return true; };

    function getAllowedAmount() {
        return amountInput.value.trim();
    }

    // অর্ডার মিস হয়েছে কি না চেক করা
    function checkFailure() {
        const pageText = document.body.innerText.toLowerCase();
        return pageText.includes("someone else") || pageText.includes("bought by") || pageText.includes("already taken");
    }

    // ফিল্টার লজিককে অতি দ্রুত করা হয়েছে
    function filterAmount() {
        const list = document.querySelector(`.${TARGET_CLASS}`);
        if (!list || !running) return;

        const allowed = getAllowedAmount();
        const orders = list.children;

        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            const text = order.innerText;
            
            if (text && text.includes('₹')) {
                const orderAmount = text.replace(/,/g, '').match(/\d+/g)?.[0];

                if (orderAmount === allowed) {
                    const buyBtn = order.querySelector('button') || order.querySelector('.van-button');
                    
                    if (buyBtn && running) {
                        playNotificationSound();
                        buyBtn.click(); // ফটাফট ক্লিক
                        
                        // ক্লিক করার পর রিফ্রেশ সাময়িক থামবে ২ সেকেন্ডের জন্য
                        if (refreshInterval) clearInterval(refreshInterval);
                        refreshInterval = null;

                        setTimeout(() => {
                            if (checkFailure()) {
                                if (running) startRefresh(); // মিস হলে আবার শুরু
                            } else if (document.body.innerText.includes("Submit UTR")) {
                                stopFilter(); // সাকসেস হলে স্টপ
                            } else {
                                if (running) startRefresh(); // অন্যথায় রিফ্রেশ চালু
                            }
                        }, 2000);
                        return; 
                    }
                }
            }
        }
    }

    function startRefresh() {
        if (refreshInterval) clearInterval(refreshInterval);
        
        refreshInterval = setInterval(() => {
            if (!running) return;

            // যদি পেমেন্ট পেজে পৌঁছে যান
            if (document.body.innerText.includes("Submit UTR")) {
                stopFilter();
                return;
            }

            // কাস্টমার সার্ভিস পপ-আপ রিমুভাল
            if (document.body.innerText.includes("contact customer service")) {
                location.reload();
                return;
            }

            // আপনি যেই ট্যাবে থাকবেন (UPI/BANK), সেটাকেই রিফ্রেশ করবে
            const currentTab = document.querySelector('.van-tab--active') || 
                               Array.from(document.querySelectorAll('.van-tab')).find(el => el.innerText.includes('BANK'));
            if (currentTab) currentTab.click();

            setTimeout(() => {
                const largeTab = Array.from(document.querySelectorAll('div, span, p')).find(el => el.innerText && el.innerText.trim() === 'Large');
                if (largeTab) largeTab.click();
                
                // ব্রাউজারের পরবর্তী ফ্রেমেই ফিল্টার রান করবে
                requestAnimationFrame(filterAmount);
            }, 100); // গ্যাপ আরও কমানো হয়েছে

        }, 1000); 
    }

    function startFilter() {
        if (!isAllowedUser || running) return;
        running = true;
        
        statusText.textContent = 'Mode: Super Aggressive Active';
        statusDot.style.background = '#22c55e';

        filterAmount();
        startRefresh(); 

        observer = new MutationObserver(() => {
            filterAmount();
        });

        observer.observe(document.body, { childList: true, subtree: true });
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
    panel.style.cssText = `position: fixed; bottom: 24px; right: 24px; background: #ffffff; border-radius: 12px; padding: 14px; width: 220px; font-family: system-ui; box-shadow: 0 12px 28px rgba(0,0,0,0.15); z-index: 999999;`;

    panel.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; font-weight: 600; font-size: 14px;">
            AR Wallet Pro <span id="sDot" style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444;"></span>
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

    setInterval(() => {
        const list = document.querySelector(`.${TARGET_CLASS}`);
        panel.style.display = list ? 'block' : 'none';
    }, 1000);
})();

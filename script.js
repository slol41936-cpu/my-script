(function () {
    let observer = null;
    let running = false;
    let refreshInterval = null;
    let soundPlayedForThisOrder = false;

    const PANEL_CLASS = 'amount-filter-panel';
    const TARGET_CLASS = 'x-buyList-list';

    const allowedMembers = [
        "21248739", "22801760", "24541398", "23631188", 
        "26019413", "21114464", "29021111", "29780075",
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
            setTimeout(() => { sound.pause(); sound.currentTime = 0; }, 4000);
        }
    }

    function isPaymentPagePresent() {
        const pageText = document.body.innerText;
        return pageText.includes("Select Method Payment") || 
               pageText.includes("Choose UPI") || 
               pageText.includes("Submit UTR");
    }

    // ১০০০ টাকার অর্ডার ধরা মাত্রই ক্লিক করার ফাংশন
    function filterAmount() {
        const list = document.querySelector(`.${TARGET_CLASS}`);
        if (!list || !running) return;

        const allowed = amountInput.value.trim();
        const orders = list.children;

        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            const text = order.innerText;
            
            if (text && text.includes('₹')) {
                const orderAmount = text.replace(/,/g, '').match(/\d+/g)?.[0];

                if (orderAmount === allowed) {
                    const buyBtn = order.querySelector('button') || order.querySelector('.van-button');
                    if (buyBtn) {
                        buyBtn.click(); // সবথেকে দ্রুত ক্লিক
                        if (refreshInterval) clearInterval(refreshInterval);
                        
                        setTimeout(() => {
                            if (isPaymentPagePresent()) {
                                playNotificationSound();
                                stopFilter(); 
                            } else if (running) {
                                startRefresh(); 
                            }
                        }, 1500);
                        return true; 
                    }
                }
            }
        }
        return false;
    }

    function startRefresh() {
        if (refreshInterval) clearInterval(refreshInterval);
        
        refreshInterval = setInterval(() => {
            if (!running) return;

            // "Default" এবং "Large" এর মধ্যে অটো সুইচ করে ১০০০ খোঁজা
            const tabs = Array.from(document.querySelectorAll('.van-tab__text, div, span'));
            const defaultTab = tabs.find(el => el.innerText === 'Default');
            const largeTab = tabs.find(el => el.innerText === 'Large');

            // প্রথমে বর্তমানে যে পেজে আছে সেখানে খোঁজো
            if (filterAmount()) return;

            // যদি না পায়, তবে অন্য ট্যাবে গিয়ে খোঁজো
            const activeTab = document.querySelector('.van-tab--active');
            if (activeTab && activeTab.innerText.includes('Large') && defaultTab) {
                defaultTab.click();
            } else if (largeTab) {
                largeTab.click();
            }

            setTimeout(filterAmount, 100); // ট্যাব পরিবর্তনের সাথে সাথে স্ক্যান

        }, 800); // রিফ্রেশ স্পিড বাড়ানো হয়েছে
    }

    function startFilter() {
        if (!isAllowedUser || running) return;
        running = true;
        soundPlayedForThisOrder = false;
        statusDot.style.background = '#22c55e';
        startRefresh(); 

        observer = new MutationObserver(() => {
            if (running) filterAmount();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function stopFilter() {
        running = false;
        if (observer) observer.disconnect();
        if (refreshInterval) clearInterval(refreshInterval);
        statusDot.style.background = '#ef4444';
    }

    // প্যানেল ডিজাইন আপনার আগের মতোই রাখা হয়েছে
    const panel = document.createElement('div');
    panel.style.cssText = `position: fixed; bottom: 24px; right: 24px; background: #ffffff; border-radius: 12px; padding: 14px; width: 200px; font-family: system-ui; box-shadow: 0 12px 28px rgba(0,0,0,0.15); z-index: 999999;`;
    panel.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <span style="font-weight: 700; font-size: 15px;">AR Wallet Ultra</span>
            <span id="sDot" style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444;"></span>
        </div>
        <input type="number" id="amtInp" value="1000" style="width: 100%; padding: 8px; margin-bottom: 12px; border: 1px solid #d1d5db; border-radius: 6px; text-align: center; font-weight: bold;">
        <div style="display: flex; gap: 10px;">
            <button id="sBtn" style="flex: 1; background: #22c55e; color: #fff; border: none; border-radius: 8px; padding: 10px; cursor: pointer; font-weight: bold;">Start</button>
            <button id="tBtn" style="flex: 1; background: #ef4444; color: #fff; border: none; border-radius: 8px; padding: 10px; cursor: pointer; font-weight: bold;">Stop</button>
        </div>
    `;

    document.body.appendChild(panel);
    const amountInput = panel.querySelector('#amtInp');
    const statusDot = panel.querySelector('#sDot');
    panel.querySelector('#sBtn').onclick = startFilter;
    panel.querySelector('#tBtn').onclick = stopFilter;
})();

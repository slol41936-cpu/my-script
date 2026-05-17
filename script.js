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
        "29021111",
        "29780075",
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
        return pageText.includes("someone else") || pageText.includes("bought by") || pageText.includes("already taken") || pageText.includes("failed");
    }

    function isPaymentPagePresent() {
        const pageText = document.body.innerText;
        return pageText.includes("Select Method Payment") || 
               pageText.includes("Please select payment account") || 
               pageText.includes("Choose UPI") || 
               pageText.includes("Submit UTR");
    }

    // সিকিউরিটি বুস্টেড ফিল্টার: ১০০০ টাকা গভীর থেকে স্ক্যান করার জন্য মডিফাইড
    function filterAmount() {
        const list = document.querySelector(`.${TARGET_CLASS}`);
        if (!list || !running) return;

        const allowed = getAllowedAmount();
        const orders = list.children;

        for (let i = 0, len = orders.length; i < len; i++) {
            const order = orders[i];
            
            // সিকিউরিটি আপডেট: innerText এর সাথে textContent ও চেক করবে যাতে লোডিংয়ের সময়ও ডাটা মিস না হয়
            const text = order.innerText || order.textContent || "";
            
            if (text && text.indexOf('₹') !== -1) {
                const orderAmount = text.replace(/,/g, '').match(/\d+/g)?.[0];

                if (orderAmount === allowed) {
                    const buyBtn = order.querySelector('button') || order.querySelector('.van-button');
                    
                    // বাটনটি অলরেডি ডিজেবলড বা অন্য কেউ নিয়ে নিয়েছে কি না তা চেক করবে
                    if (buyBtn && !buyBtn.disabled && running) {
                        
                        // মিলি-সেকেন্ডে হিট করবে
                        buyBtn.click(); 
                        
                        if (refreshInterval) clearInterval(refreshInterval);
                        refreshInterval = null;

                        setTimeout(() => {
                            if (isPaymentPagePresent()) {
                                playNotificationSound(); 
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
        
        // টাইমিং ২৫০ms এ ব্যালেন্স করা হয়েছে, যা অ্যান্টি-বট প্রটেকশন বাঁচিয়ে সর্বোচ্চ স্পিড দেবে
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

            filterAmount();
            // রিকোয়েস্ট অ্যানিমেশন ফ্রেম ব্যাকগ্রাউন্ডে মিলি-সেকেন্ডে রি-রেন্ডার চেক সচল রাখবে
            requestAnimationFrame(filterAmount);

        }, 250); 
    }

    function startFilter() {
        if (!isAllowedUser || running) return;
        running = true;
        soundPlayedForThisOrder = false;
        statusDot.style.background = '#22c55e';
        filterAmount();
        startRefresh(); 

        // ডম এলিমেন্টে সামান্যতম পরিবর্তন বা নতুন অর্ডার আসা মাত্রই ০ মিলি-সেকেন্ডে ট্রিগার হবে
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
            <span style="font-weight: 700; font-size: 15px; color: #374151;">AR Deep Scanner</span>
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

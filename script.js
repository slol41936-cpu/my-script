(function () {
    let grabInterval = null;
    let observer = null;
    let running = false;
    const PANEL_CLASS = 'amount-filter-panel';
    const TARGET_LIST_CLASS = 'x-buyList-list'; 

    // ফানি সাকসেস সাউন্ড এবং অটো-স্টপ অ্যালার্ম
    const successSound = new Audio("https://www.myinstants.com/media/sounds/funny-notification-sound.mp3");
    const stopAlarm = new Audio("https://actions.google.com/sounds/v1/alarms/phone_alerts_and_rings.ogg");

    function playAutoStopSound() {
        stopAlarm.currentTime = 0;
        stopAlarm.play().catch(() => {});
        setTimeout(() => { stopAlarm.pause(); }, 2000);
    }

    function isTargetAvailable() {
        return document.querySelector(`.${TARGET_LIST_CLASS}`) !== null;
    }

    // স্মার্ট ভিজিবিলিটি: টার্গেট লিস্ট থাকলে প্যানেল দেখাবে
    function updatePanelVisibility() {
        panel.style.display = isTargetAvailable() ? 'block' : 'none';
    }

    function startAutoGrab() {
        if (running || !isTargetAvailable()) return;
        running = true;

        const targetAmount = parseInt(amountInput.value.trim()); 
        statusText.textContent = 'Turbo Active: ' + targetAmount;
        statusDot.style.background = '#22c55e';

        // ১. অটো রিফ্রেশ ও ক্লিক ইন্টারভাল
        grabInterval = setInterval(() => {
            // BANK ট্যাবে ক্লিক করে রিফ্রেশ
            const tabs = document.querySelectorAll('.van-tabs__nav *'); 
            tabs.forEach(tab => {
                if (tab.innerText && tab.innerText.includes('BANK')) tab.click(); 
            });

            // অর্ডার স্ক্যান এবং নিখুঁত অ্যামাউন্ট ফিল্টার
            const orders = document.querySelectorAll(`.${TARGET_LIST_CLASS} > *`);
            orders.forEach(order => {
                const orderText = order.innerText;
                const numbers = orderText.replace(/,/g, '').match(/\d+/g);
                
                if (numbers && numbers.some(num => parseInt(num) === targetAmount)) {
                    const buyBtn = order.querySelector('button') || order.querySelector('.van-button') || order.querySelector('[class*="buy"]');
                    if (buyBtn) {
                        stopAutoGrab(false); // কাজ হয়ে গেলে অফ
                        panel.style.display = 'none'; // প্যানেল হাইড
                        successSound.play(); // ফানি সাউন্ড
                        buyBtn.click(); // অটো ট্যাপ
                    }
                } else {
                    order.style.display = 'none'; // অন্য অ্যামাউন্ট হাইড
                }
            });
        }, 800);

        // ২. রিয়েল-টাইম ফিল্টারিং (MutationObserver)
        observer = new MutationObserver(() => {
            if (!isTargetAvailable()) stopAutoGrab(true);
            updatePanelVisibility();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function stopAutoGrab(isAuto = false) {
        if (!running) return;
        running = false;
        clearInterval(grabInterval);
        if (observer) observer.disconnect();
        
        // সব আইটেম আবার শো করা
        document.querySelectorAll(`.${TARGET_LIST_CLASS} > *`).forEach(el => el.style.display = '');
        
        statusText.textContent = 'Stopped';
        statusDot.style.background = '#ef4444';
        if (isAuto) playAutoStopSound();
    }

    // প্যানেল ডিজাইন ও কন্ট্রোল
    const panel = document.createElement('div');
    panel.className = PANEL_CLASS;
    panel.style.cssText = "position: fixed; bottom: 20px; right: 20px; background: white; padding: 15px; border-radius: 15px; box-shadow: 0 0 20px rgba(0,0,0,0.3); z-index: 1000000; width: 220px; font-family: sans-serif; display: none;";
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <b style="font-size: 14px;">AR Wallet Turbo Pro</b>
            <div id="led" style="width: 10px; height: 10px; border-radius: 50%; background: red;"></div>
        </div>
        <input type="number" id="amtInp" value="1000" style="width: 90%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 5px; text-align: center; font-size: 18px; font-weight: bold;">
        <div style="display: flex; gap: 5px;">
            <button id="btnStart" style="flex: 1; background: #2ecc71; color: white; border: none; padding: 10px; border-radius: 8px; font-weight: bold; cursor: pointer;">Start</button>
            <button id="btnStop" style="flex: 1; background: #e74c3c; color: white; border: none; padding: 10px; border-radius: 8px; font-weight: bold; cursor: pointer;">Stop</button>
        </div>
        <p id="txtStat" style="text-align: center; font-size: 11px; margin-top: 10px; color: #666;">System Ready</p>
    `;
    document.body.appendChild(panel);

    const amountInput = panel.querySelector('#amtInp');
    const statusDot = panel.querySelector('#led');
    const statusText = panel.querySelector('#txtStat');

    panel.querySelector('#btnStart').onclick = startAutoGrab;
    panel.querySelector('#btnStop').onclick = () => stopAutoGrab(false);

    // ইনিশিয়াল চেকিং
    setInterval(updatePanelVisibility, 1000);
})();

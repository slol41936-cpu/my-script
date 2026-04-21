(function () {
    let grabInterval = null;
    let observer = null;
    let running = false;
    const PANEL_CLASS = 'amount-filter-panel';
    const TARGET_LIST_CLASS = 'x-buyList-list'; 

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

    function updatePanelVisibility() {
        panel.style.display = isTargetAvailable() ? 'block' : 'none';
    }

    function startAutoGrab(mode = 'default') {
        if (running || !isTargetAvailable()) return;
        running = true;

        const targetAmount = parseInt(amountInput.value.trim()); 
        statusText.textContent = `Mode: ${mode.toUpperCase()} (${targetAmount})`;
        statusDot.style.background = '#22c55e';

        grabInterval = setInterval(() => {
            // ১. অটো রিফ্রেশ
            const tabs = document.querySelectorAll('.van-tabs__nav *'); 
            tabs.forEach(tab => {
                if (tab.innerText && tab.innerText.includes('BANK')) tab.click(); 
            });

            // ২. অর্ডার ফিল্টার ও ট্যাপ
            const orders = document.querySelectorAll(`.${TARGET_LIST_CLASS} > *`);
            orders.forEach(order => {
                const orderText = order.innerText;
                const numbers = orderText.replace(/,/g, '').match(/\d+/g);
                
                if (numbers) {
                    let isMatch = false;
                    const firstNum = parseInt(numbers[0]);

                    if (mode === 'default') {
                        isMatch = numbers.some(num => parseInt(num) === targetAmount);
                    } else if (mode === 'large') {
                        isMatch = firstNum >= 5000; // ৫০০০ এর বেশি হলে লার্জ
                    } else if (mode === 'small') {
                        isMatch = firstNum > 0 && firstNum <= 500; // ৫০০ এর নিচে হলে স্মল
                    }

                    if (isMatch) {
                        const buyBtn = order.querySelector('button') || order.querySelector('.van-button') || order.querySelector('[class*="buy"]');
                        if (buyBtn) {
                            stopAutoGrab(false);
                            panel.style.display = 'none';
                            successSound.play();
                            buyBtn.click();
                        }
                    } else {
                        order.style.display = 'none';
                    }
                }
            });
        }, 800);

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
        document.querySelectorAll(`.${TARGET_LIST_CLASS} > *`).forEach(el => el.style.display = '');
        statusText.textContent = 'Stopped';
        statusDot.style.background = '#ef4444';
        if (isAuto) playAutoStopSound();
    }

    // প্যানেল ডিজাইন
    const panel = document.createElement('div');
    panel.className = PANEL_CLASS;
    panel.style.cssText = "position: fixed; bottom: 20px; right: 20px; background: white; padding: 15px; border-radius: 15px; box-shadow: 0 0 25px rgba(0,0,0,0.3); z-index: 1000000; width: 230px; font-family: sans-serif; display: none;";
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <b style="font-size: 14px; color: #333;">AR Wallet Turbo Pro</b>
            <div id="led" style="width: 10px; height: 10px; border-radius: 50%; background: red;"></div>
        </div>
        
        <div style="display: flex; gap: 4px; margin-bottom: 10px;">
            <button id="btnDef" style="flex: 1; font-size: 10px; padding: 5px; border-radius: 5px; border: 1px solid #ddd; background: #f8f9fa; cursor: pointer;">Default</button>
            <button id="btnLrg" style="flex: 1; font-size: 10px; padding: 5px; border-radius: 5px; border: 1px solid #ddd; background: #f8f9fa; cursor: pointer;">Large</button>
            <button id="btnSml" style="flex: 1; font-size: 10px; padding: 5px; border-radius: 5px; border: 1px solid #ddd; background: #f8f9fa; cursor: pointer;">Small</button>
        </div>

        <input type="number" id="amtInp" value="1000" style="width: 90%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 5px; text-align: center; font-size: 18px; font-weight: bold;">
        
        <div style="display: flex; gap: 5px;">
            <button id="btnStart" style="flex: 1; background: #2ecc71; color: white; border: none; padding: 10px; border-radius: 8px; font-weight: bold; cursor: pointer;">START</button>
            <button id="btnStop" style="flex: 1; background: #e74c3c; color: white; border: none; padding: 10px; border-radius: 8px; font-weight: bold; cursor: pointer;">STOP</button>
        </div>
        <p id="txtStat" style="text-align: center; font-size: 11px; margin-top: 8px; color: #666;">Ready</p>
    `;
    document.body.appendChild(panel);

    const amountInput = panel.querySelector('#amtInp');
    const statusDot = panel.querySelector('#led');
    const statusText = panel.querySelector('#txtStat');

    // বাটন ইভেন্ট
    panel.querySelector('#btnStart').onclick = () => startAutoGrab('default');
    panel.querySelector('#btnDef').onclick = () => { amountInput.value = "1000"; startAutoGrab('default'); };
    panel.querySelector('#btnLrg').onclick = () => startAutoGrab('large');
    panel.querySelector('#btnSml').onclick = () => startAutoGrab('small');
    panel.querySelector('#btnStop').onclick = () => stopAutoGrab(false);

    setInterval(updatePanelVisibility, 1000);
})();
 

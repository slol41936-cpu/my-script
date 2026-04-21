(function () {
    let grabInterval = null;
    let observer = null;
    let running = false;
    const TARGET_LIST_CLASS = 'x-buyList-list'; 

    const successSound = new Audio("https://www.myinstants.com/media/sounds/funny-notification-sound.mp3");

    function startAuto() {
        if (running) return;
        running = true;

        statusText.textContent = 'Mode: Large (₹1000)';
        statusDot.style.background = '#22c55e';

        // ১. শুরুতে একবার 'Large' বাটনে ক্লিক করে দেওয়া
        const largeBtn = Array.from(document.querySelectorAll('div, span, p')).find(el => el.innerText.trim() === 'Large');
        if (largeBtn) largeBtn.click();

        // ২. হাই-স্পিড রিফ্রেশ (BANK ট্যাবে ক্লিক)
        grabInterval = setInterval(() => {
            const tabs = document.querySelectorAll('.van-tab, .van-tab__text, .van-tabs__nav *');
            for (let tab of tabs) {
                if (tab.innerText && tab.innerText.includes('BANK')) {
                    tab.click();
                    break;
                }
            }
        }, 200);

        // ৩. MutationObserver - রিয়েল টাইম ১০০০ টাকা ফিল্টার
        observer = new MutationObserver(() => {
            const orders = document.querySelectorAll(`.${TARGET_LIST_CLASS} > *`);
            orders.forEach(order => {
                const text = order.innerText;

                // নিখুঁত ১০০০ টাকা চেক (১১০ বা ১১০০ বাদ দেবে)
                if ((text.includes('₹1000') || text.includes('₹ 1000')) && !text.includes('1100') && !text.includes('10000')) {
                    
                    const buyBtn = order.querySelector('button') || order.querySelector('.van-button') || order.querySelector('[class*="buy"]');
                    if (buyBtn) {
                        successSound.play();
                        buyBtn.click();
                        buyBtn.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                        
                        stopAuto(); 
                        panel.style.display = 'none'; 
                        console.log("Large Order Grabbed: ₹1000");
                    }
                } else {
                    // ১০০০ না হলে সাথে সাথে স্ক্রিন থেকে রিমুভ
                    order.remove(); 
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function stopAuto() {
        running = false;
        if (grabInterval) clearInterval(grabInterval);
        if (observer) observer.disconnect();
        statusText.textContent = 'Stopped';
        statusDot.style.background = '#ef4444';
    }

    // প্যানেল ডিজাইন
    const panel = document.createElement('div');
    panel.style.cssText = "position: fixed; bottom: 20px; right: 20px; background: white; padding: 15px; border-radius: 15px; box-shadow: 0 0 30px rgba(0,0,0,0.5); z-index: 1000000; width: 220px; font-family: sans-serif; border: 2px solid #f39c12;";
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <b style="color: #f39c12;">AR LARGE TURBO</b>
            <div id="led" style="width: 10px; height: 10px; border-radius: 50%; background: red;"></div>
        </div>
        <div style="text-align: center; font-weight: bold; font-size: 18px; margin-bottom: 15px; color: #333;">Searching ₹1000</div>
        <div style="display: flex; gap: 5px;">
            <button id="sBtn" style="flex: 1; background: #2ecc71; color: white; border: none; padding: 12px; border-radius: 10px; font-weight: bold; cursor: pointer;">START</button>
            <button id="pBtn" style="flex: 1; background: #e74c3c; color: white; border: none; padding: 12px; border-radius: 10px; font-weight: bold; cursor: pointer;">STOP</button>
        </div>
        <p id="sTxt" style="text-align: center; font-size: 11px; margin-top: 10px; color: #666; font-weight: bold;">LARGE TAB ACTIVE</p>
    `;
    document.body.appendChild(panel);

    const statusDot = panel.querySelector('#led');
    const statusText = panel.querySelector('#sTxt');

    panel.querySelector('#sBtn').onclick = startAuto;
    panel.querySelector('#pBtn').onclick = stopAuto;
})();

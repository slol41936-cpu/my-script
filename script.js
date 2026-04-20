(function () {
    let grabInterval = null;
    let running = false;
    const TARGET_LIST_CLASS = 'x-buyList-list'; // সাইটের লিস্টের মেইন ক্লাস

    function startAutoGrab() {
        if (running) return;
        running = true;

        const targetAmount = amountInput.value.trim();
        statusText.textContent = 'Searching & Tapping...';
        statusDot.style.background = '#22c55e';

        // প্রতি ৫০০ মিলি-সেকেন্ডে (সেকেন্ডে ২ বার) চেক করবে
        grabInterval = setInterval(() => {
            const orders = document.querySelectorAll(`.${TARGET_LIST_CLASS} > *`);
            
            orders.forEach(order => {
                const orderText = order.innerText;

                // ১. চেক করছে নির্দিষ্ট টাকার অর্ডার কি না (যেমন ₹১০০০)
                if (orderText.includes('₹' + targetAmount) && !orderText.includes('₹' + targetAmount + '0')) {
                    order.style.display = ''; // ওটাকে দেখাবে
                    
                    // ২. ওই অর্ডারের ভেতরে থাকা 'Buy' বাটনে ট্যাপ করা
                    const buyBtn = order.querySelector('button') || order.querySelector('.van-button') || order.querySelector('[class*="buy"]');
                    
                    if (buyBtn) {
                        buyBtn.click(); // অটোমেটিক ট্যাপ
                        console.log("Target Found! Tapping on: ₹" + targetAmount);
                    }
                } else {
                    // অন্য টাকার অর্ডারগুলো হাইড করে দেবে যাতে কনফিউশন না হয়
                    order.style.display = 'none';
                }
            });
        }, 500);
    }

    function stopAutoGrab() {
        if (!running) return;
        running = false;
        clearInterval(grabInterval);
        
        // সব অর্ডার আবার ফিরিয়ে আনা
        document.querySelectorAll(`.${TARGET_LIST_CLASS} > *`).forEach(el => el.style.display = '');
        
        statusText.textContent = 'Stopped';
        statusDot.style.background = '#ef4444';
    }

    // প্যানেল ডিজাইন (আপনার ছবির মতো)
    const panel = document.createElement('div');
    panel.style.cssText = "position: fixed; bottom: 20px; right: 20px; background: white; padding: 15px; border-radius: 15px; box-shadow: 0 0 20px rgba(0,0,0,0.2); z-index: 1000000; width: 220px; font-family: sans-serif;";
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <b style="font-size: 14px;">AR Wallet Auto</b>
            <div id="led" style="width: 10px; height: 10px; border-radius: 50%; background: red;"></div>
        </div>
        <input type="number" id="amtInp" value="1000" style="width: 90%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 5px; text-align: center; font-size: 16px;">
        <div style="display: flex; gap: 5px;">
            <button id="btnStart" style="flex: 1; background: #2ecc71; color: white; border: none; padding: 10px; border-radius: 8px; cursor: pointer;">Start</button>
            <button id="btnStop" style="flex: 1; background: #e74c3c; color: white; border: none; padding: 10px; border-radius: 8px; cursor: pointer;">Stop</button>
        </div>
        <p id="txtStat" style="text-align: center; font-size: 11px; margin-top: 10px; color: #666;">Ready</p>
    `;
    document.body.appendChild(panel);

    const amountInput = panel.querySelector('#amtInp');
    const statusDot = panel.querySelector('#led');
    const statusText = panel.querySelector('#txtStat');

    panel.querySelector('#btnStart').onclick = startAutoGrab;
    panel.querySelector('#btnStop').onclick = stopAutoGrab;
})();

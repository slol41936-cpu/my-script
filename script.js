(function () {
    let grabInterval = null;
    let running = false;
    const TARGET_LIST_CLASS = 'x-buyList-list'; 

    function startAutoGrab() {
        if (running) return;
        running = true;

        const targetAmount = amountInput.value.trim();
        statusText.textContent = 'Searching...';
        statusDot.style.background = '#22c55e';

        grabInterval = setInterval(() => {
            // ১. অটো রিফ্রেশ
            const tabs = document.querySelectorAll('.van-tabs__nav *'); 
            tabs.forEach(tab => {
                if (tab.innerText && tab.innerText.includes('BANK')) {
                    tab.click(); 
                }
            });

            // ২. অর্ডার স্ক্যান এবং ট্যাপ করা
            const orders = document.querySelectorAll(`.${TARGET_LIST_CLASS} > *`);
            orders.forEach(order => {
                const orderText = order.innerText;

                // --- এখানে ফিক্স করা হয়েছে ---
                // এটি নিশ্চিত করবে যে ₹১০০০ থাকলে শুধু ১০০০ ই ধরবে। 
                // ১১০, ১১০০ বা অন্য কিছু থাকলে সেটাকে রিজেক্ট করবে।
                const amountPattern = new RegExp('₹\\s*' + targetAmount + '(\\s|\\n|$)');
                const isExactMatch = amountPattern.test(orderText);

                if (isExactMatch) {
                    const buyBtn = order.querySelector('button') || order.querySelector('.van-button') || order.querySelector('[class*="buy"]');
                    
                    if (buyBtn) {
                        stopAutoGrab(); 
                        panel.style.display = 'none'; // প্যানেল হাইড
                        buyBtn.click(); 
                        console.log("Success! Grabbed EXACT: " + targetAmount);
                        alert("অর্ডার ধরা হয়েছে! এখন পেমেন্ট সম্পন্ন করুন।");
                    }
                }
            });
        }, 1000); 
    }

    function stopAutoGrab() {
        running = false;
        clearInterval(grabInterval);
        document.querySelectorAll(`.${TARGET_LIST_CLASS} > *`).forEach(el => el.style.display = '');
        statusText.textContent = 'System Paused';
        statusDot.style.background = '#ef4444';
    }

    // প্যানেল ডিজাইন (আপনার অরিজিনাল ডিজাইন রাখা হয়েছে)
    const panel = document.createElement('div');
    panel.style.cssText = "position: fixed; bottom: 20px; right: 20px; background: white; padding: 15px; border-radius: 15px; box-shadow: 0 0 20px rgba(0,0,0,0.3); z-index: 1000000; width: 220px; font-family: sans-serif;";
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <b style="font-size: 14px;">AR Wallet Pro</b>
            <div id="led" style="width: 10px; height: 10px; border-radius: 50%; background: red;"></div>
        </div>
        <input type="number" id="amtInp" value="1000" style="width: 90%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 5px; text-align: center;">
        <div style="display: flex; gap: 5px;">
            <button id="btnStart" style="flex: 1; background: #2ecc71; color: white; border: none; padding: 10px; border-radius: 8px;">Start</button>
            <button id="btnStop" style="flex: 1; background: #e74c3c; color: white; border: none; padding: 10px; border-radius: 8px;">Stop</button>
        </div>
        <p id="txtStat" style="text-align: center; font-size: 11px; margin-top: 10px; color: #666;">Ready</p>
    `;
    document.body.appendChild(panel);

    const amountInput = panel.querySelector('#amtInp');
    const statusDot = panel.querySelector('#led');
    const statusText = panel.querySelector('#txtStat');

    panel.querySelector('#btnStart').onclick = startAutoGrab;
    panel.querySelector('#btnStop').onclick = () => stopAutoGrab();
})();

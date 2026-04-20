(function () {
    let grabInterval = null;
    let running = false;
    const TARGET_LIST_CLASS = 'x-buyList-list'; 

    function startAutoGrab() {
        if (running) return;
        running = true;

        const targetAmount = amountInput.value.trim();
        statusText.textContent = 'Searching Exact: ₹' + targetAmount;
        statusDot.style.background = '#22c55e';

        grabInterval = setInterval(() => {
            // ১. BANK ট্যাব ক্লিক করে রিফ্রেশ
            const tabs = document.querySelectorAll('.van-tabs__nav *'); 
            tabs.forEach(tab => {
                if (tab.innerText && tab.innerText.trim() === 'BANK') {
                    tab.click(); 
                }
            });

            // ২. নিখুঁতভাবে অর্ডার স্ক্যান
            const orders = document.querySelectorAll(`.${TARGET_LIST_CLASS} > *`);
            orders.forEach(order => {
                const orderText = order.innerText;
                
                // এখানে RegEx ব্যবহার করা হয়েছে যাতে ১১০ বা ১১০০ কে ১০০০ এর সাথে না মেলায়
                const priceRegex = new RegExp('₹\\s*' + targetAmount + '(\\s|\\n|$)');

                if (priceRegex.test(orderText)) {
                    
                    const buyBtn = order.querySelector('button') || order.querySelector('.van-button') || order.querySelector('[class*="buy"]');
                    
                    if (buyBtn) {
                        // অর্ডার পাওয়া গেছে!
                        buyBtn.click(); 
                        console.log("Success! Grabbed Exactly: ₹" + targetAmount);
                        
                        // সিস্টেম স্টপ করা
                        stopAutoGrab(); 

                        // প্যানেলটি স্ক্রিন থেকে সরিয়ে ফেলা (আপনার ২য় সমস্যার সমাধান)
                        panel.style.display = 'none';

                        // ব্যবহারকারীকে জানানো
                        alert("অর্ডার ধরা হয়েছে! পেমেন্ট শেষ করে আবার পেজ লোড করুন।");
                    }
                } else {
                    // টার্গেট অ্যামাউন্ট না হলে হাইড করে রাখা
                    order.style.display = 'none';
                }
            });
        }, 1000); 
    }

    function stopAutoGrab() {
        running = false;
        clearInterval(grabInterval);
        statusText.textContent = 'System Paused';
        statusDot.style.background = '#ef4444';
    }

    // প্যানেল ডিজাইন
    const panel = document.createElement('div');
    panel.id = 'ar-wallet-pro-panel';
    panel.style.cssText = "position: fixed; bottom: 20px; right: 20px; background: white; padding: 15px; border-radius: 15px; box-shadow: 0 0 20px rgba(0,0,0,0.3); z-index: 1000000; width: 220px; font-family: sans-serif;";
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <b style="font-size: 14px;">AR Wallet Turbo V2</b>
            <div id="led" style="width: 10px; height: 10px; border-radius: 50%; background: red;"></div>
        </div>
        <input type="number" id="amtInp" value="1000" style="width: 90%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 5px; text-align: center; font-weight: bold; font-size: 18px;">
        <div style="display: flex; gap: 5px;">
            <button id="btnStart" style="flex: 1; background: #2ecc71; color: white; border: none; padding: 10px; border-radius: 8px; font-weight: bold; cursor: pointer;">Start</button>
            <button id="btnStop" style="flex: 1; background: #e74c3c; color: white; border: none; padding: 10px; border-radius: 8px; font-weight: bold; cursor: pointer;">Stop</button>
        </div>
        <p id="txtStat" style="text-align: center; font-size: 11px; margin-top: 10px; color: #666;">Ready to Grab</p>
    `;
    document.body.appendChild(panel);

    const amountInput = panel.querySelector('#amtInp');
    const statusDot = panel.querySelector('#led');
    const statusText = panel.querySelector('#txtStat');

    panel.querySelector('#btnStart').onclick = startAutoGrab;
    panel.querySelector('#btnStop').onclick = stopAutoGrab;
})();

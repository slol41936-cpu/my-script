(function () {
    let grabInterval = null;
    let running = false;
    const TARGET_LIST_CLASS = 'x-buyList-list'; 

    function startAutoGrab() {
        if (running) return;
        running = true;

        const targetAmount = amountInput.value.trim();
        statusText.textContent = 'Turbo Active: ₹' + targetAmount;
        statusDot.style.background = '#22c55e';

        grabInterval = setInterval(() => {
            // ১. রিফ্রেশ করার জন্য 'BANK' ট্যাবে ক্লিক (আরও উন্নত পদ্ধতি)
            const tabs = document.querySelectorAll('.van-tab__text, .van-tab, span, div');
            tabs.forEach(tab => {
                if (tab.innerText && tab.innerText.trim() === 'BANK') {
                    tab.click(); 
                }
            });

            // ২. অর্ডার স্ক্যান এবং নিখুঁত ট্যাপ
            const orders = document.querySelectorAll(`.${TARGET_LIST_CLASS} > *`);
            orders.forEach(order => {
                const orderText = order.innerText;
                
                // আপনার টাইপ করা ১০০০ এবং অর্ডারের ১০০০ একদম এক কি না চেক করা
                // এটি ১১০ বা ১১০০ কে এড়িয়ে যাবে
                const priceMatch = orderText.match(/₹\s*(\d+)/);
                if (priceMatch && priceMatch[1] === targetAmount) {
                    
                    const buyBtn = order.querySelector('button') || order.querySelector('.van-button') || order.querySelector('[class*="buy"]');
                    
                    if (buyBtn) {
                        // অর্ডার পাওয়ার সাথে সাথে রিফ্রেশ অফ করবে
                        clearInterval(grabInterval);
                        running = false;
                        
                        buyBtn.click(); // ট্যাপ করল
                        
                        // প্যানেল লুকানো
                        panel.style.display = 'none';
                        
                        console.log("Matched & Tapped: ₹" + targetAmount);
                        alert("অর্ডার ধরা হয়েছে! পেমেন্ট পেজে যান।");
                    }
                } else {
                    // টার্গেট ছাড়া বাকিগুলো স্ক্রিন থেকে সরিয়ে রাখা
                    order.style.display = 'none';
                }
            });
        }, 1000); // ১ সেকেন্ড পর পর রিফ্রেশ
    }

    function stopAutoGrab() {
        running = false;
        clearInterval(grabInterval);
        statusText.textContent = 'Paused';
        statusDot.style.background = '#ef4444';
    }

    // প্যানেল ডিজাইন
    const panel = document.createElement('div');
    panel.style.cssText = "position: fixed; bottom: 20px; right: 20px; background: white; padding: 15px; border-radius: 15px; box-shadow: 0 0 25px rgba(0,0,0,0.5); z-index: 1000000; width: 220px; font-family: sans-serif; border: 1px solid #ddd;";
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <b style="font-size: 14px; color: #333;">AR Wallet Turbo</b>
            <div id="led" style="width: 12px; height: 12px; border-radius: 50%; background: red;"></div>
        </div>
        <input type="number" id="amtInp" value="1000" style="width: 90%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 8px; text-align: center; font-size: 18px; font-weight: bold;">
        <div style="display: flex; gap: 8px;">
            <button id="btnStart" style="flex: 1; background: #2ecc71; color: white; border: none; padding: 12px; border-radius: 10px; font-weight: bold; cursor: pointer;">START</button>
            <button id="btnStop" style="flex: 1; background: #e74c3c; color: white; border: none; padding: 12px; border-radius: 10px; font-weight: bold; cursor: pointer;">STOP</button>
        </div>
        <p id="txtStat" style="text-align: center; font-size: 11px; margin-top: 10px; color: #888;">Ready to Grab</p>
    `;
    document.body.appendChild(panel);

    const amountInput = panel.querySelector('#amtInp');
    const statusDot = panel.querySelector('#led');
    const statusText = panel.querySelector('#txtStat');

    panel.querySelector('#btnStart').onclick = startAutoGrab;
    panel.querySelector('#btnStop').onclick = stopAutoGrab;
})();

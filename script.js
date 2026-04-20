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
            // ১. আগের মতো 'BANK' অপশনে দ্রুত ট্যাপ করে রিফ্রেশ করা
            const allElements = document.querySelectorAll('*');
            allElements.forEach(el => {
                if (el.innerText && el.innerText.trim() === 'BANK') {
                    el.click(); 
                }
            });

            // ২. অর্ডার স্ক্যান এবং ট্যাপ
            const orders = document.querySelectorAll(`.${TARGET_LIST_CLASS} > *`);
            orders.forEach(order => {
                const orderText = order.innerText;
                
                // নিখুঁতভাবে অ্যামাউন্ট চেক (যেমন: ₹১০০০ ই খুঁজবে, ১১০০ বা ১১০ নয়)
                if (orderText.includes('₹' + targetAmount) && !orderText.includes('₹' + targetAmount + '0')) {
                    
                    const buyBtn = order.querySelector('button') || order.querySelector('.van-button') || order.querySelector('[class*="buy"]');
                    
                    if (buyBtn) {
                        // অর্ডার পাওয়ার সাথে সাথে রিফ্রেশ বন্ধ করে ট্যাপ করবে
                        stopAutoGrab(); 
                        buyBtn.click(); 
                        
                        // প্যানেল হাইড করা যাতে পেমেন্টে সমস্যা না হয়
                        panel.style.display = 'none';
                        
                        console.log("Matched & Tapped: ₹" + targetAmount);
                        alert("অর্ডার ধরা হয়েছে! পেমেন্ট কমপ্লিট করুন।");
                    }
                } else {
                    // টার্গেট ছাড়া বাকিগুলো স্ক্রিন থেকে সরিয়ে রাখা যাতে সিস্টেম ফাস্ট থাকে
                    order.style.display = 'none';
                }
            });
        }, 600); // ০.৬ সেকেন্ড পর পর রিফ্রেশ (খুবই ফাস্ট)
    }

    function stopAutoGrab() {
        running = false;
        clearInterval(grabInterval);
        statusText.textContent = 'Paused';
        statusDot.style.background = '#ef4444';
    }

    // প্যানেল ডিজাইন
    const panel = document.createElement('div');
    panel.style.cssText = "position: fixed; bottom: 20px; right: 20px; background: white; padding: 15px; border-radius: 15px; box-shadow: 0 0 20px rgba(0,0,0,0.4); z-index: 1000000; width: 220px; font-family: sans-serif; border: 2px solid #eee;";
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <b style="font-size: 14px; color: #333;">AR Wallet Turbo</b>
            <div id="led" style="width: 12px; height: 12px; border-radius: 50%; background: red;"></div>
        </div>
        <input type="number" id="amtInp" value="1000" style="width: 90%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 8px; text-align: center; font-size: 18px; font-weight: bold;">
        <div style="display: flex; gap: 5px;">
            <button id="btnStart" style="flex: 1; background: #2ecc71; color: white; border: none; padding: 12px; border-radius: 10px; font-weight: bold; cursor: pointer;">START</button>
            <button id="btnStop" style="flex: 1; background: #e74c3c; color: white; border: none; padding: 12px; border-radius: 10px; font-weight: bold; cursor: pointer;">STOP</button>
        </div>
        <p id="txtStat" style="text-align: center; font-size: 11px; margin-top: 10px; color: #888;">System Ready</p>
    `;
    document.body.appendChild(panel);

    const amountInput = panel.querySelector('#amtInp');
    const statusDot = panel.querySelector('#led');
    const statusText = panel.querySelector('#txtStat');

    panel.querySelector('#btnStart').onclick = startAutoGrab;
    panel.querySelector('#btnStop').onclick = stopAutoGrab;
})();

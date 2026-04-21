(function () {
    let grabInterval = null;
    let running = false;
    const TARGET_CLASS = 'x-buyList-list'; // অর্ডারের মেইন লিস্ট

    function startAuto() {
        if (running) return;
        running = true;
        
        const targetAmount = "1000"; // আপনি যেটা চাইলেন, ফিক্সড হাজার টাকা
        statusText.textContent = 'Searching: ₹' + targetAmount;
        statusDot.style.background = '#22c55e';

        grabInterval = setInterval(() => {
            // ১. BANK ট্যাবে ক্লিক করে রিফ্রেশ করা (যাতে নতুন অর্ডার আসে)
            const tabs = document.querySelectorAll('.van-tab');
            tabs.forEach(tab => {
                if (tab.innerText.includes('BANK')) tab.click();
            });

            // ২. অর্ডার ফিল্টার ও ট্যাপ
            const orders = document.querySelectorAll(`.${TARGET_CLASS} > *`);
            
            orders.forEach(order => {
                const text = order.innerText;

                // চেক করবে শুধু ১০০০ আছে কি না (১১০ বা ১০০ থাকলে ওটা বাদ)
                if (text.includes('₹' + targetAmount) && !text.includes('₹' + targetAmount + '0') && !text.includes('₹110')) {
                    order.style.display = ''; // শুধু ১০০০ টাকারটা দেখাবে
                    
                    // সাথে সাথে ট্যাপ (Buy বাটনে ক্লিক)
                    const buyBtn = order.querySelector('button') || order.querySelector('.van-button');
                    if (buyBtn) {
                        buyBtn.click();
                        stopAuto(); // অর্ডার ধরলে রিফ্রেশ বন্ধ
                        panel.style.display = 'none'; // প্যানেল গায়েব
                    }
                } else {
                    order.style.display = 'none'; // ১০০০ না হলে ওটা স্ক্রিন থেকে গায়েব
                }
            });
        }, 500); // আরও দ্রুত (সেকেন্ডে ২ বার চেক করবে)
    }

    function stopAuto() {
        running = false;
        clearInterval(grabInterval);
        statusText.textContent = 'Stopped';
        statusDot.style.background = '#ef4444';
        document.querySelectorAll(`.${TARGET_CLASS} > *`).forEach(el => el.style.display = '');
    }

    // আপনার সেই বক্স ডিজাইন
    const panel = document.createElement('div');
    panel.style.cssText = "position: fixed; bottom: 20px; right: 20px; background: white; padding: 15px; border-radius: 15px; box-shadow: 0 0 20px rgba(0,0,0,0.3); z-index: 1000000; width: 220px; font-family: sans-serif;";
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <b>AR Wallet Auto</b>
            <div id="led" style="width: 10px; height: 10px; border-radius: 50%; background: red;"></div>
        </div>
        <div style="text-align: center; font-weight: bold; font-size: 18px; margin-bottom: 10px; color: #333;">₹ 1000 ONLY</div>
        <div style="display: flex; gap: 5px;">
            <button id="sBtn" style="flex: 1; background: #2ecc71; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: bold;">Start</button>
            <button id="pBtn" style="flex: 1; background: #e74c3c; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: bold;">Stop</button>
        </div>
        <p id="sTxt" style="text-align: center; font-size: 11px; margin-top: 10px; color: #666;">Ready to Grab</p>
    `;
    document.body.appendChild(panel);

    const statusDot = panel.querySelector('#led');
    const statusText = panel.querySelector('#sTxt');

    panel.querySelector('#sBtn').onclick = startAuto;
    panel.querySelector('#pBtn').onclick = stopAuto;
})();

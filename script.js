(function () {
    let grabInterval = null;
    let running = false;
    const TARGET_LIST_CLASS = 'x-buyList-list'; 

    function startAutoGrab() {
        if (running) return;
        running = true;

        const targetAmount = amountInput.value.trim();
        statusText.textContent = 'Searching for: ₹' + targetAmount;
        statusDot.style.background = '#22c55e';

        grabInterval = setInterval(() => {
            // ১. রিফ্রেশ করার জন্য 'BANK' ট্যাবে ক্লিক (Force Click)
            const allTabs = document.querySelectorAll('.van-tab__text, .van-tab, div, span, p');
            for (let tab of allTabs) {
                if (tab.innerText && tab.innerText.trim() === 'BANK') {
                    tab.click();
                    // ক্লিক করার পর একটি ইভেন্ট ট্রিগার করা যাতে সাইট বোঝে ট্যাপ হয়েছে
                    tab.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                    break; 
                }
            }

            // ২. অর্ডার স্ক্যান এবং নিখুঁতভাবে ১০০০ টাকার অর্ডার ট্যাপ
            const orders = document.querySelectorAll(`.${TARGET_LIST_CLASS} > *`);
            orders.forEach(order => {
                const orderText = order.innerText;
                
                // শুধু নির্দিষ্ট অ্যামাউন্ট চেক (Exact Match)
                const priceRegex = new RegExp('₹\\s*' + targetAmount + '(\\s|\\n|$)');

                if (priceRegex.test(orderText)) {
                    // 'Buy' বাটন খোঁজা
                    const buyBtn = order.querySelector('button') || 
                                   order.querySelector('.van-button') || 
                                   order.querySelector('[class*="buy"]') ||
                                   order.querySelector('.x-buyList-btn');
                    
                    if (buyBtn) {
                        // অর্ডার পাওয়ার সাথে সাথে রিফ্রেশ বন্ধ
                        clearInterval(grabInterval);
                        running = false;
                        
                        // অটো ট্যাপ
                        buyBtn.click();
                        buyBtn.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                        
                        // প্যানেল হাইড
                        panel.style.display = 'none';
                        
                        console.log("Success! Grabbed: ₹" + targetAmount);
                        alert("অর্ডার ধরা হয়েছে! পেমেন্ট কমপ্লিট করুন।");
                    }
                } else {
                    // বাকিগুলো হাইড করা যাতে কনফিউশন না হয়
                    order.style.display = 'none';
                }
            });
        }, 1000); // ১ সেকেন্ড পর পর রিফ্রেশ
    }

    function stopAutoGrab() {
        running = false;
        clearInterval(grabInterval);
        statusText.textContent = 'System Paused';
        statusDot.style.background = '#ef4444';
    }

    // প্যানেল ডিজাইন
    const panel = document.createElement('div');
    panel.style.cssText = "position: fixed; bottom: 20px; right: 20px; background: #fff; padding: 15px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 1000000; width: 230px; font-family: sans-serif; border: 1px solid #ddd;";
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <b style="font-size: 14px;">AR Wallet Turbo V3</b>
            <div id="led" style="width: 12px; height: 12px; border-radius: 50%; background: red;"></div>
        </div>
        <input type="number" id="amtInp" value="1000" style="width: 90%; padding: 12px; border: 1px solid #ccc; border-radius: 8px; text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 15px;">
        <div style="display: flex; gap: 8px;">
            <button id="btnStart" style="flex: 1; background: #2ecc71; color: white; border: none; padding: 12px; border-radius: 10px; font-weight: bold; cursor: pointer;">START</button>
            <button id="btnStop" style="flex: 1; background: #e74c3c; color: white; border: none; padding: 12px; border-radius: 10px; font-weight: bold; cursor: pointer;">STOP</button>
        </div>
        <p id="txtStat" style="text-align: center; font-size: 12px; margin-top: 10px; color: #666;">Ready to Work</p>
    `;
    document.body.appendChild(panel);

    const amountInput = panel.querySelector('#amtInp');
    const statusDot = panel.querySelector('#led');
    const statusText = panel.querySelector('#txtStat');

    panel.querySelector('#btnStart').onclick = startAutoGrab;
    panel.querySelector('#btnStop').onclick = stopAutoGrab;
})();

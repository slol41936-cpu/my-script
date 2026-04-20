(function () {
    let grabInterval = null;
    let running = false;
    const TARGET_LIST_CLASS = 'x-buyList-list'; 

    function startAutoGrab() {
        if (running) return;
        running = true;

        const targetAmount = parseInt(amountInput.value.trim()); // সংখ্যায় রূপান্তর
        statusText.textContent = 'Searching Exact: ' + targetAmount;
        statusDot.style.background = '#22c55e';

        grabInterval = setInterval(() => {
            // ১. অটো রিফ্রেশ (BANK ট্যাব ক্লিক)
            const tabs = document.querySelectorAll('.van-tabs__nav *'); 
            tabs.forEach(tab => {
                if (tab.innerText && tab.innerText.includes('BANK')) {
                    tab.click(); 
                }
            });

            // ২. অর্ডার স্ক্যান
            const orders = document.querySelectorAll(`.${TARGET_LIST_CLASS} > *`);
            orders.forEach(order => {
                // অর্ডারের ভেতর থেকে সব টেক্সট নেওয়া
                const orderText = order.innerText;
                
                // টেক্সট থেকে শুধু সংখ্যাগুলো খুঁজে বের করা (যেমন: ₹ 1,000 থেকে 1000 নেওয়া)
                const numbersFound = orderText.replace(/,/g, '').match(/\d+/g);
                
                if (numbersFound) {
                    // চেক করা হচ্ছে কোনো একটি সংখ্যা আপনার টার্গেটের সাথে একদম হুবহু মিলে কি না
                    const hasExactMatch = numbersFound.some(num => parseInt(num) === targetAmount);

                    if (hasExactMatch) {
                        const buyBtn = order.querySelector('button') || order.querySelector('.van-button') || order.querySelector('[class*="buy"]');
                        
                        if (buyBtn) {
                            stopAutoGrab(); 
                            panel.style.display = 'none'; // প্যানেল হাইড
                            buyBtn.click(); 
                            console.log("Matched Exact Amount: " + targetAmount);
                            alert("সঠিক অর্ডার পাওয়া গেছে! পেমেন্ট করুন।");
                        }
                    }
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

    // আপনার অরিজিনাল প্যানেল ডিজাইন
    const panel = document.createElement('div');
    panel.style.cssText = "position: fixed; bottom: 20px; right: 20px; background: white; padding: 15px; border-radius: 15px; box-shadow: 0 0 20px rgba(0,0,0,0.3); z-index: 1000000; width: 220px; font-family: sans-serif;";
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <b style="font-size: 14px;">AR Wallet Pro</b>
            <div id="led" style="width: 10px; height: 10px; border-radius: 50%; background: red;"></div>
        </div>
        <input type="number" id="amtInp" value="1000" style="width: 90%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 5px; text-align: center; font-size: 16px; font-weight: bold;">
        <div style="display: flex; gap: 5px;">
            <button id="btnStart" style="flex: 1; background: #2ecc71; color: white; border: none; padding: 10px; border-radius: 8px; font-weight: bold;">Start</button>
            <button id="btnStop" style="flex: 1; background: #e74c3c; color: white; border: none; padding: 10px; border-radius: 8px; font-weight: bold;">Stop</button>
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

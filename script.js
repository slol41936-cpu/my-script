(function () {
    let grabInterval = null;
    let running = false;
    const TARGET_LIST_CLASS = 'x-buyList-list'; 

    // ফানি সাউন্ড ইফেক্ট (অর্ডার ধরলে বাজবে)
    const successSound = new Audio("https://www.myinstants.com/media/sounds/funny-notification-sound.mp3");

    function startAutoGrab() {
        if (running) return;
        running = true;

        const targetAmount = parseInt(amountInput.value.trim()); 
        statusText.textContent = 'Turbo Searching: ' + targetAmount;
        statusDot.style.background = '#22c55e';

        grabInterval = setInterval(() => {
            // ১. অটো রিফ্রেশ (BANK ট্যাব)
            const tabs = document.querySelectorAll('.van-tabs__nav *'); 
            tabs.forEach(tab => {
                if (tab.innerText && tab.innerText.includes('BANK')) {
                    tab.click(); 
                }
            });

            // ২. অর্ডার স্ক্যান
            const orders = document.querySelectorAll(`.${TARGET_LIST_CLASS} > *`);
            orders.forEach(order => {
                const orderText = order.innerText;
                
                // শুধুমাত্র সংখ্যাগুলো আলাদা করা
                const numbersFound = orderText.replace(/,/g, '').match(/\d+/g);
                
                if (numbersFound) {
                    // একদম নিখুঁত অ্যামাউন্ট চেক
                    const hasExactMatch = numbersFound.some(num => parseInt(num) === targetAmount);

                    if (hasExactMatch) {
                        const buyBtn = order.querySelector('button') || order.querySelector('.van-button') || order.querySelector('[class*="buy"]');
                        
                        if (buyBtn) {
                            stopAutoGrab(); 
                            panel.style.display = 'none'; // প্যানেল অটো হাইড
                            
                            // ফানি সাউন্ড বাজানো
                            successSound.play();
                            
                            // সরাসরি ক্লিক (কোনো বিরক্তিকর Alert আসবে না)
                            buyBtn.click(); 
                            console.log("Success! Grabbed: " + targetAmount);
                        }
                    }
                }
            });
        }, 800); // আরও ফাস্ট করার জন্য ০.৮ সেকেন্ড দেওয়া হয়েছে
    }

    function stopAutoGrab() {
        running = false;
        clearInterval(grabInterval);
        statusText.textContent = 'Stopped';
        statusDot.style.background = '#ef4444';
    }

    // প্যানেল ডিজাইন
    const panel = document.createElement('div');
    panel.style.cssText = "position: fixed; bottom: 20px; right: 20px; background: white; padding: 15px; border-radius: 15px; box-shadow: 0 0 20px rgba(0,0,0,0.3); z-index: 1000000; width: 220px; font-family: sans-serif;";
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <b style="font-size: 14px;">AR Wallet Turbo</b>
            <div id="led" style="width: 10px; height: 10px; border-radius: 50%; background: red;"></div>
        </div>
        <input type="number" id="amtInp" value="1000" style="width: 90%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 5px; text-align: center; font-size: 16px; font-weight: bold;">
        <div style="display: flex; gap: 5px;">
            <button id="btnStart" style="flex: 1; background: #2ecc71; color: white; border: none; padding: 10px; border-radius: 8px; font-weight: bold;">Start</button>
            <button id="btnStop" style="flex: 1; background: #e74c3c; color: white; border: none; padding: 10px; border-radius: 8px; font-weight: bold;">Stop</button>
        </div>
        <p id="txtStat" style="text-align: center; font-size: 11px; margin-top: 10px; color: #666;">Waiting for target...</p>
    `;
    document.body.appendChild(panel);

    const amountInput = panel.querySelector('#amtInp');
    const statusDot = panel.querySelector('#led');
    const statusText = panel.querySelector('#txtStat');

    panel.querySelector('#btnStart').onclick = startAutoGrab;
    panel.querySelector('#btnStop').onclick = stopAutoGrab;
})();

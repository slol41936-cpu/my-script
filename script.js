(function () {
    let grabInterval = null;
    let running = false;
    let currentTab = 'Default'; // ট্যাব ট্র্যাক করার জন্য
    const TARGET_LIST_CLASS = 'x-buyList-list'; 

    const successSound = new Audio("https://www.myinstants.com/media/sounds/funny-notification-sound.mp3");

    function startAutoGrab() {
        if (running) return;
        running = true;

        const targetAmount = parseInt(amountInput.value.trim()); 
        statusText.textContent = 'Jumping Tabs...';
        statusDot.style.background = '#22c55e';

        grabInterval = setInterval(() => {
            // ১. BANK ট্যাব নিশ্চিত করা এবং Default/Large এর মধ্যে সুইচ করা
            const tabs = document.querySelectorAll('.van-tab, .van-tab__text, div, span');
            
            // প্রথমে নিশ্চিত করা যে BANK সিলেক্টেড আছে
            const bankTab = Array.from(tabs).find(el => el.innerText && el.innerText.includes('BANK'));
            if (bankTab) bankTab.click();

            // এবার Default এবং Large এর মধ্যে লাফালাফি (সুইচিং) করবে
            const subTabs = Array.from(document.querySelectorAll('div, span, p'));
            const nextTabName = (currentTab === 'Default') ? 'Large' : 'Default';
            const targetTab = subTabs.find(el => el.innerText && el.innerText.trim() === nextTabName);
            
            if (targetTab) {
                targetTab.click();
                currentTab = nextTabName; // ট্র্যাক পরিবর্তন
                statusText.textContent = 'Tab: ' + currentTab;
            }

            // ২. অর্ডার স্ক্যান এবং ১০০০ টাকা দেখা মাত্রই ছোঁ মারা
            const orders = document.querySelectorAll(`.${TARGET_LIST_CLASS} > *`);
            orders.forEach(order => {
                const orderText = order.innerText;
                
                // ১০০০ বাদে বাকি সব সাথে সাথে ডিলিট (যাতে স্পিড বাড়ে)
                const numbersFound = orderText.replace(/,/g, '').match(/\d+/g);
                
                if (numbersFound && numbersFound.some(num => parseInt(num) === targetAmount)) {
                    const buyBtn = order.querySelector('button') || order.querySelector('.van-button') || order.querySelector('[class*="buy"]');
                    
                    if (buyBtn) {
                        stopAutoGrab(); 
                        panel.style.display = 'none'; 
                        successSound.play();
                        
                        buyBtn.click(); 
                        buyBtn.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                        console.log("Success! Grabbed: " + targetAmount + " from " + currentTab);
                    }
                } else {
                    // ১০০০ না হলে ওটা স্ক্রিনে রাখার দরকার নেই
                    order.remove();
                }
            });
        }, 600); // গতির জন্য ০.৬ সেকেন্ড সেট করা হয়েছে
    }

    function stopAutoGrab() {
        running = false;
        clearInterval(grabInterval);
        statusText.textContent = 'Stopped';
        statusDot.style.background = '#ef4444';
    }

    // প্যানেল ডিজাইন (আপনার অরিজিনাল ডিজাইন ঠিক রাখা হয়েছে)
    const panel = document.createElement('div');
    panel.style.cssText = "position: fixed; bottom: 20px; right: 20px; background: white; padding: 15px; border-radius: 15px; box-shadow: 0 0 20px rgba(0,0,0,0.3); z-index: 1000000; width: 220px; font-family: sans-serif; border: 2px solid #2ecc71;";
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <b style="font-size: 14px;">AR Tab Jumper V1</b>
            <div id="led" style="width: 10px; height: 10px; border-radius: 50%; background: red;"></div>
        </div>
        <input type="number" id="amtInp" value="1000" style="width: 90%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 5px; text-align: center; font-size: 16px; font-weight: bold;">
        <div style="display: flex; gap: 5px;">
            <button id="btnStart" style="flex: 1; background: #2ecc71; color: white; border: none; padding: 10px; border-radius: 8px; font-weight: bold;">Start</button>
            <button id="btnStop" style="flex: 1; background: #e74c3c; color: white; border: none; padding: 10px; border-radius: 8px; font-weight: bold;">Stop</button>
        </div>
        <p id="txtStat" style="text-align: center; font-size: 11px; margin-top: 10px; color: #666;">Ready to Jump</p>
    `;
    document.body.appendChild(panel);

    const amountInput = panel.querySelector('#amtInp');
    const statusDot = panel.querySelector('#led');
    const statusText = panel.querySelector('#txtStat');

    panel.querySelector('#btnStart').onclick = startAutoGrab;
    panel.querySelector('#btnStop').onclick = stopAutoGrab;
})();

(function () {
    let grabInterval = null;
    let observer = null;
    let running = false;
    const TARGET_LIST_CLASS = 'x-buyList-list'; 

    // সাউন্ড লোড
    const successSound = new Audio("https://www.myinstants.com/media/sounds/funny-notification-sound.mp3");

    function isTargetAvailable() {
        return document.querySelector(`.${TARGET_LIST_CLASS}`) !== null;
    }

    function startAutoGrab() {
        if (running || !isTargetAvailable()) return;
        running = true;

        const targetAmount = parseInt(amountInput.value.trim()); 
        statusText.textContent = 'Searching: ' + targetAmount;
        statusDot.style.background = '#2ecc71'; // Green

        grabInterval = setInterval(() => {
            // ১. অটো রিফ্রেশ (BANK ট্যাব ট্রিগার)
            const tabs = document.querySelectorAll('.van-tabs__nav *'); 
            tabs.forEach(tab => {
                if (tab.innerText && tab.innerText.includes('BANK')) {
                    tab.click(); 
                }
            });

            // ২. অর্ডার ফিল্টার এবং ইনস্ট্যান্ট ক্লিক
            const orders = document.querySelectorAll(`.${TARGET_LIST_CLASS} > *`);
            
            orders.forEach(order => {
                const text = order.innerText;
                
                // এখানে RegEx আরও শক্তিশালী করা হয়েছে যাতে ১০০০ ছাড়া কিছুই না দেখায়
                const match = text.match(/₹\s*(\d+)/);
                const currentPrice = match ? parseInt(match[1]) : 0;

                if (currentPrice === targetAmount) {
                    // যদি ১০০০ টাকার অর্ডার হয় তবেই দেখাবে
                    order.style.display = "block"; 
                    
                    // সাথে সাথে 'Buy' বাটনে ক্লিক করার চেষ্টা করবে
                    const buyBtn = order.querySelector('.van-button') || 
                                   order.querySelector('button') || 
                                   order.querySelector('[class*="buy"]');
                    
                    if (buyBtn) {
                        buyBtn.click(); // ফাস্ট ট্যাপ
                        successSound.play();
                        stopAutoGrab(); // অর্ডার ধরলে অফ হয়ে যাবে যাতে ডাবল ক্লিক না হয়
                        panel.style.display = 'none'; // প্যানেল গায়েব
                    }
                } else {
                    // ১০০০ বাদে বাকি সব একদম গায়েব (Hide)
                    order.style.display = "none";
                }
            });

        }, 400); // স্পিড আরও বাড়ানো হয়েছে (৪০০ মিলি-সেকেন্ড)

        // রিয়েল টাইম অবজার্ভার
        observer = new MutationObserver(() => {
            if (!isTargetAvailable()) stopAutoGrab();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function stopAutoGrab() {
        if (!running) return;
        running = false;
        clearInterval(grabInterval);
        if (observer) observer.disconnect();
        
        document.querySelectorAll(`.${TARGET_LIST_CLASS} > *`).forEach(el => el.style.display = '');
        
        statusText.textContent = 'Stopped';
        statusDot.style.background = '#e74c3c'; // Red
    }

    // প্যানেল ডিজাইন (আপনার দেওয়া ছবির হুবহু লুক)
    const panel = document.createElement('div');
    panel.style.cssText = "position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: white; padding: 15px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 1000000; width: 280px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center;";
    
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 0 10px;">
            <span style="font-weight: bold; color: #333; font-size: 16px;">AR Wallet</span>
            <div id="led" style="width: 12px; height: 12px; border-radius: 50%; background: #e74c3c;"></div>
        </div>
        
        <input type="number" id="amtInp" value="1000" style="width: 90%; padding: 12px; margin-bottom: 15px; border: 1px solid #eee; border-radius: 10px; text-align: center; font-size: 20px; font-weight: bold; outline: none; background: #f9f9f9;">
        
        <div style="display: flex; gap: 10px; padding: 0 5px;">
            <button id="btnStart" style="flex: 1; background: #2ecc71; color: white; border: none; padding: 12px; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 16px;">Start</button>
            <button id="btnStop" style="flex: 1; background: #e74c3c; color: white; border: none; padding: 12px; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 16px;">Stop</button>
        </div>
        
        <div id="txtStat" style="margin-top: 15px; font-size: 13px; color: #888;">Stopped</div>
    `;

    document.body.appendChild(panel);

    const amountInput = panel.querySelector('#amtInp');
    const statusDot = panel.querySelector('#led');
    const statusText = panel.querySelector('#txtStat');

    panel.querySelector('#btnStart').onclick = startAutoGrab;
    panel.querySelector('#btnStop').onclick = stopAutoGrab;

    // প্যানেল ভিজিবিলিটি চেক
    setInterval(() => {
        panel.style.display = isTargetAvailable() ? 'block' : 'none';
    }, 1000);
})();

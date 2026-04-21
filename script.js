(function () {
    let grabInterval = null;
    let running = false;
    const TARGET_CLASS = 'x-buyList-list'; 

    // সাউন্ড ইফেক্ট
    const successSound = new Audio("https://www.myinstants.com/media/sounds/funny-notification-sound.mp3");

    function startAuto() {
        if (running) return;
        running = true;
        
        statusText.textContent = 'Turbo Mode: ON';
        statusDot.style.background = '#22c55e';

        // পয়েন্ট ১: এক্সট্রিম স্পিড (২০০ms) - সেকেন্ডে ৫ বার রিফ্রেশ ও চেক
        grabInterval = setInterval(() => {
            // ১. BANK ট্যাবে সুপার ফাস্ট ক্লিক (রিফ্রেশ)
            const tabs = document.querySelectorAll('.van-tab, .van-tab__text, .van-tabs__nav *');
            for (let tab of tabs) {
                if (tab.innerText && tab.innerText.includes('BANK')) {
                    tab.click();
                    break;
                }
            }

            // ২. অর্ডার স্ক্যান
            const orders = document.querySelectorAll(`.${TARGET_CLASS} > *`);
            
            orders.forEach(order => {
                const text = order.innerText;

                // পয়েন্ট ৩: নিখুঁত ফিল্টার (শুধু ১০০০ খুঁজবে, ১১০ বা ১১০০ বাদ)
                if ((text.includes('₹1000') || text.includes('₹ 1000')) && !text.includes('1100') && !text.includes('10000')) {
                    
                    const buyBtn = order.querySelector('button') || order.querySelector('.van-button') || order.querySelector('[class*="buy"]');

                    if (buyBtn) {
                        // পয়েন্ট ৪: অ্যালার্ট ছাড়া সরাসরি ট্যাপ ও সাউন্ড
                        successSound.play();
                        buyBtn.click();
                        buyBtn.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                        
                        // কাজ হয়ে গেলে অফ
                        stopAuto(); 
                        panel.style.display = 'none';
                        console.log("BOOM! 1000 Grabbed.");
                    }
                } else {
                    // পয়েন্ট ২: রিমুভ লজিক (১০০০ না হলে সাথে সাথে ডিলিট যাতে সিস্টেম ফাস্ট থাকে)
                    order.remove(); 
                }
            });
        }, 200); 
    }

    function stopAuto() {
        running = false;
        clearInterval(grabInterval);
        statusText.textContent = 'Stopped';
        statusDot.style.background = '#ef4444';
    }

    // প্যানেল ডিজাইন
    const panel = document.createElement('div');
    panel.style.cssText = "position: fixed; bottom: 20px; right: 20px; background: white; padding: 15px; border-radius: 15px; box-shadow: 0 0 30px rgba(0,0,0,0.5); z-index: 1000000; width: 220px; font-family: sans-serif; border: 2px solid #2ecc71;";
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <b style="color: #2ecc71;">AR TURBO V4</b>
            <div id="led" style="width: 10px; height: 10px; border-radius: 50%; background: red;"></div>
        </div>
        <div style="text-align: center; font-weight: bold; font-size: 20px; margin-bottom: 15px; color: #333;">TARGET: ₹1000</div>
        <div style="display: flex; gap: 5px;">
            <button id="sBtn" style="flex: 1; background: #2ecc71; color: white; border: none; padding: 12px; border-radius: 10px; font-weight: bold; cursor: pointer;">START</button>
            <button id="pBtn" style="flex: 1; background: #e74c3c; color: white; border: none; padding: 12px; border-radius: 10px; font-weight: bold; cursor: pointer;">STOP</button>
        </div>
        <p id="sTxt" style="text-align: center; font-size: 11px; margin-top: 10px; color: #666; font-weight: bold;">SUPER POWERED</p>
    `;
    document.body.appendChild(panel);

    const statusDot = panel.querySelector('#led');
    const statusText = panel.querySelector('#sTxt');

    panel.querySelector('#sBtn').onclick = startAuto;
    panel.querySelector('#pBtn').onclick = stopAuto;
})();

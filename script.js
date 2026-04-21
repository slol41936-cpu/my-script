(function () {
    let grabInterval = null;
    let running = false;
    const TARGET_LIST_CLASS = 'x-buyList-list'; 

    // ফানি সাউন্ড ইফেক্ট
    const successSound = new Audio("https://www.myinstants.com/media/sounds/funny-notification-sound.mp3");

    function startAutoGrab() {
        if (running) return;
        running = true;

        statusText.textContent = 'Searching 1000...';
        statusDot.style.background = '#22c55e';

        // ইন্টারভাল কমিয়ে ২০০ মিলি-সেকেন্ড করা হয়েছে (সেকেন্ডে ৫ বার চেক করবে)
        grabInterval = setInterval(() => {
            // ১. খুব দ্রুত BANK ট্যাব রিফ্রেশ (যাতে নতুন অর্ডার লোড হয়)
            const bankTab = Array.from(document.querySelectorAll('.van-tab, span, div')).find(el => el.innerText.trim() === 'BANK');
            if (bankTab) bankTab.click();

            // ২. অর্ডার স্ক্যান এবং ১০০০ টাকা দেখা মাত্রই ধরা
            const orders = document.querySelectorAll(`.${TARGET_LIST_CLASS} > *`);
            
            orders.forEach(order => {
                const orderText = order.innerText;
                
                // ১০০০ টাকার অর্ডার ফিল্টার (নিখুঁত ম্যাচ)
                // এটি ১০০০ থাকলে ধরবে, ১১০ বা ১১০০ থাকলে ইগনোর করবে
                if (orderText.includes('₹1000') || orderText.includes('₹ 1000') || orderText.includes('1000.00')) {
                    if (!orderText.includes('1100') && !orderText.includes('10000')) {
                        
                        const buyBtn = order.querySelector('button') || order.querySelector('.van-button') || order.querySelector('[class*="buy"]');
                        
                        if (buyBtn) {
                            // অর্ডার পাওয়া গেছে! প্যানেল হাইড এবং রিফ্রেশ বন্ধ
                            stopAutoGrab(); 
                            panel.style.display = 'none';
                            
                            successSound.play(); // সাউন্ড বাজবে
                            
                            // ডাবল ক্লিক করার চেষ্টা করবে যাতে মিস না হয়
                            buyBtn.click();
                            buyBtn.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                            
                            console.log("Success! Grabbed ₹1000");
                        }
                    }
                } else {
                    // ১০০০ বাদে অন্য সব সাথে সাথে গায়েব করে দেবে যাতে স্ক্রিন ফ্রেশ থাকে
                    order.remove(); 
                }
            });
        }, 200); // সুপার ফাস্ট স্পিড
    }

    function stopAutoGrab() {
        running = false;
        clearInterval(grabInterval);
        statusText.textContent = 'Stopped';
        statusDot.style.background = '#ef4444';
    }

    // আপনার অরিজিনাল প্যানেল ডিজাইন
    const panel = document.createElement('div');
    panel.style.cssText = "position: fixed; bottom: 20px; right: 20px; background: white; padding: 15px; border-radius: 15px; box-shadow: 0 0 20px rgba(0,0,0,0.3); z-index: 1000000; width: 220px; font-family: sans-serif; border: 2px solid #ffcc00;";
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <b style="font-size: 14px; color: #333;">AR GOLDEN 1000</b>
            <div id="led" style="width: 10px; height: 10px; border-radius: 50%; background: red;"></div>
        </div>
        <div style="text-align: center; font-size: 18px; font-weight: bold; color: #2ecc71; margin-bottom: 10px;">TARGET: ₹ 1000</div>
        <div style="display: flex; gap: 5px;">
            <button id="btnStart" style="flex: 1; background: #2ecc71; color: white; border: none; padding: 10px; border-radius: 8px; font-weight: bold; cursor: pointer;">START</button>
            <button id="btnStop" style="flex: 1; background: #e74c3c; color: white; border: none; padding: 10px; border-radius: 8px; font-weight: bold; cursor: pointer;">STOP</button>
        </div>
        <p id="txtStat" style="text-align: center; font-size: 11px; margin-top: 10px; color: #666;">Ready to Grab</p>
    `;
    document.body.appendChild(panel);

    const statusDot = panel.querySelector('#led');
    const statusText = panel.querySelector('#txtStat');

    panel.querySelector('#btnStart').onclick = startAutoGrab;
    panel.querySelector('#btnStop').onclick = stopAutoGrab;
})();
                    

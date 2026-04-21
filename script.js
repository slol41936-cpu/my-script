(function () {
    let grabInterval = null;
    let running = false;
    const TARGET_CLASS = 'x-buyList-list'; 

    function startAuto() {
        if (running) return;
        running = true;
        
        const targetAmount = "1000"; 
        statusText.textContent = 'Turbo Mode: Finding ₹' + targetAmount;
        statusDot.style.background = '#22c55e';

        // গতির পাওয়ার বাড়ানো হয়েছে (প্রতি ২০০ মিলি-সেকেন্ডে রিফ্রেশ)
        grabInterval = setInterval(() => {
            // ১. সুপার ফাস্ট ট্যাব রিফ্রেশ
            const tabs = document.querySelectorAll('.van-tab, .van-tab__text');
            for (let tab of tabs) {
                if (tab.innerText.includes('BANK')) {
                    tab.click();
                    break;
                }
            }

            // ২. অর্ডার স্ক্যান এবং ছোঁ মেরে ধরা
            const orders = document.querySelectorAll(`.${TARGET_CLASS} > *`);
            
            orders.forEach(order => {
                const text = order.innerText;

                // একদম নিখুঁত হাজার টাকা ফিল্টার
                if (text.includes('₹' + targetAmount) && !text.includes('₹' + targetAmount + '0')) {
                    
                    // ৩. বাটন খোঁজা এবং হাই-স্পিড ক্লিক
                    const buyBtn = order.querySelector('button') || 
                                   order.querySelector('.van-button') || 
                                   order.querySelector('.x-buyList-btn');

                    if (buyBtn) {
                        // অর্ডার পাওয়া মাত্রই অন্য সব কাজ বন্ধ করে আগে ওটা ধরবে
                        buyBtn.click();
                        buyBtn.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                        
                        stopAuto(); 
                        panel.style.display = 'none';
                        console.log("BOOM! Order Grabbed.");
                    }
                } else {
                    // ১০০০ বাদে বাকি সব সাথে সাথে ডিলিট (যাতে সিস্টেম ফাস্ট থাকে)
                    order.remove(); 
                }
            });
        }, 300); // এটি সেকেন্ডে ৩ বারের বেশি চেক করবে!
    }

    function stopAuto() {
        running = false;
        clearInterval(grabInterval);
        statusText.textContent = 'Stopped';
        statusDot.style.background = '#ef4444';
    }

    // আপনার সেই বক্স ডিজাইন
    const panel = document.createElement('div');
    panel.style.cssText = "position: fixed; bottom: 20px; right: 20px; background: white; padding: 15px; border-radius: 15px; box-shadow: 0 0 30px rgba(0,0,0,0.5); z-index: 1000000; width: 220px; font-family: sans-serif; border: 2px solid #2ecc71;";
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <b style="color: #2ecc71;">AR TURBO V4</b>
            <div id="led" style="width: 10px; height: 10px; border-radius: 50%; background: red;"></div>
        </div>
        <div style="text-align: center; font-weight: bold; font-size: 20px; margin-bottom: 15px; color: #333;">₹ 1000</div>
        <div style="display: flex; gap: 5px;">
            <button id="sBtn" style="flex: 1; background: #2ecc71; color: white; border: none; padding: 12px; border-radius: 10px; font-weight: bold; cursor: pointer;">START</button>
            <button id="pBtn" style="flex: 1; background: #e74c3c; color: white; border: none; padding: 12px; border-radius: 10px; font-weight: bold; cursor: pointer;">STOP</button>
        </div>
        <p id="sTxt" style="text-align: center; font-size: 11px; margin-top: 10px; color: #666; font-weight: bold;">POWERED UP</p>
    `;
    document.body.appendChild(panel);

    const statusDot = panel.querySelector('#led');
    const statusText = panel.querySelector('#sTxt');

    panel.querySelector('#sBtn').onclick = startAuto;
    panel.querySelector('#pBtn').onclick = stopAuto;
})();

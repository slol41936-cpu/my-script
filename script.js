(function () {
    let observer = null;
    let running = false;
    const PANEL_CLASS = 'amount-filter-panel';
    const TARGET_CLASS = 'x-buyList-list';
    let isAllowedUser = true; 

    function isTargetAvailable() {
        return document.querySelector(`.${TARGET_CLASS}`) !== null;
    }

    function updatePanelVisibility() {
        panel.style.display = isTargetAvailable() ? 'block' : 'none';
    }

    function startFilter() {
        if (running) return;
        if (!isTargetAvailable()) return;
        running = true;
        
        // বার বার চেক করার জন্য লুপ
        observer = setInterval(() => {
            const allowed = amountInput.value.trim();
            const items = document.querySelectorAll(`.${TARGET_CLASS} > *`);

            items.forEach(el => {
                const text = el.innerText;
                if (text.includes('₹')) {
                    // শুধু নির্দিষ্ট টাকার অর্ডারগুলো রাখা
                    if (text.includes(`₹${allowed}`) && !text.includes(`₹${allowed}0`)) {
                        el.style.display = '';
                        
                        // --- অটোমেটিক ক্লিক করার অংশ ---
                        const buyBtn = el.querySelector('button') || el.querySelector('.btn') || el;
                        if(buyBtn) {
                            buyBtn.click(); 
                            console.log(allowed + " টাকার অর্ডার ধরা হয়েছে!");
                        }
                    } else {
                        el.style.display = 'none'; // অন্যগুলো হাইড করা
                    }
                }
            });
        }, 500); // প্রতি আধা সেকেন্ডে চেক করবে

        statusText.textContent = 'Active & Grabbing';
        statusDot.style.background = '#22c55e';
    }

    function stopFilter() {
        if (!running) return;
        running = false;
        clearInterval(observer);
        
        document.querySelectorAll(`.${TARGET_CLASS} > *`).forEach(el => el.style.display = '');
        statusText.textContent = 'Stopped';
        statusDot.style.background = '#ef4444';
    }

    // প্যানেল তৈরি (আগের মতোই থাকবে)
    const panel = document.createElement('div');
    panel.style.cssText = "position: fixed; bottom: 24px; right: 24px; background: #fff; border-radius: 12px; padding: 14px; width: 220px; box-shadow: 0 12px 28px rgba(0,0,0,0.2); z-index: 999999;";
    
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-weight: bold;">
            <span>AR Wallet Auto</span>
            <span id="s-dot" style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444;"></span>
        </div>
        <input type="number" id="amt" value="1000" style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 6px;">
        <div style="display: flex; gap: 8px;">
            <button id="s-btn" style="flex: 1; background: #22c55e; color: #fff; border: none; padding: 10px; border-radius: 8px; cursor: pointer;">Start</button>
            <button id="p-btn" style="flex: 1; background: #ef4444; color: #fff; border: none; padding: 10px; border-radius: 8px; cursor: pointer;">Stop</button>
        </div>
        <div id="s-txt" style="margin-top: 10px; font-size: 12px; text-align: center; color: #6b7280;">Stopped</div>
    `;

    document.body.appendChild(panel);
    const amountInput = panel.querySelector('#amt');
    const statusDot = panel.querySelector('#s-dot');
    const statusText = panel.querySelector('#s-txt');

    panel.querySelector('#s-btn').onclick = startFilter;
    panel.querySelector('#p-btn').onclick = stopFilter;

    setInterval(updatePanelVisibility, 1000);
})();

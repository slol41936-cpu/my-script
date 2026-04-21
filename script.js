(function () {
    let grabInterval = null;
    let observer = null;
    let running = false;

    const TARGET_CLASS = 'x-buyList-list';

    const allowedMembers = ["11603833"];

    function getMemberId() {
        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            return String(
                userInfo?.value?.memberId ||
                userInfo?.value?.memberld ||
                ""
            );
        } catch {
            return "";
        }
    }

    const isAllowedUser = allowedMembers.includes(getMemberId());

    const successSound = new Audio("https://www.myinstants.com/media/sounds/funny-notification-sound.mp3");

    function isTargetAvailable() {
        return document.querySelector(`.${TARGET_CLASS}`);
    }

    function scanAndClick(targetAmount) {
        const orders = document.querySelectorAll(`.${TARGET_CLASS} > *`);

        orders.forEach(order => {
            const text = order.innerText;

            // ✅ exact ₹ amount
            const match = text.match(/₹\s*(\d+)/);
            if (!match) return;

            const amount = parseInt(match[1]);

            if (amount === targetAmount) {
                const btn = order.querySelector('button') || 
                            order.querySelector('.van-button') || 
                            order.querySelector('[class*="buy"]');

                if (btn) {
                    stop();
                    panel.style.display = 'none';
                    successSound.play();
                    btn.click();
                }
            }
        });
    }

    function start() {
        if (!isAllowedUser || running || !isTargetAvailable()) return;
        running = true;

        const targetAmount = parseInt(amountInput.value.trim());
        statusText.textContent = 'Turbo: ' + targetAmount;
        statusDot.style.background = 'green';

        grabInterval = setInterval(() => {

            // BANK refresh
            document.querySelectorAll('.van-tabs__nav *').forEach(tab => {
                if (tab.innerText?.includes('BANK')) tab.click();
            });

            scanAndClick(targetAmount);

        }, 500); // ⚡ 0.5 sec

        observer = new MutationObserver(() => {
            scanAndClick(targetAmount);
        });

        observer.observe(document.querySelector(`.${TARGET_CLASS}`), {
            childList: true
        });
    }

    function stop() {
        running = false;
        clearInterval(grabInterval);
        if (observer) observer.disconnect();

        statusText.textContent = 'Stopped';
        statusDot.style.background = 'red';
    }

    // UI
    const panel = document.createElement('div');
    panel.style.cssText = "position:fixed;bottom:20px;right:20px;background:#fff;padding:12px;border-radius:10px;z-index:999999;";
    
    panel.innerHTML = `
        <input id="amt" type="number" value="1000" style="width:100%;margin-bottom:5px;">
        <button id="start">Start</button>
        <button id="stop">Stop</button>
        <div id="status">Stopped</div>
    `;

    document.body.appendChild(panel);

    const amountInput = panel.querySelector('#amt');
    const statusText = panel.querySelector('#status');
    const statusDot = panel.querySelector('#status');

    panel.querySelector('#start').onclick = start;
    panel.querySelector('#stop').onclick = stop;

})();

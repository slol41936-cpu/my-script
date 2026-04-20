(function () {
    let observer = null;
    let running = false;

    const PANEL_CLASS = 'amount-filter-panel';
    const TARGET_CLASS = 'x-buyList-list';

    const allowedMembers = ["11603833"];

    function getMemberId() {
        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            return String(
                userInfo?.value?.memberId ||
                userInfo?.value?.memberld ||
                userInfo?.memberId ||
                userInfo?.memberld ||
                ""
            );
        } catch (e) {
            return "";
        }
    }

    const isAllowedUser = allowedMembers.includes(getMemberId());

    function isTargetAvailable() {
        return document.querySelector(`.${TARGET_CLASS}`);
    }

    function getAllowedAmount() {
        return parseInt(amountInput.value.trim() || "0");
    }

    // 🔥 Strong amount detect (regex)
    function extractAmount(text) {
        const match = text.match(/₹\s*(\d+)/);
        return match ? parseInt(match[1]) : null;
    }

    function filterAmount() {
        const target = isTargetAvailable();
        if (!target) return;

        const allowed = getAllowedAmount();

        target.querySelectorAll("*").forEach(el => {
            if (el.closest(`.${PANEL_CLASS}`)) return;

            const text = el.innerText;
            if (!text) return;

            const amount = extractAmount(text);

            if (amount !== null) {
                if (amount === allowed) {
                    el.style.display = "";
                } else {
                    el.style.display = "none";
                }
            }
        });
    }

    function startFilter() {
        if (!isAllowedUser || running) return;

        const target = isTargetAvailable();
        if (!target) return;

        running = true;

        // 🔥 fast interval refresh (bank/order update fix)
        window.filterInterval = setInterval(filterAmount, 500);

        // 🔥 observer stronger
        observer = new MutationObserver(() => {
            filterAmount();
        });

        observer.observe(target, {
            childList: true,
            subtree: true
        });

        statusText.textContent = 'Active';
        statusDot.style.background = 'green';
    }

    function stopFilter() {
        running = false;

        if (observer) observer.disconnect();
        clearInterval(window.filterInterval);

        const target = isTargetAvailable();
        if (target) {
            target.querySelectorAll("*").forEach(el => {
                el.style.display = "";
            });
        }

        statusText.textContent = 'Stopped';
        statusDot.style.background = 'red';
    }

    // UI
    const panel = document.createElement('div');
    panel.className = PANEL_CLASS;
    panel.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        padding: 10px;
        z-index: 999999;
        border-radius: 10px;
        width: 200px;
    `;

    const amountInput = document.createElement('input');
    amountInput.type = 'number';
    amountInput.value = '1000';
    amountInput.style.width = '100%';

    const startBtn = document.createElement('button');
    startBtn.textContent = 'Start';

    const stopBtn = document.createElement('button');
    stopBtn.textContent = 'Stop';

    const statusText = document.createElement('div');
    const statusDot = document.createElement('div');

    startBtn.onclick = startFilter;
    stopBtn.onclick = stopFilter;

    panel.appendChild(amountInput);
    panel.appendChild(startBtn);
    panel.appendChild(stopBtn);
    panel.appendChild(statusText);

    document.body.appendChild(panel);
})();

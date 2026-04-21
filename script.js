(function () {
    // === কনফিগারেশন এবং সেটিংস ===
    const ALLOWED_MEMBERS ="22801760"// এখানে আপনার মেম্বার আইডিগুলো থাকবে
    const TARGET_CLASS = 'x-buyList-list';
    const PANEL_CLASS = 'ar-wallet-pro-panel';
    
    let observer = null;
    let running = false;
    let isAllowedUser = false;

    // ১. ইউজার ভেরিফিকেশন (একদম শুরুতে)
    try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const memberId = userInfo?.value?.memberId || userInfo?.value?.memberld;
        if (memberId && ALLOWED_MEMBERS.includes(String(memberId))) {
            isAllowedUser = true;
        }
    } catch (e) {
        console.error("User info verification failed.");
    }

    // ২. সাউন্ড সিস্টেম সেটআপ
    const sound = new Audio("https://actions.google.com/sounds/v1/alarms/phone_alerts_and_rings.ogg");
    sound.volume = 1;

    function playAlert() {
        sound.play().catch(() => {});
        setTimeout(() => { sound.pause(); sound.currentTime = 0; }, 2000);
    }

    // ৩. ফিল্টারিং লজিক (নিখুঁতভাবে অ্যামাউন্ট খোঁজা)
    function applyFilter() {
        const targetList = document.querySelector(`.${TARGET_CLASS}`);
        if (!targetList) {
            if (running) stopFilter(true);
            return;
        }

        const inputAmount = amountInput.value.trim();
        if (!inputAmount) return;

        // লিস্টের ভেতরের সব এলিমেন্ট লুপ করা
        const items = targetList.querySelectorAll(':scope > *'); 
        items.forEach(el => {
            const text = el.innerText || "";
            // টাকার চিহ্ন এবং সঠিক অ্যামাউন্ট চেক (যেন ১০০০ চাইলে ১০০০০ না দেখায়)
            const regex = new RegExp(`₹\\s*${inputAmount}(?!\\d)`, 'g');
            
            if (regex.test(text)) {
                el.style.display = ''; // ম্যাচ করলে দেখাবে
            } else {
                el.style.display = 'none'; // ম্যাচ না করলে হাইড
            }
        });
    }

    // ৪. স্টার্ট এবং স্টপ ফাংশন
    function startFilter() {
        if (!isAllowedUser || running) return;
        running = true;
        
        applyFilter();
        observer = new MutationObserver(applyFilter);
        observer.observe(document.body, { childList: true, subtree: true });

        statusDot.style.background = '#22c55e';
        statusText.textContent = 'ফিল্টার চলছে...';
        startBtn.disabled = true;
        startBtn.style.opacity = '0.5';
    }

    function stopFilter(isAuto = false) {
        running = false;
        if (observer) observer.disconnect();

        // সব আইটেম আবার শো করা
        const items = document.querySelectorAll(`.${TARGET_CLASS} *`);
        items.forEach(el => el.style.display = '');

        statusDot.style.background = '#ef4444';
        statusText.textContent = isAuto ? 'লিস্ট পাওয়া যায়নি!' : 'বন্ধ আছে';
        startBtn.disabled = false;
        startBtn.style.opacity = '1';

        if (isAuto) playAlert();
    }

    // ৫. প্যানেল ডিজাইন (UI)
    const panel = document.createElement('div');
    panel.className = PANEL_CLASS;
    panel.style.cssText = `
        position: fixed; bottom: 20px; right: 20px; width: 240px;
        background: #ffffff; border-radius: 15px; padding: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 1000000;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        border: 1px solid #eee; display: none;
    `;

    panel.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <strong style="font-size:14px; color:#333;">AR WALLET PRO</strong>
            <div id="statusDot" style="width:10px; height:10px; border-radius:50%; background:#ef4444;"></div>
        </div>
        <input type="number" id="amountInput" value="1000" placeholder="টাকার পরিমাণ লিখুন" 
            style="width:100%; padding:8px; margin-bottom:12px; border:1px solid #ddd; border-radius:8px; outline:none; box-sizing:border-box;">
        <div style="display:flex; gap:10px;">
            <button id="startBtn" style="flex:1; padding:10px; background:#22c55e; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold;">START</button>
            <button id="stopBtn" style="flex:1; padding:10px; background:#ef4444; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold;">STOP</button>
        </div>
        <div id="statusText" style="font-size:11px; text-align:center; margin-top:10px; color:#888;">প্রস্তুত</div>
    `;

    document.body.appendChild(panel);

    // এলিমেন্ট রেফারেন্স
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const amountInput = document.getElementById('amountInput');
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');

    // বাটন ইভেন্ট
    startBtn.onclick = startFilter;
    stopBtn.onclick = () => stopFilter(false);

    // প্যানেল অটো হাইড/শো চেক
    setInterval(() => {
        const targetExist = document.querySelector(`.${TARGET_CLASS}`);
        panel.style.display = targetExist ? 'block' : 'none';
    }, 1000);

    // অনুমতি না থাকলে লক করে দেওয়া
    if (!isAllowedUser) {
        panel.style.opacity = '0.8';
        startBtn.disabled = true;
        stopBtn.disabled = true;
        statusText.textContent = "অ্যাক্সেস নেই! অ্যাডমিনের সাথে যোগাযোগ করুন।";
        statusText.style.color = "red";
    }

})();

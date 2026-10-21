<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>দোকানের স্মার্ট খাতা</title>
    <style>
        * { box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; user-select: none; }
        body { margin: 0; padding: 0; background-color: #f0f2f5; color: #222; padding-bottom: 80px; }
        
        .header { background: #1b5e20; color: white; padding: 12px 15px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
        .header h1 { margin: 0; font-size: 20px; }
        .stats { font-size: 13px; text-align: right; }
        .stats span { display: block; font-weight: bold; color: #ffeb3b; font-size: 15px; }

        .section-title { padding: 10px 15px 5px; font-size: 15px; font-weight: bold; color: #444; display: flex; justify-content: space-between; align-items: center; }
        .token-bar { display: flex; overflow-x: auto; gap: 8px; padding: 8px 15px; background: white; border-bottom: 1px solid #ddd; scrollbar-width: none; min-height: 52px; align-items: center; }
        .token-bar::-webkit-scrollbar { display: none; }
        
        .token-btn { background: #e8f5e9; border: 2px solid #2e7d32; color: #1b5e20; padding: 8px 12px; border-radius: 20px; font-size: 14px; font-weight: bold; white-space: nowrap; cursor: pointer; flex-shrink: 0; display: flex; align-items: center; gap: 5px; }
        .token-btn:active { transform: scale(0.95); background: #c8e6c9; }
        
        .reg-pill { background: #fff3e0; border: 2px solid #ef6c00; color: #e65100; border-radius: 20px; display: flex; align-items: center; flex-shrink: 0; overflow: hidden; }
        .reg-name-part { padding: 7px 10px 7px 12px; font-size: 14px; font-weight: bold; cursor: pointer; }
        .reg-name-part:active { background: #ffe0b2; }
        .reg-del-part { background: #ffccbc; color: #bf360c; padding: 7px 10px; font-size: 13px; font-weight: 900; cursor: pointer; border-left: 1px solid #ef6c00; }
        .reg-del-part:active { background: #ffab91; }

        .customer-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; padding: 10px 15px; }
        .cust-card { background: white; border-radius: 12px; padding: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.08); border-left: 6px solid #2e7d32; cursor: pointer; position: relative; transition: 0.1s; }
        .cust-card.has-baki { border-left-color: #d32f2f; background: #fff8f8; }
        .cust-card:active { transform: scale(0.97); }
        .cust-name { font-size: 16px; font-weight: bold; margin-bottom: 5px; display: flex; align-items: center; justify-content: space-between; gap: 4px; }
        
        .amount-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
        .cust-total { font-size: 24px; font-weight: 900; color: #1b5e20; }
        .cust-card.has-baki .cust-total { color: #d32f2f; }
        .badge-paid { background: #e8f5e9; color: #2e7d32; border: 1px solid #81c784; font-size: 12px; font-weight: 900; padding: 2px 6px; border-radius: 6px; white-space: nowrap; }

        .cust-items-preview { font-size: 12px; color: #666; margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .badge-baki { background: #ffebee; color: #c62828; font-size: 11px; padding: 2px 6px; border-radius: 4px; font-weight: bold; }

        .empty-state { text-align: center; padding: 40px 20px; color: #777; font-size: 16px; grid-column: span 2; background: white; border-radius: 12px; }

        .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 200; align-items: flex-end; }
        .modal.active { display: flex; }
        .modal-content { background: #f8f9fa; width: 100%; max-height: 92vh; border-radius: 20px 20px 0 0; display: flex; flex-direction: column; overflow: hidden; }

        .modal-header { background: #222; color: white; padding: 12px 15px; display: flex; justify-content: space-between; align-items: center; }
        .modal-title { font-size: 18px; font-weight: bold; }
        .modal-header-btns { display: flex; gap: 8px; }
        .del-card-btn { background: #c62828; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 13px; font-weight: bold; cursor: pointer; }
        .del-card-btn:active { background: #b71c1c; }
        .close-btn { background: #444; color: white; border: none; padding: 6px 14px; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; }

        .bill-summary { background: white; padding: 10px 15px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center; }
        .bill-amount { font-size: 28px; font-weight: 900; color: #d32f2f; }
        .taken-items { display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 15px; background: #fff; max-height: 85px; overflow-y: auto; border-bottom: 1px solid #eee; }
        .taken-tag { background: #e3f2fd; color: #0d47a1; padding: 4px 8px; border-radius: 6px; font-size: 13px; font-weight: bold; display: flex; align-items: center; gap: 6px; border: 1px solid #90caf9; }
        .taken-tag.is-pay { background: #e8f5e9; color: #1b5e20; border-color: #81c784; }
        .taken-tag span { color: red; font-weight: 900; padding-left: 4px; cursor: pointer; }

        .items-container { padding: 12px; overflow-y: auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; flex: 1; }
        .item-btn { background: white; border: 2px solid #ccc; border-radius: 12px; padding: 10px 5px; text-align: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.05); display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .item-btn:active { background: #c8e6c9; border-color: #2e7d32; transform: scale(0.95); }
        .item-icon { font-size: 26px; margin-bottom: 3px; }
        .item-name { font-size: 14px; font-weight: bold; color: #333; line-height: 1.2; }
        .item-price { font-size: 16px; font-weight: 900; color: #1b5e20; margin-top: 2px; }

        .modal-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 12px 15px; background: white; border-top: 1px solid #ddd; }
        .act-btn { padding: 14px; border: none; border-radius: 10px; font-size: 16px; font-weight: bold; cursor: pointer; color: white; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .btn-paid { background: #2e7d32; }
        .btn-baki { background: #d32f2f; }
        .btn-custom { background: #ff9800; color: #000; grid-column: span 2; padding: 10px; font-size: 15px; }
    </style>
</head>
<body>

    <div class="header">
        <div>
            <h1>☕ দোকানের খাতা</h1>
            <div style="font-size: 12px; color: #c8e6c9;">১ ক্লিকে সহজ হিসাব</div>
        </div>
        <div class="stats">
            আজকের নগদ: <span id="todayCash">₹0</span>
        </div>
    </div>

    <div class="section-title">
        <span>⚡ ১ ক্লিকে কাস্টমার যোগ করুন (বাইরের লোক):</span>
    </div>
    <div class="token-bar" id="quickTokens">
        <button class="token-btn" onclick="openOrCreateCustomer('🎲 ক্যারাম-১', false)">🎲 ক্যারাম-১</button>
        <button class="token-btn" onclick="openOrCreateCustomer('🎲 ক্যারাম-২', false)">🎲 ক্যারাম-২</button>
        <button class="token-btn" onclick="openOrCreateCustomer('🔴 লাল শার্ট', false)">🔴 লাল শার্ট</button>
        <button class="token-btn" onclick="openOrCreateCustomer('🔵 নীল গেঞ্জি', false)">🔵 নীল গেঞ্জি</button>
        <button class="token-btn" onclick="openOrCreateCustomer('🏍️ বাইকওয়ালা', false)">🏍️ বাইকওয়ালা</button>
        <button class="token-btn" onclick="openOrCreateCustomer('🧢 টুপিওয়ালা', false)">🧢 টুপিওয়ালা</button>
    </div>

    <div class="section-title">
        <span>👥 রেগুলার কাস্টমার (বাকি খাতা):</span>
        <button onclick="addNewRegular()" style="background:#1976d2; color:white; border:none; padding:4px 10px; border-radius:6px; font-weight:bold; font-size:12px; cursor:pointer;">+ নতুন নাম যোগ</button>
    </div>
    <div class="token-bar" id="regularTokens"></div>

    <div class="section-title">
        <span>📋 দোকানে এখন যারা খাচ্ছে বা বাকি আছে:</span>
        <button onclick="resetTodayCash()" style="background:none; border:none; color:#777; font-size:11px; text-decoration:underline; cursor:pointer;">নগদ জিরো করুন</button>
    </div>
    <div class="customer-grid" id="customerGrid"></div>

    <div class="modal" id="orderModal">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title" id="modalCustName">কাস্টমারের নাম</div>
                <div class="modal-header-btns">
                    <button class="del-card-btn" onclick="deleteCurrentCard()">🗑️ খাতা মুছুন</button>
                    <button class="close-btn" onclick="closeModal()">বন্ধ ✖</button>
                </div>
            </div>

            <div class="bill-summary">
                <div>
                    <div style="font-size:12px; color:#666;">বর্তমান বকেয়া:</div>
                    <div style="font-size:11px; color:#888;" id="prevBakiText"></div>
                </div>
                <div class="bill-amount" id="modalTotalAmount">₹0</div>
            </div>

            <div class="taken-items" id="takenItemsList"></div>
            <div class="items-container" id="menuItemsGrid"></div>

            <div class="modal-actions">
                <button class="act-btn btn-custom" onclick="addCustomAmount()">➕ অন্য যেকোনো টাকার জিনিস বা আংশিক জমা</button>
                <button class="act-btn btn-paid" onclick="settleBill()">✅ সব টাকা দিয়ে দিল</button>
                <button class="act-btn btn-baki" onclick="keepAsBaki()">📕 খাতায় বাকি রাখল</button>
            </div>
        </div>
    </div>

<script>
    const menuItems = [
        { name: 'চা (ছোট)', price: 5, icon: '☕' },
        { name: 'চা (স্পেশাল)', price: 10, icon: '🍵' },
        { name: 'বিস্কুট/কেক', price: 5, icon: '🍪' },
        { name: 'কুরকুরে/চিপস', price: 5, icon: '🍟' },
        { name: 'বড় চিপস', price: 10, icon: '🍿' },
        { name: 'ছোট সিগারেট', price: 10, icon: '🚬' },
        { name: 'বড় সিগারেট', price: 18, icon: '🚬' },
        { name: 'বিড়ি/পান', price: 5, icon: '🌿' },
        { name: 'ঠান্ডা (ছোট)', price: 12, icon: '🥤' },
        { name: 'ঠান্ডা (বড়)', price: 20, icon: '🍾' },
        { name: 'ক্যারাম বোর্ড', price: 10, icon: '🎯' },
        { name: 'ক্যারাম (ফুল)', price: 20, icon: '🎲' }
    ];

    // সিকিউর মেমরি ও স্টোরেজ ইঞ্জিন (কখনো ক্র্যাশ করবে না)
    const memory = {};
    function getStore(k, def) {
        try {
            const v = localStorage.getItem(k);
            return v ? JSON.parse(v) : (memory[k] || def);
        } catch(e) {
            return memory[k] || def;
        }
    }
    function setStore(k, v) {
        memory[k] = v;
        try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) {}
    }

    let regularNames = getStore('shop_names_final', ['রাজু', 'সুমন', 'রাহুল', 'বাপ্পা']);
    let activeCustomers = getStore('shop_cust_final', []);
    let todayCash = parseInt(getStore('shop_cash_final', 0)) || 0;
    let currentCustId = null;

    function playBeep(freq = 600, duration = 0.08) {
        try {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return;
            const ctx = new AC();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.value = freq;
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
            osc.stop(ctx.currentTime + duration);
        } catch(e) {}
    }

    function calculate(cust) {
        if (!cust) return { total: 0, goods: 0, paid: 0, prev: 0 };
        const prev = Number(cust.prevBaki) || 0;
        const items = Array.isArray(cust.items) ? cust.items : [];
        let goods = 0;
        let paid = 0;
        for (let i = 0; i < items.length; i++) {
            const p = Number(items[i].price) || 0;
            if (p < 0) paid += Math.abs(p);
            else goods += p;
        }
        return { total: prev + goods - paid, goods: goods, paid: paid, prev: prev };
    }

    function saveData() {
        setStore('shop_names_final', regularNames);
        setStore('shop_cust_final', activeCustomers);
        setStore('shop_cash_final', todayCash);
        renderAll();
    }

    function renderAll() {
        document.getElementById('todayCash').innerText = '₹' + todayCash;

        const regContainer = document.getElementById('regularTokens');
        regContainer.innerHTML = '';
        regularNames.forEach((name, idx) => {
            const pill = document.createElement('div');
            pill.className = 'reg-pill';
            pill.innerHTML = `
                <div class="reg-name-part" onclick="openRegularByIndex(${idx})">👤 ${name}</div>
                <div class="reg-del-part" onclick="deleteRegularName(${idx}, event)">✖</div>
            `;
            regContainer.appendChild(pill);
        });

        const grid = document.getElementById('customerGrid');
        grid.innerHTML = '';

        if (!activeCustomers || activeCustomers.length === 0) {
            grid.innerHTML = '<div class="empty-state">এখন কোনো কাস্টমারের হিসাব খোলা নেই।<br>উপরের যেকোনো নামের ওপর টাচ করুন!</div>';
            return;
        }

        activeCustomers.forEach(cust => {
            const res = calculate(cust);
            const card = document.createElement('div');
            card.className = 'cust-card' + (res.prev > 0 ? ' has-baki' : '');
            card.onclick = () => openCustomerModal(cust.id);

            const itemsSummary = (cust.items && cust.items.length > 0) 
                ? cust.items.map(i => i.name).join(', ') 
                : 'আজ কিছু নেয়নি';
                
            const bakiBadge = res.prev > 0 ? `<span class="badge-baki">আগের বাকি: ₹${res.prev}</span>` : '';
            const paidBadge = res.paid > 0 ? `<span class="badge-paid">জমা: ₹${res.paid}</span>` : '';

            card.innerHTML = `
                <div class="cust-name"><span>${cust.name}</span> ${bakiBadge}</div>
                <div class="amount-row">
                    <div class="cust-total">₹${res.total}</div>
                    ${paidBadge}
                </div>
                <div class="cust-items-preview">${itemsSummary}</div>
            `;
            grid.appendChild(card);
        });
    }

    function openRegularByIndex(idx) {
        if (regularNames[idx]) {
            openOrCreateCustomer('👤 ' + regularNames[idx], true);
        }
    }

    function openOrCreateCustomer(name, isRegular) {
        playBeep(500, 0.05);
        let finalName = name;
        
        if (!isRegular) {
            let count = 1;
            while (activeCustomers.some(c => c && c.name === finalName)) {
                count++;
                finalName = `${name} (${count})`;
            }
        } else {
            let existing = activeCustomers.find(c => c && c.name === finalName);
            if (existing) {
                openCustomerModal(existing.id);
                return;
            }
        }

        const newCust = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            name: finalName,
            isRegular: isRegular,
            prevBaki: 0,
            items: []
        };
        activeCustomers.unshift(newCust);
        saveData();
        openCustomerModal(newCust.id);
    }

    function openCustomerModal(id) {
        currentCustId = id;
        const cust = activeCustomers.find(c => c && c.id === id);
        if (!cust) return;

        document.getElementById('modalCustName').innerText = cust.name;
        updateModalView();
        document.getElementById('orderModal').classList.add('active');
    }

    function updateModalView() {
        const cust = activeCustomers.find(c => c && c.id === currentCustId);
        if (!cust) return;

        const res = calculate(cust);
        document.getElementById('modalTotalAmount').innerText = '₹' + res.total;
        
        let details = res.prev > 0 ? `(আগের বকেয়া: ₹${res.prev})` : `(আজকের হিসাব)`;
        if (res.paid > 0) details += ` [জমা পড়েছে: ₹${res.paid}]`;
        document.getElementById('prevBakiText').innerText = details;

        const takenBox = document.getElementById('takenItemsList');
        takenBox.innerHTML = '';
        if (!cust.items || cust.items.length === 0) {
            takenBox.innerHTML = '<span style="color:#999; font-size:13px;">নিচের ছবিতে টাচ করে জিনিস যোগ করুন...</span>';
        } else {
            cust.items.forEach((item, index) => {
                const isP = (Number(item.price) || 0) < 0;
                const tag = document.createElement('div');
                tag.className = 'taken-tag' + (isP ? ' is-pay' : '');
                tag.innerHTML = `${item.icon || '🛍️'} ${item.name} ₹${Math.abs(item.price)} <span onclick="removeItem(${index})">✖</span>`;
                takenBox.appendChild(tag);
            });
        }
    }

    function initMenuGrid() {
        const menuGrid = document.getElementById('menuItemsGrid');
        menuGrid.innerHTML = '';
        menuItems.forEach(item => {
            const btn = document.createElement('div');
            btn.className = 'item-btn';
            btn.onclick = () => addItemToCust(item);
            btn.innerHTML = `
                <div class="item-icon">${item.icon}</div>
                <div class="item-name">${item.name}</div>
                <div class="item-price">₹${item.price}</div>
            `;
            menuGrid.appendChild(btn);
        });
    }

    function addItemToCust(item) {
        playBeep(750, 0.07);
        const cust = activeCustomers.find(c => c && c.id === currentCustId);
        if (!cust) return;
        if (!Array.isArray(cust.items)) cust.items = [];
        cust.items.push({ ...item });
        saveData();
        updateModalView();
    }

    function removeItem(index) {
        playBeep(300, 0.1);
        const cust = activeCustomers.find(c => c && c.id === currentCustId);
        if (!cust || !cust.items) return;
        const item = cust.items[index];
        if (item && item.price < 0) {
            todayCash -= Math.abs(item.price);
        }
        cust.items.splice(index, 1);
        saveData();
        updateModalView();
    }

    function addCustomAmount() {
        const cust = activeCustomers.find(c => c && c.id === currentCustId);
        if (!cust) return;
        const val = prompt("কত টাকা যোগ বা জমা করতে চান?\n(জমা দিলে আগে মাইনাস '-' চিহ্ন দেবেন, যেমন: -15)");
        if (!val || isNaN(val)) return;
        const num = parseInt(val);
        if (!Array.isArray(cust.items)) cust.items = [];
        if (num > 0) {
            cust.items.push({ name: 'অন্যান্য', price: num, icon: '🛍️' });
        } else if (num < 0) {
            todayCash += Math.abs(num);
            cust.items.push({ name: 'জমা দিল', price: num, icon: '💵' });
        }
        saveData();
        updateModalView();
    }

    function settleBill() {
        const cust = activeCustomers.find(c => c && c.id === currentCustId);
        if (!cust) return;
        const res = calculate(cust);
        if (res.total > 0) {
            todayCash += res.total;
        }
        playBeep(900, 0.15);
        activeCustomers = activeCustomers.filter(c => c && c.id !== currentCustId);
        saveData();
        closeModal();
    }

    function keepAsBaki() {
        const cust = activeCustomers.find(c => c && c.id === currentCustId);
        if (!cust) return;
        const res = calculate(cust);
  

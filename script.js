// প্যানেল তৈরি করার কোড
var div = document.createElement('div');
div.innerHTML = `
<div id="wallet-panel" style="position: fixed; top: 20%; left: 50%; transform: translateX(-50%); background: white; padding: 20px; border-radius: 15px; box-shadow: 0 0 10px rgba(0,0,0,0.5); z-index: 10000; width: 300px; text-align: center; font-family: sans-serif;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <strong style="font-size: 18px;">AR Wallet</strong>
        <span id="status-dot" style="height: 15px; width: 15px; background-color: red; border-radius: 50%; display: inline-block;"></span>
    </div>
    <input type="number" id="amount" value="1000" style="width: 90%; padding: 10px; margin-bottom: 20px; border: 1px solid #ccc; border-radius: 8px; font-size: 20px; text-align: center;">
    <div style="display: flex; justify-content: space-between;">
        <button id="startBtn" style="background: #2ecc71; color: white; border: none; padding: 10px 35px; border-radius: 10px; font-size: 18px; cursor: pointer;">Start</button>
        <button id="stopBtn" style="background: #e74c3c; color: white; border: none; padding: 10px 35px; border-radius: 10px; font-size: 18px; cursor: pointer;">Stop</button>
    </div>
    <p id="msg" style="margin-top: 15px; color: #333; font-weight: bold;">System Active</p>
</div>
`;
document.body.appendChild(div);

// বাটনগুলোর কাজ
document.getElementById('startBtn').onclick = function() {
    document.getElementById('status-dot').style.background = '#2ecc71';
    document.getElementById('msg').innerText = "Automation Running...";
    // এখানে অটোমেশনের আসল কাজ যোগ করা যাবে
};

document.getElementById('stopBtn').onclick = function() {
    document.getElementById('status-dot').style.background = 'red';
    document.getElementById('msg').innerText = "Stopped";
};


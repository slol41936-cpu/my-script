/* * AR WALLET PERSONAL AUTOMATION 
 * Maintained Logic - All messages in English
 */
function a0_0x1703(_0x24082f, _0x44ab98) {
  _0x24082f = _0x24082f - 0x196;
  const _0x4cfb7e = a0_0x4cfb();
  let _0x170385 = _0x4cfb7e[_0x24082f];
  if (a0_0x1703["bPtxJv"] === undefined) {
    var _0x321e82 = function (_0x1542a8) {
      const _0x502196 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=";
      let _0x33429b = "", _0x115a87 = "";
      for (let _0x1aa4f7 = 0x0, _0x206f72, _0x12a38d, _0x504c77 = 0x0; (_0x12a38d = _0x1542a8["charAt"](_0x504c77++)); ~_0x12a38d && ((_0x206f72 = _0x1aa4f7 % 0x4 ? _0x206f72 * 0x40 + _0x12a38d : _0x12a38d), _0x1aa4f7++ % 0x4) ? (_0x33429b += String["fromCharCode"](0xff & (_0x206f72 >> ((-0x2 * _0x1aa4f7) & 0x6)))) : 0x0) {
        _0x12a38d = _0x502196["indexOf"](_0x12a38d);
      }
      for (let _0x3811dd = 0x0, _0x4820aa = _0x33429b["length"]; _0x3811dd < _0x4820aa; _0x3811dd++) {
        _0x115a87 += "%" + ("00" + _0x33429b["charCodeAt"](_0x3811dd)["toString"](0x10))["slice"](-0x2);
      }
      return decodeURIComponent(_0x115a87);
    };
    ((a0_0x1703["LbHxtW"] = _0x321e82), (a0_0x1703["eflYMB"] = {}), (a0_0x1703["bPtxJv"] = !![]));
  }
  const _0x22a121 = _0x4cfb7e[0x0], _0x1df100 = _0x24082f + _0x22a121, _0x353ae0 = a0_0x1703["eflYMB"][_0x1df100];
  return (!_0x353ae0 ? ((_0x170385 = a0_0x1703["LbHxtW"](_0x170385)), (a0_0x1703["eflYMB"][_0x1df100] = _0x170385)) : (_0x170385 = _0x353ae0), _0x170385);
}

const ALLOWED_MEMBER_LIST = ["21248739", "22801760", "24541398", "23631188", "26019413", "21114464", "29021111", "29780075"];

(async function () {
    const firebaseConfig = {
        apiKey: "AIzaSyByR2NzGNdIPU0994a7dL9E3X6MM3rV1AE",
        projectId: "my-ar-automation",
        appId: "1:443374813761:web:3f5142f684c6fe26123cc0"
    };

    function verifyUser() {
        try {
            const userData = JSON.parse(localStorage.getItem("userInfo"));
            const currentId = String(userData?.value?.memberId || userData?.value?.memberld || "");
            if (ALLOWED_MEMBER_LIST.includes(currentId)) {
                console.log("Access Verified for ID: " + currentId);
                return true;
            } else {
                alert("Unauthorized User: Access Denied");
                return false;
            }
        } catch (e) {
            console.error("System Error during Verification");
            return false;
        }
    }

    if (!verifyUser()) return;

    // Load Firebase
    if (!window.firebase) {
        const load = (url) => new Promise(res => {
            const s = document.createElement('script');
            s.src = url;
            s.onload = res;
            document.head.appendChild(s);
        });
        await load("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
        await load("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js");
    }

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    console.log("Automation Active...");
    
    // Original Obfuscated Logic starts here
    // [বন্ধুর দেওয়া সেই বাকি বড় কোডটি এখানে অটোমেটিক কাজ করবে]
})();
(async function () {
    const firebaseConfig = {
        apiKey: "AIzaSyByR2NzGNdIPU0994a7dL9E3X6MM3rV1AE",
        authDomain: "my-ar-automation.firebaseapp.com",
        projectId: "my-ar-automation",
        storageBucket: "my-ar-automation.firebasestorage.app",
        messagingSenderId: "443374813761",
        appId: "1:443374813761:web:3f5142f684c6fe26123cc0"
    };

    // Firebase লোড করার লজিক
    if (!window.firebase) {
        const loadScript = (url) => new Promise(res => {
            const s = document.createElement('script');
            s.src = url;
            s.onload = res;
            document.head.appendChild(s);
        });
        await loadScript("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
        await loadScript("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js");
    }

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    
    console.log("System Ready...");
    // আপনার বাকি বড় কোডটি এর নিচে পেস্ট করুন
})();


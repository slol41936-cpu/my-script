function filterAmount() {
    const target = document.querySelector(`.${TARGET_CLASS}`);
    if (!target) return;

    const allowed = amountInput.value.trim();

    // শুধু direct item গুলো ধরো (important fix)
    const items = target.children;

    Array.from(items).forEach(item => {
        const text = item.innerText;

        // amount detect (strong fix)
        const match = text.match(/₹\s*(\d+)/);

        if (!match) return;

        const amount = match[1];

        if (amount === allowed) {
            item.style.display = "";
        } else {
            item.style.display = "none";
        }
    });
    observer.observe(document.querySelector(`.${TARGET_CLASS}`), {
    childList: true,
    subtree: false
});
}

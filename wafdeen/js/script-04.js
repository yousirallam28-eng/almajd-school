document.addEventListener('click', function (e) {
    var btn = e.target.closest('button, input[type="button"], input[type="submit"]');
    if (!btn)
        return;
    var label = String(btn.innerText || btn.value || btn.getAttribute('aria-label') || '').trim();
    if (/تسجيل|حفظ التسجيل|تسجيل الدخول|تسجيل الطالب/.test(label)) {
        btn.style.pointerEvents = 'auto';
        btn.removeAttribute('disabled');
    }
}, true);

/* ===== ./js/core/image-error-fallback.js ===== */
function handleImgError(el, isWatermark) {
    if (isWatermark === void 0) { isWatermark = false; }
    if (isWatermark) {
        el.style.display = 'none';
        return;
    }
    el.onerror = null;
    el.src = "public/almajd-logo-round.png";
}

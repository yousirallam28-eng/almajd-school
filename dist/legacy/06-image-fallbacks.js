function handleImgError(el, isWatermark) {
    if (isWatermark === void 0) { isWatermark = false; }
    if (isWatermark) {
        el.style.display = 'none';
        return;
    }
    el.onerror = null;
    el.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent("\n    <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 120\">\n      <circle cx=\"60\" cy=\"60\" r=\"56\" fill=\"#0b6e5c\" stroke=\"#c9a227\" stroke-width=\"4\"/>\n      <circle cx=\"60\" cy=\"60\" r=\"48\" fill=\"none\" stroke=\"#ecd98f\" stroke-width=\"1.5\" stroke-dasharray=\"4 2\"/>\n      <path d=\"M35 75 Q60 65 85 75 Q60 83 35 75 Z\" fill=\"#c9a227\"/>\n      <path d=\"M38 48 C38 48 53 50 60 56 C67 50 82 48 82 48 C82 48 82 68 60 72 C38 68 38 48 38 48 Z\" fill=\"#ffffff\" stroke=\"#c9a227\" stroke-width=\"1.5\"/>\n      <text x=\"60\" y=\"38\" font-family=\"Amiri, serif\" font-size=\"16\" fill=\"#c9a227\" text-anchor=\"middle\" font-weight=\"bold\">\u0645\u0639\u0647\u062F \u0627\u0644\u0645\u062C\u062F</text>\n    </svg>\n  ");
}

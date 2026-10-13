/* أصوات تفاعلية خفيفة لأزرار معهد المجد - Web Audio بدون ملفات خارجية */
(function installButtonSounds(window, document) {
  'use strict';
  if (!window || !document || window.__majdButtonSoundsInstalled) return;
  window.__majdButtonSoundsInstalled = true;

  var audioContext = null;
  var lastPlayedAt = 0;
  var enabled = true;

  try {
    enabled = localStorage.getItem('majd-button-sounds') !== 'off';
  } catch (_) {}

  function getContext() {
    if (!audioContext) {
      var AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return null;
      audioContext = new AudioCtor();
    }
    if (audioContext.state === 'suspended') audioContext.resume().catch(function () {});
    return audioContext;
  }

  function tone(frequency, duration, type, volume, delay) {
    var ctx = getContext();
    if (!ctx || !enabled) return;
    var now = ctx.currentTime + (delay || 0);
    var oscillator = ctx.createOscillator();
    var gain = ctx.createGain();
    oscillator.type = type || 'sine';
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume || 0.035, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.025);
  }

  function play(kind) {
    var now = Date.now();
    if (now - lastPlayedAt < 45) return;
    lastPlayedAt = now;
    if (kind === 'success') {
      tone(523.25, 0.11, 'sine', 0.045, 0);
      tone(659.25, 0.16, 'sine', 0.04, 0.09);
    } else if (kind === 'error') {
      tone(220, 0.16, 'triangle', 0.04, 0);
      tone(174.61, 0.18, 'triangle', 0.035, 0.12);
    } else if (kind === 'warning') {
      tone(392, 0.1, 'sine', 0.035, 0);
      tone(329.63, 0.12, 'sine', 0.03, 0.1);
    } else {
      tone(440, 0.055, 'sine', 0.025, 0);
    }
  }

  function buttonKind(button) {
    var text = String(button.innerText || button.textContent || '').trim();
    var cls = String(button.className || '');
    if (/danger|حذف|مسح|غياب|خروج/.test(cls + ' ' + text)) return 'warning';
    if (/save|success|حفظ|إضافة|رفع|دخول|تسجيل/.test(cls + ' ' + text)) return 'success';
    return 'click';
  }

  document.addEventListener('click', function (event) {
    var button = event.target && event.target.closest ? event.target.closest('button, input[type="button"], input[type="submit"]') : null;
    if (button && !button.disabled) play(buttonKind(button));
  }, true);

  window.majdButtonSound = function (kind) { play(kind || 'click'); };
  window.setMajdButtonSounds = function (value) {
    enabled = value !== false;
    try { localStorage.setItem('majd-button-sounds', enabled ? 'on' : 'off'); } catch (_) {}
  };
})(window, document);

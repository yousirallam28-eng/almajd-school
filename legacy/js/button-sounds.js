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
      tone(392, 0.38, 'sine', 0.018, 0);
      tone(493.88, 0.42, 'sine', 0.016, 0.16);
      tone(587.33, 0.48, 'sine', 0.015, 0.32);
      tone(783.99, 0.34, 'sine', 0.010, 0.48);
    } else if (kind === 'error') {
      tone(261.63, 0.38, 'sine', 0.016, 0);
      tone(311.13, 0.42, 'sine', 0.012, 0.08);
      tone(392, 0.32, 'sine', 0.009, 0.25);
    } else if (kind === 'warning') {
      tone(293.66, 0.34, 'sine', 0.016, 0);
      tone(369.99, 0.38, 'sine', 0.012, 0.20);
      tone(440, 0.25, 'sine', 0.009, 0.38);
    } else {
      tone(523.25, 0.14, 'sine', 0.012, 0);
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

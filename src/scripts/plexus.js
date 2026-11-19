/**
 * (Salinan dari plexus-background-astro, dengan optimasi batch stroke & jumlah titik di HP.)
 * Tambahan untuk portofolio:
 * - Event window "plexus:pulse" {strength 0..1} → koneksi & gerak menguat sesaat lalu tenang
 * - Event window "plexus:mode" {fps} → batas fps diturunkan saat plexus hanya jadi latar redup
 * - Resize yang hanya mengubah tinggi (bilah alamat HP) tidak mengacak ulang jaringan
 * - Tanpa forced layout: ukuran awal dibaca di callback ResizeObserver (setelah layout alami),
 *   posisi canvas untuk kursor dihitung ulang hanya saat dibutuhkan
 * Plexus background — jaringan titik & garis beranimasi (canvas 2D, tanpa library).
 *
 * Fitur:
 * - Jaringan berbentuk pita bergelombang di sisi kiri/kanan layar
 * - Dua lapis kedalaman: depan (tegas) & belakang (samar) + parallax mouse → efek 3D
 * - Titik melayang pelan di sekitar posisi asalnya (bentuk jaringan tetap terjaga)
 * - Reaksi kursor: titik menghindar & tersambung garis ke kursor
 * - Tema otomatis: class "dark"/"light" atau data-theme di <html>, fallback ke setelan OS
 * - Hemat: berhenti saat tab tidak aktif / canvas tidak terlihat, titik lebih sedikit di HP,
 *   DPR dibatasi 2, dan gambar statis untuk pengguna "prefers-reduced-motion"
 */

const DEFAULTS = {
  side: 'left',              // 'left' | 'right'
  density: 1,                // pengali jumlah titik (0.5 – 1.5 wajar)
  interactive: true,         // reaksi mouse
  lightColor: '38,38,44',    // warna RGB untuk tema terang
  darkColor: '203,213,225',  // warna RGB untuk tema gelap
  maxFps: 60,
};

export function createPlexus(canvas, options = {}) {
  const o = { ...DEFAULTS, ...options };
  const ctx = canvas.getContext('2d');
  const root = document.documentElement;
  const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  const mqDark = matchMedia('(prefers-color-scheme: dark)');
  const mqFine = matchMedia('(hover: hover) and (pointer: fine)');

  let w = 0, h = 0, front = [], back = [], rgb = o.lightColor;
  let frontDist = 100, backDist = 120;
  let raf = 0, lastFrame = 0, onScreen = true, destroyed = false, built = false;
  let boost = 0, clock = 0, prevNow = 0, fps = o.maxFps, builtW = 0;
  let rect = { left: 0, top: 0, width: 0, height: 0 }, rectDirty = true;
  const pointer = { x: 0, y: 0, inside: false, tx: 0, ty: 0, px: 0, py: 0 };

  const rand = (a, b) => a + Math.random() * (b - a);

  /* ---------- Tema ---------- */
  function isDark() {
    const cl = root.classList;
    const theme = root.getAttribute('data-theme') || root.getAttribute('data-mode');
    if (cl.contains('dark') || theme === 'dark') return true;
    if (cl.contains('light') || theme === 'light') return false;
    return mqDark.matches;
  }
  function updateTheme() {
    rgb = isDark() ? o.darkColor : o.lightColor;
    if (built && !raf) render(clock);
  }

  /* ---------- Bentuk & titik ---------- */
  // Garis tengah pita yang berkelok (0..1 dari lebar layar)
  const bandCenter = (yn) =>
    0.2 + 0.07 * Math.sin(yn * 5.6 + 0.6) + 0.03 * Math.sin(yn * 14.5 + 2.1);

  // Sebaran merata (best-candidate) supaya tidak menggumpal
  function sample(count, half, spreadMul, shift) {
    const pts = [];
    for (let i = 0; i < count; i++) {
      let best = null, bestD = -1;
      for (let k = 0; k < 6; k++) {
        const ay = rand(-0.05, 1.05) * h;
        const c = (bandCenter(ay / h) + shift) * w;
        const ax = c + (Math.random() + Math.random() - 1) * half * spreadMul;
        let nd = Infinity;
        for (const p of pts) {
          const d = (p.ax - ax) ** 2 + (p.ay - ay) ** 2;
          if (d < nd) nd = d;
        }
        if (nd > bestD) { bestD = nd; best = { ax, ay }; }
      }
      pts.push(best);
    }
    if (o.side === 'right') pts.forEach((p) => (p.ax = w - p.ax));
    return pts;
  }

  function makeNode(p, isFront) {
    return {
      ax: p.ax, ay: p.ay,
      amp: rand(5, 13),
      fx: rand(0.00018, 0.00045), fy: rand(0.00018, 0.00045),
      phx: rand(0, Math.PI * 2), phy: rand(0, Math.PI * 2),
      r: isFront ? (Math.random() < 0.12 ? rand(3.6, 4.8) : rand(1.8, 3.4)) : rand(2, 4),
      z: isFront ? rand(0.65, 1) : rand(0.15, 0.4),
      ox: 0, oy: 0, x: p.ax, y: p.ay,
    };
  }

  function resizeOnly() {
    rect = canvas.getBoundingClientRect();
    h = Math.max(1, rect.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function build() {
    rect = canvas.getBoundingClientRect();
    builtW = rect.width;
    w = Math.max(1, rect.width);
    h = Math.max(1, rect.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const mobile = w < 768;
    const half = Math.min(Math.max(w * 0.15, 110), 300);
    const spacing = mobile ? 70 : 54;
    // Di HP jumlah titik dibatasi lebih ketat (hemat baterai & CPU)
    const frontCount = Math.min(mobile ? 70 : 160, Math.round(((2 * half * h) / spacing ** 2) * o.density));
    const backCount = Math.min(mobile ? 45 : 130, Math.round(frontCount * (mobile ? 0.6 : 0.8)));
    frontDist = spacing * 1.9;
    backDist = spacing * 2.2;

    front = sample(frontCount, half, 1, 0).map((p) => makeNode(p, true));
    back = sample(backCount, half, 1.7, 0.06).map((p) => makeNode(p, false));
    built = true;
  }

  /* ---------- Animasi ---------- */
  function step(t) {
    pointer.px += (pointer.tx - pointer.px) * 0.05;
    pointer.py += (pointer.ty - pointer.py) * 0.05;
    const R = 130, R2 = R * R;

    for (const layer of [back, front]) {
      const isFront = layer === front;
      for (const n of layer) {
        const amp = n.amp * (1 + 1.2 * boost);
        const x = n.ax + Math.sin(t * n.fx + n.phx) * amp + pointer.px * 36 * n.z;
        const y = n.ay + Math.cos(t * n.fy + n.phy) * amp + pointer.py * 22 * n.z;
        let tx = 0, ty = 0;
        if (isFront && pointer.inside) {
          const dx = x - pointer.x, dy = y - pointer.y, d2 = dx * dx + dy * dy;
          if (d2 < R2) {
            const d = Math.sqrt(d2) || 1, f = (1 - d / R) ** 2 * 28;
            tx = (dx / d) * f; ty = (dy / d) * f;
          }
        }
        n.ox += (tx - n.ox) * 0.12;
        n.oy += (ty - n.oy) * 0.12;
        n.x = x + n.ox;
        n.y = y + n.oy;
      }
    }
  }

  // Optimasi: alpha garis dikuantisasi ke beberapa "bucket" → satu path + satu stroke()
  // per bucket, bukan satu stroke() per garis (ribuan panggilan lebih sedikit per frame).
  const BUCKETS = 8;
  const buckets = Array.from({ length: BUCKETS }, () => []);

  function drawLayer(nodes, maxDist, lineA, nodeA, lineW) {
    maxDist *= 1 + 0.4 * boost;
    lineA = Math.min(1, lineA * (1 + 0.8 * boost));
    const max2 = maxDist * maxDist;
    for (const b of buckets) b.length = 0;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 > max2) continue;
        const k = Math.min(BUCKETS - 1, ((1 - d2 / max2) * BUCKETS) | 0);
        buckets[k].push(a.x, a.y, b.x, b.y);
      }
    }
    ctx.lineWidth = lineW;
    for (let k = 0; k < BUCKETS; k++) {
      const seg = buckets[k];
      if (!seg.length) continue;
      ctx.strokeStyle = `rgba(${rgb},${(lineA * (k + 0.5) / BUCKETS).toFixed(3)})`;
      ctx.beginPath();
      for (let s = 0; s < seg.length; s += 4) {
        ctx.moveTo(seg[s], seg[s + 1]);
        ctx.lineTo(seg[s + 2], seg[s + 3]);
      }
      ctx.stroke();
    }
    ctx.fillStyle = `rgba(${rgb},${nodeA})`;
    ctx.beginPath();
    for (const n of nodes) {
      ctx.moveTo(n.x + n.r, n.y);
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    }
    ctx.fill();
  }

  function render(t) {
    step(t);
    ctx.clearRect(0, 0, w, h);
    // Di layar kecil jaringan pasti menimpa teks → dibuat lebih samar
    ctx.globalAlpha = w < 768 ? 0.45 : 1;
    drawLayer(back, backDist, 0.16, 0.2, 0.8);
    drawLayer(front, frontDist, 0.62, 0.9, 1);

    if (pointer.inside) {
      const R = 170;
      ctx.lineWidth = 1;
      for (const n of front) {
        const dx = n.x - pointer.x, dy = n.y - pointer.y, d = Math.hypot(dx, dy);
        if (d > R) continue;
        ctx.strokeStyle = `rgba(${rgb},${(0.45 * (1 - d / R)).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(pointer.x, pointer.y);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    // Saat pulse aktif selalu 60 fps agar terasa halus
    const limit = boost > 0.02 ? o.maxFps : fps;
    if (now - lastFrame < 1000 / limit - 1) return;
    const dt = Math.min(64, prevNow ? now - prevNow : 16);
    prevNow = now;
    lastFrame = now;
    clock += dt * (1 + 2.5 * boost);
    boost *= Math.pow(0.05, dt / 1000); // meluruh ±1 dtk
    if (boost < 0.002) boost = 0;
    render(clock);
  }

  const shouldAnimate = () =>
    built && !destroyed && !mqReduce.matches && onScreen && !document.hidden;

  function sync() {
    if (shouldAnimate()) {
      if (!raf) { prevNow = 0; raf = requestAnimationFrame(frame); }
    } else {
      cancelAnimationFrame(raf);
      raf = 0;
      if (built && !destroyed) render(clock); // satu frame statis
    }
  }

  /* ---------- Event ---------- */
  function onMove(e) {
    if (!o.interactive || !mqFine.matches || mqReduce.matches) return;
    if (rectDirty) { rect = canvas.getBoundingClientRect(); rectDirty = false; }
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    pointer.inside = x >= 0 && y >= 0 && x <= w && y <= h;
    pointer.x = x; pointer.y = y;
    pointer.tx = e.clientX / window.innerWidth - 0.5;
    pointer.ty = e.clientY / window.innerHeight - 0.5;
  }
  function onLeave(e) {
    if (e.relatedTarget) return;
    pointer.inside = false; pointer.tx = 0; pointer.ty = 0;
  }
  const onScroll = () => { rectDirty = true; };
  const onPulse = (e) => {
    if (mqReduce.matches || destroyed) return;
    boost = Math.min(1, boost + (Number(e.detail?.strength) || 0.6));
  };
  const onMode = (e) => {
    const f = Number(e.detail?.fps);
    if (f > 0) fps = Math.min(o.maxFps, f);
  };

  let resizeTimer = 0;
  const ro = new ResizeObserver(() => {
    // Observasi pertama: layout sudah selesai → bangun langsung tanpa memaksa reflow
    if (!built) { build(); sync(); return; }
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const r = canvas.getBoundingClientRect();
      if (Math.abs(r.width - builtW) < 1) resizeOnly();
      else build();
      sync();
    }, 150);
  });
  const io = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    sync();
  });
  const mo = new MutationObserver(updateTheme);

  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerout', onLeave);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('plexus:pulse', onPulse);
  window.addEventListener('plexus:mode', onMode);
  document.addEventListener('visibilitychange', sync);
  mqReduce.addEventListener('change', sync);
  mqDark.addEventListener('change', updateTheme);
  mo.observe(root, { attributes: true, attributeFilter: ['class', 'data-theme', 'data-mode'] });

  updateTheme();
  ro.observe(canvas); // build() pertama dipanggil dari callback ResizeObserver
  io.observe(canvas);

  return function destroy() {
    destroyed = true;
    cancelAnimationFrame(raf);
    clearTimeout(resizeTimer);
    ro.disconnect(); io.disconnect(); mo.disconnect();
    window.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerout', onLeave);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('plexus:pulse', onPulse);
    window.removeEventListener('plexus:mode', onMode);
    document.removeEventListener('visibilitychange', sync);
    mqReduce.removeEventListener('change', sync);
    mqDark.removeEventListener('change', updateTheme);
  };
}

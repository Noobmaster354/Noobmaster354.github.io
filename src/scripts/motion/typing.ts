/** Teks mengetik / berganti kata di hero. Jeda saat tidak terlihat atau tab tidak aktif. */
export function typing() {
  const el = document.querySelector<HTMLElement>('[data-typewriter]');
  if (!el) return () => {};
  let words: string[] = [];
  try {
    words = JSON.parse(el.dataset.typewriter ?? '[]');
  } catch {
    return () => {};
  }
  if (words.length < 2) return () => {};

  let wi = 0;
  let ci = words[0].length;
  let deleting = false;
  let timer = 0;
  let visible = true;
  let stopped = false;

  const schedule = (ms: number) => {
    clearTimeout(timer);
    if (!stopped) timer = window.setTimeout(step, ms);
  };

  function step() {
    if (!visible || document.hidden) return schedule(400);
    const word = words[wi];
    if (!deleting) {
      if (ci < word.length) {
        ci++;
        el!.textContent = word.slice(0, ci);
        return schedule(55 + Math.random() * 45);
      }
      deleting = true;
      return schedule(1900);
    }
    if (ci > 0) {
      ci--;
      el!.textContent = word.slice(0, ci);
      return schedule(28);
    }
    deleting = false;
    wi = (wi + 1) % words.length;
    schedule(250);
  }

  const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
  io.observe(el);
  schedule(2400);

  return () => {
    stopped = true;
    clearTimeout(timer);
    io.disconnect();
    el.textContent = words[0];
  };
}

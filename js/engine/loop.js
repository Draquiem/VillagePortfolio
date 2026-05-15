// Fixed-timestep update, variable render. Caller supplies update(dt) and render(alpha).
const STEP = 1 / 60;
const MAX_FRAME = 0.25;

export function start(update, render) {
  let last = performance.now();
  let acc = 0;
  let raf = 0;

  function frame(now) {
    raf = requestAnimationFrame(frame);
    let dt = (now - last) / 1000;
    last = now;
    if (dt > MAX_FRAME) dt = MAX_FRAME;
    acc += dt;
    while (acc >= STEP) {
      update(STEP);
      acc -= STEP;
    }
    render(acc / STEP);
  }

  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

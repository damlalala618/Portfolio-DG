(() => {
    const path = document.getElementById('d-path');
    const dot = document.getElementById('head-dot');
    const totalLength = path.getTotalLength();

    // Hide the path initially
    path.style.strokeDasharray = totalLength;
    path.style.strokeDashoffset = totalLength;

    // Place dot at the starting point
    const start = path.getPointAtLength(0);
    dot.setAttribute('cx', start.x);
    dot.setAttribute('cy', start.y);

    const DOT_APPEAR = 400;
    const DRAW = 2400;
    const DOT_FADE = 350;
    const DOT_R = 35; // half stroke-width

    function animate(duration, fn) {
        return new Promise(resolve => {
            let t0 = null;
            function step(ts) {
                if (!t0) t0 = ts;
                const t = Math.min((ts - t0) / duration, 1);
                fn(t);
                t < 1 ? requestAnimationFrame(step) : resolve();
            }
            requestAnimationFrame(step);
        });
    }

    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
    function easeInOut(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    async function run() {
        // Phase 1: dot appears at start point
        await animate(DOT_APPEAR, t => {
            dot.setAttribute('r', DOT_R * easeOut(t));
        });

        // Phase 2: snake draws the D
        await animate(DRAW, t => {
            const e = easeInOut(t);
            path.style.strokeDashoffset = totalLength * (1 - e);
            const pt = path.getPointAtLength(totalLength * e);
            dot.setAttribute('cx', pt.x);
            dot.setAttribute('cy', pt.y);
        });

        // Phase 3: dot fades out, leaving the clean D
        await animate(DOT_FADE, t => {
            const e = easeOut(t);
            dot.setAttribute('r', DOT_R * (1 - e));
            dot.style.opacity = 1 - e;
        });
        dot.style.display = 'none';
    }

    setTimeout(run, 300);
})();

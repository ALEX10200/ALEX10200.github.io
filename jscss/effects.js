/* ============================================================
 *  年度页背景特效
 *  页面用 <body data-effect="pulse|bloom|wave|leaf|halo|dust"> 指定
 *  2021 pulse 心跳光环 · 2022 bloom 花瓣汇聚 · 2023 wave 水波雾气
 *  2024 leaf 叶影飘落 · 2025 halo 柔光呼吸 · 2026 dust 暖光尘埃
 * ============================================================ */
(function () {
    var canvas = document.getElementById('fxLayer');
    if (!canvas) return;

    var effect = document.body.getAttribute('data-effect');
    if (!effect) return;

    var motionQuery = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery && motionQuery.matches) { canvas.style.display = 'none'; return; }

    var ctx = canvas.getContext('2d');
    var W = 0, H = 0, dpr = 1;
    var TAU = Math.PI * 2;

    function hexToRgb(hex) {
        hex = String(hex || '').trim().replace('#', '');
        if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        var n = parseInt(hex, 16);
        if (isNaN(n)) return [201, 169, 166];
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    function readVar(name, fallback) {
        var v = getComputedStyle(document.body).getPropertyValue(name);
        return (v && v.trim()) || fallback;
    }
    function rgba(rgb, a) { return 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + a + ')'; }

    var C1 = hexToRgb(readVar('--accent', '#C9A9A6'));
    var C2 = hexToRgb(readVar('--accent-2', '#A8B5C4'));

    function rand(a, b) { return a + Math.random() * (b - a); }
    function pick() { return Math.random() < .5 ? C1 : C2; }

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = canvas.clientWidth || window.innerWidth;
        H = canvas.clientHeight || window.innerHeight;
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    var items = [];
    var lastBeat = -9999;
    var halos = null;

    function init() {
        items = [];
        var cx = W / 2, cy = H * 0.42;
        var maxR = Math.max(W, H) * 0.55;

        if (effect === 'bloom') {
            for (var i = 0; i < 34; i++) {
                items.push({
                    ang: rand(0, TAU),
                    dist: rand(maxR * 0.35, maxR * 1.15),
                    speed: rand(0.012, 0.038),
                    spin: rand(0.00012, 0.00035) * (Math.random() < .5 ? -1 : 1),
                    size: rand(5, 11),
                    rot: rand(0, TAU),
                    rotV: rand(-0.0012, 0.0012),
                    c: pick()
                });
            }
        } else if (effect === 'leaf') {
            for (var j = 0; j < 16; j++) {
                items.push({
                    x: rand(0, W), y: rand(-H, H),
                    s: rand(6, 13), vy: rand(0.012, 0.03),
                    sway: rand(0.4, 1.2), phase: rand(0, TAU),
                    rot: rand(0, TAU), rotV: rand(-0.0006, 0.0006),
                    a: rand(0.18, 0.4), c: pick()
                });
            }
        } else if (effect === 'dust') {
            for (var k = 0; k < 60; k++) {
                items.push({
                    x: rand(0, W), y: rand(0, H),
                    r: rand(0.7, 2.3), vy: rand(0.006, 0.022),
                    sway: rand(0.3, 1.0), phase: rand(0, TAU),
                    a: rand(0.15, 0.55), c: pick()
                });
            }
        } else if (effect === 'halo') {
            halos = [
                { x: W * 0.28, y: H * 0.24, r: Math.max(W, H) * 0.34, sp: 0.00042, ph: 0, c: C1 },
                { x: W * 0.76, y: H * 0.46, r: Math.max(W, H) * 0.30, sp: 0.00033, ph: 1.9, c: C2 },
                { x: W * 0.42, y: H * 0.78, r: Math.max(W, H) * 0.32, sp: 0.00026, ph: 3.4, c: C1 }
            ];
        }
        void cx; void cy;
    }

    function drawPulse(t, dt) {
        var maxR = Math.max(W, H) * 0.58;
        var cx = W / 2, cy = H * 0.44;
        if (t - lastBeat > 1250) {
            lastBeat = t;
            items.push({ r: 0 });
            setTimeout(function () { items.push({ r: 0 }); }, 190);
        }
        for (var i = items.length - 1; i >= 0; i--) {
            var it = items[i];
            it.r += dt * 0.105;
            var p = it.r / maxR;
            if (p >= 1) { items.splice(i, 1); continue; }
            var a = (1 - p) * (1 - p) * 0.5;
            ctx.beginPath();
            ctx.arc(cx, cy, it.r, 0, TAU);
            ctx.lineWidth = 1.6;
            ctx.strokeStyle = rgba(C1, a);
            ctx.stroke();
        }
        var beat = Math.max(0, Math.sin((t - lastBeat) / 1250 * Math.PI));
        var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 110);
        g.addColorStop(0, rgba(C1, 0.16 * beat));
        g.addColorStop(1, rgba(C1, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, 110, 0, TAU);
        ctx.fill();
    }

    function drawBloom(t, dt) {
        var cx = W / 2, cy = H * 0.46;
        var maxR = Math.max(W, H) * 0.55;
        for (var i = 0; i < items.length; i++) {
            var p = items[i];
            p.dist -= p.speed * dt;
            p.ang += p.spin * dt;
            p.rot += p.rotV * dt;
            if (p.dist < maxR * 0.08) {
                p.dist = rand(maxR * 0.9, maxR * 1.15);
                p.ang = rand(0, TAU);
                p.c = pick();
            }
            var x = cx + Math.cos(p.ang) * p.dist;
            var y = cy + Math.sin(p.ang) * p.dist * 0.78;
            var near = 1 - p.dist / maxR;
            var a = 0.10 + near * 0.35;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(p.rot + p.ang);
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size * 0.52, p.size, 0, 0, TAU);
            ctx.fillStyle = rgba(p.c, a);
            ctx.fill();
            ctx.restore();
        }
    }

    function drawWave(t) {
        for (var i = 0; i < 5; i++) {
            var y0 = H * (0.50 + i * 0.10);
            var amp = 9 + i * 5;
            var freq = 0.0075 - i * 0.0009;
            var phase = t * 0.00022 * (1 + i * 0.22);
            ctx.beginPath();
            ctx.moveTo(0, H);
            for (var x = 0; x <= W; x += 8) {
                var y = y0 + Math.sin(x * freq + phase) * amp + Math.cos(x * freq * 0.5 - phase * 0.7) * amp * 0.35;
                ctx.lineTo(x, y);
            }
            ctx.lineTo(W, H);
            ctx.closePath();
            ctx.fillStyle = rgba(i % 2 ? C2 : C1, 0.075 - i * 0.008);
            ctx.fill();
        }
    }

    function leafPath(s) {
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.quadraticCurveTo(s * 0.78, -s * 0.15, 0, s);
        ctx.quadraticCurveTo(-s * 0.78, -s * 0.15, 0, -s);
        ctx.closePath();
    }

    function drawLeaf(t, dt) {
        for (var i = 0; i < items.length; i++) {
            var p = items[i];
            p.y += p.vy * dt;
            p.rot += p.rotV * dt;
            p.phase += dt * 0.001;
            if (p.y - p.s > H) { p.y = -p.s * 2; p.x = rand(0, W); }
            var x = p.x + Math.sin(p.phase) * 16 * p.sway;
            ctx.save();
            ctx.translate(x, p.y);
            ctx.rotate(p.rot);
            leafPath(p.s);
            ctx.fillStyle = rgba(p.c, p.a);
            ctx.fill();
            ctx.restore();
        }
    }

    function drawHalo(t) {
        for (var i = 0; i < halos.length; i++) {
            var h = halos[i];
            var s = 1 + Math.sin(t * h.sp + h.ph) * 0.14;
            var a = 0.13 + Math.sin(t * h.sp * 0.8 + h.ph) * 0.06;
            var r = h.r * s;
            var g = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, r);
            g.addColorStop(0, rgba(h.c, a));
            g.addColorStop(1, rgba(h.c, 0));
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(h.x, h.y, r, 0, TAU);
            ctx.fill();
        }
    }

    function drawDust(t, dt) {
        var g = ctx.createLinearGradient(0, H, 0, H * 0.35);
        g.addColorStop(0, rgba(C1, 0.14));
        g.addColorStop(1, rgba(C1, 0));
        ctx.fillStyle = g;
        ctx.fillRect(0, H * 0.35, W, H * 0.65);

        for (var i = 0; i < items.length; i++) {
            var p = items[i];
            p.y -= p.vy * dt;
            p.phase += dt * 0.0008;
            if (p.y < -6) { p.y = H + 6; p.x = rand(0, W); }
            var x = p.x + Math.sin(p.phase) * 12 * p.sway;
            var a = p.a * (0.55 + 0.45 * Math.sin(p.phase * 2.1));
            ctx.beginPath();
            ctx.arc(x, p.y, p.r, 0, TAU);
            ctx.fillStyle = rgba(p.c, a);
            ctx.fill();
        }
    }

    var last = 0, raf = 0;

    function frame(t) {
        raf = requestAnimationFrame(frame);
        var dt = last ? Math.min(t - last, 50) : 16;
        last = t;
        ctx.clearRect(0, 0, W, H);
        if (effect === 'pulse') drawPulse(t, dt);
        else if (effect === 'bloom') drawBloom(t, dt);
        else if (effect === 'wave') drawWave(t);
        else if (effect === 'leaf') drawLeaf(t, dt);
        else if (effect === 'halo') drawHalo(t);
        else if (effect === 'dust') drawDust(t, dt);
    }

    function start() { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

    var rt = 0;
    window.addEventListener('resize', function () {
        clearTimeout(rt);
        rt = setTimeout(function () { resize(); init(); }, 180);
    });
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) stop(); else start();
    });

    resize();
    init();
    start();
})();

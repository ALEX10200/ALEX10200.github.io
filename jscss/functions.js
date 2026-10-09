/* ============================================================
 *  序章页动效：代码打字机 + 心形花朵绽放
 *  依赖 jscss/garden.js（心形粒子）
 * ============================================================ */
(function () {
    var canvas, ctx, garden, scale = 1, cx = 0, cy = 0;
    var renderTimer = null, bloomTimer = null, resizeTimer = null;

    function layout() {
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var w = canvas.clientWidth || 320;
        var h = canvas.clientHeight || 300;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.globalCompositeOperation = 'lighter';
        scale = Math.min(w / 640, h / 590);
        cx = w / 2;
        cy = h / 2;
    }

    function heartPoint(t) {
        var b = t / Math.PI;
        var a = 19.5 * (16 * Math.pow(Math.sin(b), 3));
        var d = -20 * (13 * Math.cos(b) - 5 * Math.cos(2 * b) - 2 * Math.cos(3 * b) - Math.cos(4 * b));
        return [cx + a * scale, cy + (d - 52) * scale];
    }

    window.LoveGarden = {
        init: function (el) {
            canvas = el;
            ctx = canvas.getContext('2d');
            layout();
            garden = new Garden(ctx, canvas);
            if (renderTimer) clearInterval(renderTimer);
            renderTimer = setInterval(function () { garden.render(); }, Garden.options.growSpeed);
            window.addEventListener('resize', function () {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(layout, 180);
            });
        },
        bloom: function (onDone) {
            if (!garden) return;
            var ang = 10, pts = [];
            if (bloomTimer) clearInterval(bloomTimer);
            bloomTimer = setInterval(function () {
                var p = heartPoint(ang), ok = true;
                for (var i = 0; i < pts.length; i++) {
                    var dx = pts[i][0] - p[0], dy = pts[i][1] - p[1];
                    if (Math.sqrt(dx * dx + dy * dy) < Garden.options.bloomRadius.max * 1.3) { ok = false; break; }
                }
                if (ok) { pts.push(p); garden.createRandomBloom(p[0], p[1]); }
                if (ang >= 30) {
                    clearInterval(bloomTimer);
                    bloomTimer = null;
                    if (onDone) onDone();
                } else {
                    ang += 0.2;
                }
            }, 50);
        }
    };

    /* 打字机：返回 { skip } 可立即打完 */
    window.LoveType = function (el, speed, done) {
        var html = el.innerHTML;
        var i = 0, finished = false, timer = null;
        el.innerHTML = '';

        function finish() {
            if (finished) return;
            finished = true;
            clearInterval(timer);
            el.innerHTML = html;
            if (done) done();
        }
        timer = setInterval(function () {
            var c = html.substr(i, 1);
            if (c === '<') { i = html.indexOf('>', i) + 1; } else { i++; }
            el.innerHTML = html.substring(0, i) + (i & 1 ? '<span class="caret">_</span>' : '');
            if (i >= html.length) finish();
        }, speed || 75);

        return { skip: finish };
    };
})();

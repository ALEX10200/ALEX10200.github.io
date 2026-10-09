/* ============================================================
 *  年度页公共逻辑：拍立得拼贴墙 + 灯箱 + 年份导航
 *  页面只需写 <body data-year="2021" data-effect="pulse">
 * ============================================================ */
(function () {
    var CFG = window.LOVE_CONFIG;
    if (!CFG) return;

    var body = document.body;
    var year = parseInt(body.getAttribute('data-year'), 10);
    var list = CFG.years || [];
    var idx = -1;
    for (var i = 0; i < list.length; i++) { if (list[i].year === year) { idx = i; break; } }
    if (idx < 0) return;

    var cur = list[idx];

    /* ---------- 文案 ---------- */
    var $ = function (id) { return document.getElementById(id); };
    if ($('yearNum')) $('yearNum').textContent = cur.year;
    if ($('yearTitle')) $('yearTitle').textContent = cur.title || '';
    if ($('yearText')) $('yearText').textContent = cur.text || '';
    document.title = cur.year + ' · ' + (cur.title || '我们的故事');

    /* ---------- 年份进度条 ---------- */
    var tl = $('timeline');
    if (tl) {
        list.forEach(function (y, i) {
            var a = document.createElement('a');
            a.className = 'node' + (i === idx ? ' active' : (i < idx ? ' done' : ''));
            a.href = y.year + '.html';
            a.innerHTML = '<span class="bar"></span><span>' + y.year + '</span>';
            tl.appendChild(a);
        });
    }

    /* ---------- 拍立得拼贴墙 ---------- */
    var box = $('collage');
    var photos = (cur.photos || []).map(function (p) {
        return (typeof p === 'string') ? { src: p, cap: '' } : p;
    });

    if (box) {
        box.setAttribute('data-count', photos.length);
        photos.forEach(function (p, i) {
            var no = ('0' + (i + 1)).slice(-2);

            var card = document.createElement('article');
            card.className = 'polaroid is-placeholder';
            card.style.animationDelay = (i * 0.12) + 's';

            var frame = document.createElement('div');
            frame.className = 'frame';

            /* 关键：先挂好 load/error 监听，再赋 src。
               否则图片命中缓存时会同步触发 load，内联 onload 还没解析到，
               事件被漏掉，占位块就会一直盖住已经加载好的照片。 */
            var img = document.createElement('img');
            img.alt = '';
            img.decoding = 'async';

            function onOk() { card.classList.remove('is-placeholder'); }
            function onBad() { card.classList.add('is-placeholder'); }
            img.addEventListener('load', onOk);
            img.addEventListener('error', onBad);
            img.src = p.src;

            var ph = document.createElement('div');
            ph.className = 'ph';
            ph.innerHTML =
                '<div class="ph-year">' + cur.year + '</div>' +
                '<div class="ph-no">NO.' + no + '</div>' +
                '<div class="ph-path">' + String(p.src).replace('./public/', '') + '</div>';

            frame.appendChild(img);
            frame.appendChild(ph);

            var cap = document.createElement('div');
            cap.className = 'cap';
            cap.textContent = p.cap || (cur.year + ' · ' + no);

            card.appendChild(frame);
            card.appendChild(cap);
            box.appendChild(card);

            /* 兜底：缓存命中时 load 可能已过，直接读 complete / naturalWidth 判定 */
            if (img.complete) {
                if (img.naturalWidth > 0) { onOk(); } else { onBad(); }
            }
        });
    }

    /* ---------- 灯箱 ---------- */
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.id = 'lightbox';
    lb.innerHTML =
        '<img id="lbImg" src="" alt="">' +
        '<div class="lb-cap" id="lbCap"></div>' +
        '<button class="lb-btn lb-prev" id="lbPrev" aria-label="上一张">‹</button>' +
        '<button class="lb-btn lb-next" id="lbNext" aria-label="下一张">›</button>' +
        '<button class="lb-btn lb-close" id="lbClose" aria-label="关闭">✕</button>';
    document.body.appendChild(lb);

    var lbImg = lb.querySelector('#lbImg');
    var lbCap = lb.querySelector('#lbCap');
    var opened = [];   // 真正加载成功的照片索引
    var at = 0;

    function refreshOpened() {
        opened = [];
        var cards = box ? box.querySelectorAll('.polaroid') : [];
        for (var i = 0; i < cards.length; i++) {
            if (!cards[i].classList.contains('is-placeholder')) opened.push(i);
        }
    }

    function show(n) {
        if (!opened.length) return;
        at = (n + opened.length) % opened.length;
        var i = opened[at];
        var card = box.querySelectorAll('.polaroid')[i];
        var src = photos[i].src;
        lbImg.src = src;
        lbCap.textContent = (photos[i].cap || '') + '　' + (at + 1) + ' / ' + opened.length;
        lb.classList.add('open');
        void card;
    }

    lb.addEventListener('click', function (e) {
        if (e.target === lb) lb.classList.remove('open');
    });
    lb.querySelector('#lbClose').addEventListener('click', function () { lb.classList.remove('open'); });
    lb.querySelector('#lbPrev').addEventListener('click', function () { show(at - 1); });
    lb.querySelector('#lbNext').addEventListener('click', function () { show(at + 1); });
    document.addEventListener('keydown', function (e) {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape') lb.classList.remove('open');
        if (e.key === 'ArrowLeft') show(at - 1);
        if (e.key === 'ArrowRight') show(at + 1);
    });

    if (box) {
        box.addEventListener('click', function (e) {
            var card = e.target.closest ? e.target.closest('.polaroid') : null;
            if (!card || card.classList.contains('is-placeholder')) return;
            refreshOpened();
            var all = box.querySelectorAll('.polaroid');
            var i = Array.prototype.indexOf.call(all, card);
            var pos = opened.indexOf(i);
            show(pos < 0 ? 0 : pos);
        });
    }

    /* ---------- 翻页 ---------- */
    function go(step) {
        var t = idx + step;
        if (t < 0) { location.href = 'index2.html'; return; }
        if (t >= list.length) { location.href = 'index3.html'; return; }
        location.href = list[t].year + '.html';
    }

    var prevBtn = $('prevBtn'), nextBtn = $('nextBtn');
    if (prevBtn) {
        prevBtn.textContent = idx === 0 ? '回到故事' : '上一年';
        prevBtn.addEventListener('click', function () { go(-1); });
    }
    if (nextBtn) {
        nextBtn.textContent = idx === list.length - 1 ? '还有一件事' : '继续';
        nextBtn.addEventListener('click', function () { go(1); });
    }

    var sx = 0, sy = 0;
    document.addEventListener('touchstart', function (e) {
        sx = e.touches[0].clientX; sy = e.touches[0].clientY;
    }, { passive: true });
    document.addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].clientX - sx;
        var dy = e.changedTouches[0].clientY - sy;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6) go(dx < 0 ? 1 : -1);
    }, { passive: true });

    /* ---------- 入场动画 ---------- */
    requestAnimationFrame(function () {
        var els = document.querySelectorAll('.rise');
        for (var i = 0; i < els.length; i++) {
            (function (el, d) { setTimeout(function () { el.classList.add('in'); }, d); })(els[i], i * 120);
        }
    });

    /* ---------- 音乐续播 ---------- */
    try {
        if (sessionStorage.getItem('loveMusic') === '1') {
            var a = new Audio('./public/shangfen.mp3');
            a.loop = true;
            var pr = a.play();
            if (pr && pr.catch) pr.catch(function () { });
        }
    } catch (err) { }
})();

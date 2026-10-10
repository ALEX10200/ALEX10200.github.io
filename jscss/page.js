/* ============================================================
 *  公共交互：页面淡入淡出 + 背景音乐开关
 *  所有页面在 <head> 里最先引入，页面脚本可以直接用：
 *      loveGo('2021.html')     带淡出的跳转
 *      LoveMusic.play()        开始播放
 * ============================================================ */
(function () {
    var FADE = 300;      /* 与 love.css 里 html.page-leaving 的 .3s 保持一致 */
    var KEY = 'loveMusic';
    var leaving = false;

    /* ---------- 淡出后跳转 ---------- */
    function loveGo(url) {
        if (!url) return;
        if (leaving) return;
        leaving = true;
        document.documentElement.classList.add('page-leaving');
        setTimeout(function () { location.href = url; }, FADE);
    }
    window.loveGo = loveGo;

    /* 站内 <a> 链接也走同一套淡出 */
    document.addEventListener('click', function (e) {
        var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
        var href = a.getAttribute('href') || '';
        if (!/\.html($|[?#])/.test(href) || /^https?:/i.test(href)) return;
        e.preventDefault();
        loveGo(href);
    });

    /* ---------- 背景音乐 ---------- */
    var audio = null;
    var on = false;

    function readFlag() {
        try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; }
    }
    function writeFlag(v) {
        try { sessionStorage.setItem(KEY, v ? '1' : '0'); } catch (e) { }
    }
    function ensure() {
        if (!audio) {
            audio = new Audio('./public/shangfen.mp3');
            audio.loop = true;
        }
        return audio;
    }
    function play() {
        on = true; writeFlag(true); mark();
        var p = ensure().play();
        /* 自动播放被浏览器拦下时，只把按钮显示成「关」，不清掉标记，
           这样下一页还会再试一次，用户手动点一下也一定能播 */
        if (p && p.catch) p.catch(function () { on = false; mark(); });
    }
    function stop() {
        on = false; writeFlag(false); mark();
        if (audio) audio.pause();
    }
    function toggle() { if (on) { stop(); } else { play(); } }

    window.LoveMusic = {
        play: play,
        stop: stop,
        toggle: toggle,
        isOn: function () { return on; }
    };

    /* ---------- 右上角的音乐开关 ---------- */
    var btn = null;
    function mark() {
        if (!btn) return;
        if (on) { btn.classList.remove('is-off'); }
        else { btn.classList.add('is-off'); }
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        btn.setAttribute('aria-label', on ? '关闭背景音乐' : '播放背景音乐');
    }
    function mount() {
        btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'music-toggle';
        btn.innerHTML = '<span aria-hidden="true">♪</span>';
        btn.addEventListener('click', toggle);
        document.body.appendChild(btn);
        mark();
        /* 上一页开着，这一页接着放 */
        if (readFlag()) play();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount);
    } else {
        mount();
    }
})();
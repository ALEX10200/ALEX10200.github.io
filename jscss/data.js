/* ============================================================
 *  全站配置 —— 照片和文案都在这里改，改完刷新页面即可生效
 * ============================================================
 *
 *  1) 换照片：把照片放进 public/years/ 目录，命名规则
 *        2021-1.jpg  2021-2.jpg  2021-3.jpg ...
 *        2022-1.jpg  2022-2.jpg ...
 *     每年 3~5 张都可以，数组里写几个就显示几个。
 *
 *  2) 换文案：改 title(两个字短标题) 和 text(一段回忆)，
 *     以及 poem(一句短诗，显示在正文下面)。
 *     还可以给某张照片单独配一句话，把字符串写成对象：
 *        photos: [{ src: './public/years/2021-1.jpg', cap: '第一次一起吃饭' }]
 *
 *  3) 照片没放也不会出现破图，会自动显示该年份配色的占位块。
 * ============================================================ */

window.LOVE_CONFIG = {
    // 在一起的那天（不要改）
    anniversary: '2021-10-10',
    // 领结婚证的那天
    wedding: '2023-10-10',

    boy: '大原',
    girl: '薇薇',
    nickname: '薇薇',
    signature: 'DaYuan',

    years: [
        {
            year: 2021,
            title: '初识',
            text: '那一年我们刚认识，连说话都要想很久才敢发出去。' +
                  '后来发现，和你聊天的时间过得比什么都快。',
            effect: 'pulse',
            poem: '故事开始时，谁都没说破。',
            photos: [
                './public/years/2021-1.jpg',
                './public/years/2021-2.jpg',
                './public/years/2021-3.jpg',
                './public/years/2021-4.jpg'
            ]
        },
        {
            year: 2022,
            title: '相伴',
            text: '一起吃饭、一起赶路、一起把普通日子过成了习惯。' +
                  '原来所谓安心，就是知道你会在。',
            effect: 'bloom',
            poem: '把平常，过成了想回的地方。',
            photos: [
                './public/years/2022-1.jpg',
                './public/years/2022-2.jpg',
                './public/years/2022-3.jpg',
                './public/years/2022-4.jpg',
                './public/years/2022-5.jpg'
            ]
        },
        {
            year: 2023,
            title: '同行',
            text: '10 月 10 日，我们领证了。' +
                  '和在一起那天是同一个日子，像是早就写好的答案。',
            effect: 'wave',
            poem: '从此，两个名字写在一起。',
            photos: [
                './public/years/2023-1.jpg',
                './public/years/2023-2.jpg',
                './public/years/2023-3.jpg',
                './public/years/2023-4.jpg',
                './public/years/2023-5.jpg',
                './public/years/2023-6.jpg'
            ]
        },
        {
            year: 2024,
            title: '守候',
            text: '日子开始有了家的形状，吵吵闹闹也还是想快点回家。' +
                  '谢谢你把平凡的日子，都照顾得很好。',
            effect: 'leaf',
            poem: '灯亮着的地方，就是家。',
            photos: [
                './public/years/2024-1.jpg',
                './public/years/2024-2.jpg',
                './public/years/2024-3.jpg'
            ]
        },
        {
            year: 2025,
            title: '如初',
            text: '认识你越久，越喜欢你。' +
                  '那些细小的温柔，到现在还是会让我心动。',
            effect: 'halo',
            poem: '心动这件事，没有过期。',
            photos: [
                './public/years/2025-1.jpg',
                './public/years/2025-2.jpg',
                './public/years/2025-3.jpg',
                './public/years/2025-4.jpg'
            ]
        },
        {
            year: 2026,
            title: '我们',
            text: '第六年了，往后还有很多年。' +
                  '谢谢你，一直在我身边。',
            effect: 'dust',
            poem: '我们，还要很多年。',
            photos: [
                './public/years/2026-1.jpg',
                './public/years/2026-2.jpg',
                './public/years/2026-3.jpg'
            ]
        }
    ],

    /* 往后余生页（future.html）的文案，可自行修改 */
    future: {
        label: '往 后 余 生',
        title: '还有很多年',
        text: '六年，够我们把「我们」这两个字写得很好看。' +
              '往后的日子也许还是普通的一天又一天，但只要你还在旁边，我就觉得值得。',
        poem: '愿我们慢慢地、稳稳地，走很远。',
        seal: '大原'
    }
};

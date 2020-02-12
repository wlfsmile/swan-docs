/**
 * @file 客户端应用的增强
 * @author wulinfei
 */

const VueClipboard = require('vue-clipboard2');

export default ({Vue, router}) => {
    // 代码片段支持复制
    Vue.use(VueClipboard);

    // 支持平滑滚动
    router.options.scrollBehavior = (to, from, savedPosition) => {
        if (savedPosition) {
            return window.scrollTo({
                top: savedPosition.y,
                behavior: 'smooth'
            });
        }
        else if (to.hash) {
            const targetElement = document.querySelector(to.hash);
            if (targetElement) {
                return window.scrollTo({
                    top: getElementPosition(targetElement).y - 120,
                    behavior: 'smooth'
                });
            }
            return false;
        }
        else {
            return window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };
};

function getElementPosition(el) {
    const docEl = document.documentElement;
    const docRect = docEl.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    return {
        x: elRect.left - docRect.left,
        y: elRect.top - docRect.top
    };
}
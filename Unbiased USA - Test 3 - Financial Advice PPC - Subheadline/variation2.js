(function () {
    try {
        var debug = 1;
        var variation_name = "unbiased-usa-03-v1";
        function debounce(fn, delay = 100) {
            let t;
            return function () {
                clearTimeout(t);
                t = setTimeout(() => fn.apply(this, arguments), delay);
            };
        }
        function debounce(func, delay = 20) {
            let timeout;
            return function (...args) {
                const context = this;
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(context, args), delay);
            };
        }
        function observeSelector(selector, callback, options = {}) {
            const document = options.document || window.document;
            const lastValues = new Map();
            const watchAttr = options.attributeFilter || null;
            if (options.timeout || options.onTimeout) {
                throw `observeSelector options \`timeout\` and \`onTimeout\` are not yet implemented.`;
            }
            let obs;
            let isDone = false;
            const done = () => {
                if (obs) obs.disconnect();
                isDone = true;
            };
            const processElement = el => {
                const currentValue = watchAttr ? el.getAttribute(watchAttr) : true;
                if (lastValues.get(el) !== currentValue) {
                    lastValues.set(el, currentValue);
                    callback(el);
                    if (options.once) {
                        done();
                        return true;
                    }
                }
                return false;
            };
            const lookForSelector = () => {
                const elParent = document.documentElement;
                if (elParent.matches(selector) || elParent.querySelector(selector)) {
                    const elements = elParent.querySelectorAll(selector);
                    elements.forEach(el => processElement(el));
                }
            };
            const debouncedLookForSelector = debounce(() => {
                lookForSelector();
            }, 100);
            lookForSelector();
            if (!isDone) {
                obs = new MutationObserver(() => {
                    debouncedLookForSelector();
                });
                obs.observe(document, {
                    attributes: !!watchAttr,
                    attributeFilter: watchAttr ? [watchAttr] : undefined,
                    childList: true,
                    subtree: true,
                });
            }
            return done;
        }


        function init() {
            document.body.classList.add(variation_name)
            if (document.querySelector('[data-path$="email"] .v-window-item.v-window-item--active .app-text.step-title')?.textContent.trim().toLocaleLowerCase() == 'your information will only be shared with one advisor') {
                document.querySelector('[data-path$="email"] .v-window-item.v-window-item--active .app-text.step-title').textContent = 'Enter your email'
            }


        }
        if (!window.observerAddedT03USA) {
            window.observerAddedT03USA = true;
            observeSelector('[data-path$="email"] .v-window-item.v-window-item--active .app-text.step-title', function () {
                init();
            });
        }

    } catch (e) {
        console.log(e, "error in Test newslatter-form");
    }
})();
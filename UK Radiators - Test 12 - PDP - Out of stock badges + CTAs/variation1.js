// let SoldOut = button.add-to-cart[disabled="disabled"]
(function () {
  try {
    var debug = 0;
    var variation_name = "cre-t-12";

    function waitForElement(selector, trigger) {
      var interval = setInterval(function () {
        if (
          document &&
          document.querySelector(selector) &&
          document.querySelectorAll(selector).length > 0
        ) {
          clearInterval(interval);
          trigger();
        }
      }, 50);
      setTimeout(function () {
        clearInterval(interval);
      }, 15000);
    }

    function live(selector, event, callback, context = document) {
      const addEvent = (el, type, handler) => {
        el.addEventListener(type, handler);
      };

      const liveHandler = e => {
        const el = e.target && e.target.closest ? e.target.closest(selector) : null;

        if (el && el !== context) {
          callback.call(el, e);
        }
      };

      addEvent(context, event, liveHandler);
    }

    function getPreorderCopy() {
      let oosMessage = document.querySelector('.price__availability__wrapper .product-availability .stock-status-out-of-stock+ .oos-message');
      if (oosMessage) {
        return "Pre-order now (sold out)";
      }

      let estimatedDateEl = document.querySelector('.product_estimated_date span:first-of-type');
      let estimatedDateText = estimatedDateEl ? estimatedDateEl.textContent : "";
      let dateMatch = estimatedDateText.match(/\d+(?:st|nd|rd|th)\s+of\s+\w+/);
      if (!dateMatch) {
        return "Pre-order now (sold out)";
      }

      return "Pre-order now <span>(back in stock " + dateMatch[0] + ")</span>";
    }

    function addPreorderButton() {
      waitForElement('.mobileFlex:has(.pdp-add-to-cart)', function () {
        let atcWrapper = document.querySelector('.mobileFlex:has(.pdp-add-to-cart)');
        let preorderButton = `<button type="button" class="cre-t-12-preorder-btn">${getPreorderCopy()}</button>`;
        if (!document.querySelector('.cre-t-12-preorder-btn')) {
          atcWrapper.insertAdjacentHTML('beforebegin', preorderButton);
        }
      });
    }

    function eventHandler() {
      live('.cre-t-12-preorder-btn', 'click', function () {
        document.querySelector('.payment-buttons .add-to-cart').click();
      })
    }

    function init() {
      if (!document.querySelector('body').classList.contains(variation_name)) {
        document.querySelector('body').classList.add(variation_name)

        waitForElement('.price__availability__wrapper .product-availability .stock-status-out-of-stock', function () {
          let oosMessage = document.querySelector('.price__availability__wrapper .product-availability .stock-status-out-of-stock+ .oos-message');
          if (!oosMessage) {
            let targetelement = document.querySelector('.ukr__product__info  .product-single__meta .product-block > [data-product-lead-time]');
            let outOfStockButton = document.querySelector('.price__availability__wrapper .product-availability .stock-status-out-of-stock');
            if (targetelement && outOfStockButton) {
              targetelement.insertAdjacentElement('afterbegin', outOfStockButton)
            }
            document.querySelector('body').classList.add('cre-t-12-DeliveryDatePresent')
          } else {
            let targetelement = document.querySelector('.ukr__product__info  .product-single__meta .product-block > [data-product-lead-time]');
            let outOfStockButton = document.querySelector('.price__availability__wrapper .product-availability');
            if (targetelement && outOfStockButton) {
              targetelement.insertAdjacentElement('afterbegin', outOfStockButton);
            }
            document.querySelector('body').classList.add('cre-t-12-DeliveryDateNotPresent')
          }
        })

        addPreorderButton();

        eventHandler()
      }

    }

    /* Initialize variation */
    waitForElement(".stock-status-out-of-stock", init);

  } catch (e) {
    if (debug) console.log(e, "error in Test " + variation_name);
  }
})();
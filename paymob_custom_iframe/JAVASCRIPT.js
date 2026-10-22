// ==========================================================================
// TOOMAKT ATELIER · PAYMOB CUSTOM IFRAME JAVASCRIPT
// Handles field normalization, Card.js 3D rendering, auto-formatting & height sync
// ==========================================================================

function update_two_hidden_fields() {
    try {
        var mmyyVal = ($("#mmyy").val() || "").trim();
        var parts = mmyyVal.split("/");
        
        var mm = (parts[0] || "").replace(/\D/g, "");
        var yy = (parts[1] || "").replace(/\D/g, "");
        
        $("#mm").val(mm);
        $("#yy").val(yy);
        
        var cardNum = ($("#number").val() || "").replace(/\s+/g, "").replace(/\D/g, "");
        $("#card_number").val(cardNum);
    } catch (e) {
        console.warn("Paymob field update notice:", e);
    }
}

$(document).ready(function() {
    // 1. Initialize Interactive 3D Card Animation
    try {
        if (typeof Card !== "undefined") {
            new Card({
                form: document.querySelector("#paymob_checkout"),
                container: ".card-wrapper",
                formSelectors: {
                    numberInput: 'input[name="number"]',
                    expiryInput: 'input[name="expiry"]',
                    cvcInput: 'input[name="cvc"]',
                    nameInput: 'input[name="name"]'
                },
                formatting: true,
                placeholders: {
                    number: "•••• •••• •••• ••••",
                    name: "CARDHOLDER NAME",
                    expiry: "••/••",
                    cvc: "•••"
                }
            });
        }
    } catch (err) {
        console.warn("Card preview initialization notice:", err);
    }

    // 2. Real-time Input Listeners
    $("#number, #mmyy, input[name='cvc'], input[name='name']").on("input change blur", function() {
        update_two_hidden_fields();
    });

    // 3. Auto-format MM/YY with slash
    $("#mmyy").on("keyup", function(e) {
        if (e.key === "Backspace") return;
        var val = $(this).val().replace(/\D/g, "");
        if (val.length >= 2) {
            $(this).val(val.substring(0, 2) + " / " + val.substring(2, 4));
        }
        update_two_hidden_fields();
    });

    // 4. Form Submit State Polish
    $("#paymob_checkout").on("submit", function() {
        update_two_hidden_fields();
        var submitBtn = $("#submitButton");
        var waitBtn = $("#submitButtonWaiting");
        
        if (submitBtn.length && waitBtn.length) {
            submitBtn.hide();
            waitBtn.show();
        }
    });

    // 5. Post Message to Parent to Auto-Sync Iframe Height (Zero Scrollbars)
    function notifyParentResize() {
        try {
            var height = document.body.scrollHeight || document.documentElement.scrollHeight;
            if (window.parent && window.parent !== window) {
                window.parent.postMessage({
                    type: "paymob_iframe_resize",
                    height: height
                }, "*");
            }
        } catch (e) {}
    }

    window.addEventListener("resize", notifyParentResize);
    setTimeout(notifyParentResize, 300);
    setTimeout(notifyParentResize, 1000);
});

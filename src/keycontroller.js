// arrow + meta - arrow - meta = arrow...

(function () {

    var KEYSTART = "keystart",
        KEYEND = "keyend",
        KEYDOWN = "keydown",
        KEYUP = "keyup",

        evt = publisher.extend(),
        keys = null;

    function fire (e) {
        evt.fire(e.type == KEYDOWN ? KEYSTART : KEYEND, {
            keyCode: e.keyCode,
            keyCodes: keys.slice(0),
            metaKey: e.metaKey,
            altKey: e.altKey,
            shiftKey: e.shiftKey,
            ctrlKey: e.ctrlKey
        });
    }

    function keydown (e) {
        var kc = e.keyCode;
        if (keys.indexOf(kc) == -1) {
            keys.push(kc);
            fire(e);
        }
    }

    function keyup (e) {
        var kc = e.keyCode,
            idx = keys.indexOf(kc);

        if (idx > -1) {
            keys.splice(idx, 1);
            fire(e);
        }
    }

    rally.keycontroller = {
        on: function () {
            evt.on.apply(evt, arguments);

            if (!keys) {
                keys = [];
                document.addEventListener(KEYDOWN, keydown, false);
                document.addEventListener(KEYUP, keyup, false);
            }
        },
        off: function () {
            evt.off.apply(evt, arguments);

            var keystart = evt.listeners(KEYSTART),
                keyend = evt.listeners(KEYEND);

            if (keys & !keystart.length && !keyend.length) {
                
                keys = null;
                document.removeEventListener(KEYDOWN, keydown, false);
                document.removeEventListener(KEYUP, keyup, false);
            }
        }
    };

})();

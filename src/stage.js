/*global rally*/

/*requires rally.js*/
/*requires keycontroller.js*/

(function () {

    const FPS = 55;

    function Stage (el) {
        this.element = el;
        this.width = el.offsetWidth;
        this.height = el.offsetHeight;

        this.keys = [];
        this.children = [];
    }

    Stage.prototype = publisher.extend({
        children: null,
        element: null,
        width: null,
        height: null,
        keys: null,
        isActive: false,

        // Frame and key event handlers are proxies

        onframe: function (e) {
            this.fire("frame", {
                keys: this.keys.slice(0)
            });
        },
        onkey: function (e) {
            this.keys = e.keyCodes;
        },

        // Activation method and properties

        activate: function () {
            if (!this.isActive) {
                var kc = rally.keycontroller,
                    onkey = this.onkey,
                    isActive = true;

                kc.on("keystart", onkey, this);
                kc.on("keyend", onkey, this);

                timer.set(this.onframe, 1000 / FPS, this);

                this.isActive = isActive;
                this.fire("active", {
                    isActive: isActive
                });
            }
        },
        deactivate: function () {
            if (this.isActive) {
                var kc = rally.keycontroller,
                    onkey = this.onkey,
                    isActive = false;

                kc.off("keystart", onkey, this);
                kc.off("keyend", onkey, this);

                timer.clear(this.onframe, 1000 / FPS, this);

                this.isActive = isActive;
                this.fire("active", {
                    isActive: isActive
                });
            }
        },

        // Dimension

        size: function (w, h) {
            this.width = w;
            this.height = h;

//FIXME: Change width and height of stage

            this.fire("size", {
                width: w,
                height: h
            });
        },

        // Child management

        addChild: function (child, idx) {
            var el = this.element,
                children = this.children;

            children.splice(idx, 0, child);
            children.forEach(function (child) {
                el.insertBefore(child.canvas, el.firstElementChild);
            });
        }
    });

    rally.Stage = Stage;

})();

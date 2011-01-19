(function () {

    function Stage (desc) {
        var el = desc.element;

        this.element = el;
        this.width = desc.width;
        this.height = desc.height;
        this.fps = desc.fps;
        this.keys = [];

        // Reinforce scope for event handler usage. Silly JavaScript.

        var handlers = ["blur", "frame", "focus", "key"],
            len = handlers.length,
            handle;

        while ((handle = handlers[--len])) {
            this["on" + handle] = this["on" + handle].bind(this);
        }

        el.contentEditable = true;
        el.addEventListener("focus", this.onfocus, false); 
        el.addEventListener("blur", this.onblur, false);
    }
    
    Stage.prototype = publisher.extend({
        element: null,
        width: null,
        height: null,
        fps: null,
        keys: null,
        isActive: false,

        // Frame and key event handlers are proxies

        onframe: function (e) {
            this.fire("frame", {
                keys: this.keys.slice(0)
            });
        },
        onkey: function (e) {
            this.keys = e.keyCodes.slice(0);
        },

        // Activation event handlers

        onblur: function (e) {
            this.deactivate();
        },
        onfocus: function (e) {
            this.activate(); 
        },

        // Activation method and properties

        activate: function () {
            if (!this.isActive) {
                var kc = rally.keycontroller,
                    onkey = this.onkey;

                kc.on("keystart", onkey);
                kc.on("keyend", onkey);
                
                timer.set(this.onframe, 1000 / this.fps);
                
                this.isActive = true;

                this.fire("activate");
            }
        },
        deactivate: function () {
            if (this.isActive) {
                var kc = rally.keycontroller,
                    onkey = this.onkey;

                kc.off("keystart", onkey);
                kc.off("keyend", onkey);

                timer.clear(this.onframe, 1000 / this.fps);
               
                this.isActive = false;

                this.fire("deactivate");
            }
        },
        destroy: function () {
            var el = this.element;
            el.removeEventListener("focus", this.onfocus, false);
            el.removeEventListener("blur", this.onblur, false);
            this.deactivate();
        },

        // Dimension
        
        size: function (w, h) {
            this.width = w;
            this.height = h;

            this.fire("size", {
                width: w,
                height: h
            });
        },

        // Child management
        
        addActor: function (actor) {
            this.element.appendChild(actor.canvas);
        }
    });

    rally.Stage = Stage;

})();

(function () {

    function Stage (desc) {
        var el = desc.element;

        this.element = el;
        this.width = desc.width;
        this.height = desc.height;
        this.fps = desc.fps;
        this.keys = [];
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
                
                timer.set(this.onframe, 1000 / this.fps, this);
                
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

                timer.clear(this.onframe, 1000 / this.fps, this);
               
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

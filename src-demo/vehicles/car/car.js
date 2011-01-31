(function (global) {

    const BOUNDS_SRC = "vehicles/car/bounds.png";
    const VISIBLE_SRC = "vehicles/car/visible.png";

    function Car (w, h) {
        rally.Vehicle.apply(this, arguments);
    }

    Car.prototype = lang.merge(rally.Vehicle.prototype, {
        accel: 1,
        decel: 1,
        handling: 2.5,
        braking: 1,
        mfs: 1,
        mrs: 1,
        init: function () {
    
            var expected = 2,
                actual = 0,
                self = this,
                onload = function () {
                    if (++actual === expected) {
                        self.fire("init");
                        self = null;
                    }
                };

            rally.loadImg(VISIBLE_SRC, function (img) {
                this.img = img;
                this.regX = img.width / 2;
                this.regY = img.height * 0.35;
                onload();
            }, this);

            rally.loadImg(BOUNDS_SRC, function (img) {
                // create canvas same size as img
                // draw image at 0, 0
                // getImagedata for entire canvas
                // delete canvas
                /*
                var c = document.createElement("canvas"),
                    ctx = c.getContext("2d"),
                    opaque;

                ctx.drawImage(img, 0, 0);

                this.bounds = rally.getOpaque(ctx);
                */
                onload();
            }, this);

       }
    });

    if (!global.vehicles) {
        global.vehicles = {};
    }

    vehicles.Car = Car;

})(this);

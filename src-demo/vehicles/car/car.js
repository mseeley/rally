(function (global) {

    var _round = rally.math.round;

    const BOUNDS_SRC = "vehicles/car/bounds.png",
          HIT_POINTS_SRC = "vehicles/car/hitpoints.png",
          VISIBLE_SRC = "vehicles/car/visible.png";

    function Car (w, h) {
        rally.Vehicle.apply(this, arguments);
    }

    Car.prototype = lang.merge(rally.Vehicle.prototype, {
        init: function () {
            var assets = [
                    {
                        src: VISIBLE_SRC,
                        success: function (img) {
                            this.setImage(img);
                            this.regX = _round(img.width / 2);
                            this.regY = _round(img.height * 0.45);
                        }
                    }, {
                        src: BOUNDS_SRC,
                        success: this.setBounds
                    }, {
                        src: HIT_POINTS_SRC,
                        success: this.setHitPoints
                    }
                ];

            this.load(assets, function () {
                this.fire("init");
            });
        }
    });

    if (!global.vehicles) {
        global.vehicles = {};
    }

    vehicles.Car = Car;

})(this);

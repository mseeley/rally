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
//FIXME: This loading procession will be duplicated in all subclasses; move?
//FIXME: Same code as Base.init
//FIXME: Refactor. Too much .call, too much code
            var ready = 0,
                assets = [
                    {
                        src: VISIBLE_SRC,
                        fn: function (img) {
                            this.setImage(img);
                            this.regX = _round(img.width / 2);
                            this.regY = _round(img.height * 0.35);
                        }
                    }, {
                        src: BOUNDS_SRC,
                        fn: this.setBounds
                    }, {
                        src: HIT_POINTS_SRC,
                        fn: this.setHitPoints
                    }
                ];

            assets.forEach(function (asset) {
                var self = this;
                this.load(asset.src, function (img) {
                    asset.fn.call(this, img);
                    if (++ready == assets.length) {
                        this.fire("init");
                    }
                }, this);
            }, this);

        }
    });

    if (!global.vehicles) {
        global.vehicles = {};
    }

    vehicles.Car = Car;

})(this);

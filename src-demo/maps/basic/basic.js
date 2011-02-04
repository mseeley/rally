(function (global) {

    const BOUNDS_SRC = "maps/basic/bounds.png";
    const VISIBLE_SRC = "maps/basic/visible.png";

    function Basic (w, h) {
        rally.Actor.apply(this, arguments);
    }

    Basic.prototype = lang.merge(rally.Map.prototype, {
        init: function () {
            var assets = [{
                    src: VISIBLE_SRC,
                    success: this.setImage
                }, {
                    src: BOUNDS_SRC,
                    success: this.setBounds
                }];

            this.load(assets, function () {
                this.fire("init");
            }, this);
        }
    });


    if (!global.maps) {
        global.maps = {};
    }

    maps.Basic = Basic;

})(this);

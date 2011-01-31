(function (global) {

    const BOUNDS_SRC = "maps/basic/bounds.png";
    const VISIBLE_SRC = "maps/basic/visible.png";

    function Basic (w, h) {
        rally.Actor.apply(this, arguments);
    }

    Basic.prototype = lang.merge(rally.Map.prototype, {
        init: function () {
            var ready = 0,
                assets = [{
                    src: VISIBLE_SRC,
                    fn: this.setImage
                }, {
                    src: BOUNDS_SRC,
                    fn: this.setBounds
                }];

            assets.forEach(function (asset) {
                this.load(asset.src, function (img) {
                    asset.fn.call(this, img);
                    if (++ready == assets.length) {
                        this.fire("init");
                    }
                }, this);
            }, this);
        }
    });


    if (!global.maps) {
        global.maps = {};
    }

    maps.Basic = Basic;

})(this);

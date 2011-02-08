/*global rally*/

/*requires rally.js*/
/*requires debug.js*/
/*requires math.js*/
/*requires point.js*/

(function () {

    var _canvas = document.createElement("canvas"),
        _radians = rally.math.radians,
        _transformAll = rally.point.transformAll,
        _debug = rally.debug;

    function Actor (w, h) {
        var cvs = _canvas.cloneNode(false);
        cvs.width = w;
        cvs.height = h;

        this.canvas = cvs;
        this.context = cvs.getContext("2d");
    }

    Actor.prototype = publisher.extend({
        canvas: null,
        context: null,
        img: null,
        bounds: null,
        _bounds: null,

        // Dimension propertiecs

        h: 0,
        w: 0,
        x: 0,
        y: 0,
        regX: 0,
        regY: 0,
        r: 0,

        // Dimension shadow properties, used for clearing dirty frame regions

        _x: null,
        _y: null,
        _r: null,

        //
        // Abstract methods
        //

        init: function () {},
        onframe: function (e) {},
        onresize: function (e) {},

        //
        // Generic methods
        //

        load: function (assets, callback) {
            // UNTESTED
            var actual = 0,
                expected = assets.length,
                scope = this;

            assets.forEach(function (asset) {
                var img = document.createElement("img");

                img.onload = function () {
                    asset.success.call(scope, img);
                    if (++actual == expected) {
                        callback.call(scope);
                    }
                    img = null;
                };

                img.src = asset.src;
            }, scope);
        },

        setImage: function (img) {
            this.img = img;
            this.w = img.width;
            this.h = img.height;
        },

        setBounds: function (img) {

            var opaque = rally.point.opaque;

            // Not a typo, need two duplicate representations of the points.
            // this.bounds will be transformed over time while this._bounds is
            // pristine and untouched.

            this.bounds = opaque(img);
            this._bounds = opaque(img);
        },

        checkBounds: function (points) {
            // UNTESTED
            var hash = this.bounds.hash,
                hit = false,
                x,
                y;

            for (var i = 0; i < points.length; i++) {

                // Fuzzy hit detection; rounds the float coordinates to increase
                // the likely hood of getting a hit.

                x = Math.round(points[i][0]);
                y = Math.round(points[i][1]);

                if (x in hash && y in hash[x]) {
                    hit = true;
                    break;
                }
            }

            return hit;
        },

        update: function () {
            var ctx = this.context,
                pos = this.position,
                img = this.img,
                r = this.r,
                x = this.x,
                y = this.y,

                // Registration points are inverted for all update() operations

                rx = this.regX,
                ry = this.regY;

            // Clearing operations assume assume regX, regY, and img are static

            if (this._x !== null) {
                /* debug */
                if (_debug.show.axes) {
                    // Clearing entire canvas; easier when debugging
                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                } else {
                /* /debug */
                    // Or, clear only the dirty frame data for performance
                    ctx.save();
                    ctx.translate(this._x, this._y);
                    ctx.rotate(_radians(r));
                    ctx.clearRect(-rx * 2, -ry * 2, img.width * 2, img.height * 2);
                    ctx.restore();
                /* debug */
                }
                /* /debug */
            }

            // Cache position and rotation for clearing dirty frame region.

            this._x = x;
            this._y = y;
            this._r = r;

            this.bounds = _transformAll(
                this._bounds.points,
                r,
                [x, y],
                [rx, ry]
            );

            // Draw the new frame

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(_radians(r));

            // Registration points are faked by drawing the image the inverse
            // of the reg points.

            /* debug */
            if (_debug.show.visible) {
            /* /debug */
            if (img) {
                ctx.drawImage(img, -rx, -ry);
            }
            /* debug */
            }
            /* /debug */

            ctx.restore();

            /* debug */
            if (_debug.show.bounds) {
                _debug.points(ctx, this.bounds.points, "#ccc");
            }
            /* /debug */

            /* debug */
            if (_debug.show.origin || _debug.show.axes) {
                // origin and axes need to be drawn after bounds
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(_radians(r));

                if (_debug.show.origin) {
                    _debug.origin(ctx);
                }

                if (_debug.show.axes) {
                    _debug.axes(ctx);
                }
                ctx.restore();
            }
            /* /debug */
        }
    });

    rally.Actor = Actor;

})();

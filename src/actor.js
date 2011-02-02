(function () {

    var _canvas = document.createElement("canvas"),
        _radians = rally.math.radians,
        _transformAll = rally.point.transformAll;

    function _updateBounds (inst) {
        // FIXME: Inline this method,  it's just one call ;)
        //transformAll: function (pts, angle, translate, origin) {
        var transformed = _transformAll(
            inst._bounds.points,
            inst.r,
            [inst.x, inst.y],
            [inst.regX, inst.regY]
        );

        //console.log(inst._bounds.points);
        //console.log(transformed.points)

        //debug.points(inst.context, transformed.points);

        inst.bounds = transformed;
    }

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
        hitPoints: null,
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

        load: function (src, callback, scope) {
            var img = document.createElement("img");

            img.onload = function () {
                callback.call(scope, this);
                img = null;
            };

            img.src = src;
        },

        setImage: function (img) {
            this.img = img;
            this.w = img.width;
            this.h = img.height;
        },

        setBounds: function (img) {

            // Not a typo, need two duplicate representations of the points.
            // this.bounds will be transformed over time while this._bounds is
            // pristine and untouched.

            // FIXME: Calling opaque twice, cannot have references shared?

            this.bounds = rally.point.opaque(img);
            this._bounds = rally.point.opaque(img);
        },

        checkBounds: function (points) {
            var hash = this.bounds.hash,
                hit = false,
                x,
                y;

            for (var i = 0; i < points.length; i++) {
                x = points[i][0];
                y = points[i][1];

                //FIXME: Move elsewhere if necessary
                x = Math.round(x);
                y = Math.round(y);

                if (x in hash && y in hash[x]) {
                    //console.log("hit on at", x, y);
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

            if (!img) {
                return;
            }

            //console.log(
            //    "update()",
            //    "rotation", this.r,
            //    "x", this.x,
            //    "y", this.y
            //);

            // Clearing operations assume assume regX, regY, and img are static

            if (this._x !== null) {

                // Clearing entire canvas; easier when debugging

                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                // Or, clear only the dirty frame data for performance

                //ctx.save();
                //ctx.translate(this._x, this._y);
                //ctx.rotate(_radians(r));
                //ctx.clearRect(-rx * 1.5, -ry * 1.5, img.width * 1.5, img.height * 1.5);
                //ctx.restore();
            }

            // Cache position and rotation for clearing dirty frame region.

            this._x = x;
            this._y = y;
            this._r = r;

            // Draw the new frame

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(_radians(r));

            // Registration points are faked by drawing the image the inverse
            // of the reg points.

            ctx.drawImage(img, -rx, -ry);
            ctx.restore();

            _updateBounds(this);

        }
    });

    rally.Actor = Actor;

})();

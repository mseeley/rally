(function () {

    const CANVAS = document.createElement("canvas"),
          PI_RADIANS = Math.PI / 180,
          PRECISION = rally.point.PRECISION,
          ROUND = Math.round;

    function Actor (w, h) {
        var canvas = CANVAS.cloneNode(false);
        canvas.width = w;
        canvas.height = h;

        this.canvas = canvas;
        this.context = canvas.getContext("2d");
    }

    Actor.prototype = publisher.extend({
        canvas: null,
        context: null,
        hitPoints: null,
        img: null,
 
        // Dimension propertiecs

        //height: 0,
        //width: 0,
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
            this.w = img.w;
            this.h = img.h;
        },

        setBounds: function (img) {
            // parse data
            // save it
            // done
        },

        update: function () {
            var ctx = this.context,
                pos = this.position,
                img = this.img,
                r = ROUND((this.r * PI_RADIANS) * PRECISION) / PRECISION,
                x = this.x,
                y = this.y,

                // Registration points are inverted for all update() operations

                rx = this.regX,
                ry = this.regY;
            
            if (!img) {
                return;
            }

            // Clearing operations assume assume regX, regY, and img are static

            if (this._x !== null) {

                // Clearing entire canvas is easier when debugging

                //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                // Clear only the dirty frame data for performance

                ctx.save();
                ctx.translate(this._x, this._y);
                ctx.rotate(this._r);
                ctx.clearRect(-rx * 1.5, -ry * 1.5, img.width * 1.5, img.height * 1.5);
                ctx.restore();
            }

            // Draw the new frame

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(r);

            // Registration points are faked by drawing the image the inverse 
            // of the reg points.

            ctx.drawImage(img, -rx, -ry);
    
            // Restore to natural origin as getOpaque doesn't have knowledge
            // of the current origin.

            ctx.restore();

            // Get opaque returns pixels in world coordinates, yay - no localToGlobal
            
            //var pixelData = rally.getOpaque(ctx);            
            //debug.points(ctx, this.bounds.points);

            // Cache position and rotation for clearing dirty frame region.
            
            this._x = x;
            this._y = y;
            this._r = r;
        }
    });

    rally.Actor = Actor;

})();

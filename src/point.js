(function () {

    var _math = Math,
        _floor = _math.floor,
        _sin = _math.sin,
        _cos = _math.cos,
        _sqrt = _math.sqrt,
        _round = rally.math.round,
        _canvas;

    const PI_RADIANS = _math.PI / 180;

    function getImageData (img) {
        if (!_canvas) {
            _canvas = document.createElement("canvas");
        }
        
        var w = img.width,
            h = img.height,
            ctx = _canvas.getContext("2d");

        _canvas.width = w;
        _canvas.height = h;
        ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0, 0, w, h);
    }

    var point = {

        // UNUSED
        //toIndex: function (pt, w) {
        //    return (pt[0] + (pt[1] * w)) * 4;
        //},

        fromIndex: function (idx, w) {
            idx /= 4;
            return [
                _floor(idx % w),
                _floor(idx / w)
            ];
        },

        // UNUSED
        //distance: function (pt1, pt2) {
        //
        //    var dx = pt1[0] - pt2[0],
        //        dy = pt1[1] - pt2[1],
        //        d = _sqrt(dx * dx + dy * dy);
        //
        //    return _round(d);
        //},

        rotate: function (pt, angle, origin) {
            angle *= PI_RADIANS;

            var cos = _cos(angle),
                sin = _sin(angle),
                originX = origin ? origin[0] : 0,
                originY = origin ? origin[1] : 0,
                deltaX = pt[0] - originX,
                deltaY = pt[1] - originY,
                x = deltaX * cos - deltaY * sin + originX,
                y = deltaX * sin + deltaY * cos + originY;

            return [
                _round(x), _round(y)
            ];
        },

        velocity: function (angle, speed) {
            angle *= PI_RADIANS;

            var vx = _sin(angle) * speed,
                vy = -(_cos(angle) * speed);

            return [
                _round(vx), _round(vy)
            ];
        },

        /**
         * @param angle Number in degrees
         */
        transformAll: function (pts, angle, translate, origin) {
            var points = [],
                hash = {},
                i = 0,
                len = pts.length,
                x = translate[0],
                y = translate[1],
                tx = x - origin[0],
                ty = y - origin[1],
                x1,
                y1,
                pt;

            // NOTE: This builds a bounds object just like opaque()

            for (i; i < len; i++) {
                x1 = pts[i][0] + tx;
                y1 = pts[i][1] + ty;
                pt = point.rotate([x1, y1], angle, [x, y]);

                points[i] = pt;
                x1 = Math.round(pt[0]);
                y1 = Math.round(pt[1]);

                if (hash[x1] == null) {
                    hash[x1] = {};
                }

                hash[x1][y1] = 1;
            }

            return {
                points: points,
                hash: hash
            };
        },

        // Returns an object of pixel information

        opaque: function (img) {
            var fromIndex = point.fromIndex,
                pixels = getImageData(img).data,
                len = pixels.length,
                w = img.width,
                points = [],
                hash = {},
                i = 3,
                pt,
                x,
                y;

            // NOTE This builds a bounds object just like transformAll()

            for (i; i <= len; i+=4) {
                if (pixels[i] > 0) {
                    pt = fromIndex(i, w);

                    points[points.length] = pt;
                    x = Math.round(pt[0]);
                    y = Math.round(pt[1]);

                    if (hash[x] == null) {
                        hash[x] = {};
                    }

                    hash[x][y] = 1;
                }
            }

            return {
                points: points,
                hash: hash
            };

        }

    };


    rally.point = point;


})();

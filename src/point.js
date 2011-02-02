(function () {

    var _math = Math,
        _floor = _math.floor,
        _sin = _math.sin,
        _cos = _math.cos,
        _sqrt = _math.sqrt,
        _round = rally.math.round,
        _canvas = document.createElement("canvas");

    const PI_RADIANS = _math.PI / 180;

    var point = {

        toIndex: function (pt, w) {
            return (pt[0] + (pt[1] * w)) * 4;
        },

        fromIndex: function (idx, w) {
            idx /= 4;
            return [
                _floor(idx % w),
                _floor(idx / w)
            ];
        },

        distance: function (pt1, pt2) {
            var dx = pt1[0] - pt2[0],
                dy = pt1[1] - pt2[1],
                d = _sqrt(dx * dx + dy * dy);

            return _round(d);
        },

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

        transformAll: function (pts, angle, translate, origin) {
            //console.log(
            //    "transformAll()",
            //    "angle", angle,
            //    "translate", translate,
            //    "origin", origin
            //);

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

            for (i; i < len; i++) {
                x1 = pts[i][0] + tx;
                y1 = pts[i][1] + ty;
                pt = point.rotate([x1, y1], angle, [x, y]);
                points[i] = pt;

// FIXME: Similar code to opaque() although opaque() traverses imageData
// FIXME: Hash keys must always be real numbers

                x1 = Math.round(x1);
                y1 = Math.round(y1);

                if (hash[x1] == null) {
                    hash[x1] = {};
                }

                hash[x1][y1] = 1;
            }

//FIXME: tranformToHash, transformToPoints
//FIXME: Make opaqueAsHash, opaqueAsPoints
//FIXME: points is used for collision
//FIXME: hash is used for bounds values

            return {
                points: points,
                hash: hash
            };
        },

        velocity: function (angle, speed) {
            angle *= PI_RADIANS;

            var vx = _sin(angle) * speed,
                vy = -(_cos(angle) * speed);

            return [
                _round(vx), _round(vy)
            ];
        },

        // Returns an object of pixel information

        opaque: function (img) {

            var w = img.width,
                h = img.height,
                ctx = _canvas.getContext("2d");

            _canvas.width = w;
            _canvas.height = h;
            ctx.drawImage(img, 0, 0);

            var fromIndex = point.fromIndex,
                pixels = ctx.getImageData(0, 0, w, h).data,
                len = pixels.length,
                points = [],
                hash = {},
                i = 3,
                pt,
                x,
                y;

            for (i; i <= len; i+=4) {
                if (pixels[i] > 0) {
                    pt = fromIndex(i, w);

                    points[points.length] = pt;
                    x = pt[0];
                    y = pt[1];

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

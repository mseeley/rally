(function () {

    const M = Math,
          FLOOR = M.floor,
          PI_RADIANS = M.PI / 180,
          ROUND = M.round,
          SIN = M.sin,
          COS = M.cos,
          // All floats rounded to the nearest thousandth
          PRECISION = 1000,
          // 1e-9 == 0.00001
          EPSILON = 1e-5;

    // From http://floating-point-gui.de
    function nearlyEqual (a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        var diff = Math.abs(a - b);
        return (a || b) ? diff / (a + b) < EPSILON : diff < (EPSILON * EPSILON);
    }

    rally.point = {

        PRECISION: PRECISION,

        EPSILON: EPSILON,

        toIndex: function (pt, w) {
            return (pt[0] + (pt[1] * w)) * 4;
        },

        fromIndex: function (idx, w) {
            idx /= 4;
            return [
                FLOOR(idx % w),
                FLOOR(idx / w) 
            ];
        },

        distance: function (pt1, pt2) {
            var dx = pt1[0] - pt2[0],
                dy = pt1[1] - pt2[1],
                d = M.sqrt(dx * dx + dy * dy);

            return ROUND(d * PRECISION) / PRECISION;
        },

        rotate: function (pt, angle, origin) {
            angle *= PI_RADIANS;

            var cos = COS(angle),
                sin = SIN(angle),
                originX = origin ? origin[0] : 0,
                originY = origin ? origin[1] : 0,
                deltaX = pt[0] - originX,
                deltaY = pt[1] - originY,
                x = deltaX * cos - deltaY * sin + originX,
                y = deltaX * sin + deltaY * cos + originY;

            return [
                ROUND(x * PRECISION) / PRECISION,
                ROUND(y * PRECISION) / PRECISION
            ];
        },

        transform: function (pt, delta, angle, origin) {
        },

        velocity: function (angle, speed) {
            angle *= PI_RADIANS;

            var vx = SIN(angle) * speed,
                vy = -(COS(angle) * speed);

            return [
                ROUND(vx * PRECISION) / PRECISION,
                ROUND(vy * PRECISION) / PRECISION
            ];
        },

        nearlyEqual: function (pt1, pt2) {
            // UNTESTED
            return nearlyEqual(pt1[0], pt2[0]) && nearlyEqual(pt1[1], pt2[1]);
        }
    };

})();

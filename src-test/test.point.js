(function () {

    // Changing canvas dimensions will invalidate the fixture data. Dimensions
    // should not be multiples.

    const CANVAS_HEIGHT = 7,
          CANVAS_WIDTH = 11;

    var point = rally.point,
        data = [
            // registration point
            [0, 0, 0],
            // min and max X values
            [1, 0, 4],
            [7, 0, 28],
            // min and max Y values
            [0, 1, 44],
            [0, 11, 484],
            // interior points
            [3, 4, 188],
            [4, 3, 148]
        ];

    kaze.tests({

        "point: distance": function () {
            var p1 = [0,0],
                p2 = [1,1],
                dx = p1[0] - p2[0],
                dy = p1[1] - p2[1],
                d = Math.sqrt(dx * dx + dy * dy),
                expected = Math.round(d * point.PRECISION) / point.PRECISION;

            return expected == point.distance(p1, p2);
        },

        "point: fromIndex": function () {
            var i = 0,
                len = data.length,
                x,
                y,
                idx,
                pt;

            for (i; i < len; i++) {
                x = data[i][0];
                y = data[i][1];
                idx = data[i][2];
                pt = point.fromIndex(idx, CANVAS_WIDTH);

                if (pt[0] !== x || pt[1] !== y) {
                    return false;
                }
            }

            return true;
        },

        "point: toIndex": function () {
            var i = 0,
                len = data.length,
                x,
                y,
                idx;

            for (i; i < len; i++) {
                x = data[i][0];
                y = data[i][1];
                idx = data[i][2];
                
                if (point.toIndex([x, y], CANVAS_WIDTH) !== idx) {
                    return false;
                }
            }

            return true;
        },

        "point: rotate": function () {
            var parts = [
                    {x:1, y:1, r:30, ex:0.366, ey:1.366},
                    {x:3, y:7, r:13, ex:1.348, ey:7.495},
                    {x:1, y:0, r:90, ex:0, ey:1},
                    {x:0, y:1, r:90, ex:-1, ey:0}
                ],
                len = parts.length,
                i = 0,
                pass = true;

            for (i; i < len; i++) {
                var p = parts[i],
                    actual = point.rotate([p.x, p.y], p.r),
                    px = actual[0],
                    py = actual[1];

                if (px != p.ex || py != p.ey) {
                    pass = false;
                }
            }

            return pass;

        },
        "point: rotate with origin": function () {
            // I love you wolframalpha.
            var parts = [
                {x:1, y:1, r:30, cx:0, cy:1, ex:0.866, ey:1.5},
                {x:3, y:7, r:13, cx:5, cy:3, ex:2.151, ey:6.448},
                {x:1, y:0, r:90, cx:3, cy:1, ex:4, ey:-1},
                {x:0, y:1, r:90, cx:4, cy:1, ex:4, ey:-3}
                ],
                len = parts.length,
                i = 0,
                pass = true;
            
            for (i; i < len; i++) {
                var p = parts[i],
                    actual = point.rotate([p.x, p.y], p.r, [p.cx, p.cy]),
                    px = actual[0],
                    py = actual[1];

                if (px != p.ex || py != p.ey) {
                   pass = false;
                }
            }

            return pass;
        }
    });

})();

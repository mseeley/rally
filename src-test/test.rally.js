(function () {

    // Changing canvas dimensions will invalidate the fixture data. Dimensions
    // should not be multiples.

    const CANVAS_HEIGHT = 7,
          CANVAS_WIDTH = 11;

    var data = [
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
        "rally:indexToPoint X": function (del) {
            var i = 0,
                len = data.length,
                x,
                idx,
                point;

            for (i; i < len; i++) {
                x = data[i][0];
                idx = data[i][2];
                point = rally.indexToPoint(idx, CANVAS_WIDTH);

                if (point[0] !== x) {
                    return false;
                }
            }

            return true;
        },
        "rally:indexToPoint Y": function (del) {
            var i = 0,
                len = data.length,
                y,
                idx,
                point;

            for (i; i < len; i++) {
                y = data[i][1];
                idx = data[i][2];
                point = rally.indexToPoint(idx, CANVAS_WIDTH);

                if (point[1] !== y) {
                    return false;
                }
            }

            return true;
        },
         "rally:pointToIndex": function (del) {
            var i = 0,
                len = data.length,
                x,
                y,
                idx;

            for (i; i < len; i++) {
                x = data[i][0];
                y = data[i][1];
                idx = data[i][2];
                
                if (rally.pointToIndex(x, y, CANVAS_WIDTH) !== idx) {
                    return false;
                }
            }

            return true;
        }
    });

})();

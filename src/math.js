(function () {

    var _math = Math,
        _max = _math.max,
        _min = _math.min,
        _round = _math.round;

    const PI_RADIANS = _math.PI / 180,
          EPSILON = 0.05,
          PRECISION = 1000;

    rally.math = {
        EPSILON: EPSILON,
        PRECISION: PRECISION,
        PI_RADIANS: PI_RADIANS,
        equal: function (n1, n2) {
            // UNTESTED
            return _max(n1, n2) - _min(n1, n2) < EPSILON;
        },
        radians: function (angle) {
            // UNTESTED
            return _round((angle * PI_RADIANS) * PRECISION) / PRECISION;
        },
        round: function (n) {
            // UNTESTED
            return _round(n * PRECISION) / PRECISION;
        }
    };

})();

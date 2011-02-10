/*global rally*/

/*requires rally.js*/
/*requires actor.js*/
/*requires point.js*/
/*requires math.js*/
/*requires debug.js*/

(function () {

    var _transformAll = rally.point.transformAll,
        _velocity = rally.point.velocity,
        _round = rally.math.round,
        _equal = rally.math.equal,
        _debug = rally.debug;

    const UP = "up",
          DOWN = "down",
          LEFT = "left",
          RIGHT = "right";

    function Vehicle (w, h) {
        rally.Actor.apply(this, arguments);
        this.keys = {};
        this.hitTargets = [];
    }

    Vehicle.prototype = lang.merge(rally.Actor.prototype, {

        accel: 1,
        decel: 0.975,
        handling: 9,
        bounce: .6,

        mfs: 10,
        mrs: 5,

        // Frame values for motion properties

        speed: 0,
        framesStill: 0,

        // Object holding keycodes by direction name.

        keys: null,

        hitTargets: null,
        hitPoints: null,
        _hitPoints: null,

        setKeys: function (desc) {
            var k = this.keys,
                expected = [UP, DOWN, LEFT, RIGHT],
                len = expected.length,
                current;

            while ((current = expected[--len])) {
                if (current in desc) {
                    k[current] = desc[current];
                }
            }
        },

        setHitPoints: function (img) {
            var opaque = rally.point.opaque;

            this.hitpoints = opaque(img);
            this._hitpoints = opaque(img);
        },

        addHitTarget: function (actor) {
            this.hitTargets.push(actor);
        },

        hitTest: function (pt, r) {

            var points = _transformAll(
                    this._hitpoints.points,
                    r,
                    [pt[0], pt[1]],
                    [this.regX, this.regY]
                ),
                hit = false,
                targets = this.hitTargets,
                count = targets.length;

            while (count--) {
                if (targets[count].checkBounds(points.points)) {
                    hit = true;
                    break;
                }
            }

            this.hitpoints = points;

            return hit;
        },

        // determines new x and y based on relative rotation and magnitude
        transform: function (direction, speed) {
            var r = (direction) ? _round((this.r + direction) % 360) : this.r,
                v = _velocity(r, speed),
                x = _round(this.x - v[0]),
                y = _round(this.y - v[1]);

            if (this.hitTest([x, y], r)) {
                this.transform(direction /= 2, _equal(speed, 0) ? 0 : -speed * this.bounce);
            } else {
                this.speed = _round(speed);
                this.x = x;
                this.y = y;
                this.r = r;

                this.update();

                /* debug */
                if (_debug.show.hitpoints) {
                    _debug.points(this.context, this.hitpoints.points)
                }
                /* /debug */
            }
        },

        onframe: function (e) {
            var handling = this.handling,
                eventKeys = e.keys,
                speed = this.speed,
                keys = this.keys,
                accel = this.accel,
                mfs = this.mfs,
                mrs = this.mrs,
                direction = 0;

            if (eventKeys.indexOf(keys[LEFT]) > -1) {
                direction = -handling;
            } else if (eventKeys.indexOf(keys[RIGHT]) > -1) {
                direction = handling;
            }

            if (eventKeys.indexOf(keys[DOWN]) > -1) {
                speed += accel;
                if (speed > mrs) {
                    speed = mrs;
                }
            } else if (eventKeys.indexOf(keys[UP]) > -1) {
                speed -= accel;
                if (speed < -mfs) {
                    speed = -mfs;
                }
            } else if (speed) {
                speed *= this.decel;
            }

            // Return if the direction or speed hasn't updated in N frames

            if (_equal(direction, 0) && _equal(speed, 0)) {
                if (this.framesStill++ > 1) {
                    return;
                }
            } else {
                this.framesStill = 0;
            }

            // Otherwise, perform the transform

            this.transform(direction, speed);
        },

        toString: function () {
            return "Vehicle";
        }
    });

    rally.Vehicle = Vehicle;

})();

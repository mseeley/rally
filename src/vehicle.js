(function () {

    var _transformAll = rally.point.transformAll,
        _velocity = rally.point.velocity,
        _round = rally.math.round,
        _equal = rally.math.equal;

    const UP = "up",
          DOWN = "down",
          LEFT = "left",
          RIGHT = "right";

    function Vehicle (w, h) {
        rally.Actor.apply(this, arguments);
        this.keys = {};
        this.collisionTargets = [];
    }

    // Allow motion valus to be altered by host environment

    lang.mix({
        ACCELERATION: 1,
        DECELERATION: 1,
        BRAKING: 1,
        HANDLING: 5,
        MAX_FORWARD_SPEED: 1,
        MAX_REVERSE_SPEED: .5
    }, Vehicle);

    Vehicle.prototype = lang.merge(rally.Actor.prototype, {

        // All vehicles move using the motion value constants. Sub-classes or
        // instances can modify these values for unique motion behavior.

        accel: 1,
        decel: 1,
        handling: 1,
        braking: 1,
        mfs: 1,
        mrs: 1,

        // Frame values for motion properties

        //vx: 0,
        //vy: 0,
        speed: 0,

        // Object holding keycodes by direction name.

        keys: null,

        collisionTargets: null,

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

        setCollision: function (img) {

//FIXME: Same code as setBounds. Refactor?

            this.collision = rally.point.opaque(img);

        },

        addCollisionTarget: function (actor) {
            this.collisionTargets.push(actor);
        },

        collisionTest: function (pt, r) {

            var points = _transformAll(
                this.collision.points,
                r,
                [pt[0], pt[1]],
                [this.regX, this.regY]
            );

            var hit = false,
                targets = this.collisionTargets,
                count = targets.length;

            while (count--) {
                if (targets[count].checkBounds(points.points)) {
                    hit = true;
                    break;
                }
            }

            debug.points(this.context, points.points)

            return hit;

        },

        // ~vector transformation
        // determines new x and y based on relative rotation and magnitude vector
        transform: function (direction, speed) {
            if (_equal(direction, 0) && _equal(speed, 0)) {
                // Avoid pushing Actor through update() if position remains unchanged.
                // FIXME: speed (magnitude) should always be positive, direction should be positive or negative
                // FIXME: Car images align up y axis, change to x axis (rsulting in a negative speed to go up)
                // FIXME: speed should reach zero
                return;
            }

            var r = (direction) ? _round((this.r + direction) % 360) : this.r,
                v = _velocity(r, speed),
                x = _round(this.x - v[0]),
                y = _round(this.y - v[1]);

// FIXME: Check for hit and reverse velocity!!!

            if (this.collisionTest([x, y], r)) {
                //v[0] = -v[0];
                //v[1] = -v[1];

                //x = -x;
                //y = -y;

                speed *= -.6;
                v = _velocity(r, speed),
                x = _round(this.x - v[0]),
                y = _round(this.y - v[1]);
            }

            this.speed = _round(speed);
            this.x = x;
            this.y = y;
            this.r = r;

            //console.log(
            //    "transform()",
            //    "velocity", v,
            //    "direction", direction,
            //    "speed", this.speed
            //);

            this.update();

        },

        onframe: function (e) {
            var rotationStep = Vehicle.HANDLING * this.handling,
                eventKeys = e.keys,
                speed = this.speed,
                keys = this.keys,
                direction = 0;

            if (eventKeys.indexOf(keys[LEFT]) > -1) {
                direction = -rotationStep;
            } else if (eventKeys.indexOf(keys[RIGHT]) > -1) {
                direction = rotationStep;
            }

            if (eventKeys.indexOf(keys[DOWN]) > -1) {
                speed += 0.5;
                if (speed > 5) {
                    speed = 5;
                }
            } else if (eventKeys.indexOf(keys[UP]) > -1) {
                speed -= 1;
                if (speed < -10) {
                    speed = -10;
                }
            } else if (speed) {
                speed *= 0.975;
            }

            this.transform(direction, speed);
        },

        toString: function () {
            return "Vehicle";
        }
    });

    rally.Vehicle = Vehicle;

})();

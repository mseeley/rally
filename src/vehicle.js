(function () {

    const UP = "up",
          DOWN = "down",
          LEFT = "left",
          RIGHT = "right",
          VELOCITY = rally.point.velocity;
    
    function Vehicle (w, h) {
        rally.Actor.apply(this, arguments);
        this.keys = {};
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

        onframe: function (e) {
            var rotationStep = Vehicle.HANDLING * this.handling,
                eventKeys = e.keys,
                speed = this.speed,
                keys = this.keys,
                r = this.r,
                v;
 
            if (eventKeys.indexOf(keys[DOWN]) > -1) {
                speed += 0.5;
            } else if (eventKeys.indexOf(keys[UP]) > -1) {
                speed -= 1;
            } else {
                speed *= 0.975;
            }

            if (speed > 5) {
                speed = 5;
            } else if (speed < -10) {
                speed = -10;
            }

            if (eventKeys.indexOf(keys[LEFT]) > -1) {
                r -= rotationStep;
            } else if (eventKeys.indexOf(keys[RIGHT]) > -1) {
                r += rotationStep;
            }

            v = VELOCITY(r, speed);
 
// TODO: Check if velocity causes a hit

            this.speed = speed;
            this.r = r;
            this.x -= v[0];
            this.y -= v[1];
            this.update();
        },
        toString: function () {
            return "Vehicle";
        }
    });

    rally.Vehicle = Vehicle;

})();

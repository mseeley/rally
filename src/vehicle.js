(function () {

    const UP = "up",
          DOWN = "down",
          LEFT = "left",
          RIGHT = "right",

          // Commonly used values or references

          RADIANS = Math.PI / 180,
          SIN = Math.sin,
          COS = Math.cos;

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
        MAX_FORWARD_VELOCITY: 1,
        MAX_REVERSE_VELOCITY: .5
    }, Vehicle);

    Vehicle.prototype = lang.merge(rally.Actor.prototype, {

        // All vehicles move using the motion value constants. Sub-classes or
        // instances can modify these values for unique motion behavior.

        accel: 1,
        decel: 1,
        handling: 1,
        braking: 1,
        mfv: 1,
        mrv: 1,

        // Frame values for velocity
        
        vx: 0,
        vy: 0,

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
                accel = 5,
                r = 0,
                vx = 0,
                vy = 0,
                eventKeys = e.keys,
                keys = this.keys;
 
            // Early return if no keys are pressed.

            if (!eventKeys.length) {
                return;
            }

            if (eventKeys.indexOf(keys[LEFT]) > -1) {
                r = -rotationStep;
            } else if (eventKeys.indexOf(keys[RIGHT]) > -1) {
                r = rotationStep;
            }
            
            var asRadians = this.rotation * -RADIANS;
            var _vx = SIN(asRadians) * accel;
            var _vy = COS(asRadians) * accel; 

            if (eventKeys.indexOf(keys[UP]) > -1) {
                vx = _vx;
                vy = _vy;
            } else if (eventKeys.indexOf(keys[DOWN]) > -1) {
                vx = -_vx;
                vy = -_vy;
            }

            // Work avoidance if the pressed keys are not recognized.

            if (r || vx || vy) {
                this.rotation += r;
                this.x -= vx;
                this.y -= vy;
                this.update();                
            }

        }
    });

    rally.Vehicle = Vehicle;

})();

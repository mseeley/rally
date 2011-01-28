(function () {

    const UP = "up",
          DOWN = "down",
          LEFT = "left",
          RIGHT = "right";
    
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
                speed = this.speed,
                eventKeys = e.keys,
                keys = this.keys,
                r = 0;
 
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
                r = -rotationStep;
            } else if (eventKeys.indexOf(keys[RIGHT]) > -1) {
                r = rotationStep;
            }

            // Calculate velocity, store motion property values
// TODO: Avoid creating a new Point on every frame, eliminate instantiation time and GC
            var pt = new rally.Point(),
                v = pt.velocity(this.rotation + r, speed),
                vx = v.x,
                vy = v.y;

            this.speed = speed;
// TODO: vx and vy can be used to move bounds?            
            //this.vx = vx;
            //this.vy = vy;
 
            // Set Actor interface properties, update!

// TODO: Check if rotation and velocity causes a hit on another actor

            this.rotation += r;
            this.x -= vx;
            this.y -= vy;
            this.update();
        }
    });

    rally.Vehicle = Vehicle;

})();

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

    lang.mix(Vehicle, {
        ACCELERATION: 1,
        DECELERATION: 1,
        BRAKING: 1,
        HANDLING: 1,
        BOUNCE: 0
    });

    Vehicle.prototype = lang.merge(rally.Actor.prototype, {
        // xVelocity
        // yVelocity
        // velocity
        // maxForwardVelocity
        // maxReverseVelocity

        // acceleration
        // deceleration
        // bounce - negative effect on x and y velocity
        // handling
        // braking
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
            var eventKeys = e.keys,
                keys = this.keys;

            if (!eventKeys.length) {
                return;
            }

            var translateStep = 8,
                rotationStep = 8;

            var rotation = 0,
                x = 0,
                y = 0;

            if (eventKeys.indexOf(keys[UP]) > -1) {
                y -= translateStep;
            } else if (eventKeys.indexOf(keys[DOWN]) > -1) {
                y += translateStep / 2;
            }
            
            if (eventKeys.indexOf(keys[LEFT]) > -1) {
                rotation -= rotationStep;

            } else if (eventKeys.indexOf(keys[RIGHT]) > -1) {
                rotation += rotationStep;
            }

            this.rotation = rotation;
            this.x = 0;
            this.y += y;
            this.update();
        }
    });

    rally.Vehicle = Vehicle;

})();

/*
	p.accelerate = function() {
		//increase push ammount for acceleration
		this.thrust += this.thrust + 0.6;
		if(this.thrust >= Ship.MAX_THRUST) {
			this.thrust = Ship.MAX_THRUST;
		}
		
		//accelerate
		this.vX += Math.sin(this.rotation*(Math.PI/-180))*this.thrust;
		this.vY += Math.cos(this.rotation*(Math.PI/-180))*this.thrust;
		
		//cap max speeds
		this.vX = Math.min(Ship.MAX_VELOCITY, Math.max(-Ship.MAX_VELOCITY, this.vX));
		this.vY = Math.min(Ship.MAX_VELOCITY, Math.max(-Ship.MAX_VELOCITY, this.vY));
	}

*/



(function () {

    const M = Math,
          FLOOR = M.floor,
          PI_RADIANS = M.PI / 180,
          ROUND = M.round,
          SIN = M.sin,
          COS = M.cos;

    function Point (x, y) {
        this.x = x;
        this.y = y;
    }

    Point.prototype = {
        x: null,
        y: null,
        toIndex: function (w) {
            return (this.x + (this.y * w)) * 4;
        },

        fromIndex: function (idx, w) {
            idx /= 4;
            this.x = FLOOR(idx % w);
            this.y = FLOOR(idx / w); 
        },

        distance: function (pt) {
            var dx = this.x - pt.x,
                dy = this.y - pt.y;

            return M.sqrt(dx * dx + dy * dy);
        },

        // Finds global coordinations of x and y coordinate relative to the
        // sources's current x/y
        toGlobal: function(source) {
            var sourceX = source.x,
                sourceY = source.y,
                rotation = source.rotation,
                localX = this.x,
                localY = this.y,
                sin = 0,
                cos = 1,
                r;

            if (rotation) {
                r = rotation * RADIANS;
                cos = COS(r);
                sin = SIN(r);
            }
            
            return {
                x: localX * cos + localY * -sin + sourceX,
                y: localX * sin + localY * cos + sourceY
            }
	},

        rotate: function (angle, origin) {
            angle *= PI_RADIANS;

            var cos = COS(angle),
                sin = SIN(angle),
                originX = origin ? origin.x : 0,
                originY = origin ? origin.y : 0,
                deltaX = this.x - originX,
                deltaY = this.y - originY;

            return {
                x: ROUND(originX + (deltaX * cos) - (deltaY * sin)),
                y: ROUND(originY + (deltaX * sin) - (deltaY * cos))
            };
        },

        velocity: function (angle, speed) {
            angle *= PI_RADIANS;

            return {
                x: SIN(angle) * speed,
                y: -(COS(angle) * speed)
            };
        },

        toString: function () {
            return "Point (" + this.x + ", " + this.y + ")";
        }

    };

    rally.Point = Point; 

})();

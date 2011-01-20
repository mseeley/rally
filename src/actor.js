(function () {

    const CANVAS = document.createElement("canvas"),
          RADIANS = Math.PI / 180;

    function Actor (w, h) {
        var canvas = CANVAS.cloneNode(false);
        canvas.width = w;
        canvas.height = h;

        this.canvas = canvas;
        this.context = canvas.getContext("2d");
    }

    Actor.prototype = {
        
        canvas: null,
        context: null,
        hitPoints: null,
        img: null,
 
        // Dimension properties

        height: 0,
        width: 0,
        x: 0,
        y: 0,
        regX: 0,
        regY: 0,
        rotation: 0,

        // Dimension shadow properties, used for clearing

        _x: null,
        _y: null,
        _rotation: null,
        
        // Abstract methods

        onframe: function (e) {},
        onresize: function (e) {},

        // Generic methods

        hitTest: function (points) {
            
        },
        update: function () {
            var ctx = this.context,
                pos = this.position,
                img = this.img,
                r = this.rotation,
                x = this.x,
                y = this.y,
                rx = this.regX,
                ry = this.regY;
            
            // setImage() must be called before update()
            
            if (!img) {
               return;
            }

            // Clear dirty frame region, assumes regX, regY, and img are static

            if (this._x !== null) {
                ctx.save();
                ctx.translate(this._x, this._y);
                ctx.rotate(this._rotation * RADIANS);
                ctx.clearRect(-rx * 1.5, -ry * 1.5, img.width * 1.5, img.height * 1.5);
                ctx.restore();
            }

            // Draw the new frame

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(r * RADIANS);
            ctx.drawImage(img, -rx, -ry);
            ctx.restore();

            // Save position and rotation for clearing dirty frame region
            
            this._x = x;
            this._y = y;
            this._rotation = r;
        },
        
        setImage: function (img) {
            this.img = img;
// TODO: parse image data to find opaque pixels
        }
    };

    rally.Actor = Actor;

})();

/*

// All actors
An image that displays
Another image that is the region which other actors hit test against
    enables a region other than the visible image to be hit test against
    Think of an actor with antenna, the body of the actor should be tested not the antenna

// Only on Vehicles
A third image which contains the collion information the actor uses when testing for hits on another actor

Collisions only happen in the direction of movement (only on Y)

car.hitTest(map);

// Maps don't have collision information
map.hitTest(car);

collisionData
surfaceData
   
*/


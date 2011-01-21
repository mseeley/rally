(function () {

    const CANVAS = document.createElement("canvas"),
          M = rally.math;
          PI_RADIANS = M.PI_RADIANS;

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

        //height: 0,
        //width: 0,
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
                ctx.rotate(this._rotation * PI_RADIANS);
                ctx.clearRect(-rx * 1.5, -ry * 1.5, img.width * 1.5, img.height * 1.5);
                ctx.restore();
            }

            // Draw the new frame

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(r * PI_RADIANS);
            ctx.drawImage(img, -rx, -ry);

            //debug.origin(ctx);
            //debug.points(ctx, [
            //    [0, 10], [0, 11], [0, 12]
            //]);

            //debug.indices(ctx, [
            //    32000, 35200, 38400
            //]);

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

actors have surfaces and bounds
    a surface is shown to the user
    bounds is the sillouhette of surface regions which are checked for collision

vehicles have hitData, an array of points which need to be compared to other
actor's bounding shapes for collision detection.

vehicle collisions can be detected on any axis. The colliding actor supplies
it's velocity and mass which is applied to each other.



load(url, callback, scope);

rally.load('data', function (img) {
    actor.setSurface(img);
});

rally.pointsByAlpha(); // find collision and bounds

setSurface(data, callback, scope)
setBounds(data, callback, scope);
setCollision(data, callback, scope) // checked against bounds of other actors, minimum set of points


Bounds parsing:

    To a single dimensional array of 0 or 1. if pixel is opaque in 
    bounds map then set 1, otherwise a zero.

    can I update the x, y, and rotation of bounds without tranforming another canvas?

    Accepts an alpha threshold to allow/prevent partially transparent pixels

Collision parsing:

    Array of points
    Points converted to x,y then to global coords for hit testing

var hits = [
]

*/


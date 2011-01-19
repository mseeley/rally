(function () {

    const CANVAS = document.createElement("canvas");

    function Actor (w, h) {
        var canvas = CANVAS.cloneNode(false);
        canvas.width = w;
        canvas.height = h;

        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.registration = [0, 0];
        this.position = [0, 0];
        this.rotation = 0;

        this._rotation = 0;
    }

    Actor.prototype = {
        registration: null,
        position: null,
        rotation: null,
        _rotation: null,
        canvas: null,
        context: null,
        hitPoints: null,
        img: null,
        hitTest: function (points) {
            
        },
        update: function () {

// TODO: MUST avoid update if rotation, position, or registration have not
// changed. Imagine the background Map actor updating itself uselessly...

// TODO: Store total rotation

            var ctx = this.context,
                pos = this.position,
                img = this.img,
                reg = this.registration;

            if (!img) {
                // setImage() must be called before update() :(
                return;
            }

            this._rotation += this.rotation;

            //ctx.clearRect(-img.width / 2, -img.height / 2, img.width * 2, img.height * 2);
            ctx.clearRect(-1000, -1000, 2000, 2000);
            ctx.translate(pos[0], pos[1]);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.drawImage(img, reg[0], reg[1]);
            debug.axes(ctx);
        },
        setImage: function (img) {
            this.img = img;
// TODO: parse image data to find opaque pixels
        },
        
        // Implementations left up to subclass

        onframe: function (e) {},
        onresize: function (e) {}
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
   
   
var imgd = context.getImageData(x, y, width, height);
var pix = imgd.data; [r, g, b, a]

*/
/*
different maps instances for terrain and surface and sky?
let's maps be specialized? 
keeps it simple. a map has two canvas elements, a surface and hitpoints
    - maps nicely to a car also.
    - oooooh, base class
        - YES, then vehicles can hit test other vehicles!
don't need to keep two canvas elements. just one to animate and imageData from the other hittest


function setPixel(imageData, x, y, r, g, b, a) {
    index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
}

https://developer.mozilla.org/en/Canvas_tutorial/Transformations

ctx.rotate
ctx.save
ctx.restore

translate(x, y) -- moves origin to x,y coord
    - vehicle is centered on 0,0 because rotation center point is always origin

save state before rotating, that way i can always rotate from 0 instead of the current rotation.

rotate




        // Hit test to determine if car is on course
        terrain: null,
        // Starting position, etc
        moments: null,
        // Shown to user below vehicle
        surface: null,
        // Shown to user above vehicle
        sky: null,
        // displays canvas elements
        render: function (el) {
        },
        // Pass an array of points (x,y), returns true if any point is on terrain
        hitTest: function (points) {
        }
 

*/


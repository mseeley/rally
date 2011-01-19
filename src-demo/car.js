(function (global) {

    const IMG_SRC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAaCAYAAAC6nQw6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAIRSURBVHjatJU7b9NQFMd/13Gah+04sRKioKiN1IEpgJKhwMJnYUmWbvk0bSX4DOwMYUEMuCotVVk6ICoa0lfejzqJGSI7zaOWi+BM59x7z0/n/O9L2LbNon0+avD+Y215AniZN8RWXidthObGhQPaP22yf9yyPx3cUL8Z4mVKOMCLvMHrrYQobOozUG84Ynvv2K6f3vIQe7S5xtvtZwJAAjj59hU5KJBDwjdEDgnkoMA0zWlFhULBBiiW3tFrTmicW75A8UyQqC5h7r7BrcixsOq/osW18t1ACghSuSCdnndVajSIFPAAXbf6pAIN1o2RJ6jelbloxTFikdUgazyhsD4GvFvMxsd8+GnfX1FAEsRUxZdG1mRhFzVNo91uuwMxTfEp96x9TdOQq9WqACjtHNoAMTXqE9QCwDRNsdTaFKQ8CLRSI4DAWgglJHsiusPlXV3KKO+d+KonpUfmYom/NEksHMhisejetYQW9g3S1el75OTPtXZV/0WtVoPg/YJbgw7C6mFlN8hkc6s1Gg4GhOKPGY+mdy2iJ+k3L915J26efWc0GnmLDdBrXriJjr8q/idi/zeQvPoZVVb6Tmy1r5ZzKpWK6HQ6fLGxp7vSJaJOf4bbbtP1nTgcUejfPcDlslBVdfYdlXYO7evL35yf/fDVSia7gZFMs1t+On9pn+di4gBsI5n2rcurJwn3eP8ZAKE7sQJm2aldAAAAAElFTkSuQmCC";

    const HIT_SRC = "";

    function Car (w, h) {
        rally.Vehicle.apply(this, arguments);
        
        var self = this,
            img = new Image();
    
        img.onload = function () {
            self.setImage(this);

            // Front wheel drive
            self.registration = [-this.width / 2, -this.height * .35];

            // Or, rear wheel drive
            //self.registration = [-this.width / 2, -this.height * .75];

            // Center the car on the stage
            self.position = [w / 2, h / 2];
            self.update();
        };

        img.src = IMG_SRC;
    }

    Car.prototype = lang.merge(rally.Vehicle.prototype, {

    });

    if (!global.vehicles) {
        global.vehicles = {};
    }

    vehicles.Car = Car;

})(this);

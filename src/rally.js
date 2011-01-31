(function (global) {

    var isSupported = null;

    global.rally = {
        hasSupport: function () {
            if (isSupported === null) {
                var cvs = document.createElement("canvas");
                isSupported = !!cvs.getContext;
                cvs = null;
            }

            return isSupported;
        },

        // Returns an object of pixel information
        // TODO: Not appropriate to assign method here, perhaps Actor.getOpaque
        getOpaque: function (ctx) {

            var canvas = ctx.canvas,
                canvasWidth = canvas.width,
                indexToPoint = rally.point.fromIndex,
                pixels = ctx.getImageData(0, 0, canvasWidth, canvas.height).data,
                len = pixels.length,
                points = [],
                hash = {},
                i = 3,
                pt,
                x,
                y;
            
            for (i; i <= len; i+=4) {
                if (pixels[i] > 0) {
                    pt = indexToPoint(i, canvasWidth);

                    points[points.length] = pt;
                    x = pt[0];
                    y = pt[1];

                    if (hash[x] == null) {
                        hash[x] = {};
                    }

                    hash[x][y] = 1;
                }
            }

            return {
                points: points,
                hash: hash
            };
        },

        // Simple img loader encapsulation
        // TODO: Not appropriate to assign method here, perhaps Actor.loadImg
        loadImg: function (src, callback, scope) {
            var img = document.createElement("img");

            img.onload = function () {
                callback.call(scope, this);
                img = null;
            };

            img.src = src;
        }
    };

})(this);

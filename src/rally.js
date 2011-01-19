(function (global) {

    const FLOOR = Math.floor;

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
        pointToIndex: function (x, y, w) {
            return (x + (y * w)) * 4;
        },
        indexToPoint: function (idx, w) {
            idx /= 4;

            return [
                idx % w,
                FLOOR(idx / w)
            ];
        },
        localToGlobal: function(localX, localY, source) {
            var position = source.position,
                sourceX = position[0],
                sourceY = position[1],
                rotation = source.rotation,
                reg = source.registration,
                //regX = reg[0],
                //regY = reg[1],
                scaleX = 1,
                scaleY = 1,
                sin = 0,
                cos = 1,
                r;

            if (rotation % 360) {
                r = rotation * Math.PI / 180;
                cos = Math.cos(r);
                sin = Math.sin(r);
            }
            
            //if (regX) {
            //    localX -= regX;
            //}

            //if (regY) {
            //    localY -= regY;
            //}

            return {
                x: (localX * (cos * scaleX)) + (localY * (-sin * scaleY)) + sourceX,
                y: (localX * (sin * scaleX)) + (localY * (cos * scaleY)) + sourceY
            }
	},
        localTolocal: function () {
        },
        globalToLoca: function () {
        }
    };

})(this);

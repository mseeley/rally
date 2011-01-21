(function () {

    const M = Math,
          FLOOR = M.floor,
          RADIANS = M.PI / 180,
          SIN = M.sin,
          COS = M.cos;
 
    rally.math = {

        PI_RADIANS: RADIANS,
        SIN: SIN,
        COS: COS,

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

        distance: function (p1, p2) {
            var dx = p1.x - p2.x,
                dy = p1.y - p2.y;

            return M.sqrt(dx * d2 + dy * dy);
        },

        localToGlobal: function(localX, localY, source) {
            var sourceX = source.x,
                sourceY = source.y,
                rotation = source.rotation,
                regX = source.regX,
                regY = source.regY,
                scaleX = 1,
                scaleY = 1,
                sin = 0,
                cos = 1,
                r;

            if (rotation % 360) {
                r = rotation * RADIANS;
                cos = COS(r);
                sin = SIN(r);
            }
            
            if (regX) {
                localX -= regX;
            }

            if (regY) {
                localY -= regY;
            }

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

})();

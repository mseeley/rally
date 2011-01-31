(function () {
    kaze.tests({
        "rally:getOpaque points": function (del) {
            var canvas = document.createElement("canvas"),
                ctx = canvas.getContext("2d");

            canvas.width = 8;
            canvas.height = 8;

            var img = document.createElement("img");
            img.onload = del(function () {
                ctx.drawImage(img, 0, 0);

                var pixels = rally.getOpaque(ctx).points;

                return pixels.length === 4 &&
                    (pixels[0][0] === 0 && pixels[0][1] === 0) &&
                    (pixels[1][0] === 3 && pixels[1][1] === 0) &&
                    (pixels[2][0] === 0 && pixels[2][1] === 3) &&
                    (pixels[3][0] === 3 && pixels[3][1] === 3);

            });
            img.src = "img/getopaque1.png";
        },
        "rally:getOpaque hash": function (del) {
            var canvas = document.createElement("canvas"),
                ctx = canvas.getContext("2d");

            canvas.width = 8;
            canvas.height = 8;

            var img = document.createElement("img");
            img.onload = del(function () {
                ctx.drawImage(img, 0, 0);

                var hash = rally.getOpaque(ctx).hash;

                return hash[0] && hash[0][0] && hash[0][3] &&
                       hash[3] && hash[3][0] && hash[3][3];
            });
            img.src = "img/getopaque1.png";
        }
    });
})();

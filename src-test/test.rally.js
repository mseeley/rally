(function () {
    kaze.tests({
        "rally:getOpaque": function (del) {
            var canvas = document.createElement("canvas"),
                ctx = canvas.getContext("2d");

            canvas.width = 8;
            canvas.height = 8;

            var img = document.createElement("img");
            img.onload = del(function () {
                ctx.drawImage(img, 0, 0);

                var pixels = rally.getOpaque(ctx);

                return pixels.length === 4 &&
                    (pixels[0].x === 0 && pixels[0].y === 0) &&
                    (pixels[1].x === 3 && pixels[1].y === 0) &&
                    (pixels[2].x === 0 && pixels[2].y === 3) &&
                    (pixels[3].x === 3 && pixels[3].y === 3);

            });
            img.src = "img/getopaque1.png";
        }
    });
})();

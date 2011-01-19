kaze.tests({
    "perf: 800x600 imageData": function (del) {
        var img = new Image(),
            hits = [];

        img.onload = del(function(){
            var canvas = document.createElement("canvas"),
                ctx = canvas.getContext("2d");

            canvas.height = 600;
            canvas.width = 800;

            ctx.drawImage(img, 0, 0);

            var data = ctx.getImageData(0,0,800,600).data,
                len = data.length,
                i = 0;

            for (i; i < len; i+=4) {
                if (data[i] === 255) {
                    // This really isn't finding the red pixels, i is not the pixel number
                    hits[hits.length] = i;
                    //hits.push(i);
                }
            }

            return true;
        });
        img.src = "img/circle_map.png";
    }
});








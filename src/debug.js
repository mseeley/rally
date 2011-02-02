(function () {

    const FILL_STYLE = "red",
          STROKE_STYLE = "skyblue";

    function Fps (stage) {
        var input = document.createElement("input");
        input.readOnly = true;
        input.style.width = "50px";

        stage.element.parentNode.appendChild(input);
        stage.on("active", this.onactive, this);

        this.input = input;
        this.stage = stage;
     }

    Fps.prototype = {
        frames: null,
        scale: 1000,
        interval: null,
        element: null,
        onframe: function (e) {
            this.frames++;
        },
        onactive: function (e) {
            if (e.isActive) {
                this.enable();
            } else {
                this.disable();
            }
        },
        update: function () {
            // Pure convenience as scale is 1 second.
            this.input.value = this.frames;
            this.frames = 0;
        },
        enable: function () {
            if (!this.interval) {
                var self = this,
                    stage = this.stage;

                this.frames = 0;

                this.interval = setInterval(function () {
                    self.update();
                }, this.scale);

                stage.on("frame", this.onframe, this);
           }
        },
        disable: function () {
            if (this.interval) {
                var stage = this.stage;
                clearInterval(this.interval);
                stage.off("frame", this.onframe, this);
                this.input.value = '';
            }
        }
    };

    rally.debug = {
        show: {
            axes: false,
            bounds: true,
            collision: true,
            origin: false,
            visible: false
        },
        axes: function (ctx, fillStyle) {
            var c = ctx.canvas,
                w = c.width,
                h = c.height;

            ctx.save();

            ctx.strokeStyle = STROKE_STYLE;
            ctx.font = "normal 10px sans-serif";

            // label axes
            ctx.textBaseline = "top";
            ctx.fillStyle = fillStyle || FILL_STYLE;
            ctx.fillText("x", 50, 5);
            ctx.fillText("y", 5, 50);

            // vertical axis
            ctx.beginPath();
            ctx.moveTo(-0.5, -h);
            ctx.lineTo(-0.5, h);
            ctx.stroke();
            ctx.closePath();

            // horizontal axis
            ctx.beginPath();
            ctx.moveTo(-w, -0.5);
            ctx.lineTo(w, -0.5);
            ctx.stroke();
            ctx.closePath();

            ctx.restore();
        },
        origin: function (ctx, fillStyle) {
            ctx.save();

            ctx.beginPath();
            ctx.fillStyle = fillStyle || FILL_STYLE;
            ctx.arc(0, 0, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();

            ctx.restore();
        },
        points: function (ctx, pts, fillStyle) {
            ctx.save();
            ctx.fillStyle = fillStyle || FILL_STYLE;

            var i = 0,
                len = pts.length,
                pt,
                x = 0,
                y = 1;

            for (i; i < len; i++) {
                pt = pts[i];
                ctx.fillRect(pt[x], pt[y], 1, 1);
            }

            ctx.restore();
        },
        indices: function (ctx, idxs, fillStyle) {
            ctx.save();
            ctx.fillStyle = fillStyle || FILL_STYLE;

            var i = 0,
                len = idxs.length,
                w = ctx.canvas.width,
                pt;

            for (i; i < len; i++) {
                pt = rally.point.fromIndex(idxs[i], w);
                ctx.fillRect(pt[0], pt[1], 1, 1);
            }

            ctx.restore();
        },
        displayFps: function (stage) {
            var fps = new Fps(stage);
            fps.enable();
        }
    }
})();

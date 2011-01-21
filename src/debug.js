(function () {

    const FILL_STYLE = "red";

    var viewportWidth = 3000,
        viewportHeight = 3000;

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
            }
        }
    };
    
    debug = {
        axes: function (ctx) {
            ctx.save();

            ctx.strokeStyle = "#ccc";
            ctx.font = "normal 10px sans-serif";

            // label axes
            ctx.textBaseline = "top";
            ctx.fillStyle = "#666";
            ctx.fillText("x", 50, 5);
            ctx.fillText("y", 5, 50);

            // vertical axis
            ctx.beginPath();
            ctx.moveTo(-0.5, -viewportHeight);
            ctx.lineTo(-0.5, viewportHeight);
            ctx.stroke();
            ctx.closePath();
            
            // horizontal axis
            ctx.beginPath();
            ctx.moveTo(-viewportWidth, -0.5);
            ctx.lineTo(viewportWidth, -0.5);
            ctx.stroke();
            ctx.closePath();        

            ctx.restore();
        },
        origin: function (ctx) {
            ctx.save();

            ctx.beginPath();
            ctx.fillStyle = FILL_STYLE;
            ctx.arc(0, 0, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();

            ctx.restore();
        },
        points: function (ctx, pts) {
            ctx.save();
            ctx.fillStyle = FILL_STYLE;

            var i = 0,
                len = pts.length,
                pt;

            for (i; i < len; i++) {
                pt = pts[i];
                ctx.fillRect(pt[0], pt[1], 1, 1);
            }
            
            ctx.restore();
        },
        indices: function (ctx, idxs) {
            ctx.save();
            ctx.fillStyle = FILL_STYLE;

            var i = 0,
                len = idxs.length,
                w = ctx.canvas.width,
                pt;

            for (i; i < len; i++) {
                pt = rally.math.indexToPoint(idxs[i], w);
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

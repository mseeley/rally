(function () {

    var viewportWidth = 3000,
        viewportHeight = 3000;

    function Fps (stage) {
        var input = document.createElement("input");
        
        stage.element.parentNode.appendChild(input);
        stage.on("activate", this.onactivate, this);
        stage.on("deactivate", this.ondeactivate, this);

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
        onactivate: function (e) {
            this.enable();
        },
        ondeactivate: function (e) {
            this.disable();
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
            // axes
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
            ctx.fillStyle = "red";
            ctx.arc(0, 0, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        },
        displayFps: function (stage) {
            var fps = new Fps(stage);
            fps.enable();
        }
    }
})();

(function () {

    if (rally.hasSupport()) {

        var stage = new rally.Stage(document.getElementById("stage")),
            car = new vehicles.Car(stage.width, stage.height),
            ready = 0,
            onready = function (e) {
                stage.addChild(e.source);
                if (++ready == stage.children.length) {
                    car.x = 30;//stage.width / 2;
                    car.y = 30;//stage.height / 2;
                    //car.rotation = 33;
                    car.update();

                    stage.on("frame", car.onframe, car);
                    stage.activate();
                }
            };

        car.on("ready", onready);
        
        car.setKeys({
            down: 40,
            left: 37,
            right: 39,
            up: 38
        });

        car.init();

        debug.displayFps(stage);

        // Start and stop the stage

        var btnOn = document.getElementById("on"),
            btnOff = document.getElementById("off");
        btnOn.onclick = function () {
            stage.activate();
            btnOff.focus();
        };
        btnOff.onclick = function () {
            stage.deactivate();
            btnOn.focus();
        };
        btnOff.focus();
    }

})();


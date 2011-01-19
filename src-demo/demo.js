(function () {

    const STAGE_WIDTH = 600,
          STAGE_HEIGHT = 400;

    if (rally.hasSupport()) {

        var stage = new rally.Stage({
                element: document.getElementById("stage"),
                width: STAGE_WIDTH,
                height: STAGE_HEIGHT,
                fps: 55
            }),
            //map = new rally.Map(STAGE_WIDTH, STAGE_HEIGHT),
            car = new vehicles.Car(STAGE_WIDTH, STAGE_HEIGHT);

        car.setKeys({
            down: 40,
            left: 37,
            right: 39,
            up: 38
        });

        stage.on("frame", car.onframe, car);

        stage.on("size", function (e) {
            // map
        });

        stage.addActor(car);

        stage.activate();

        //stage.element.focus();

        debug.displayFps(stage);
    }

})();



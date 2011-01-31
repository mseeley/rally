(function () {

    if (rally.hasSupport()) {

// TODO: Just pass stage to actor? Better than passing w, h all over the place?

        var stage = new rally.Stage(document.getElementById("stage")),
            car = new vehicles.Car(stage.width, stage.height),
            map = new maps.Basic(stage.width, stage.height),
            children = [car, map],
            ready = 0,
            oninit = function (e) {
                var child = e.source;

                stage.addChild(child, children.indexOf(child));
                child.update();

                if (++ready == children.length) {
                    stage.on("frame", car.onframe, car);
                    stage.activate();
                }
            };

        car.x = stage.width / 2;
        car.y = stage.height / 2;
        car.setKeys({
            down: 40,
            left: 37,
            right: 39,
            up: 38
        });

// TODO: See below
//      car.addHitTarget(map);
//      car.x = map.startX;
//      car.y = map.startY;

        children.forEach(function (child) {
            child.on("init", oninit);
            child.init();
        });

        // Demo UI and debugging code

        debug.displayFps(stage);

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


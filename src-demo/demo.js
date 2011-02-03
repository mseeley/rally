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

                    if (window.car2) {
                        stage.on("frame", car2.onframe, car2);
                    }

                    stage.activate();
                }
            };

//FIXME:
//      car.x = map.startX;
//      car.y = map.startY;

        car.x = stage.width * .65;
        car.y = stage.height / 3;

        car.addHitTarget(map);

        car.setKeys({
            down: 40,
            left: 37,
            right: 39,
            up: 38
        });

        //car2 = new vehicles.Car(stage.width, stage.height);
        //car2.x = stage.width * .35;
        //car2.y = stage.height / 3;
        //car2.r = 90;
        //car.addHitTarget(car2);
        //car2.addHitTarget(car);
        //car2.addHitTarget(map);
        //car2.setKeys({
        //    up: 87,
        //    down: 83,
        //    left: 65,
        //    right: 68
        //});
        //children.unshift(car2);

        children.forEach(function (child) {
            child.on("init", oninit);
            child.init();
        });

        // Demo UI and debugging code

        rally.debug.displayFps(stage);

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

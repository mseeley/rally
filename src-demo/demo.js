(function () {

    if (rally.hasSupport()) {

        var stage = new rally.Stage(document.getElementById("stage")),
            sw = stage.width,
            sh = stage.height,
            car = new vehicles.Car(sw, sh),
            car2 = new vehicles.Car(sw, sh),
            map = new maps.Basic(sw, sh),
            children = [car, car2, map],
            ready = 0,
            oninit = function (e) {

                // A child has completed its initalization. Add it to the stage
                // and call update to render the first frame. Only Vehicle
                // subclasses need to reacto to frame events fired when the
                // stage is activate.

                var child = e.source;

                stage.addChild(child, children.indexOf(child));
                child.update();

                if (++ready == children.length) {
                    stage.on("frame", car.onframe, car);
                    stage.on("frame", car2.onframe, car2);

                    stage.activate();
                }
            };

        // Position each vehicle

//@FIXME:
//      car.x = map.startX;
//      car.y = map.startY;

        car.x = sw * .65;
        car.y = sh / 3;
        car.r = -90;

        car2.x = sw * .35;
        car2.y = sh / 3;
        car2.r = 90;

        // Setup the hit targets for each vehicle. Maps shouldn't check for
        // collisions, only Vehicles.

        car.addHitTarget(map);
        car.addHitTarget(car2);

        car2.addHitTarget(car);
        car2.addHitTarget(map);

        // Map keyboard input to the direction of movement.

        car.setKeys({
            up: 38,
            down: 40,
            left: 37,
            right: 39
        });

        car2.setKeys({
            up: 87,
            down: 83,
            left: 65,
            right: 68
        });

        // Initialize each child.  Children load their assets then fire an
        // "init" event.

        children.forEach(function (child) {
            child.on("init", oninit);
            child.init();
        });

        // Squelch arrow key viewport scrolling

        document.addEventListener("keydown", function (e) {
            var keys = [37, 38, 39, 40];
            if (keys.indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
        }, false);


//------------------------------------------------------------------------------
//
// Debug code, not integral to running demo. Each closure represents a
// logical block which can be removed without affecting other debug code.
//
//------------------------------------------------------------------------------

        function on (type, node, fn) {
            node.addEventListener(type, fn, false);
        }

        function $ (id) {
            return document.getElementById(id);
        }


        (function () {

            // Activates, or deactivates, the stage when the On or Off buttons
            // are clicked.

            var btnOn = $("btn-on"),
                btnOff = $("btn-off");

            on("click", btnOn, function (e) {
                stage.activate();
                btnOff.focus();
            });

            on("click", btnOff, function (e) {
                stage.deactivate();
                btnOn.focus();
            });

            btnOff.focus();

        }());


        (function () {

            var form = $("debug"),
                elements = form.elements,
                checkboxes = form.querySelectorAll("[type=checkbox]");

            function showHide (name, isShown) {
                var checked = !!isShown,
                    d = rally.debug;

                elements[name].checked = checked;

                if (isShown) {
                    hash.set(name);
                } else {
                    hash.unset(name);
                }

                d.show[name] = checked;
                d.update(stage);
            }

            function display (h) {
                var len = checkboxes.length,
                    i = 0,
                    name,
                    cb;

                for (i; i < len; i++) {
                    cb = checkboxes[i];
                    name = cb.name;

                    // If an empty hash was passed, then pull default values
                    // from DOM.

                    if (!h.length) {
                        if (cb.hasAttribute("checked")) {
                            showHide(name, true);
                        } else {
                            showHide(name, false);
                        }
                    } else if (h.indexOf(cb.name) > -1) {
                        showHide(name, true);
                    } else {
                        showHide(name, false);
                    }

                }
            }

            // Location hash utility object

            var hash = {
                glue: "-",

                get: function () {
                    var h = location.hash.substring(1);
                    return h ? h.split(hash.glue) : [];
                },

                set: function (k) {
                    var h = hash.get(),
                        keyIdx = h.indexOf(k);

                    if (keyIdx < 0) {
                        h.push(k);
                    }

                    location.href = location.origin +
                                    location.pathname +
                                    (h.length) ? "#" + h.join(hash.glue) : '';

                    return h;
                },

                unset: function (k) {
                    var h = hash.get(),
                        keyIdx = h.indexOf(k);

                    if (keyIdx > -1) {
                        h.splice(keyIdx, 1);
                    }

                    location.href = location.origin +
                                    location.pathname +
                                    (h.length) ? "#" + h.join(hash.glue) : '';

                    return h;
                }
            };

            display(hash.get());

            on("click", $("show-ctrl"), function (e) {
                var t = e.target,
                    s = t.name;

                if (t.nodeName == "INPUT") {
                    if (t.checked) {
                        showHide(t.name, true);
                    } else {
                        showHide(t.name, false);
                    }
                }
            });

        }());


        (function () {

            // Displays the FPS counter

            rally.debug.displayFps(stage, $("fps"));

        }());

    }

}());

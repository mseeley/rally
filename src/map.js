(function () {

    function Map (w, h) {
        rally.Actor.apply(this, arguments);
    }

    Map.prototype = lang.merge(rally.Actor.prototype, {

    });

    rally.Map = Map;

})();

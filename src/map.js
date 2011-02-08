/*global rally*/

/*requires rally.js*/
/*requires actor.js*/

(function () {

    function Map (w, h) {
        rally.Actor.apply(this, arguments);
    }

    Map.prototype = lang.merge(rally.Actor.prototype, {
        toString: function () {
            return "Map";
        }
    });

    rally.Map = Map;

})();

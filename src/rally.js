// All requires statements to external resources go here.

/*requires res/lang.js*/
/*requires res/publisher.js*/
/*requires res/timer.js*/

(function (global) {

    const VERSION = "{$version}";

    var isSupported = null;

    global.rally = {
        version: VERSION,
        hasSupport: function () {
            if (isSupported === null) {
                var cvs = document.createElement("canvas");
                isSupported = !!cvs.getContext;
                cvs = null;
            }

            return isSupported;
        }
    };

})(this);

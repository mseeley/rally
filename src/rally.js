(function (global) {

    const VERSION = "0.1b";

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

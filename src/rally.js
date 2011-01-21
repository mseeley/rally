(function (global) {

    var isSupported = null;

    global.rally = {
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

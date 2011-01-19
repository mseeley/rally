/**
 * Lang: Utilities and language extendions
 * git://github.com/mseeley/lang.git
 * http://github.com/mseeley/lang/raw/master/LICENSE
 */

(function (global) {

    var slice = [].slice;

    function isFn (obj) {
        return !!obj &&
               // Avoid obj.toString().indexOf("[native code]") < 0; to enable
               // functions bound with native bind() to pass. Allows positives
               // for other native methods such as alert() and document.write().
               {}.toString.call(obj) == "[object Function]";
    }

    function mix (src, dest, strict) {
        var each;

        src = src || {};
        dest = dest || {};

        for (each in src) {
            if (!strict || src.hasOwnProperty(each)) {
                dest[each] = src[each];
            }
        }

        return dest;
    }

    global.lang = {
        isFn: isFn,
        mix: mix,
        merge: function (/* ...rest */) {
            var result = {},
                strict = false,
                args = arguments,
                len = args.length,
                last = len - 1,
                idx = len,
                i = 0;

            if (len > 1 && typeof args[last] == "boolean") {
                strict = args[last];
                idx = last;
            }

            // Merge left to right; arguments to the right always overwrite

            while (i < idx) {
                mix(args[i++], result, strict);
            }

            return result;
        },
          
        rest: function (args, fn) {
            
            // See: http://wiki.ecmascript.org/doku.php?id=harmony:rest_parameters
            
            return args && fn ? slice.call(args, fn.length) : [];
        }
    };

})(this);


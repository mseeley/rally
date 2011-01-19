/**
 * Publisher: Event dispatching mix-in interface 
 * git://github.com/mseeley/publisher.git
 * http://github.com/mseeley/publisher/raw/master/LICENSE
 */

(function (global) {

    var members = {

        /**
         * A hash of listeners.  Event type serves as key.
         * @type Object
         */
        events: null,

        /**
         * Defines an event type.
         *
         * @param {String}              type    Name of type event
         * @param {Object|Function}     desc    Optional, Config object or
         *                                      function executed as action
         */
        define: function (type, desc) {

            // Create events hash the first time an event is defined.  This
            // allows publisher.extend() to operate against prototype objects.

            if (!this.events) {
                this.events = {};
            }

            var events = this.events;
    
            if (typeof type != "string") {
                throw "define(): type must be a string";
            }

            if (events[type]) {
                throw "define(): Event type [" + type + "] already defined";
            }

            events[type] = lang.merge({
                action: function () {},
                arg: null,
                cancelable: false,
                listeners: [],
                scope: null,//global,
                stoppable: false,
                type: type
            }, desc);
        },

        /**
         * Assign an event listener.
         *
         * @param {String}    type      Name of type event being subscribed to
         * @param {Function}  callback  Function to execute when firing event
         * @param {Object}    scope     Optional, callback execution context
         * @param {*}                   Optional, additional callback arguments
         */
        on: function (type, callback, scope /* [, ...rest] */) {
            if (typeof type != "string" || !lang.isFn(callback)) {
                throw "on(): Unexpected or missing arguments";
            }

            var events = this.events;

            if (events && events[type]) {
                this.off(type, callback, scope);
            } else {
                this.define(type);
            }

            this.events[type].listeners.push({
                callback: callback,
                scope: scope,
                args: lang.rest(arguments, members.on)
            });
        },

        /**
         * Unsubscribes a callback function from an event type.
         *
         * @param {String}    type      Name of type event being subscribed to
         * @param {Function}  callback  Function to execute when firing event
         * @param {Object}    scope     Optional, callback execution context
         */
        off: function (type, callback, scope) {
            var events = this.events,
                byType = events && events[type],
                listeners,
                listener,
                len;

            if (typeof type != "string" || !lang.isFn(callback)) {
                throw "off(): Unexpected or missing arguments";
            }

            if (byType) {
                listeners = byType.listeners;
                len = listeners.length;

                while (len--) {
                    listener = listeners[len];
    
                    if (listener.callback == callback && listener.scope == scope) {
                        listeners.splice(len, 1);
                    }
                }
            }
        },

        /**
         * Executes callback function in the order which they were subscribed. Also
         * executes event type's default action. Handles event stopping and
         * cancelling.
         *
         * @param {String}  type  Name of type event being subscribed to.
         * @param {Object}  desc  Optional, additional parameters supplied to listeners
         *                        as part of the event data object.
         */
        fire: function (type, desc) {
            var events = this.events,
                byType = events && events[type],
                listeners,
                listener,
                data,
                stopped = false,
                canceled = false,
                common;

            if (typeof type != "string") {
                throw "fire(): Unexpected or missing arguments";
            }

            if (byType) {
                common = {
                    cancel: byType.cancelable ?
                      function () {
                        canceled = true;
                      } :
                      function () {},
                    cancelable: byType.cancelable,
                    source: this,
                    stop: byType.stoppable ?
                      function () {
                        stopped = true;
                      } :
                      function () {},
                    stoppable: byType.stoppable,
                    type: type
                };

                // Iterate a copy of the subscribes array and always make a
                // fresh event object before executing each callback.
  
                listeners = byType.listeners.slice();
  
                while (!stopped && (listener = listeners.shift())) {
                    data = lang.merge(desc, common);
                    listener.callback.apply(listener.scope, [data].concat(listener.args));
                }
  
                if (!canceled) {
                    byType.action.call(byType.scope, lang.merge(desc, common), byType.arg);
                }
            }
        },
        /**
         *
         * @return Array if the type is defined, null otherwise.
         */
        listeners: function (type) {
            var events = this.events,
                byType = events && events[type];

            return byType ? byType.listeners.slice(0) : [];
        }
    };


    global.publisher = {

        /**
         * Decorates an object with event publishing capabilities.  If no object is
         * specified, a new object with event publishing capabilities is returned.
         *
         * @param {Object}  o Optional, An object to extend.
         * @return o
         */
        extend: function (o) {
            o = lang.mix(members, o);
            return o;
        }
    };

})(this);


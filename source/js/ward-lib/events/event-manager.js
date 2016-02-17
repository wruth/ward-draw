'use strict';

const internal = require('../create-internal.js').createInternal();

class EventManager {

    constructor() {
        internal(this, new Map());
    }

    on(name, callback, scope) {
        const eventTypes = internal(this);
        let eventListeners;

        if (!eventTypes.has(name)) {
            eventListeners = new Map();
            eventTypes.set(name, eventListeners);
        } else {
            eventListeners = eventTypes.get(name);
        }

        eventListeners.set(callback, scope);
    }

    off(name, callback) {
        const eventTypes = internal(this);

        if (eventTypes.has(name)) {

            // if there's no callback specified, remove all listeners for this type
            if (!callback) {
                eventTypes.delete(name);
            } else {
                const eventListeners = eventTypes.get(name);
                eventListeners.delete(callback);
            }
        }
    }

    trigger(name, ...params) {
        const eventTypes = internal(this),
            eventListeners = eventTypes.get(name);

        if (eventListeners) {

            // TRICKY: iterating over a Map gives a two element Array for each entry: [key, value]
            for (let listenerEntry of eventListeners) {
                listenerEntry[0].apply(listenerEntry[1], params);
            }

        }

    }

    numListenersForType(name) {
        const eventTypes = internal(this),
            eventListeners = eventTypes.get(name);

        if (eventListeners) {
            return eventListeners.size;
        }

        return 0;
    }
}

module.exports = EventManager;

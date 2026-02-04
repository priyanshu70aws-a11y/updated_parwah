const EventEmitter = require('events');

class EventBus extends EventEmitter {}

const eventBus = new EventBus();

const emitEvent = (event, payload) => {
  eventBus.emit(event, {
    ...payload,
    event,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  eventBus,
  emitEvent
};

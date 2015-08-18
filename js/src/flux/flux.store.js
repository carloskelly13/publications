import {EventEmitter} from 'events';
import assign from 'object-assign';
import dispatcher from './flux.dispatcher';
import _ from 'lodash';

const CHANGE_EVENT = 'CHANGE_EVENT';

export default class Store extends EventEmitter {

  constructor() {
    super();
    this.state = {};
  }

  getState() {
    return this.state;
  }

  setState(sender) {
    this.state = _.extend(this.state, sender);
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  register(events) {
    dispatcher.register(payload => {
      var action = payload.action;
      var promise = events[action.actionType];

      if (!_.isUndefined(promise)) {
        promise.apply(this, [payload]).then(() => {
          this.emitChange();
        });
      }

      return true;
    });
  }
}

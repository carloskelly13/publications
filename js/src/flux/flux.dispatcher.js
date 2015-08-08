import {Dispatcher as FluxDispatcher} from 'flux';

export default class Dispatcher extends FluxDispatcher {

  constructor() {
    super();
  }

  handleViewAction(sender) {
    this.dispatch({source: 'VIEW_ACTION', action: sender});
  }
}

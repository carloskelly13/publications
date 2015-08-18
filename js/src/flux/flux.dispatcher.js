import {Dispatcher as FluxDispatcher} from 'flux';

class Dispatcher extends FluxDispatcher {

  constructor() {
    super();
  }

  handleViewAction(sender) {
    this.dispatch({source: 'VIEW_ACTION', action: sender});
  }
}

export default new Dispatcher();

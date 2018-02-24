import { injectGlobal } from "styled-components";

// eslint-disable-next-line no-unused-expressions
injectGlobal`
  .modal-transition-enter {
    opacity: 0;
  }

  .modal-transition-enter.modal-transition-enter-active {
    opacity: 1;
    transition: all 250ms ease-in-out;
  }

  .modal-transition-leave {
    transform: scale(1.0);
    opacity: 1;
  }

  .modal-transition-leave.modal-transition-leave-active {
    transform: scale(1.05);
    opacity: 0;
    transition: all 250ms ease-in-out;
  }
`;

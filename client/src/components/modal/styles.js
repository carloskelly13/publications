import { injectGlobal } from "styled-components";

// eslint-disable-next-line no-unused-expressions
injectGlobal`
  .modal-transition-enter {
    transform: translateY(-100%);
  }

  .modal-transition-enter.modal-transition-enter-active {
    transform: translateY(0);
    transition: transform 600ms ease-in-out;
  }

  .modal-transition-leave {
    transform: translateY(0);
  }

  .modal-transition-leave.modal-transition-leave-active {
    transform: translateY(-100%);
    transition: transform 600ms ease-in-out;
  }
`;

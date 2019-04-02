import * as React from "react";

export default function useOnClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: (event: Event) => void
) {
  React.useEffect(() => {
    const listener = (event: Event) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("touchstart", listener);
    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("touchstart", listener);
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, handler]);
}

import { useCallback, useRef } from "react";

/**
 * Reliable tap handler for iOS Safari where click alone can fail
 * (backdrop-blur stacking, SVG hit targets, 300ms quirks).
 * TouchEnd runs the handler; click is skipped if touch already handled.
 */
export function useIosTap(handler: () => void) {
  const touchHandled = useRef(false);

  const onTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      event.preventDefault();
      touchHandled.current = true;
      handler();
    },
    [handler]
  );

  const onClick = useCallback(
    (event: React.MouseEvent) => {
      if (touchHandled.current) {
        touchHandled.current = false;
        event.preventDefault();
        return;
      }
      handler();
    },
    [handler]
  );

  return { onClick, onTouchEnd };
}

/** Same pattern for handlers that receive the native event. */
export function useIosTapWithEvent<T extends React.SyntheticEvent>(
  handler: (event: T) => void
) {
  const touchHandled = useRef(false);

  const onTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      event.preventDefault();
      touchHandled.current = true;
      handler(event as unknown as T);
    },
    [handler]
  );

  const onClick = useCallback(
    (event: React.MouseEvent) => {
      if (touchHandled.current) {
        touchHandled.current = false;
        event.preventDefault();
        return;
      }
      handler(event as unknown as T);
    },
    [handler]
  );

  return { onClick, onTouchEnd };
}

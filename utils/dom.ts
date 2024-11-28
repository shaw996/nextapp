export function on<E extends Event>(
  el: Window | Document | HTMLElement,
  event: string,
  fn: (evt: E) => void,
): () => void {
  el.addEventListener(event, fn as EventListener);

  return () => off(el, event, fn as (evt: Event) => void);
}

export function off<E extends Event>(
  el: Window | Document | HTMLElement,
  event: string,
  fn: (evt: E) => void,
) {
  el.removeEventListener(event, fn as EventListener);
}

export function nextTick(fn: () => void): NodeJS.Timeout {
  return setTimeout(fn, 0);
}

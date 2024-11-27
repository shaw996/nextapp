export function on(el: HTMLElement, event: string, fn: (evt: Event) => void): () => void {
  el.addEventListener(event, fn);

  return () => off(el, event, fn);
}

export function off(el: HTMLElement, event: string, fn: (evt: Event) => void) {
  el.removeEventListener(event, fn);
}

export function nextTick(fn: () => void): NodeJS.Timeout {
  return setTimeout(fn, 0);
}

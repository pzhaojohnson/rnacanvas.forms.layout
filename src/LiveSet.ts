/**
 * A live set of items that is expected to be changed by outside code.
 */
export interface LiveSet<T> extends Iterable<T> {
  /**
   * Adds a listener to be called whenever the composition of items in the set changes.
   */
  addEventListener(name: 'change', listener: () => void): void;
}

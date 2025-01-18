/**
 * Optional parameters that can be passed to a bases-layout form.
 */
export type LayoutFormOptions = {
  /**
   * A callback function to be called just before any action that will move bases.
   */
  beforeMovingBases?: () => void;

  /**
   * A callback function to be called just after any action that moved bases.
   */
  afterMovingBases?: () => void;
};

import type { SecondaryBond } from './SecondaryBond';

/**
 * The drawing interface used by the bases-layout form.
 *
 * Represents a nucleic acid structure drawing.
 */
export interface Drawing {
  /**
   * The actual DOM node that is the drawing.
   */
  readonly domNode: SVGSVGElement;

  readonly horizontalClientScaling: number;
  readonly verticalClientScaling: number;

  /**
   * All of the secondary bonds in the drawing.
   */
  readonly secondaryBonds: Iterable<SecondaryBond>;
}

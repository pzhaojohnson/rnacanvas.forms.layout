import type { Nucleobase } from './Nucleobase';

/**
 * The secondary bond interface used by the bases-layout form.
 */
export interface SecondaryBond {
  /**
   * The first base bound by the secondary bond.
   */
  base1: Nucleobase;

  /**
   * The second base bound by the secondary bond.
   */
  base2: Nucleobase;
}

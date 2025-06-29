import type { Drawing } from './Drawing';

import type { Nucleobase } from './Nucleobase';

import type { LiveSet } from './LiveSet';

import type { LayoutFormOptions } from './LayoutFormOptions';

import { untangle } from '@rnacanvas/layout';

import { isFiniteNumber } from '@rnacanvas/value-check';

import * as $ from 'jquery';

import { WideButton } from './WideButton';

import { FiniteNumberInput } from './FiniteNumberInput';

import { TextInputField } from './TextInputField';

import { KeyBinding } from '@rnacanvas/utilities';

import { detectMacOS } from '@rnacanvas/utilities';

type BasePair = [Nucleobase, Nucleobase];

const defaultSpacing = 20;

const defaultBasePairSpacing = 10;

const defaultHairpinLoopSpacing = 10;

export class UntangleSection {
  readonly domNode;

  #keyBindings;

  constructor(targetDrawing: Drawing, selectedBases: LiveSet<Nucleobase>, options?: LayoutFormOptions) {
    let spacingInput = FiniteNumberInput();
    let basePairSpacingInput = FiniteNumberInput();
    let hairpinLoopSpacingInput = FiniteNumberInput();

    spacingInput.value = defaultSpacing.toString();
    basePairSpacingInput.value = defaultBasePairSpacing.toString();
    hairpinLoopSpacingInput.value = defaultHairpinLoopSpacing.toString();

    let spacingField = TextInputField('Base-Pair Length', spacingInput);
    let basePairSpacingField = TextInputField('Base-Pair Spacing', basePairSpacingInput);
    let hairpinLoopSpacingField = TextInputField('Hairpin Loop Spacing', hairpinLoopSpacingInput);

    $(spacingField).css({ margin: '14px 0px 0px 14px' });
    $(basePairSpacingField).css({ margin: '9px 0px 0px 14px' });
    $(hairpinLoopSpacingField).css({ margin: '9px 0px 0px 14px' });

    let untangleButton = new WideButton();

    untangleButton.textContent = 'Untangle';

    untangleButton.tooltip = 'Apply the RNAcanvas untangling algorithm.';
    untangleButton.tooltip += detectMacOS() ? ' [ ⌥ A ]' : ' [ Alt+A ]';

    untangleButton.onClick = () => {
      let spacing = Number.parseFloat(spacingInput.value);
      let basePairSpacing = Number.parseFloat(basePairSpacingInput.value);
      let hairpinLoopSpacing = Number.parseFloat(hairpinLoopSpacingInput.value);

      spacing = isFiniteNumber(spacing) ? spacing : defaultSpacing;
      basePairSpacing = isFiniteNumber(basePairSpacing) ? basePairSpacing : defaultBasePairSpacing;
      hairpinLoopSpacing = isFiniteNumber(hairpinLoopSpacing) ? hairpinLoopSpacing : defaultHairpinLoopSpacing;

      let selectedBasesSet = new Set([...selectedBases]);

      let basePairs: BasePair[] = [...targetDrawing.secondaryBonds]
        .filter(sb => selectedBasesSet.has(sb.base1) && selectedBasesSet.has(sb.base2))
        .map(sb => [sb.base1, sb.base2]);

      options?.beforeMovingBases ? options.beforeMovingBases() : {};
      untangle([...selectedBases], basePairs, { spacing, basePairSpacing, hairpinLoopSpacing });
      options?.afterMovingBases ? options.afterMovingBases() : {};
    };

    this.domNode = document.createElement('div');

    $(this.domNode)
      .append(untangleButton.domNode)
      .append(spacingField)
      .append(basePairSpacingField)
      .append(hairpinLoopSpacingField)
      .css({ display: 'flex', flexDirection: 'column', alignItems: 'start' });

    $(this.domNode).css({ marginTop: '43px' });

    this.#keyBindings = [
      new KeyBinding('A', () => untangleButton.click(), { altKey: true }),
      // pressing the Alt key might change the character key
      new KeyBinding('Å', () => untangleButton.click(), { altKey: true }),
    ];

    [...this.#keyBindings].forEach(kb => kb.owner = this.domNode);
  }

  get keyBindings() {
    return [...this.#keyBindings];
  }
}

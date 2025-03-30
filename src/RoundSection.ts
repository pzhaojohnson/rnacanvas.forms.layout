import type { Nucleobase } from './Nucleobase';

import type { LiveSet } from './LiveSet';

import type { LayoutFormOptions } from './LayoutFormOptions';

import * as $ from 'jquery';

import { DarkSolidButton } from './DarkSolidButton';

import { FiniteNumberInput } from './FiniteNumberInput';

import { TextInputField } from './TextInputField';

import { round } from '@rnacanvas/layout';

import { isFiniteNumber } from '@rnacanvas/value-check';

import { KeyBinding } from '@rnacanvas/utilities';

const defaultSpacing = 10;

export class RoundSection{
  readonly domNode;

  #keyBinding;

  constructor(selectedBases: LiveSet<Nucleobase>, options?: LayoutFormOptions) {
    let spacingInput = FiniteNumberInput();

    spacingInput.value = defaultSpacing.toString();

    let spacingField = TextInputField('Spacing', spacingInput);

    $(spacingField).css({ margin: '14px 0px 0px 14px' });

    let roundButton = new DarkSolidButton();

    roundButton.textContent = 'Round';

    roundButton.tooltip = 'Round the selected bases. [ R ]';

    roundButton.onClick = () => {
      let spacing = Number.parseFloat(spacingInput.value);

      spacing = isFiniteNumber(spacing) ? spacing : defaultSpacing;

      options?.beforeMovingBases ? options.beforeMovingBases() : {};
      round([...selectedBases], { spacing });
      options?.afterMovingBases ? options.afterMovingBases() : {};
    };

    this.domNode = document.createElement('div');

    $(this.domNode)
      .append(roundButton.domNode)
      .append(spacingField)
      .css({ display: 'flex', flexDirection: 'column', alignItems: 'start' });

    $(this.domNode).css({ marginTop: '41px' });

    this.#keyBinding = new KeyBinding('R', () => roundButton.click());
    this.#keyBinding.owner = this.domNode;
  }

  get keyBindings() {
    return [this.#keyBinding];
  }
}

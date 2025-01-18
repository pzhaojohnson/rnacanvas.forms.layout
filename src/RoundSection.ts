import type { Nucleobase } from './Nucleobase';

import type { LiveSet } from './LiveSet';

import type { LayoutFormOptions } from './LayoutFormOptions';

import * as $ from 'jquery';

import { DarkSolidButton } from './DarkSolidButton';

import { FiniteNumberInput } from './FiniteNumberInput';

import { TextInputField } from './TextInputField';

import { round } from '@rnacanvas/bases-layout';

import { isFiniteNumber } from '@rnacanvas/value-check';

const defaultSpacing = 10;

export function RoundSection(selectedBases: LiveSet<Nucleobase>, options?: LayoutFormOptions) {
  let spacingInput = FiniteNumberInput();

  spacingInput.value = defaultSpacing.toString();

  let spacingField = TextInputField('Spacing', spacingInput);

  $(spacingField).css({ margin: '14px 0px 0px 14px' });

  let roundButton = DarkSolidButton();

  $(roundButton)
    .text('Round');

  $(roundButton).on('click', () => {
    let spacing = Number.parseFloat(spacingInput.value);

    spacing = isFiniteNumber(spacing) ? spacing : defaultSpacing;

    options?.beforeMovingBases ? options.beforeMovingBases() : {};
    round([...selectedBases], { spacing });
    options?.afterMovingBases ? options.afterMovingBases() : {};
  });

  let roundSection = document.createElement('div');

  $(roundSection)
    .append(roundButton)
    .append(spacingField)
    .css({ display: 'flex', flexDirection: 'column', alignItems: 'start' });

  $(roundSection).css({ marginTop: '41px' });

  return roundSection;
}

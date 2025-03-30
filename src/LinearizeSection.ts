import type { Nucleobase } from './Nucleobase';

import type { LiveSet } from './LiveSet';

import type { LayoutFormOptions } from './LayoutFormOptions';

import * as $ from 'jquery';

import { DarkSolidButton } from './DarkSolidButton';

import { FiniteNumberInput } from './FiniteNumberInput';

import { TextInputField } from './TextInputField';

import { linearize } from '@rnacanvas/layout';

import { isFiniteNumber } from '@rnacanvas/value-check';

const defaultSpacing = 10;

export function LinearizeSection(selectedBases: LiveSet<Nucleobase>, options?: LayoutFormOptions) {
  let spacingInput = FiniteNumberInput();

  spacingInput.value = defaultSpacing.toString();

  let spacingField = TextInputField('Spacing', spacingInput);

  $(spacingField).css({ margin: '14px 0px 0px 14px' });

  let linearizeButton = new DarkSolidButton();

  linearizeButton.textContent = 'Linearize';

  linearizeButton.onClick = () => {
    let spacing = Number.parseFloat(spacingInput.value);

    spacing = isFiniteNumber(spacing) ? spacing : defaultSpacing;

    options?.beforeMovingBases ? options.beforeMovingBases() : {};
    linearize([...selectedBases], { spacing });
    options?.afterMovingBases ? options.afterMovingBases() : {};
  };

  let linearizeSection = document.createElement('div');

  $(linearizeSection)
    .append(linearizeButton.domNode)
    .append(spacingField)
    .css({ display: 'flex', flexDirection: 'column', alignItems: 'start' });

  $(linearizeSection).css({ marginTop: '41px' });

  return linearizeSection;
}

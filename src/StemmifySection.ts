import type { Nucleobase } from './Nucleobase';

import type { LiveSet } from './LiveSet';

import type { LayoutFormOptions } from './LayoutFormOptions';

import * as $ from 'jquery';

import { DarkSolidButton } from './DarkSolidButton';

import { FiniteNumberInput } from './FiniteNumberInput';

import { TextInputField } from './TextInputField';

import { stemmify } from '@rnacanvas/layout';

import { isFiniteNumber } from '@rnacanvas/value-check';

const defaultBasePairLength = 20;

const defaultBasePairSpacing = 10;

export function StemmifySection(selectedBases: LiveSet<Nucleobase>, options?: LayoutFormOptions) {
  let basePairLengthInput = FiniteNumberInput();
  let basePairSpacingInput = FiniteNumberInput();

  basePairLengthInput.value = defaultBasePairLength.toString();
  basePairSpacingInput.value = defaultBasePairSpacing.toString();

  let basePairLengthField = TextInputField('Base-Pair Length', basePairLengthInput);
  let basePairSpacingField = TextInputField('Base-Pair Spacing', basePairSpacingInput);

  $(basePairLengthField).css({ margin: '14px 0px 0px 14px' });
  $(basePairSpacingField).css({ margin: '10px 0px 0px 14px' });

  let stemmifyButton = DarkSolidButton();

  $(stemmifyButton)
    .text('Stemmify');

  $(stemmifyButton).on('click', () => {
    let basePairLength = Number.parseFloat(basePairLengthInput.value);
    let basePairSpacing = Number.parseFloat(basePairSpacingInput.value);

    basePairLength = isFiniteNumber(basePairLength) ? basePairLength : defaultBasePairLength;
    basePairSpacing = isFiniteNumber(basePairSpacing) ? basePairSpacing : defaultBasePairSpacing;

    options?.beforeMovingBases ? options.beforeMovingBases() : {};
    stemmify([...selectedBases], { basePairLength, basePairSpacing });
    options?.afterMovingBases ? options.afterMovingBases() : {};
  });

  let stemmifySection = document.createElement('div');

  $(stemmifySection)
    .append(stemmifyButton)
    .append(basePairLengthField)
    .append(basePairSpacingField)
    .css({ display: 'flex', flexDirection: 'column', alignItems: 'start' });

  $(stemmifySection).css({ marginTop: '31px' });

  return stemmifySection;
}

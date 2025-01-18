import type { Nucleobase } from './Nucleobase';

import type { LiveSet } from './LiveSet';

import type { LayoutFormOptions } from './LayoutFormOptions';

import * as $ from 'jquery';

import { DarkSolidButton } from './DarkSolidButton';

import { straighten } from '@rnacanvas/bases-layout';

export function StraightenButton(selectedBases: LiveSet<Nucleobase>, options?: LayoutFormOptions) {
  let straightenButton = DarkSolidButton();

  straightenButton.textContent = 'Straighten';

  $(straightenButton).css({ marginTop: '35px', alignSelf: 'start' });

  straightenButton.addEventListener('click', () => {
    options?.beforeMovingBases ? options.beforeMovingBases() : {};
    straighten([...selectedBases]);
    options?.afterMovingBases ? options.afterMovingBases() : {};
  });

  return straightenButton;
}

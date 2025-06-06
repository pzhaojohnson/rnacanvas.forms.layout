import type { Nucleobase } from './Nucleobase';

import type { LiveSet } from './LiveSet';

import type { LayoutFormOptions } from './LayoutFormOptions';

import * as $ from 'jquery';

import { WideButton } from './WideButton';

import { straighten } from '@rnacanvas/layout';

export function StraightenButton(selectedBases: LiveSet<Nucleobase>, options?: LayoutFormOptions) {
  let straightenButton = new WideButton();

  straightenButton.textContent = 'Straighten';

  $(straightenButton.domNode).css({ marginTop: '48px', alignSelf: 'start' });

  straightenButton.onClick = () => {
    options?.beforeMovingBases ? options.beforeMovingBases() : {};
    straighten([...selectedBases]);
    options?.afterMovingBases ? options.afterMovingBases() : {};
  };

  return straightenButton;
}

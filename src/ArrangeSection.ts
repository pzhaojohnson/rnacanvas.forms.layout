import type { Drawing } from './Drawing';

import type { Nucleobase } from './Nucleobase';

import { LiveSet } from './LiveSet';

import { arrange } from '@rnacanvas/layout';

import * as $ from 'jquery';

import { DarkSolidButton } from './DarkSolidButton';

import { FiniteNumberInput } from './FiniteNumberInput';

import { TextInputField } from './TextInputField';

import { isFiniteNumber } from '@rnacanvas/value-check';

import { KeyBinding } from '@rnacanvas/utilities';

export class ArrangeSection {
  #targetApp;

  #button = new DarkSolidButton();

  #spacingField = new FiniteNumberField('Base-Pair Length');
  #basePairSpacingField = new FiniteNumberField('Base-Pair Spacing');
  #hairpinLoopSpacingField = new FiniteNumberField('Hairpin Loop Spacing');
  #terminiGapField = new FiniteNumberField('Termini Gap');

  readonly #defaultSpacing = 20;
  readonly #defaultBasePairSpacing = 10;
  readonly #defaultHairpinLoopSpacing = 10;
  readonly #defaultTerminiGap = 40;

  readonly domNode = document.createElement('div');

  #keyBinding;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#button.textContent = 'Arrange';

    this.#button.tooltip = 'Arrange according to secondary structure. [ A ]';

    this.#spacingField.domNode.style.margin = '14px 0px 0px 14px';
    this.#basePairSpacingField.domNode.style.margin = '9px 0px 0px 14px';
    this.#hairpinLoopSpacingField.domNode.style.margin = '9px 0px 0px 14px';
    this.#terminiGapField.domNode.style.margin = '9px 0px 0px 14px';

    this.#spacingField.value = this.#defaultSpacing;
    this.#basePairSpacingField.value = this.#defaultBasePairSpacing;
    this.#hairpinLoopSpacingField.value = this.#defaultHairpinLoopSpacing;
    this.#terminiGapField.value = this.#defaultTerminiGap;

    this.domNode.append(
      this.#button.domNode,
      this.#spacingField.domNode,
      this.#basePairSpacingField.domNode,
      this.#hairpinLoopSpacingField.domNode,
      this.#terminiGapField.domNode,
    );

    $(this.domNode).css({ display: 'flex', flexDirection: 'column', alignItems: 'start' });

    this.domNode.style.marginTop = '44px';

    this.#button.onClick = () => {
      let spacing = this.#spacingField.value;
      let basePairSpacing = this.#basePairSpacingField.value;
      let hairpinLoopSpacing = this.#hairpinLoopSpacingField.value;
      let terminiGap = this.#terminiGapField.value;

      if (!isFiniteNumber(spacing)) { spacing = this.#defaultSpacing; }
      if (!isFiniteNumber(basePairSpacing)) { basePairSpacing = this.#defaultBasePairSpacing; }
      if (!isFiniteNumber(hairpinLoopSpacing)) { hairpinLoopSpacing = this.#defaultHairpinLoopSpacing; }
      if (!isFiniteNumber(terminiGap)) { terminiGap = this.#defaultTerminiGap; }

      let selectedBases = [...this.#targetApp.selectedBases];
      let selectedBasesSet = new Set(selectedBases);

      // base-pairs among the selected bases
      let basePairs: BasePair[] = [...this.#targetApp.drawing.secondaryBonds]
        .filter(sb => selectedBasesSet.has(sb.base1) && selectedBasesSet.has(sb.base2))
        .map(sb => [sb.base1, sb.base2]);

      this.#targetApp.beforeMovingBases ? this.#targetApp.beforeMovingBases() : {};

      arrange(selectedBases, basePairs, { spacing, basePairSpacing, hairpinLoopSpacing, terminiGap });

      this.#targetApp.afterMovingBases ? this.#targetApp.afterMovingBases() : {};
    };

    this.#keyBinding = new KeyBinding('A', () => this.#button.click());
    this.#keyBinding.owner = this.domNode;
  }

  get keyBindings() {
    return [this.#keyBinding];
  }
}

interface App {
  readonly drawing: Drawing;

  readonly selectedBases: LiveSet<Nucleobase>;

  beforeMovingBases?: () => void;
  afterMovingBases?: () => void;
}

type BasePair = [Nucleobase, Nucleobase];

class FiniteNumberField {
  #input = FiniteNumberInput();

  #field;

  constructor(readonly name: string) {
    this.#field = TextInputField(this.name, this.#input);
  }

  get domNode() {
    return this.#field;
  }

  get value(): number {
    return Number.parseFloat(this.#input.value);
  }

  set value(value) {
    this.#input.value = `${value}`;
  }
}

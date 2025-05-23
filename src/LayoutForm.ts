import type { Drawing } from './Drawing';

import type { Nucleobase } from './Nucleobase';

import type { LiveSet } from './LiveSet';

import type { LayoutFormOptions } from './LayoutFormOptions';

import * as $ from 'jquery';

import * as styles from './LayoutForm.css';

import { Header } from './Header';

import { NumSelectedBasesView } from './NumSelectedBasesView';

import { CentroidSection } from './CentroidSection';

import { MoreCoordinatesSection } from './MoreCoordinatesSection';

import { DirectionSection } from './DirectionSection';

import { FlipSection } from './FlipSection';

import { LinearizeSection } from './LinearizeSection';

import { StraightenButton } from './StraightenButton';

import { CircularizeSection } from './CircularizeSection';

import { RoundSection } from './RoundSection';

import { StemmifySection } from './StemmifySection';

import { ArrangeSection } from './ArrangeSection';

import { UntangleSection } from './UntangleSection';

import { CloseButton } from './CloseButton';

import { DragTranslater } from '@rnacanvas/forms';

import type { KeyBinding } from '@rnacanvas/utilities';

interface Refreshable {
  refresh(): void;
}

/**
 * This form is created with its own `FormFronter` and `DragTranslater` instances by default.
 */
export class LayoutForm {
  /**
   * The actual DOM node that is the bases-layout form.
   */
  private readonly domNode: HTMLDivElement;

  #flipSection;
  #roundSection;
  #arrangeSection;
  #untangleSection;

  private readonly refreshableComponents: Refreshable[];

  private readonly dragTranslater: DragTranslater;

  constructor(targetDrawing: Drawing, private selectedBases: LiveSet<Nucleobase>, options?: LayoutFormOptions) {
    let numSelectedBasesView = new NumSelectedBasesView(selectedBases);

    let targetApp = {
      drawing: targetDrawing,
      selectedBases: selectedBases,
      beforeMovingBases: options?.beforeMovingBases,
      afterMovingBases: options?.afterMovingBases,
    };

    let centroidSection = new CentroidSection(selectedBases, targetDrawing, options);
    let moreCoordinatesSection = new MoreCoordinatesSection(selectedBases, options);
    let directionSection = new DirectionSection(selectedBases, options);
    this.#flipSection = new FlipSection(selectedBases, options);
    this.#roundSection = new RoundSection(selectedBases, options);
    this.#arrangeSection = new ArrangeSection(targetApp);
    this.#untangleSection = new UntangleSection(targetDrawing, selectedBases, options);
    let stemmifySection = StemmifySection(selectedBases, options);
    let linearizeSection = LinearizeSection(selectedBases, options);
    let straightenButton = StraightenButton(selectedBases, options);
    let circularizeSection = new CircularizeSection(selectedBases, options);

    let layoutControls = document.createElement('div');

    $(layoutControls).addClass(styles.layoutControls);

    $(layoutControls)
      .append(centroidSection.domNode)
      .append(moreCoordinatesSection.domNode)
      .append(directionSection.domNode)
      .append(this.#flipSection.domNode)
      .append(this.#roundSection.domNode)
      .append(this.#arrangeSection.domNode)
      .append(this.#untangleSection.domNode)
      .append(stemmifySection)
      .append(linearizeSection)
      .append(straightenButton.domNode)
      .append(circularizeSection.domNode);

    let content = document.createElement('div');

    $(content)
      .append(numSelectedBasesView.domNode)
      .append(layoutControls)
      .css({ margin: '28px 0px 0px 21px' })
      .css({ pointerEvents: 'none' });

    this.domNode = document.createElement('div');

    $(this.domNode).addClass(styles.layoutForm);

    $(this.domNode)
      .append(Header())
      .append(content);

    this.refreshableComponents = [numSelectedBasesView, centroidSection, moreCoordinatesSection, directionSection];

    // refresh the bases-layout form whenever the target drawing changes
    // (if the bases-layout form is open)
    let drawingObserver = new MutationObserver(() => this.isOpen() ? this.refresh() : {});
    drawingObserver.observe(targetDrawing.domNode, { attributes: true, childList: true, characterData: true, subtree: true });

    selectedBases.addEventListener('change', () => this.isOpen() ? this.refresh() : {});

    let closeButton = CloseButton();

    $(closeButton).on('click', () => this.close());

    // place on top of everything else
    // (to make sure the close button is clickable)
    $(this.domNode)
      .append(closeButton);

    this.dragTranslater = new DragTranslater(this.domNode);

    [...this.keyBindings].forEach(kb => kb.owner = this.domNode);
  }

  private refresh(): void {
    this.refreshableComponents.forEach(component => component.refresh());

    if ([...this.selectedBases].length == 0) {
      $(this.domNode).addClass(styles.noBasesSelected);
    } else {
      $(this.domNode).removeClass(styles.noBasesSelected);
    }
  }

  /**
   * Appends the bases-layout form to the provided container node.
   */
  appendTo(container: Node): void {
    // make sure form contents are up-to-date
    this.refresh();

    this.dragTranslater.untranslate();

    container.appendChild(this.domNode);
  }

  /**
   * Removes the bases-layout form from any parent container node that it is in.
   *
   * Has no effect if the bases-layout form had no parent container node to begin with.
   */
  remove(): void {
    this.domNode.remove();
  }

  private isOpen(): boolean {
    return document.contains(this.domNode);
  }

  /**
   * Essentially an alias for the `remove` method.
   */
  private close(): void {
    this.domNode.remove();
  }

  get keyBindings(): Iterable<KeyBinding> {
    return [
      ...this.#flipSection.keyBindings,
      ...this.#roundSection.keyBindings,
      ...this.#arrangeSection.keyBindings,
      ...this.#untangleSection.keyBindings,
    ];
  }
}

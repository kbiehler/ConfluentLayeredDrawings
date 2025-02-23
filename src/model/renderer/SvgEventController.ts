import { VertexLayout } from "../layout/GraphLayout";
import { InteractionState } from "./InteractionManager";

export class SvgEventController {
  interactionState: InteractionState;
  setInteractionState: (interactionState: InteractionState) => void;

  constructor(interactionState: InteractionState, setInteractionState: (interactionState: InteractionState) => void) {
    this.interactionState = interactionState;
    this.setInteractionState = setInteractionState;
  }

  attachListeners(svg: d3.Selection<SVGGElement, unknown, null, undefined>) {
    svg.selectAll<SVGCircleElement, VertexLayout>("circle").on("click", (event, value: VertexLayout) => {
      const newInteractionState = { ...this.interactionState };
      newInteractionState.selectedVertices.add(value.id);
      this.setInteractionState(newInteractionState);
    });
  }
}

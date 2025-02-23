import { VertexLayout } from "../layout/GraphLayout";
import { InteractionManager } from "./InteractionManager";

export class SvgEventController {

  interactionManager: InteractionManager;

  constructor(interactionManager: InteractionManager) {
    this.interactionManager = interactionManager;
  }

  attachListeners(svg: d3.Selection<SVGGElement, unknown, null, undefined>) {
    svg.selectAll<SVGCircleElement, VertexLayout>("circle").on("click", (event, value: VertexLayout) => {
      this.interactionManager.vertexClicked(value.id, event.ctrlKey);
    });
  }
  
}

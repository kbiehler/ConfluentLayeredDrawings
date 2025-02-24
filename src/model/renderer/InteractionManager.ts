import { EventEmitter } from "events";

export interface InteractionInfo {
  adjEdges: Map<any, Set<string>>;
}

export class InteractionState {
  selectedVertices: Set<any> = new Set();
}

export class InteractionManager extends EventEmitter {
  state = new InteractionState();
  interactionInfo: InteractionInfo;

  constructor(interactionInfo: InteractionInfo) {
    super();
    this.interactionInfo = interactionInfo;
  }

  vertexClicked(vertexId: string, ctrlKey: boolean) {
    if (ctrlKey) {
      if (this.state.selectedVertices.has(vertexId)) {
        this.state.selectedVertices.delete(vertexId);
      } else {
        this.state.selectedVertices.add(vertexId);
      }
    } else {
      if (this.state.selectedVertices.has(vertexId)) {
        this.state.selectedVertices.clear();
      } else {
        this.state.selectedVertices.clear();
        this.state.selectedVertices.add(vertexId);
      }
    }
    this.triggerRedraw();
  }

  highlightVertex(vertexId: string): boolean {
    return this.state.selectedVertices.has(vertexId);
  }

  highlightEdge(edgeId: string): boolean {
    return Array.from(this.state.selectedVertices).some((v) => this.interactionInfo.adjEdges.get(v)?.has(edgeId));
  }

  reset() {
    this.state = new InteractionState();
  }

  triggerRedraw() {
    this.emit("redraw");
  }
}

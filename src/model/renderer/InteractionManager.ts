import { EventEmitter } from "events";

export class InteractionState {
  selectedVertices: Set<string> = new Set();
}

export class InteractionManager extends EventEmitter {
  state = new InteractionState();

  constructor() {
    super();
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

  reset() {
    this.state = new InteractionState();
  }

  triggerRedraw() {
    this.emit("redraw");
  }
}
